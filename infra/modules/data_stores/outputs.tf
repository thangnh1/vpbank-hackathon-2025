output "data_lake_bucket_name" {
  description = "Name of the S3 data lake bucket"
  value       = aws_s3_bucket.data_lake.bucket
}

output "data_lake_bucket_arn" {
  description = "ARN of the S3 data lake bucket"
  value       = aws_s3_bucket.data_lake.arn
}

output "ledger_table_name" {
  description = "Name of the DynamoDB ledger table"
  value       = aws_dynamodb_table.ledger.name
}

output "ledger_table_arn" {
  description = "ARN of the DynamoDB ledger table"
  value       = aws_dynamodb_table.ledger.arn
}

output "s3_endpoint_id" {
  description = "Identifier for the S3 VPC gateway endpoint"
  value       = aws_vpc_endpoint.s3.id
}

output "dynamodb_endpoint_id" {
  description = "Identifier for the DynamoDB VPC gateway endpoint"
  value       = aws_vpc_endpoint.dynamodb.id
}
