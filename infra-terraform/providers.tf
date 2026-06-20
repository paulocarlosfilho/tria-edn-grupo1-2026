terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  # Política de tags obrigatórias cobrada pela Anabel
  default_tags {
    tags = {
      "Hackathon"     = "Grupo1"
      "Grupo"         = var.nome_grupo
      "Projeto"       = "Tria"
      "Ambiente"      = "Production"
      "GerenciadoPor" = "Terraform"
    }
  }
}