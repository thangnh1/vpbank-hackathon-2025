terraform {
  backend "s3" {
    bucket         = "tf-state-dev-hnckc"
    key            = "vpbank-hackathon/dev/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks-dev"
    encrypt        = true
  }
}
