resource "aws_subnet" "privada_1" {
  vpc_id            = aws_vpc.vpc_docusmart.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "us-east-1a"
}

resource "aws_route_table" "privada" {
  vpc_id = aws_vpc.vpc_docusmart.id
}

resource "aws_route_table_association" "privada_1" {
  subnet_id      = aws_subnet.privada_1.id
  route_table_id = aws_route_table.privada.id
}