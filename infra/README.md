# VPBank Hackathon Terraform Infrastructure

This repository contains a production-ready Terraform layout that provisions the VPBank hackathon platform across network, serverless, data, blockchain, audit, ML, and observability layers. The codebase follows Terraform best practices, is fully modular, and supports multiple environments (development and production) with Terratest coverage.

## Repository Layout

```
infra/
  modules/               # Reusable infrastructure modules
    network/             # VPC, subnets, routing, NAT
    data_stores/         # Data lake S3 bucket, DynamoDB, VPC endpoints
    serverless_app/      # API Gateway, Lambdas, SQS, Step Functions, EventBridge
    blockchain_ipfs/     # Private EC2 nodes for blockchain/IPFS workloads
    audit_analytics/     # Audit bucket, audit Lambda, Glue catalog, Athena workgroup
    ml/                  # SageMaker IAM scaffolding and endpoint placeholders
    observability/       # CloudWatch log groups, GuardDuty, AWS Config, optional WAF/CloudFront
  envs/
    dev/                 # Development environment configuration
    prod/                # Production environment configuration
  tests/
    terratest/           # Terratest suites and fixtures
    Makefile             # fmt/validate/test helpers
    go.mod, go.sum       # Go module definition for tests
```

## Prerequisites

- Terraform >= 1.6.0
- AWS credentials with permissions to manage the provisioned services
- (Optional) Go >= 1.21 if you plan to execute the Terratest suite. Run `go mod tidy` in `infra/tests` to download dependencies before testing.

## Backend Configuration

Each environment expects the remote backend parameters (`backend_bucket`, `backend_key`, `backend_region`, `backend_dynamodb_table`) to be provided. Update `terraform.tfvars` or supply the values via CLI flags/environment variables before running `terraform init`.

## Deploying an Environment

1. Change into the target environment directory, e.g. `infra/envs/dev`.
2. Initialize without a backend to review configuration:
   ```bash
   terraform init -backend-config bucket=<state-bucket> \
     -backend-config key=vpbank-hackathon/dev/terraform.tfstate \
     -backend-config region=ap-southeast-1 \
     -backend-config dynamodb_table=<lock-table>
   ```
3. Review the plan:
   ```bash
   terraform plan -var-file=terraform.tfvars
   ```
4. Apply the stack when ready:
   ```bash
   terraform apply -var-file=terraform.tfvars
   ```

Modules are instantiated in dependency order within `main.tf` (network → data stores → serverless → blockchain/IPFS → audit/analytics → ML scaffolding → observability). Individual modules can be applied by creating ad-hoc terragrunt/terraform wrappers that point to `infra/modules/<module>`.

## Running Terratest

From the `infra/tests` directory:

```bash
make fmt        # Runs terraform fmt recursively
make validate   # Validates both dev and prod stacks
make test       # Executes Terratest suites (requires Go and AWS credentials)
```

The Terratest suites provision isolated fixtures to validate the network and serverless layers, asserting that critical outputs (VPC ID, public subnets, API invoke URL, queue URL) are returned.

## Cleaning Up

Always destroy test fixtures and sandbox deployments to avoid incurring cloud costs:

```bash
terraform destroy -var-file=terraform.tfvars
```

The Terratest suite automatically runs `terraform destroy`, but you should also run it manually when experimenting interactively.

export AWS_ACCESS_KEY_ID="AKIAV6PFTFWHKEHDEYPF"
export AWS_SECRET_ACCESS_KEY="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"
export AWS_DEFAULT_REGION="Global"
