output "vpc_id" {
  description = "Identifier of the provisioned VPC"
  value       = aws_vpc.this.id
}

output "public_subnet_ids" {
  description = "List of public subnet IDs for ingress and NAT gateways"
  value       = [for subnet in aws_subnet.public : subnet.id]
}

output "app_subnet_ids" {
  description = "Application subnet IDs for serverless workloads"
  value = [
    for key, subnet in aws_subnet.private : subnet.id
    if local.private_subnets[key].group == "app"
  ]
}

output "data_subnet_ids" {
  description = "Data subnet IDs for data services"
  value = [
    for key, subnet in aws_subnet.private : subnet.id
    if local.private_subnets[key].group == "data"
  ]
}

output "audit_subnet_ids" {
  description = "Audit subnet IDs for compliance tooling"
  value = [
    for key, subnet in aws_subnet.private : subnet.id
    if local.private_subnets[key].group == "audit"
  ]
}

output "blockchain_subnet_ids" {
  description = "Blockchain/IPFS subnet IDs"
  value = [
    for key, subnet in aws_subnet.private : subnet.id
    if local.private_subnets[key].group == "blockchain"
  ]
}

output "route_table_ids" {
  description = "Map of subnet group to route table IDs, used for VPC endpoints"
  value = {
    public     = [aws_route_table.public.id]
    app        = [for key, rt in aws_route_table.private : rt.id if local.private_subnets[key].group == "app"]
    data       = [for key, rt in aws_route_table.private : rt.id if local.private_subnets[key].group == "data"]
    audit      = [for key, rt in aws_route_table.private : rt.id if local.private_subnets[key].group == "audit"]
    blockchain = [for key, rt in aws_route_table.private : rt.id if local.private_subnets[key].group == "blockchain"]
  }
}
