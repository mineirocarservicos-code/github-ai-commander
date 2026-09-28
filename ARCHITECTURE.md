# Arquitetura

## Fluxo
1. PWA recebe comando por texto ou áudio.
2. Backend recebe comando, repositório e branch.
3. Backend autentica no GitHub usando GITHUB_TOKEN armazenado como variável de ambiente.
4. Backend lê a árvore do repositório.
5. IA identifica arquivos relevantes e propõe alterações.
6. Frontend mostra arquivos + diff + resumo.
7. Usuário confirma.
8. Backend cria uma branch de trabalho e um Pull Request.
9. Usuário revisa o PR antes de incorporar a alteração.

## Segurança
Nunca colocar GITHUB_TOKEN, chave de IA ou client secret em index.html, app.js, localStorage ou qualquer arquivo versionado.

## Variáveis futuras
- GITHUB_TOKEN
- AI_API_KEY

A implementação final deve preferir Pull Request em vez de escrever diretamente na branch principal.
