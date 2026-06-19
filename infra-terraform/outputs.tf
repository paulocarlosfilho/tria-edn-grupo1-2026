output "bucket_name" {
  value = aws_s3_bucket.bucket_documentos.id
}

output "sqs_queue_url" {
  value = aws_sqs_queue.fila_processamento.id
}

output "sns_topic_arn" {
  value = aws_sns_topic.alertas_operacoes.arn
}

output "dynamodb_table_name" {
  value = aws_dynamodb_table.tabela_dados_estruturados.name
}

output "api_gateway_url_consulta" {
  value       = "${aws_apigatewayv2_api.api_consulta.api_endpoint}/${aws_apigatewayv2_stage.api_stage.name}"
  description = "URL base para o Portal do SAC realizar consultas de sinistros"
}