# GitHub AI Commander

PWA mobile-first para comandar alterações em repositórios GitHub por texto ou voz, sempre com prévia antes da execução.

## Primeira versão
- Seleção de repositório e branch.
- Campo de comando em português.
- Gravação de áudio pelo celular.
- Prévia da alteração antes da confirmação.
- Interface instalável como PWA.
- Nenhum token GitHub é colocado no frontend.

## Próxima etapa
A execução real será feita por um backend seguro, usando autenticação GitHub/OAuth e um serviço de IA. O backend deverá:
1. Receber o comando.
2. Ler o repositório e a branch autorizados.
3. Identificar arquivos relevantes.
4. Gerar diff.
5. Retornar a prévia.
6. Só após confirmação, criar commit ou pull request.

Nunca colocar PAT, client secret ou qualquer credencial permanente no código do navegador.
