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
      "Hackathon"     = "EdN-Jun-Grupo1-Tria-2026"
      "Grupo"         = var.nome_grupo
      "Projeto"       = var.nome_projeto
      "Ambiente"      = "Production-Tria"
      "GerenciadoPor" = "Terraform"
    }
  }
}