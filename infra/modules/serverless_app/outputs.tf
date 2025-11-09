output "api_invoke_url" {
  description = "Invoke URL for the ingestion REST API"
  value       = aws_api_gateway_stage.this.invoke_url
}

output "queue_url" {
  description = "URL of the ingestion SQS queue"
  value       = aws_sqs_queue.ingestion.url
}

output "ingestion_lambda_arn" {
  description = "ARN of the ingestion Lambda function"
  value       = aws_lambda_function.ingestion.arn
}

output "ingestion_lambda_name" {
  description = "Name of the ingestion Lambda function"
  value       = aws_lambda_function.ingestion.function_name
}

output "processing_lambda_arn" {
  description = "ARN of the processing Lambda function"
  value       = aws_lambda_function.processing.arn
}

output "processing_lambda_name" {
  description = "Name of the processing Lambda function"
  value       = aws_lambda_function.processing.function_name
}

# output "state_machine_arn" {
#   description = "ARN of the optional Step Functions state machine"
#   value       = try(aws_sfn_state_machine.processing[0].arn, null)
# }

output "kinesis_stream_name" {
  description = "Name of the Kinesis data stream handling ingestion"
  value       = aws_kinesis_stream.ingestion_stream.name
}

output "kinesis_stream_arn" {
  description = "ARN of the Kinesis data stream handling ingestion"
  value       = aws_kinesis_stream.ingestion_stream.arn
}
