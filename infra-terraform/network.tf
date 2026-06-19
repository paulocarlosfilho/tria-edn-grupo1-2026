# ==========================================
# REDE (VPC, SUBNETS, ETC)
# ==========================================

# VPC
resource "aws_vpc" "vpc_tria" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
}

# Internet Gateway
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.vpc_tria.id
}

# Subnet Pública
resource "aws_subnet" "publica_1" {
  vpc_id                  = aws_vpc.vpc_tria.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true
}

resource "aws_route_table" "publica" {
  vpc_id = aws_vpc.vpc_tria.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
}

resource "aws_route_table_association" "publica_1" {
  subnet_id      = aws_subnet.publica_1.id
  route_table_id = aws_route_table.publica.id
}

# Subnet Privada
resource "aws_subnet" "privada_1" {
  vpc_id            = aws_vpc.vpc_tria.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "us-east-1a"
}

resource "aws_route_table" "privada" {
  vpc_id = aws_vpc.vpc_tria.id
}

resource "aws_route_table_association" "privada_1" {
  subnet_id      = aws_subnet.privada_1.id
  route_table_id = aws_route_table.privada.id
}