variable "name" {
  description = "Base name for audit and analytics resources"
  type        = string
}

variable "environment" {
  description = "Environment identifier"
  type        = string
}

variable "vpc_id" {
  description = "VPC identifier used for the audit Lambda"
  type        = string
}

variable "audit_subnet_ids" {
  description = "Subnet IDs dedicated to audit workloads"
  type        = list(string)
}

variable "audit_bucket_name" {
  description = "Globally unique bucket name used for audit logs"
  type        = string
}

variable "glue_database_name" {
  description = "Name of the Glue Data Catalog database"
  type        = string
  default     = "audit_logs_db"
}

variable "glue_table_name" {
  description = "Name of the Glue table referencing audit logs"
  type        = string
  default     = "audit_logs"
}

variable "athena_workgroup_name" {
  description = "Athena workgroup name for audit queries"
  type        = string
  default     = "audit-workgroup"
}

variable "tags" {
  description = "Additional tags applied to resources"
  type        = map(string)
  default     = {}
}
