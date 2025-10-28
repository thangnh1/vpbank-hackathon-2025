variable "name" {
  description = "Base name used for serverless resources"
  type        = string
}

variable "environment" {
  description = "Deployment environment identifier"
  type        = string
}

variable "vpc_id" {
  description = "VPC identifier where Lambdas will run"
  type        = string
}

variable "app_subnet_ids" {
  description = "Private application subnet IDs for Lambda VPC attachment"
  type        = list(string)
}

variable "data_lake_bucket_arn" {
  description = "ARN of the data lake bucket used for processing outputs"
  type        = string
}

variable "data_lake_bucket_name" {
  description = "Name of the data lake bucket"
  type        = string
}

variable "ledger_table_arn" {
  description = "ARN of the DynamoDB ledger table"
  type        = string
}

variable "ledger_table_name" {
  description = "Name of the DynamoDB ledger table"
  type        = string
  default     = "ledger-table"
}

variable "queue_name" {
  description = "Name of the ingestion SQS queue"
  type        = string
  default     = "ingestion-queue"
}

variable "processing_schedule_expression" {
  description = "EventBridge schedule expression used to trigger the processing Lambda"
  type        = string
  default     = "rate(5 minutes)"
}

variable "enable_step_function" {
  description = "Whether to deploy the optional Step Functions state machine"
  type        = bool
  default     = true
}

variable "kinesis_stream_name" {
  description = "Name of the Kinesis data stream used for real-time ingestion"
  type        = string
  default     = "ingestion-stream"
}

variable "tags" {
  description = "Additional tags applied to resources"
  type        = map(string)
  default     = {}
}
