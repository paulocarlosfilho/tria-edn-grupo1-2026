resource "aws_subnet" "publica_1" {
  vpc_id                  = aws_vpc.vpc_docusmart.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true
}

resource "aws_route_table" "publica" {
  vpc_id = aws_vpc.vpc_docusmart.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
}

resource "aws_route_table_association" "publica_1" {
  subnet_id      = aws_subnet.publica_1.id
  route_table_id = aws_route_table.publica.id
}