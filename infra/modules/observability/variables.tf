variable "name" {
  description = "Base name for observability and security resources"
  type        = string
}

variable "environment" {
  description = "Environment identifier"
  type        = string
}

variable "lambda_function_names" {
  description = "List of Lambda function names that require explicit log groups"
  type        = list(string)
}

variable "audit_bucket_name" {
  description = "Audit bucket used for AWS Config delivery"
  type        = string
}

variable "enable_waf" {
  description = "Controls optional creation of a WAF and CloudFront placeholder"
  type        = bool
  default     = false
}

variable "cloudfront_origin_domain_name" {
  description = "Origin domain name used by the optional CloudFront distribution"
  type        = string
  default     = ""
}

variable "tags" {
  description = "Additional tags applied to resources"
  type        = map(string)
  default     = {}
}
