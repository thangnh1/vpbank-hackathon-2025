# data "aws_region" "current" {}

# locals {
#   base_tags = merge(
#     {
#       Environment = var.environment
#       Module      = "audit_analytics"
#     },
#     var.tags
#   )
# }

# # Dedicated bucket storing immutable audit logs
# resource "aws_s3_bucket" "audit" {
#   bucket = var.audit_bucket_name

#   tags = merge(local.base_tags, {
#     Name = "${var.name}-${var.environment}-audit-logs"
#   })
# }

# # Enforce ownership controls for audit log delivery
# resource "aws_s3_bucket_ownership_controls" "audit" {
#   bucket = aws_s3_bucket.audit.id

#   rule {
#     object_ownership = "BucketOwnerPreferred"
#   }
# }

# # Block public access to the audit log bucket
# resource "aws_s3_bucket_public_access_block" "audit" {
#   bucket                  = aws_s3_bucket.audit.id
#   block_public_acls       = true
#   block_public_policy     = true
#   ignore_public_acls      = true
#   restrict_public_buckets = true
# }

# # Version all audit artifacts for tamper evidence
# resource "aws_s3_bucket_versioning" "audit" {
#   bucket = aws_s3_bucket.audit.id

#   versioning_configuration {
#     status = "Enabled"
#   }
# }

# # Default encryption enforced on audit objects
# resource "aws_s3_bucket_server_side_encryption_configuration" "audit" {
#   bucket = aws_s3_bucket.audit.id

#   rule {
#     apply_server_side_encryption_by_default {
#       sse_algorithm = "AES256"
#     }
#   }
# }

# # Security group for the audit Lambda restricting ingress while allowing egress
# resource "aws_security_group" "audit_lambda" {
#   name        = "${var.name}-${var.environment}-audit-sg"
#   description = "Audit Lambda security group"
#   vpc_id      = var.vpc_id

#   egress {
#     description = "Allow outbound access for log delivery"
#     from_port   = 0
#     to_port     = 0
#     protocol    = "-1"
#     cidr_blocks = ["0.0.0.0/0"]
#     ipv6_cidr_blocks = ["::/0"]
#   }

#   tags = merge(local.base_tags, {
#     Name = "${var.name}-${var.environment}-audit-sg"
#   })
# }

# # Inline package for the audit Lambda responsible for writing logs to S3
# data "archive_file" "audit" {
#   type        = "zip"
#   output_path = "${path.module}/build/lambda_audit.zip"

#   source {
#     content  = <<-PYTHON
#       import boto3
#       import os
#       import json
#       from datetime import datetime

#       s3 = boto3.client("s3")
#       bucket = os.environ.get("AUDIT_BUCKET")

#       def lambda_handler(event, context):
#           timestamp = datetime.utcnow().isoformat()
#           payload = json.dumps({"timestamp": timestamp, "event": event}, default=str)
#           key = f"year={timestamp[:4]}/month={timestamp[5:7]}/logs-{timestamp}.json"
#           s3.put_object(Bucket=bucket, Key=key, Body=payload.encode("utf-8"))
#           return {"statusCode": 200, "body": json.dumps({"stored": key})}
#     PYTHON
#     filename = "audit.py"
#   }
# }

# # IAM role assumed by the audit Lambda
# resource "aws_iam_role" "audit_lambda" {
#   name               = "${var.name}-${var.environment}-audit-role"
#   assume_role_policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [{
#       Action = "sts:AssumeRole"
#       Effect = "Allow"
#       Principal = {
#         Service = "lambda.amazonaws.com"
#       }
#     }]
#   })

#   tags = merge(local.base_tags, {
#     Name = "${var.name}-${var.environment}-audit-role"
#   })
# }

# # Managed policy providing VPC access and core logging
# resource "aws_iam_role_policy_attachment" "audit_vpc" {
#   role       = aws_iam_role.audit_lambda.name
#   policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
# }

# # Inline policy granting write access into the audit bucket
# resource "aws_iam_role_policy" "audit_lambda" {
#   name = "${var.name}-${var.environment}-audit-policy"
#   role = aws_iam_role.audit_lambda.id

#   policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Sid    = "CloudWatchLogging"
#         Effect = "Allow"
#         Action = [
#           "logs:CreateLogGroup",
#           "logs:CreateLogStream",
#           "logs:PutLogEvents"
#         ]
#         Resource = "arn:aws:logs:${data.aws_region.current.name}:*:log-group:/aws/lambda/*"
#       },
#       {
#         Sid    = "WriteAuditLogs"
#         Effect = "Allow"
#         Action = [
#           "s3:PutObject",
#           "s3:PutObjectAcl",
#           "s3:ListBucket"
#         ]
#         Resource = [
#           aws_s3_bucket.audit.arn,
#           "${aws_s3_bucket.audit.arn}/*"
#         ]
#       }
#     ]
#   })
# }

# # Lambda writing structured audit logs to S3
# resource "aws_lambda_function" "audit" {
#   function_name = "${var.name}-${var.environment}-audit-fn"
#   role          = aws_iam_role.audit_lambda.arn
#   runtime       = "python3.11"
#   handler       = "audit.lambda_handler"
#   filename         = data.archive_file.audit.output_path
#   source_code_hash = data.archive_file.audit.output_base64sha256
#   memory_size      = 256
#   timeout          = 10

#   vpc_config {
#     subnet_ids         = var.audit_subnet_ids
#     security_group_ids = [aws_security_group.audit_lambda.id]
#   }

#   environment {
#     variables = {
#       AUDIT_BUCKET = aws_s3_bucket.audit.bucket
#     }
#   }

#   tags = merge(local.base_tags, {
#     Name = "${var.name}-${var.environment}-audit-fn"
#   })
# }

# # Glue database cataloguing audit artifacts
# resource "aws_glue_catalog_database" "audit" {
#   name = var.glue_database_name

#   tags = merge(local.base_tags, {
#     Name = "${var.name}-${var.environment}-glue-db"
#   })
# }

# # Glue table definition for queryable audit logs (partitioned by year/month)
# resource "aws_glue_catalog_table" "audit" {
#   name          = var.glue_table_name
#   database_name = aws_glue_catalog_database.audit.name

#   table_type = "EXTERNAL_TABLE"

#   storage_descriptor {
#     location = "s3://${aws_s3_bucket.audit.bucket}"
#     input_format  = "org.apache.hadoop.mapred.TextInputFormat"
#     output_format = "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat"

#     ser_de_info {
#       serialization_library = "org.openx.data.jsonserde.JsonSerDe"
#     }

#     columns {
#       name = "timestamp"
#       type = "string"
#     }

#     columns {
#       name = "event"
#       type = "string"
#     }
#   }

#   partition_keys {
#     name = "year"
#     type = "string"
#   }

#   partition_keys {
#     name = "month"
#     type = "string"
#   }

#   parameters = {
#     classification = "json"
#   }
# }

# # Athena workgroup configured to query the audit dataset
# resource "aws_athena_workgroup" "audit" {
#   name          = var.athena_workgroup_name
#   force_destroy = true

#   configuration {
#     enforce_workgroup_configuration = true
#     publish_cloudwatch_metrics_enabled = true

#     result_configuration {
#       output_location = "s3://${aws_s3_bucket.audit.bucket}/athena-results/"
#     }
#   }

#   tags = merge(local.base_tags, {
#     Name = "${var.name}-${var.environment}-athena-wg"
#   })
# }
