variable "name" {
  description = "Base name applied to data store resources"
  type        = string
}

variable "environment" {
  description = "Environment identifier"
  type        = string
}

variable "vpc_id" {
  description = "VPC identifier where endpoints will be created"
  type        = string
}

variable "route_table_ids" {
  description = "List of private route table IDs that require access to S3 and DynamoDB via gateway endpoints"
  type        = list(string)
}

variable "data_lake_bucket_name" {
  description = "Globally unique S3 bucket name for the data lake"
  type        = string
}

variable "ledger_table_name" {
  description = "Name of the DynamoDB ledger table"
  type        = string
  default     = "ledger-table"
}

variable "tags" {
  description = "Additional tags applied to resources"
  type        = map(string)
  default     = {}
}
