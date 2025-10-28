variable "name" {
  description = "Base name used for tagging and naming network resources"
  type        = string
}

variable "environment" {
  description = "Environment identifier (e.g. dev, prod)"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for the primary VPC"
  type        = string
}

variable "public_subnets" {
  description = "List of public subnet definitions where NAT gateways and ingress resources reside"
  type = list(object({
    cidr_block        = string
    availability_zone = string
  }))
}

variable "app_subnets" {
  description = "List of private application subnet definitions for Lambda and API workloads"
  type = list(object({
    cidr_block        = string
    availability_zone = string
  }))
}

variable "data_subnets" {
  description = "List of private data subnet definitions for data stores and analytics engines"
  type = list(object({
    cidr_block        = string
    availability_zone = string
  }))
}

variable "audit_subnets" {
  description = "List of dedicated audit subnet definitions"
  type = list(object({
    cidr_block        = string
    availability_zone = string
  }))
}

variable "blockchain_subnets" {
  description = "List of subnet definitions for blockchain and IPFS nodes"
  type = list(object({
    cidr_block        = string
    availability_zone = string
  }))
}

variable "enable_nat_gateways" {
  description = "Whether to create one NAT gateway per public subnet"
  type        = bool
  default     = true
}

variable "tags" {
  description = "Additional resource tags to merge with defaults"
  type        = map(string)
  default     = {}
}
