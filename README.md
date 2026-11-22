# TopSongs API (Consumindo a API da Deezer)

API para pesquisa de artistas, álbuns e faixas utilizando a API da Deezer, com funcionalidade de geração de imagem personalizada (Canvas em alta definição) com informações e capa do artista e suas principais músicas.

## Funcionalidades e Rotas

- **Status da API**:
  - `GET /`: Status geral da API e catálogo interativo de rotas.
  - `GET /api`: Status do módulo Deezer.
  - `GET /topsongs`: Status do módulo TopSongs.
- **Deezer**:
  - `GET /api/artists?q={nome}`: Busca de artistas.
  - `GET /api/artistinfo?q={id}`: Informações detalhadas do artista.
  - `GET /api/albums?q={id}`: Lista de álbuns de um artista.
  - `GET /api/tracks?q={nome}`: Busca de faixas por nome.
  - `GET /api/tracklist?q={id_album}`: Lista de músicas de um álbum.
- **TopSongs Canvas**:
  - `POST /topsongs/canvas` (ou `POST /api/canvas`): Gera a imagem PNG personalizada (1080x1920).

### Exemplo de Corpo JSON (`POST /topsongs/canvas`):

```json
{
  "artist": {
    "name": "Coldplay",
    "bodyColor": "#0E131F",
    "color": "#3498db",
    "opacity": "25",
    "pattern": "1",
    "icon": "https://e-cdns-images.dzcdn.net/.../artist.jpg"
  },
  "songs": [
    {
      "title": "Yellow",
      "albumTitle": "Parachutes",
      "coverAlbum": "https://e-cdns-images.dzcdn.net/.../cover.jpg"
    }
  ]
}
```

## Como Rodar Localmente (Ambiente de Desenvolvimento)

1. **Instale as dependências**:
   ```bash
   npm install
   ```

2. **Configure a porta**:
   O arquivo `.env` já vem pré-configurado na porta local:
   ```env
   PORT=3001
   NODE_ENV=development
   ```

3. **Inicie o servidor**:
   - Modo desenvolvimento (com reinicialização automática via nodemon):
     ```bash
     npm run dev
     ```
   - Modo padrão:
     ```bash
     npm start
     ```

   A API iniciará em `http://localhost:3001`.

## Deploy na Vercel

Configurado com Serverless Functions nativas e suporte às versões modernas de Node.js (22.x, 24.x, 26.x):
- O arquivo `vercel.json` inclui rewrites direcionando o tráfego para `api/index.js` e inclui `fonts/**` e `images/**` no deploy (`includeFiles`).
- A biblioteca `@napi-rs/canvas` garante renderização gráfica ultrarrápida sem depender de bibliotecas externas do Linux.

## Licença

Este projeto está licenciado sob a [Licença Apache v2.0](LICENSE).
