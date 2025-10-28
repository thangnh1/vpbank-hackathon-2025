variable "project_name" {
  description = "Base project name used for resource naming"
  type        = string
}

variable "environment" {
  description = "Environment identifier"
  type        = string
}

variable "aws_region" {
  description = "AWS region for deployments"
  type        = string
}

variable "owner" {
  description = "Owner or team responsible for the stack"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for the primary VPC"
  type        = string
}

variable "public_subnets" {
  description = "Public subnet definitions"
  type = list(object({
    cidr_block        = string
    availability_zone = string
  }))
}

variable "app_subnets" {
  description = "Application subnet definitions"
  type = list(object({
    cidr_block        = string
    availability_zone = string
  }))
}

variable "data_subnets" {
  description = "Data subnet definitions"
  type = list(object({
    cidr_block        = string
    availability_zone = string
  }))
}

variable "audit_subnets" {
  description = "Audit subnet definitions"
  type = list(object({
    cidr_block        = string
    availability_zone = string
  }))
}

variable "blockchain_subnets" {
  description = "Blockchain subnet definitions"
  type = list(object({
    cidr_block        = string
    availability_zone = string
  }))
}

variable "data_lake_bucket_name" {
  description = "Data lake bucket name"
  type        = string
}

variable "audit_bucket_name" {
  description = "Audit logs bucket name"
  type        = string
}

variable "sagemaker_endpoint_name" {
  description = "Placeholder SageMaker endpoint name"
  type        = string
}

variable "enable_step_function" {
  description = "Toggle for deploying Step Functions"
  type        = bool
}

variable "enable_waf" {
  description = "Toggle for optional WAF/CloudFront placeholder"
  type        = bool
}

variable "cloudfront_origin_domain_name" {
  description = "Origin domain used by the optional CloudFront distribution"
  type        = string
}

variable "blockchain_instance_type" {
  description = "Instance type for blockchain nodes"
  type        = string
}

variable "blockchain_instance_count" {
  description = "Number of blockchain nodes"
  type        = number
}

variable "blockchain_key_name" {
  description = "SSH key name for blockchain nodes"
  type        = string
}

variable "backend_bucket" {
  description = "S3 bucket used for Terraform state"
  type        = string
}

variable "backend_key" {
  description = "Terraform state key"
  type        = string
}

variable "backend_region" {
  description = "Region of the backend bucket"
  type        = string
}

variable "backend_dynamodb_table" {
  description = "DynamoDB table for state locking"
  type        = string
}
