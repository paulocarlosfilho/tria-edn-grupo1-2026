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

output "cloudfront_distribution_domain" {
  value = aws_cloudfront_distribution.cdn.domain_name
  description = "Domain name for the CloudFront distribution"
}

output "cognito_user_pool_id" {
  value = aws_cognito_user_pool.user_pool.id
  description = "ID of the Cognito User Pool"
}

output "cognito_user_pool_client_id" {
  value = aws_cognito_user_pool_client.user_pool_client.id
  description = "ID of the Cognito User Pool Client"
}

output "frontend_bucket_name" {
  value = aws_s3_bucket.frontend_bucket.id
  description = "Name of the S3 bucket for the frontend static files"
}