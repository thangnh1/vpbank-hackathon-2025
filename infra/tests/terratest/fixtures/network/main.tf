module "network" {
  source      = "../../../../modules/network"
  name        = "test"
  environment = "test"
  vpc_cidr    = "10.50.0.0/16"

  public_subnets = [
    {
      cidr_block        = "10.50.1.0/24"
      availability_zone = "${var.aws_region}a"
    },
    {
      cidr_block        = "10.50.2.0/24"
      availability_zone = "${var.aws_region}b"
    }
  ]

  app_subnets = [
    {
      cidr_block        = "10.50.10.0/24"
      availability_zone = "${var.aws_region}a"
    },
    {
      cidr_block        = "10.50.11.0/24"
      availability_zone = "${var.aws_region}b"
    }
  ]

  data_subnets = []
  audit_subnets = []
  blockchain_subnets = []

  tags = {
    Owner = "tests"
  }
}

output "vpc_id" {
  value = module.network.vpc_id
}

output "public_subnet_ids" {
  value = module.network.public_subnet_ids
}
