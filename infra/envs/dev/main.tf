locals {
  common_tags = {
    Owner   = var.owner
    Project = var.project_name
  }
}

module "network" {
  source      = "../../modules/network"
  name        = var.project_name
  environment = var.environment
  vpc_cidr    = var.vpc_cidr

  public_subnets     = var.public_subnets
  app_subnets        = var.app_subnets
  data_subnets       = var.data_subnets
  audit_subnets      = var.audit_subnets
  blockchain_subnets = var.blockchain_subnets

  tags = local.common_tags
}

module "data_stores" {
  source      = "../../modules/data_stores"
  name        = var.project_name
  environment = var.environment
  vpc_id      = module.network.vpc_id

  route_table_ids = flatten([
    module.network.route_table_ids.app,
    module.network.route_table_ids.data,
    module.network.route_table_ids.audit,
    module.network.route_table_ids.blockchain
  ])

  data_lake_bucket_name = var.data_lake_bucket_name
  ledger_table_name     = "ledger-table"

  tags = local.common_tags
}

# module "serverless_app" {
#   source      = "../../modules/serverless_app"
#   name        = var.project_name
#   environment = var.environment
#   vpc_id      = module.network.vpc_id

#   app_subnet_ids                 = module.network.app_subnet_ids
#   data_lake_bucket_arn           = module.data_stores.data_lake_bucket_arn
#   data_lake_bucket_name          = module.data_stores.data_lake_bucket_name
#   ledger_table_arn               = module.data_stores.ledger_table_arn
#   ledger_table_name              = module.data_stores.ledger_table_name
#   queue_name                     = "ingestion-queue"
#   enable_step_function           = var.enable_step_function
#   processing_schedule_expression = "rate(5 minutes)"

#   tags = local.common_tags
# }

# module "blockchain_ipfs" {
#   source      = "../../modules/blockchain_ipfs"
#   name        = var.project_name
#   environment = var.environment
#   vpc_id      = module.network.vpc_id
#   vpc_cidr    = var.vpc_cidr

#   subnet_ids     = module.network.blockchain_subnet_ids
#   instance_type  = var.blockchain_instance_type
#   instance_count = var.blockchain_instance_count
#   key_name       = var.blockchain_key_name

#   tags = local.common_tags
# }

# module "audit_analytics" {
#   source      = "../../modules/audit_analytics"
#   name        = var.project_name
#   environment = var.environment
#   vpc_id      = module.network.vpc_id

#   audit_subnet_ids      = module.network.audit_subnet_ids
#   audit_bucket_name     = var.audit_bucket_name
#   glue_database_name    = "audit_logs_db"
#   glue_table_name       = "audit_logs"
#   athena_workgroup_name = "audit-workgroup"

#   tags = local.common_tags
# }

# module "ml" {
#   source      = "../../modules/ml"
#   name        = var.project_name
#   environment = var.environment

#   sagemaker_endpoint_name = var.sagemaker_endpoint_name

#   tags = local.common_tags
# }

# module "observability" {
#   source      = "../../modules/observability"
#   name        = var.project_name
#   environment = var.environment

#   lambda_function_names = [
#     module.serverless_app.ingestion_lambda_name,
#     module.serverless_app.processing_lambda_name,
#     module.audit_analytics.audit_lambda_name
#   ]

#   audit_bucket_name             = module.audit_analytics.audit_bucket_name
#   enable_waf                    = var.enable_waf
#   cloudfront_origin_domain_name = var.cloudfront_origin_domain_name

#   tags = local.common_tags
# }

output "network_vpc_id" {
  description = "VPC identifier for the environment"
  value       = module.network.vpc_id
}

# output "api_invoke_url" {
#   description = "Invoke URL for the ingestion API"
#   value       = module.serverless_app.api_invoke_url
# }

# output "audit_bucket_name" {
#   description = "Audit bucket used by compliance tooling"
#   value       = module.audit_analytics.audit_bucket_name
# }

# output "ml_placeholder_endpoint" {
#   description = "Configured placeholder SageMaker endpoint name"
#   value       = module.ml.sagemaker_endpoint_name
# }
