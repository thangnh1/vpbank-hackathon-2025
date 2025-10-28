# data "aws_region" "current" {}

# locals {
#   base_tags = merge(
#     {
#       Environment = var.environment
#       Module      = "observability"
#     },
#     var.tags
#   )

#   waf_enabled = var.enable_waf && var.cloudfront_origin_domain_name != ""
# }

# # Explicit CloudWatch log groups with retention controls for each Lambda
# resource "aws_cloudwatch_log_group" "lambda" {
#   for_each          = toset(var.lambda_function_names)
#   name              = "/aws/lambda/${each.value}"
#   retention_in_days = 30

#   tags = merge(local.base_tags, {
#     Name = "${var.name}-${var.environment}-lg-${each.value}"
#   })
# }

# # GuardDuty detector enabling continuous threat detection
# resource "aws_guardduty_detector" "this" {
#   enable = true

#   datasources {
#     s3_logs {
#       enable = true
#     }
#     kubernetes {
#       audit_logs {
#         enable = true
#       }
#     }
#   }

#   tags = merge(local.base_tags, {
#     Name = "${var.name}-${var.environment}-guardduty"
#   })
# }

# # IAM role assumed by AWS Config to record resource configuration
# resource "aws_iam_role" "config" {
#   name               = "${var.name}-${var.environment}-config-role"
#   assume_role_policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [{
#       Action = "sts:AssumeRole"
#       Effect = "Allow"
#       Principal = {
#         Service = "config.amazonaws.com"
#       }
#     }]
#   })

#   tags = merge(local.base_tags, {
#     Name = "${var.name}-${var.environment}-config-role"
#   })
# }

# # Attach the AWS managed policy providing Config permissions
# resource "aws_iam_role_policy_attachment" "config" {
#   role       = aws_iam_role.config.name
#   policy_arn = "arn:aws:iam::aws:policy/service-role/AWSConfigRole"
# }

# # Configuration recorder capturing all resource changes
# resource "aws_config_configuration_recorder" "this" {
#   name     = "${var.name}-${var.environment}-config-recorder"
#   role_arn = aws_iam_role.config.arn

#   recording_group {
#     all_supported                 = true
#     include_global_resource_types = true
#   }
# }

# # Delivery channel sending configuration snapshots to the audit bucket
# resource "aws_config_delivery_channel" "this" {
#   name           = "${var.name}-${var.environment}-config-channel"
#   s3_bucket_name = var.audit_bucket_name
#   s3_key_prefix  = "config"

#   depends_on = [aws_config_configuration_recorder.this]
# }

# # Ensure the recorder is actively running
# resource "aws_config_configuration_recorder_status" "this" {
#   name       = aws_config_configuration_recorder.this.name
#   is_enabled = true

#   depends_on = [aws_config_delivery_channel.this]
# }

# # Optional WAFv2 web ACL for future CloudFront distributions
# resource "aws_wafv2_web_acl" "this" {
#   count = local.waf_enabled ? 1 : 0

#   name        = "${var.name}-${var.environment}-waf"
#   description = "Placeholder web ACL protecting CloudFront"
#   scope       = "CLOUDFRONT"

#   default_action {
#     allow {}
#   }

#   visibility_config {
#     cloudwatch_metrics_enabled = true
#     metric_name                = "${var.name}-${var.environment}-waf"
#     sampled_requests_enabled   = true
#   }

#   tags = merge(local.base_tags, {
#     Name = "${var.name}-${var.environment}-waf"
#   })
# }

# # Placeholder CloudFront distribution wired to the optional WAF
# resource "aws_cloudfront_distribution" "this" {
#   count = local.waf_enabled ? 1 : 0

#   enabled             = true
#   is_ipv6_enabled     = true
#   comment             = "Placeholder distribution for future public ingress"
#   default_root_object = "index.html"

#   origin {
#     domain_name = var.cloudfront_origin_domain_name
#     origin_id   = "origin-1"

#     custom_origin_config {
#       http_port              = 80
#       https_port             = 443
#       origin_protocol_policy = "https-only"
#       origin_ssl_protocols   = ["TLSv1.2"]
#     }
#   }

#   default_cache_behavior {
#     allowed_methods  = ["GET", "HEAD", "OPTIONS"]
#     cached_methods   = ["GET", "HEAD"]
#     target_origin_id = "origin-1"

#     viewer_protocol_policy = "redirect-to-https"

#     forwarded_values {
#       query_string = false

#       cookies {
#         forward = "none"
#       }
#     }
#   }

#   restrictions {
#     geo_restriction {
#       restriction_type = "none"
#     }
#   }

#   viewer_certificate {
#     cloudfront_default_certificate = true
#   }

#   web_acl_id = aws_wafv2_web_acl.this[0].arn

#   tags = merge(local.base_tags, {
#     Name = "${var.name}-${var.environment}-cdn"
#   })
# }
