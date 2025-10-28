output "security_group_id" {
  description = "Security group protecting the blockchain/IPFS nodes"
  value       = aws_security_group.blockchain.id
}

output "instance_ids" {
  description = "List of instance IDs for the blockchain/IPFS nodes"
  value       = [for instance in aws_instance.nodes : instance.id]
}

output "private_ips" {
  description = "Private IP addresses assigned to blockchain/IPFS nodes"
  value       = [for instance in aws_instance.nodes : instance.private_ip]
}
