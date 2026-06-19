resource "aws_iam_role" "lambda_role" {
  name = "docusmart-lambda-execution-role-${var.nome_grupo}"
  assume_role_policy = jsonencode({
    Version = "2012-10-19"
    Statement = [{ Action = "sts:AssumeRole", Effect = "Allow", Principal = { Service = "lambda.amazonaws.com" } }]
  })
}

resource "aws_iam_role_policy" "lambda_policy" {
  name = "docusmart-lambda-extended-policy-${var.nome_grupo}"
  role = aws_iam_role.lambda_role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      { Effect = "Allow", Action = ["logs:*"], Resource = "*" },
      { Effect = "Allow", Action = ["s3:GetObject"], Resource = "${aws_s3_bucket.bucket_documentos.arn}/*" },
      { Effect = "Allow", Action = ["sqs:ReceiveMessage", "sqs:DeleteMessage", "sqs:GetQueueAttributes"], Resource = aws_sqs_queue.fila_processamento.arn },
      { Effect = "Allow", Action = ["dynamodb:PutItem", "dynamodb:GetItem"], Resource = aws_dynamodb_table.tabela_dados_estruturados.arn },
      { Effect = "Allow", Action = ["sns:Publish"], Resource = aws_sns_topic.alertas_operacoes.arn },
      { Effect = "Allow", Action = ["textract:*", "bedrock:InvokeModel"], Resource = "*" }
    ]
  })
}