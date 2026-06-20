/* eslint-disable */
// ATENÇÃO: Preencha com os valores que você anotou ao criar os serviços no console da AWS.

const awsmobile = {
    "aws_project_region": "us-east-1", // Mantenha a região que você usou
    "aws_cognito_region": "us-east-1", // Mantenha a região que você usou
    "aws_user_pools_id": "COLE_SEU_USER_POOL_ID_AQUI",
    "aws_user_pools_web_client_id": "COLE_SEU_CLIENT_ID_AQUI",
    "oauth": {},
    "aws_cloud_logic_custom": [
        {
            "name": "TriaAPI",
            // Se você criou a API manualmente, cole a URL de invocação aqui.
            // Ex: "https://xxxx.execute-api.us-east-1.amazonaws.com/prod"
            "endpoint": "COLE_A_URL_DA_SUA_API_GATEWAY_AQUI",
            "custom_header": async () => { 
              // Este código adiciona o token de autenticação em cada chamada para a API
              return { Authorization: `Bearer ${(await Amplify.Auth.currentSession()).getIdToken().getJwtToken()}` }
            }
        }
    ]
};

export default awsmobile;