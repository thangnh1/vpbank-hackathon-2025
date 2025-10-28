output "audit_bucket_name" {
  description = "Name of the S3 bucket storing audit logs"
  value       = aws_s3_bucket.audit.bucket
}

output "audit_lambda_arn" {
  description = "ARN of the audit Lambda function"
  value       = aws_lambda_function.audit.arn
}

output "audit_lambda_name" {
  description = "Name of the audit Lambda function"
  value       = aws_lambda_function.audit.function_name
}

output "athena_workgroup_name" {
  description = "Athena workgroup configured for audit analytics"
  value       = aws_athena_workgroup.audit.name
}

output "glue_database_name" {
  description = "Glue database cataloguing audit datasets"
  value       = aws_glue_catalog_database.audit.name
}
