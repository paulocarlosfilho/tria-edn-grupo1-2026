# ==========================================
# ARMAZENAMENTO (DOCUMENTOS BRUTOS)
# ==========================================
resource "aws_s3_bucket" "bucket_documentos" {
  bucket        = "docusmart-documentos-brutos-${var.nome_grupo}"
  force_destroy = true
}

resource "aws_s3_bucket_notification" "s3_to_eventbridge" {
  bucket      = aws_s3_bucket.bucket_documentos.id
  eventbridge = true
}

# ==========================================
# EVENTOS & ROTEAMENTO (EVENTBRIDGE)
# ==========================================
resource "aws_cloudwatch_event_rule" "event_upload" {
  name        = "docusmart-upload-rule-${var.nome_grupo}"
  event_pattern = jsonencode({
    source      = ["aws.s3"],
    detail-type = ["Object Created"],
    detail = {
      bucket = { name = [aws_s3_bucket.bucket_documentos.id] }
    }
  })
}

resource "aws_cloudwatch_event_target" "target_to_sqs" {
  rule      = aws_cloudwatch_event_rule.event_upload.name
  arn       = aws_sqs_queue.fila_processamento.arn
}

# ==========================================
# FILA DE PROCESSAMENTO (SQS)
# ==========================================
resource "aws_sqs_queue" "fila_processamento" {
  name                      = "docusmart-fila-processamento-${var.nome_grupo}"
  receive_wait_time_seconds = 20
}

# Configura política para o EventBridge conseguir injetar mensagens na fila SQS
resource "aws_sqs_queue_policy" "sqs_policy" {
  queue_url = aws_sqs_queue.fila_processamento.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = "*"
      Action    = "sqs:SendMessage"
      Resource  = aws_sqs_queue.fila_processamento.arn
      Condition = {
        ArnEquals = { "aws:SourceArn" = aws_cloudwatch_event_rule.event_upload.arn }
      }
    }]
  })
}

# ==========================================
# ORQUESTRACAO & IA (LAMBDA CONTROLLER)
# ==========================================
resource "aws_lambda_function" "lambda_orquestracao" {
  filename      = "lambda_function.zip"
  function_name = "docusmart-lambda-orquestracao-${var.nome_grupo}"
  role          = aws_iam_role.lambda_role.arn
  handler       = "index.handler"
  runtime       = "python3.10"

  environment {
    variables = {
      DYNAMODB_TABLE = aws_dynamodb_table.tabela_dados_estruturados.name
      SNS_TOPIC_ARN  = aws_sns_topic.alertas_operacoes.arn
    }
  }
}

# Gatilho para a Lambda ler os arquivos da fila SQS automaticamente
resource "aws_lambda_event_source_mapping" "sqs_trigger" {
  event_source_arn = aws_sqs_queue.fila_processamento.arn
  function_name    = aws_lambda_function.lambda_orquestracao.arn
  batch_size       = 5
}

# ==========================================
# BANCO DE DADOS (DADOS ESTRUTURADOS)
# ==========================================
resource "aws_dynamodb_table" "tabela_dados_estruturados" {
  name         = "docusmart-dados-estruturados-${var.nome_grupo}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id_sinistro"

  attribute {
    name = "id_sinistro"
    type = "S"
  }
}

# ==========================================
# CANAIS DE ALERTAS & NOTIFICAÇÕES (SNS)
# ==========================================
resource "aws_sns_topic" "alertas_operacoes" {
  name = "docusmart-alertas-notificacoes-${var.nome_grupo}"
}