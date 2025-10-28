locals {
  base_tags = merge(
    {
      Environment = var.environment
      Module      = "network"
    },
    var.tags
  )

  public_subnets_by_az = { for subnet in var.public_subnets : subnet.availability_zone => subnet }

  private_subnets = merge(
    { for idx, subnet in var.app_subnets : "app-${idx}" => merge(subnet, { group = "app" }) },
    { for idx, subnet in var.data_subnets : "data-${idx}" => merge(subnet, { group = "data" }) },
    { for idx, subnet in var.audit_subnets : "audit-${idx}" => merge(subnet, { group = "audit" }) },
    { for idx, subnet in var.blockchain_subnets : "blockchain-${idx}" => merge(subnet, { group = "blockchain" }) }
  )
}

resource "aws_vpc" "this" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = merge(local.base_tags, {
    Name = "${var.name}-vpc"
  })
}

resource "aws_internet_gateway" "this" {
  vpc_id = aws_vpc.this.id

  tags = merge(local.base_tags, {
    Name = "${var.name}-igw"
  })
}

resource "aws_subnet" "public" {
  for_each = local.public_subnets_by_az

  vpc_id                  = aws_vpc.this.id
  cidr_block              = each.value.cidr_block
  availability_zone       = each.value.availability_zone
  map_public_ip_on_launch = true

  tags = merge(local.base_tags, {
    Name = "${var.name}-public-${each.value.availability_zone}"
  })
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.this.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.this.id
  }

  tags = merge(local.base_tags, {
    Name = "${var.name}-public-rt"
  })
}

resource "aws_route_table_association" "public" {
  for_each       = aws_subnet.public
  subnet_id      = each.value.id
  route_table_id = aws_route_table.public.id
}

resource "aws_eip" "nat" {
  for_each = var.enable_nat_gateways ? local.public_subnets_by_az : {}

  domain = "vpc"

  tags = merge(local.base_tags, {
    Name = "${var.name}-nat-eip-${each.key}"
  })
}

resource "aws_nat_gateway" "this" {
  for_each = var.enable_nat_gateways ? local.public_subnets_by_az : {}

  allocation_id = aws_eip.nat[each.key].id
  subnet_id     = aws_subnet.public[each.key].id

  tags = merge(local.base_tags, {
    Name = "${var.name}-nat-${each.key}"
  })
}

resource "aws_subnet" "private" {
  for_each = local.private_subnets

  vpc_id            = aws_vpc.this.id
  cidr_block        = each.value.cidr_block
  availability_zone = each.value.availability_zone

  tags = merge(local.base_tags, {
    Name = "${var.name}-${each.value.group}-${each.value.availability_zone}-${replace(each.value.cidr_block, "/", "-")}"
  })
}

resource "aws_route_table" "private" {
  for_each = local.private_subnets

  vpc_id = aws_vpc.this.id

  dynamic "route" {
    for_each = var.enable_nat_gateways ? [each.value.availability_zone] : []
    content {
      cidr_block     = "0.0.0.0/0"
      nat_gateway_id = aws_nat_gateway.this[route.value].id
    }
  }

  tags = merge(local.base_tags, {
    Name = "${var.name}-${each.value.group}-rt-${each.value.availability_zone}-${replace(each.value.cidr_block, "/", "-")}"
  })
}

resource "aws_route_table_association" "private" {
  for_each = local.private_subnets

  subnet_id      = aws_subnet.private[each.key].id
  route_table_id = aws_route_table.private[each.key].id
}
