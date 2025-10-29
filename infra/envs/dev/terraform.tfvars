project_name = "vpbank-hackathon"
environment  = "dev"
aws_region   = "ap-southeast-1"
owner        = "cloud-platform"

vpc_cidr = "10.0.0.0/16"

public_subnets = [
  {
    cidr_block        = "10.0.1.0/24"
    availability_zone = "ap-southeast-1a"
  },
  {
    cidr_block        = "10.0.2.0/24"
    availability_zone = "ap-southeast-1b"
  }
]

app_subnets = [
  {
    cidr_block        = "10.0.10.0/24"
    availability_zone = "ap-southeast-1a"
  },
  {
    cidr_block        = "10.0.11.0/24"
    availability_zone = "ap-southeast-1b"
  }
]

data_subnets = [
  {
    cidr_block        = "10.0.20.0/24"
    availability_zone = "ap-southeast-1a"
  },
  {
    cidr_block        = "10.0.21.0/24"
    availability_zone = "ap-southeast-1b"
  }
]

audit_subnets = [
  {
    cidr_block        = "10.0.30.0/24"
    availability_zone = "ap-southeast-1a"
  },
  {
    cidr_block        = "10.0.31.0/24"
    availability_zone = "ap-southeast-1b"
  }
]

blockchain_subnets = [
  {
    cidr_block        = "10.0.40.0/24"
    availability_zone = "ap-southeast-1a"
  },
  {
    cidr_block        = "10.0.41.0/24"
    availability_zone = "ap-southeast-1b"
  }
]

data_lake_bucket_name  = "vpbank-hackathon-dev-data-lake"
audit_bucket_name      = "vpbank-hackathon-dev-audit-logs"
sagemaker_endpoint_name = "vpbank-hackathon-dev-ml-endpoint"

enable_step_function = true
enable_waf           = false
cloudfront_origin_domain_name = ""

blockchain_instance_type  = "t3.medium"
blockchain_instance_count = 2
blockchain_key_name       = ""

backend_bucket         = "replace-with-backend-bucket"
backend_key            = "vpbank-hackathon/dev/terraform.tfstate"
backend_region         = "ap-southeast-1"
backend_dynamodb_table = "replace-with-lock-table"
