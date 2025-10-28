variable "name" {
  description = "Base name used for ML resources"
  type        = string
}

variable "environment" {
  description = "Environment identifier"
  type        = string
}

variable "sagemaker_endpoint_name" {
  description = "Placeholder SageMaker endpoint name"
  type        = string
  default     = "ml-endpoint-placeholder"
}

variable "tags" {
  description = "Additional tags applied to ML scaffolding"
  type        = map(string)
  default     = {}
}
