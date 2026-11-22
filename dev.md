# 📘 Guia de Integração para o Front-end — TopSongs API

Este documento contém todas as informações necessárias para integrar o front-end com a **TopSongs API**, incluindo URLs base, rotas, parâmetros, exemplos de requisição/resposta e trechos prontos de código em JavaScript.

---

## 🌐 URLs Base

| Ambiente | URL Base | Observações |
| :--- | :--- | :--- |
| **Desenvolvimento Local** | `http://localhost:3001` | Porta padrão definida no `.env` |
| **Produção (Vercel)** | `https://top-songs-api.vercel.app` | Pode variar conforme o domínio da Vercel |

> **CORS**: O CORS está habilitado globalmente na API, permitindo requisições de qualquer origem local (`localhost:3000`, `localhost:5173`, etc.) ou de produção.

---

## 📑 Resumo dos Endpoints

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/` | Status geral da API e catálogo interativo de rotas |
| `GET` | `/api/artists?q={nome}` | Busca de artistas pelo nome |
| `GET` | `/api/artistinfo?q={id}` | Detalhes de um artista pelo ID |
| `GET` | `/api/albums?q={id}` | Lista de álbuns de um artista |
| `GET` | `/api/tracks?q={nome}` | Busca de faixas/músicas pelo nome |
| `GET` | `/api/tracklist?q={id_album}` | Lista de faixas de um álbum específico |
| `POST` | `/topsongs/canvas` *(ou `/api/canvas`)* | Gera e retorna a imagem PNG do TopSongs |

---

## 🔍 Detalhamento das Rotas

### 1. Buscar Artistas
Busca artistas na base de dados da Deezer correspondentes ao termo de busca.

- **Método**: `GET`
- **Rota**: `/api/artists`
- **Query Params**:
  - `q` (*string, obrigatório*): Nome ou parte do nome do artista. Ex: `Coldplay`

**Exemplo de Requisição**:
```http
GET http://localhost:3001/api/artists?q=Coldplay
```

**Exemplo de Resposta (200 OK)**:
```json
{
  "data": [
    {
      "id": 892,
      "name": "Coldplay",
      "link": "https://www.deezer.com/artist/892",
      "picture": "https://api.deezer.com/artist/892/image",
      "picture_small": "https://e-cdns-images.dzcdn.net/images/artist/.../56x56-000000-80-0-0.jpg",
      "picture_medium": "https://e-cdns-images.dzcdn.net/images/artist/.../250x250-000000-80-0-0.jpg",
      "picture_big": "https://e-cdns-images.dzcdn.net/images/artist/.../500x500-000000-80-0-0.jpg",
      "picture_xl": "https://e-cdns-images.dzcdn.net/images/artist/.../1000x1000-000000-80-0-0.jpg",
      "nb_album": 48,
      "nb_fan": 12100000,
      "radio": true,
      "tracklist": "https://api.deezer.com/artist/892/top?limit=50",
      "type": "artist"
    }
  ],
  "total": 20
}
```

---

### 2. Informações do Artista
Retorna os dados completos de um artista a partir do seu ID.

- **Método**: `GET`
- **Rota**: `/api/artistinfo`
- **Query Params**:
  - `q` (*string | number, obrigatório*): ID do artista no Deezer. Ex: `892`

**Exemplo de Requisição**:
```http
GET http://localhost:3001/api/artistinfo?q=892
```

**Exemplo de Resposta (200 OK)**:
```json
{
  "id": 892,
  "name": "Coldplay",
  "picture_big": "https://e-cdns-images.dzcdn.net/images/artist/.../500x500-000000-80-0-0.jpg",
  "nb_album": 48,
  "nb_fan": 12100000
}
```

---

### 3. Buscar Álbuns do Artista
Retorna os álbuns de um determinado artista formatados de maneira simplificada.

- **Método**: `GET`
- **Rota**: `/api/albums`
- **Query Params**:
  - `q` (*string | number, obrigatório*): ID do artista. Ex: `892`

**Exemplo de Requisição**:
```http
GET http://localhost:3001/api/albums?q=892
```

**Exemplo de Resposta (200 OK)**:
```json
{
  "artist": {
    "id": "892",
    "name": "Coldplay"
  },
  "albums": [
    {
      "id": 302127,
      "title": "Parachutes",
      "cover": "https://e-cdns-images.dzcdn.net/images/cover/.../500x500-000000-80-0-0.jpg",
      "release_date": "2000-07-10",
      "tracklist": "https://api.deezer.com/album/302127/tracks"
    }
  ]
}
```

---

### 4. Buscar Faixas
Busca faixas avulsas pelo nome ou título.

- **Método**: `GET`
- **Rota**: `/api/tracks`
- **Query Params**:
  - `q` (*string, obrigatório*): Nome da música. Ex: `Yellow`

**Exemplo de Requisição**:
```http
GET http://localhost:3001/api/tracks?q=Yellow
```

---

### 5. Faixas de um Álbum (Tracklist)
Retorna a lista de músicas de um álbum com duração, preview de áudio (30s) e posição no disco.

- **Método**: `GET`
- **Rota**: `/api/tracklist`
- **Query Params**:
  - `q` (*string | number, obrigatório*): ID do álbum. Ex: `302127`

**Exemplo de Requisição**:
```http
GET http://localhost:3001/api/tracklist?q=302127
```

**Exemplo de Resposta (200 OK)**:
```json
[
  {
    "id": 3128098,
    "title": "Don't Panic",
    "duration": 137,
    "track_position": 1,
    "explicit_lyrics": false,
    "preview": "https://cdns-preview-d.dzcdn.net/stream/c-..."
  },
  {
    "id": 3128099,
    "title": "Shiver",
    "duration": 300,
    "track_position": 2,
    "explicit_lyrics": false,
    "preview": "https://cdns-preview-d.dzcdn.net/stream/c-..."
  }
]
```

---

### 6. Geração do Canvas TopSongs
Gera a arte em alta resolução (1080x1920 pixels) com o fundo personalizado, padrão SVG, foto do artista e até 5 músicas selecionadas.

- **Método**: `POST`
- **Rota**: `/topsongs/canvas` *(ou `/api/canvas`)*
- **Headers**: `Content-Type: application/json`
- **Corpo da Requisição (Body JSON)**:

```json
{
  "artist": {
    "name": "Coldplay",
    "bodyColor": "#0E131F",
    "color": "#3498db",
    "opacity": "25",
    "pattern": "1",
    "icon": "https://e-cdns-images.dzcdn.net/images/artist/0200877a5ff68181f9a25b2ffb38ca15/250x250-000000-80-0-0.jpg"
  },
  "songs": [
    {
      "title": "Yellow",
      "albumTitle": "Parachutes",
      "coverAlbum": "https://e-cdns-images.dzcdn.net/images/cover/bba47a9efecb1424bf8f6b0f0a8c2789/250x250-000000-80-0-0.jpg"
    },
    {
      "title": "The Scientist",
      "albumTitle": "A Rush of Blood to the Head",
      "coverAlbum": "https://e-cdns-images.dzcdn.net/images/cover/bba47a9efecb1424bf8f6b0f0a8c2789/250x250-000000-80-0-0.jpg"
    },
    {
      "title": "Fix You",
      "albumTitle": "X&Y",
      "coverAlbum": "https://e-cdns-images.dzcdn.net/images/cover/bba47a9efecb1424bf8f6b0f0a8c2789/250x250-000000-80-0-0.jpg"
    },
    {
      "title": "Viva La Vida",
      "albumTitle": "Viva La Vida or Death and All His Friends",
      "coverAlbum": "https://e-cdns-images.dzcdn.net/images/cover/bba47a9efecb1424bf8f6b0f0a8c2789/250x250-000000-80-0-0.jpg"
    },
    {
      "title": "Paradise",
      "albumTitle": "Mylo Xyloto",
      "coverAlbum": "https://e-cdns-images.dzcdn.net/images/cover/bba47a9efecb1424bf8f6b0f0a8c2789/250x250-000000-80-0-0.jpg"
    }
  ]
}
```

#### Dicionário de Campos do Canvas:

| Campo | Tipo | Obrigatório | Descrição | Padrão se omitido |
| :--- | :--- | :---: | :--- | :--- |
| `layout` | string | Não | Proporção da arte: `"vertical"` (1080x1920), `"horizontal"` (1920x1080) ou `"square"` (1080x1080) | `"vertical"` |
| `artist` | objeto | **Sim** | Configurações e identidade visual do artista | — |
| `artist.name` | string | **Sim** | Nome de exibição do artista (renderizado em negrito) | `""` |
| `artist.nameColor` | string | Não | Cor do texto do nome do artista (hexadecimal) | `"#FFFFFF"` |
| `artist.icon` | string | **Sim** | URL da foto/avatar do artista | — |
| `artist.shape` | string | Não | Formato do avatar: `"circle"`, `"rounded"`, `"square"`, `"diamond"`, `"hexagon"` | `"square"` |
| `artist.borderWidth` | number | Não | Espessura da borda ao redor do avatar em pixels | `0` |
| `artist.borderColor` | string | Não | Cor da borda do avatar em hexadecimal | `"#FFFFFF"` |
| `artist.bodyColor` | string | Não | Cor de fundo geral em hexadecimal | `"#0E131F"` |
| `artist.color` | string | Não | Cor de destaque do padrão SVG (com ou sem `#`) | `b22222` |
| `artist.opacity` | string/num | Não | Opacidade do padrão (de 0 a 100) | `"20"` |
| `artist.pattern` | string | Não | Modelo do padrão SVG (`"1"` a `"12"`) | `"1"` |
| `songs` | array | **Sim** | Lista com até 5 músicas (índices 0 a 4) | `[]` |
| `songs[].title` | string | **Sim** | Nome da música | `""` |
| `songs[].albumTitle`| string | **Sim** | Nome do álbum correspondente | `""` |
| `songs[].coverAlbum`| string | **Sim** | URL da imagem da capa do álbum | — |

- **Resposta da API**: 
  - Status: `200 OK`
  - Header: `Content-Type: image/png`
  - Corpo: **Buffer binário da imagem (Blob)**

---

## 💻 Exemplos de Consumo no Front-end

### A. Como requisitar e exibir o Canvas com `fetch`:
```javascript
const API_URL = "http://localhost:3001"; // ou https://top-songs-api.vercel.app

async function gerarCanvasTopSongs(dadosPayload) {
  try {
    const response = await fetch(`${API_URL}/topsongs/canvas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dadosPayload),
    });

    if (!response.ok) {
      const errorJson = await response.json();
      throw new Error(errorJson.error || "Erro ao gerar imagem");
    }

    // Converte a resposta binária em Blob
    const blob = await response.blob();
    // Cria uma URL temporária para usar no <img src="..."> ou download
    const imageUrl = URL.createObjectURL(blob);
    
    // Exemplo: atribuindo a uma tag <img>
    document.getElementById("canvas-preview").src = imageUrl;
    
    return imageUrl;
  } catch (error) {
    console.error("Falha ao gerar canvas:", error);
  }
}
```

### B. Como requisitar e exibir o Canvas com `axios`:
```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001", // ou https://top-songs-api.vercel.app
});

async function gerarCanvasComAxios(payload) {
  try {
    const response = await api.post("/topsongs/canvas", payload, {
      responseType: "blob", // OBRIGATÓRIO para imagens binárias
    });

    const imageUrl = URL.createObjectURL(response.data);
    return imageUrl;
  } catch (error) {
    console.error("Erro na requisição:", error);
  }
}
```

### C. Como fazer o download direto da imagem gerada:
```javascript
function baixarImagemCanvas(blobUrl, nomeArquivo = "topsongs.png") {
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
```

---

## ⚠️ Padrão de Respostas de Erro

Quando houver falha de validação ou erro de servidor, a API responde com um status HTTP adequado e um JSON padronizado:

```json
{
  "error": "Você deve fornecer um nome de artista na consulta."
}
```

| Código HTTP | Significado | Exemplo |
| :---: | :--- | :--- |
| `400 Bad Request` | Parâmetro obrigatório ausente ou body malformatado | `q` ausente na busca |
| `404 Not Found` | Rota não existente na API | `/api/rota-inexistente` |
| `500 Server Error` | Falha interna ou erro na API externa da Deezer | Timeout ou serviço inacessível |
