# ==========================================
# CAMADA DE CONSULTA (API GATEWAY)
# ==========================================
resource "aws_apigatewayv2_api" "api_consulta" {
  name          = "tria-api-consulta-${var.nome_grupo}"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "api_stage" {
  api_id      = aws_apigatewayv2_api.api_consulta.id
  name        = "prod"
  auto_deploy = true
}

# Integração do API Gateway com a Lambda de Consulta
resource "aws_apigatewayv2_integration" "integration_lambda" {
  api_id           = aws_apigatewayv2_api.api_consulta.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.lambda_consulta.invoke_arn
}

# Rota de consulta: GET /sinistros/{id}
resource "aws_apigatewayv2_route" "rota_consulta" {
  api_id    = aws_apigatewayv2_api.api_consulta.id
  route_key = "GET /sinistros/{id_sinistro}"
  target    = "integrations/${aws_apigatewayv2_integration.integration_lambda.id}"
}

# Permissionamento para a API invocar a Lambda
resource "aws_lambda_permission" "api_gw_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_consulta.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api_consulta.execution_arn}/*/*"
}

# ==========================================
# LAMBDA DE CONSULTA (PORTAL SAC)
# ==========================================
resource "aws_lambda_function" "lambda_consulta" {
  filename      = "lambda_consulta.zip"
  function_name = "tria-lambda-consulta-${var.nome_grupo}"
  role          = aws_iam_role.lambda_consulta_role.arn
  handler       = "index.handler"
  runtime       = "python3.10"

  environment {
    variables = {
      DYNAMODB_TABLE = aws_dynamodb_table.tabela_dados_estruturados.name
    }
  }
}