resource "random_pet" "suffix" {
  length = 2
}

locals {
  bucket_suffix = random_pet.suffix.id
}

module "network" {
  source      = "../../../../modules/network"
  name        = "test"
  environment = "test"
  vpc_cidr    = "10.60.0.0/16"

  public_subnets = [
    {
      cidr_block        = "10.60.1.0/24"
      availability_zone = "${var.aws_region}a"
    },
    {
      cidr_block        = "10.60.2.0/24"
      availability_zone = "${var.aws_region}b"
    }
  ]

  app_subnets = [
    {
      cidr_block        = "10.60.10.0/24"
      availability_zone = "${var.aws_region}a"
    },
    {
      cidr_block        = "10.60.11.0/24"
      availability_zone = "${var.aws_region}b"
    }
  ]

  data_subnets = [
    {
      cidr_block        = "10.60.20.0/24"
      availability_zone = "${var.aws_region}a"
    },
    {
      cidr_block        = "10.60.21.0/24"
      availability_zone = "${var.aws_region}b"
    }
  ]

  audit_subnets = [
    {
      cidr_block        = "10.60.30.0/24"
      availability_zone = "${var.aws_region}a"
    },
    {
      cidr_block        = "10.60.31.0/24"
      availability_zone = "${var.aws_region}b"
    }
  ]

  blockchain_subnets = []

  tags = {
    Owner = "tests"
  }
}

module "data_stores" {
  source      = "../../../../modules/data_stores"
  name        = "test"
  environment = "test"
  vpc_id      = module.network.vpc_id

  route_table_ids = flatten([
    module.network.route_table_ids.app,
    module.network.route_table_ids.data,
    module.network.route_table_ids.audit
  ])

  data_lake_bucket_name = "terratest-data-lake-${local.bucket_suffix}"
  ledger_table_name     = "terratest-ledger-${local.bucket_suffix}"

  tags = {
    Owner = "tests"
  }
}

module "serverless_app" {
  source      = "../../../../modules/serverless_app"
  name        = "test"
  environment = "test"
  vpc_id      = module.network.vpc_id

  app_subnet_ids        = module.network.app_subnet_ids
  data_lake_bucket_arn  = module.data_stores.data_lake_bucket_arn
  data_lake_bucket_name = module.data_stores.data_lake_bucket_name
  ledger_table_arn      = module.data_stores.ledger_table_arn
  ledger_table_name     = module.data_stores.ledger_table_name
  queue_name            = "ingestion-queue-${local.bucket_suffix}"
  enable_step_function  = false

  tags = {
    Owner = "tests"
  }
}

output "api_invoke_url" {
  value = module.serverless_app.api_invoke_url
}

output "queue_url" {
  value = module.serverless_app.queue_url
}
