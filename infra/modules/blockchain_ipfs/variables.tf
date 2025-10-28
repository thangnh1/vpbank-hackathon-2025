variable "name" {
  description = "Base name for blockchain/IPFS components"
  type        = string
}

variable "environment" {
  description = "Environment identifier"
  type        = string
}

variable "vpc_id" {
  description = "VPC where the blockchain nodes are launched"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block of the VPC used to restrict security group ingress"
  type        = string
}

variable "subnet_ids" {
  description = "List of blockchain subnet IDs"
  type        = list(string)
}

variable "instance_type" {
  description = "EC2 instance type for blockchain/IPFS nodes"
  type        = string
  default     = "t3.medium"
}

variable "instance_count" {
  description = "Number of blockchain/IPFS nodes to launch"
  type        = number
  default     = 2
}

variable "key_name" {
  description = "Optional SSH key pair name for node access"
  type        = string
  default     = ""
}

variable "tags" {
  description = "Additional tags to apply"
  type        = map(string)
  default     = {}
}
