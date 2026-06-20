# Projeto Tria - Plataforma Inteligente de Análise de Sinistros

## 1. Visão Geral do Projeto

**Tria** é uma plataforma de software como serviço (SaaS) projetada para revolucionar a análise de sinistros de seguros. Utilizando uma arquitetura serverless na AWS e inteligência artificial, a Tria automatiza o processo de recebimento, análise e consulta de documentos de sinistros, oferecendo uma solução ágil, segura e escalável para seguradoras.

### Problema de Negócio

Seguradoras enfrentam um grande volume de processos de sinistros que dependem de análise manual de documentos. Esse processo é lento, caro e propenso a erros humanos, resultando em atrasos nos pagamentos e insatisfação do cliente.

### Solução Proposta

A Tria implementa um fluxo de trabalho automatizado:
1.  **Upload Seguro:** Clientes ou agentes fazem o upload de documentos (apólices, laudos, etc.) em um portal seguro.
2.  **Processamento Inteligente:** Os documentos são analisados por um fluxo de IA (potencialmente com AWS Bedrock e Step Functions) que extrai informações, valida dados e classifica o sinistro.
3.  **Consulta Rápida:** As informações processadas são armazenadas em um banco de dados NoSQL, permitindo consultas instantâneas sobre o status e os detalhes de qualquer sinistro através de uma API segura.

---

## 2. Arquitetura da Solução

O projeto é construído sobre uma arquitetura 100% serverless na AWS, garantindo alta disponibilidade, escalabilidade automática e otimização de custos (pague-pelo-uso).

### Componentes da Infraestrutura (`/infra-terraform`)

-   **Rede Segura:**
    -   **VPC, Subnets (Públicas e Privadas):** Cria uma rede isolada na nuvem para máxima segurança.
    -   **NAT Gateway & Internet Gateway:** Permite que recursos em subnets privadas acessem a internet de forma segura, sem serem expostos diretamente.

-   **Fluxo de Dados e Processamento (Backend):**
    -   **Amazon S3 (`tria-documentos`):** Bucket de armazenamento para o upload dos documentos de sinistros.
    -   **Amazon EventBridge & SQS:** O upload de um novo documento no S3 dispara um evento, que é enviado para uma fila SQS, garantindo que nenhum evento seja perdido.
    -   **AWS Lambda (`lambda_processamento`):** Função que é acionada pela fila SQS para iniciar o processamento dos documentos.
    -   **Amazon DynamoDB (`tria-sinistros-table`):** Banco de dados NoSQL para armazenar os dados extraídos e o status dos sinistros.
    -   **Amazon SNS:** Tópico de notificação para alertar sobre a conclusão (ou falha) do processamento.

-   **API de Consulta (Backend):**
    -   **AWS Lambda (`lambda_consulta`):** Função que busca informações de um sinistro específico no DynamoDB.
    -   **Amazon API Gateway:** Expõe a `lambda_consulta` como um endpoint de API RESTful (`GET /sinistros/{id_sinistro}`).

-   **Frontend e Autenticação:**
    -   **Amazon S3 (`tria-frontend`):** Bucket configurado para hospedar os arquivos estáticos da aplicação React.
    -   **Amazon CloudFront:** Rede de distribuição de conteúdo (CDN) que entrega o site com baixa latência e segurança (HTTPS). Utiliza OAC (Origin Access Control) para garantir que o bucket S3 não seja acessado publicamente.
    -   **Amazon Cognito:** Gerencia o ciclo de vida dos usuários (cadastro, login, recuperação de senha) e emite tokens JWT para autenticar as chamadas à API Gateway.

---

## 3. Como Implantar o Projeto

> **⚠️ Atenção:** Esta seção descreve o processo de implantação planejado. Atualmente, estamos trabalhando para resolver as configurações de credenciais na pipeline de CI/CD para concluir a primeira implantação.

Siga os passos abaixo para configurar e implantar a infraestrutura e a aplicação.

### Pré-requisitos

-   Conta na AWS com credenciais configuradas (Access Key e Secret Key).
-   [Terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli) instalado.
-   [AWS CLI](https://aws.amazon.com/cli/) instalada.
-   [Node.js e npm](https://nodejs.org/en/) instalados.

### Passo 1: Implantar a Infraestrutura com Terraform

1.  **Navegue até a pasta da infraestrutura:**
    ```bash
    cd infra-terraform
    ```

2.  **Inicialize o Terraform:**
    Este comando prepara o ambiente, baixando os provedores necessários.
    ```bash
    terraform init
    ```

3.  **Planeje a Implantação:**
    O Terraform irá mostrar todos os recursos que serão criados.
    ```bash
    terraform plan
    ```

4.  **Aplique a Configuração:**
    Este comando irá provisionar todos os recursos na sua conta AWS.
    ```bash
    terraform apply --auto-approve
    ```

5.  **Colete os Outputs:**
    Após a conclusão, o Terraform exibirá saídas importantes. Guarde estes valores, pois serão usados no próximo passo.
    ```bash
    terraform output
    ```
    *   `api_gateway_url_consulta`
    *   `cognito_user_pool_id`
    *   `cognito_user_pool_client_id`
    *   `frontend_bucket_name`

### Passo 2: Implantar a Aplicação Frontend

1.  **Configure a Aplicação React:**
    -   Abra o arquivo `frontend-react/src/aws-exports.js`.
    -   Preencha os valores de `aws_user_pools_id`, `aws_user_pools_web_client_id` e `endpoint` com as saídas do Terraform do passo anterior.

2.  **Instale as Dependências:**
    Navegue até a pasta do frontend e instale os pacotes necessários.
    ```bash
    cd ../frontend-react
    npm install
    ```

3.  **Compile a Aplicação:**
    Este comando gera uma pasta `build` com os arquivos otimizados para produção.
    ```bash
    npm run build
    ```

4.  **Envie os Arquivos para o S3:**
    Use a AWS CLI para sincronizar a pasta `build` com o bucket S3 do frontend. **Substitua `SEU-BUCKET-NAME-AQUI`** pelo valor da saída `frontend_bucket_name`.
    ```bash
    aws s3 sync build/ s3://SEU-BUCKET-NAME-AQUI --delete
    ```

### Passo 3: Acesse a Aplicação

-   Abra o seu navegador e acesse a URL fornecida pelo output `cloudfront_distribution_domain` do Terraform.
-   Você será redirecionado para a página de login gerenciada pelo Cognito. Crie uma conta, confirme seu e-mail e faça o login para acessar o portal de consulta.

---

## 4. Automação com GitHub Actions (CI/CD)

O repositório está configurado com um workflow de CI/CD (`.github/workflows/terraform.yml`) que automatiza a validação e implantação da infraestrutura.

-   **Em Pull Requests:** O workflow executa `terraform init` e `terraform plan` para garantir que as mudanças são válidas antes de serem mescladas.
-   **Em Merges para `develop`:** O workflow executa `terraform apply` para implantar as mudanças automaticamente.

Para que a automação funcione, é necessário configurar os seguintes "Secrets" no repositório do GitHub (`Settings > Secrets and variables > Actions`):
-   `AWS_ACCESS_KEY_ID`: Sua chave de acesso da AWS.
-   `AWS_SECRET_ACCESS_KEY`: Sua chave de acesso secreta da AWS.