data "aws_region" "current" {}

data "aws_ami" "al2023" {
  most_recent = true

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "architecture"
    values = ["x86_64"]
  }

  owners = ["amazon"]
}

locals {
  base_tags = merge(
    {
      Environment = var.environment
      Module      = "blockchain_ipfs"
    },
    var.tags
  )
}

# Security group limiting ingress to intra-VPC traffic only
resource "aws_security_group" "blockchain" {
  name        = "${var.name}-${var.environment}-blockchain-sg"
  description = "Security group for blockchain/IPFS nodes"
  vpc_id      = var.vpc_id

  ingress {
    description = "Allow peer-to-peer traffic from inside the VPC"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [var.vpc_cidr]
  }

  egress {
    description = "Allow outbound traffic for cluster communication"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = merge(local.base_tags, {
    Name = "${var.name}-${var.environment}-blockchain-sg"
  })
}

# Launch EC2 instances representing blockchain/IPFS nodes without public exposure
resource "aws_instance" "nodes" {
  count                       = var.instance_count
  ami                         = data.aws_ami.al2023.id
  instance_type               = var.instance_type
  subnet_id                   = element(var.subnet_ids, count.index % length(var.subnet_ids))
  associate_public_ip_address = false
  key_name                    = var.key_name != "" ? var.key_name : null
  vpc_security_group_ids      = [aws_security_group.blockchain.id]

  metadata_options {
    http_endpoint = "enabled"
    http_tokens   = "required"
  }

  root_block_device {
    volume_size = 50
    volume_type = "gp3"
    encrypted   = true
  }

  tags = merge(local.base_tags, {
    Name = "${var.name}-${var.environment}-blockchain-${count.index}"
  })
}
