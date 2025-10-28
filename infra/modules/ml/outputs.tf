output "sagemaker_execution_role_arn" {
  description = "ARN of the SageMaker execution role"
  value       = aws_iam_role.sagemaker_execution.arn
}

output "invoke_endpoint_policy_arn" {
  description = "IAM policy ARN allowing InvokeEndpoint for the placeholder endpoint"
  value       = aws_iam_policy.invoke_endpoint.arn
}

output "sagemaker_endpoint_name" {
  description = "Placeholder SageMaker endpoint name"
  value       = var.sagemaker_endpoint_name
}
