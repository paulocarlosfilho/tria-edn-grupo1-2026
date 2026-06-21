# Changelog

Todo o histórico de mudanças notáveis neste projeto será documentado neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-20

Esta é a primeira versão principal da plataforma de ingestão de documentos.

### Added (Adicionado)
- **Criação do Projeto:** Estrutura inicial do projeto com Create React App.
- **Interface de Ingestão:** Implementada uma interface de usuário moderna com Tailwind CSS para o upload de documentos.
- **Suporte a Múltiplos Arquivos:** O campo de upload agora aceita arquivos `.pdf` e todos os tipos de imagem (`image/*`).
- **Documentação de Deploy:** Adicionado `DEPLOY_GUIDE.md` com o passo a passo para instalar dependências, gerar a build e publicar no S3.
- **Criação do Changelog:** Adicionado este arquivo (`CHANGELOG.md`) para rastrear o histórico de versões do projeto.

### Changed (Alterado)
- **Pivô da Funcionalidade Principal:** O foco do projeto mudou de um "Portal de Consulta de Sinistros" para uma "Plataforma de Ingestão de Documentos via IA".
- **Design da Interface:** A interface foi completamente redesenhada, saindo de um layout básico com Bootstrap para um design customizado e profissional com Tailwind CSS.

### Fixed (Corrigido)
- **Configuração do Git:** O arquivo `.gitignore` foi corrigido para ignorar corretamente as pastas `node_modules/` e `build/`, prevenindo que arquivos desnecessários fossem rastreados.
- **Estabilidade do Repositório:** Resolvidos erros de `Bad file descriptor` no Git, estabilizando o processo de commit.

---