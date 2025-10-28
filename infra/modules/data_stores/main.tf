data "aws_region" "current" {}

locals {
  base_tags = merge(
    {
      Environment = var.environment
      Module      = "data_stores"
    },
    var.tags
  )
}

# Primary S3 bucket used as the landing zone for raw and processed data
resource "aws_s3_bucket" "data_lake" {
  bucket = var.data_lake_bucket_name
  tags = merge(local.base_tags, {
    Name = "${var.name}-data-lake"
  })
}

# Enforce secure ownership controls for the data lake bucket
resource "aws_s3_bucket_ownership_controls" "data_lake" {
  bucket = aws_s3_bucket.data_lake.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

# Block public access on the data lake bucket for compliance
resource "aws_s3_bucket_public_access_block" "data_lake" {
  bucket                  = aws_s3_bucket.data_lake.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Enable versioning to retain historical objects for auditability
resource "aws_s3_bucket_versioning" "data_lake" {
  bucket = aws_s3_bucket.data_lake.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Apply default server-side encryption to protect data at rest
resource "aws_s3_bucket_server_side_encryption_configuration" "data_lake" {
  bucket = aws_s3_bucket.data_lake.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# DynamoDB ledger table storing tamper-evident records
resource "aws_dynamodb_table" "ledger" {
  name         = var.ledger_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "pk"

  attribute {
    name = "pk"
    type = "S"
  }

  tags = merge(local.base_tags, {
    Name = "${var.name}-ledger-table"
  })
}

# Gateway endpoint for S3 ensures private subnets reach the data lake without traversing the internet
resource "aws_vpc_endpoint" "s3" {
  vpc_id            = var.vpc_id
  service_name      = "com.amazonaws.${data.aws_region.current.name}.s3"
  vpc_endpoint_type = "Gateway"
  route_table_ids   = var.route_table_ids

  tags = merge(local.base_tags, {
    Name = "${var.name}-s3-endpoint"
  })
}

# Gateway endpoint for DynamoDB enabling private connectivity from processing Lambdas
resource "aws_vpc_endpoint" "dynamodb" {
  vpc_id            = var.vpc_id
  service_name      = "com.amazonaws.${data.aws_region.current.name}.dynamodb"
  vpc_endpoint_type = "Gateway"
  route_table_ids   = var.route_table_ids

  tags = merge(local.base_tags, {
    Name = "${var.name}-dynamodb-endpoint"
  })
}
