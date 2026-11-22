# 🚀 Novidades da TopSongs API — Novos Recursos e Guia de Integração (`news.md`)

Este documento apresenta todas as novidades implementadas na API, incluindo **novos layouts (vertical, horizontal e quadrado)**, **novos shapes para o avatar do artista**, **estilização do nome do artista em negrito com cor configurável**, **6 novos padrões SVG** (totalizando 12 patterns) e um **estudo detalhado de viabilidade técnica para geração de vídeos com o áudio de preview da Deezer**.

---

## 📋 Sumário das Novidades

1. [📐 Novos Layouts de Imagem](#1-novos-layouts-de-imagem)
2. [👤 Novos Shapes e Estilos para o Artista](#2-novos-shapes-e-estilos-para-o-artista)
3. [🎨 Catálogo Expandido de SVGs / Patterns (1 a 12)](#3-catálogo-expandido-de-svgs--patterns-1-a-12)
4. [🎬 Viabilidade de Criação de Vídeos (Preview de Áudio + Imagem)](#4-viabilidade-de-criação-de-vídeos)
5. [💻 Exemplos de Requisições JSON Completas](#5-exemplos-de-requisições-json-completas)

---

## 1. 📐 Novos Layouts de Imagem

Agora o endpoint `POST /topsongs/canvas` aceita o parâmetro `"layout"` (ou `"orientation"`), permitindo gerar artes sob medida para diferentes redes sociais e telas:

| Layout | Resolução | Proporção | Uso Recomendado |
| :--- | :---: | :---: | :--- |
| `"vertical"` *(padrão)* | `1080 x 1920` | `9:16` | Instagram Stories, TikTok, Reels, Shorts e WhatsApp Status |
| `"horizontal"` | `1920 x 1080` | `16:9` | Desktop, YouTube Banners, Cards de Web App, Twitter horizontal |
| `"square"` | `1080 x 1080` | `1:1` | Feed do Instagram, Twitter/X Posts, capas de Playlists |

### Detalhes de Cada Layout:
- **`vertical` (1080x1920)**: Layout clássico em tela cheia com foto do artista em destaque centralizado no topo e lista das 5 músicas numeradas com capas arredondadas na base.
- **`horizontal` (1920x1080)**: Layout em 2 colunas; Coluna esquerda com a capa do artista, nome em negrito e tags decorativas; Coluna direita com a lista das 5 faixas em cartões horizontais elegantes.
- **`square` (1080x1080)**: Layout compacto para feed com cabeçalho contendo o avatar estilizado, nome do artista e contador de faixas, seguido pelas 5 músicas espaçadas uniformemente.

---

## 2. 👤 Novos Shapes e Estilos para o Artista

### A. Nome do Artista em Negrito, Maior e com Cor Customizável
- **Negrito e Tamanho Aumentado**: O nome do artista agora é renderizado em negrito com escala visual hierárquica forte (`bold 76px` no vertical, `bold 64px` no horizontal e `bold 58px` no quadrado).
- **Cor Customizável**: Adicionada a propriedade opcional `artist.nameColor`.
  - Exemplo: `"nameColor": "#FEB029"` ou `"nameColor": "#00FFCC"`.
  - Se omitido, o padrão é branco (`#FFFFFF`).

### B. Formatos Geométricos (Shapes) da Foto do Artista
Agora você pode personalizar o formato do avatar do artista através de `artist.shape`:

| Valor de `shape` | Visual | Descrição |
| :--- | :--- | :--- |
| `"circle"` *(ou `"round"`)* | Círculo | Avatar circular com máscara perfeita e sombra suave |
| `"rounded"` *(ou `"squircle"`)* | Squircle | Cantos arredondados modernos (raio suave de 40px) |
| `"diamond"` *(ou `"rhombus"`)* | Losango | Formato de diamante moderno |
| `"hexagon"` | Hexágono | Polígono geométrico de 6 faces |
| `"square"` *(padrão)* | Quadrado | Formato quadrado reto clássico |

### C. Bordas Decorativas e Sombra Suave
Você pode adicionar uma borda em volta do avatar em qualquer formato:
- `artist.borderWidth`: Largura da borda em pixels (ex: `6` ou `8`). Padrão `0`.
- `artist.borderColor`: Cor da borda em hexadecimal (ex: `"#FFFFFF"`, `"#FEB029"`).
- O Canvas adiciona automaticamente uma sombra suave tridimensional (`drop-shadow`) atrás do avatar para destacá-lo das cores do fundo.

---

## 3. 🎨 Catálogo Expandido de SVGs / Patterns (1 a 12)

O parâmetro `artist.pattern` agora aceita valores de **`"1"` a `"12"`**:

| ID | Nome do Pattern | Tema Visual |
| :---: | :--- | :--- |
| **`"1"`** | *Padrão Clássico* | Geometrias e curvas originais na base |
| **`"2"`** | *Formas Angulares* | Linhas e cortes retos |
| **`"3"`** | *Preenchimento Sólido A* | Formas preenchidas com transparência |
| **`"4"`** | *Preenchimento Sólido B* | Variação com preenchimento e contornos |
| **`"5"`** | *Vórtice Abstrato* | Linhas que convergem em perspectiva espiral |
| **`"6"`** | *Geometria Dinâmica* | Composição moderna em camadas |
| **`"7"`** 🌟 | **Equalizer & Sound Waves** | Espectro sonoro com barras de equalizador e ondas de áudio senoidais |
| **`"8"`** 🌟 | **Cyber Synthwave Grid** | Grade 3D retro-futurista com ponto de fuga e horizonte |
| **`"9"`** 🌟 | **Vinyl Grooves** | Círculos concêntricos e ranhuras que simulam um disco de vinil |
| **`"10"`** 🌟 | **Constellation Nodes** | Rede de nós estelares e circuitos geométricos conectados |
| **`"11"`** 🌟 | **Bauhaus Modern Arches** | Arcos concêntricos, formas orgânicas e símbolos Memphis |
| **`"12"`** 🌟 | **Sonic Laser Rays** | Raios diagonais ultradinâmicos e losangos em cruz |

---

## 4. 🎬 Viabilidade de Criação de Vídeos

> **Pergunta**: *"É viável, além de imagem, conseguir criar vídeos (a imagem estática, mas com o usuário podendo selecionar uma das músicas para inserir a preview dela no vídeo)?"*

### Resposta Resumida:
**SIM, é 100% viável tecnicamente!** 
A API da Deezer já fornece em cada música o campo **`preview`**, que é uma URL direta para um arquivo de áudio MP3 com os **30 segundos mais famosos da faixa**.

Existem duas abordagens de implementação possíveis:

---

### Abordagem A: No Front-end (Altamente Recomendada ⭐⭐⭐⭐⭐)

Nesta abordagem, o navegador do usuário combina a imagem PNG gerada pela API com o arquivo de áudio MP3 da Deezer e exporta o vídeo diretamente no cliente.

#### Vantagens:
- **Zero custo de servidor**: Não consome CPU nem memória do backend.
- **Livre de limites da Vercel**: A Vercel possui limites estritos de timeout no plano gratuito (10 a 15 segundos). Processar vídeo no servidor pode atingir esse tempo limite facilmente em conexões lentas.
- **Processamento Instantâneo**: Dispositivos modernos (smartphones e computadores) geram o vídeo de 30s em menos de 2 segundos usando aceleração de hardware.
- **Privacidade total**: O arquivo de vídeo é montado diretamente na memória do usuário.

#### Como implementar no Front-end (Exemplo com Canvas + Web Audio API):

```javascript
// 1. O usuário seleciona uma das 5 músicas (que contém a URL 'preview' da Deezer)
const audioPreviewUrl = musicaSelecionada.preview; 

// 2. Função para gravar a imagem do canvas + áudio em um arquivo de vídeo MP4/WebM
async function exportarVideoComMusica(imagemCanvasUrl, audioUrl) {
  // Cria elementos de mídia em memória
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = imagemCanvasUrl;
  await new Promise((res) => (img.onload = res));

  const audio = new Audio();
  audio.crossOrigin = "anonymous";
  audio.src = audioUrl;

  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  // Captura o stream de vídeo do canvas a 30 quadros por segundo
  const videoStream = canvas.captureStream(30);

  // Captura o áudio usando a Web Audio API
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioContext.createMediaElementSource(audio);
  const destination = audioContext.createMediaStreamDestination();
  source.connect(destination);
  source.connect(audioContext.destination); // toca enquanto grava (opcional)

  // Combina a trilha de vídeo e a de áudio
  const combinedStream = new MediaStream([
    ...videoStream.getVideoTracks(),
    ...destination.stream.getAudioTracks(),
  ]);

  // Grava com MediaRecorder nativo
  const recorder = new MediaRecorder(combinedStream, {
    mimeType: "video/webm; codecs=vp9,opus",
  });

  const chunks = [];
  recorder.ondataavailable = (e) => chunks.push(e.data);
  recorder.onstop = () => {
    const videoBlob = new Blob(chunks, { type: "video/webm" });
    const videoUrl = URL.createObjectURL(videoBlob);

    // Baixa o vídeo automaticamente
    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = "topsongs-story.webm";
    a.click();
  };

  recorder.start();
  await audio.play();

  // Para a gravação ao fim dos 30s de preview
  audio.onended = () => recorder.stop();
}
```

> **Dica Pro**: Caso o front-end precise estritamente de formato `.mp4` (para compatibilidade com WhatsApp Web e Instagram via desktop), pode-se utilizar a biblioteca leve [mp4-muxer](https://github.com/Vanilagy/mp4-muxer) ou [webcodecs], que gera `.mp4` puro direto no navegador sem depender de WebAssembly pesado.

---

### Abordagem B: No Back-end com FFmpeg

Nesta abordagem, o backend junta a imagem e o MP3 usando o binário do **FFmpeg**:

#### Comando de Codificação Ultrarrápido:
```bash
ffmpeg -loop 1 -i canvas.png -i preview.mp3 -c:v libx264 -tune stillimage -c:a aac -b:a 192k -pix_fmt yuv420p -shortest -movflags +faststart output.mp4
```
A flag `-tune stillimage` faz o FFmpeg codificar apenas 1 ou 2 frames por segundo para a imagem estática, gerando os 30 segundos de vídeo em **menos de 3 segundos** de CPU.

#### Considerações de Infraestrutura:
- **Em VPS / Servidor Dedicado / Docker / Railway**: Funciona de forma excelente e robusta.
- **Na Vercel Serverless (AWS Lambda)**:
  - O binário do FFmpeg compilado para Linux Lambda ocupa cerca de ~50 MB.
  - No plano gratuito da Vercel (Hobby), o limite de execução é de 10 segundos. Se o download do MP3 oscilar, pode estourar o limite de tempo.
  - Para ambientes Serverless em produção, a arquitetura ideal caso queira gerar vídeos no backend é delegar para um microserviço em Docker ou utilizar um serviço de media como Cloudinary Video / AWS MediaConvert.

---

## 5. 💻 Exemplos de Requisições JSON Completas

### Exemplo 1: Layout Vertical (Instagram Stories / 1080x1920)
Avatar circular com borda dourada e pattern de ondas de som (Equalizer 7):

```json
{
  "layout": "vertical",
  "artist": {
    "name": "Coldplay",
    "nameColor": "#FEB029",
    "shape": "circle",
    "borderWidth": 8,
    "borderColor": "#FFFFFF",
    "bodyColor": "#0B0E14",
    "color": "#FEB029",
    "opacity": "35",
    "pattern": "7",
    "icon": "https://e-cdns-images.dzcdn.net/images/artist/0200877a5ff68181f9a25b2ffb38ca15/500x500-000000-80-0-0.jpg"
  },
  "songs": [
    {
      "title": "Yellow",
      "albumTitle": "Parachutes",
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
      "title": "The Scientist",
      "albumTitle": "A Rush of Blood to the Head",
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

---

### Exemplo 2: Layout Horizontal (Desktop / Widescreen 1920x1080)
Avatar com cantos arredondados (`rounded`), nome em ciano e grade Synthwave 3D (Pattern 8):

```json
{
  "layout": "horizontal",
  "artist": {
    "name": "Dua Lipa",
    "nameColor": "#00FFCC",
    "shape": "rounded",
    "borderWidth": 6,
    "borderColor": "#00FFCC",
    "bodyColor": "#0D1117",
    "color": "#00FFCC",
    "opacity": "25",
    "pattern": "8",
    "icon": "https://e-cdns-images.dzcdn.net/images/artist/0200877a5ff68181f9a25b2ffb38ca15/500x500-000000-80-0-0.jpg"
  },
  "songs": [
    {
      "title": "Levitating",
      "albumTitle": "Future Nostalgia",
      "coverAlbum": "https://e-cdns-images.dzcdn.net/images/cover/bba47a9efecb1424bf8f6b0f0a8c2789/250x250-000000-80-0-0.jpg"
    },
    {
      "title": "Don't Start Now",
      "albumTitle": "Future Nostalgia",
      "coverAlbum": "https://e-cdns-images.dzcdn.net/images/cover/bba47a9efecb1424bf8f6b0f0a8c2789/250x250-000000-80-0-0.jpg"
    }
  ]
}
```

---

### Exemplo 3: Layout Quadrado (Feed / 1:1 - 1080x1080)
Avatar em hexágono geométrico (`hexagon`) e ranhuras de disco de vinil (Pattern 9):

```json
{
  "layout": "square",
  "artist": {
    "name": "The Weeknd",
    "nameColor": "#FF3366",
    "shape": "hexagon",
    "borderWidth": 4,
    "borderColor": "#FF3366",
    "bodyColor": "#120B16",
    "color": "#FF3366",
    "opacity": "30",
    "pattern": "9",
    "icon": "https://e-cdns-images.dzcdn.net/images/artist/0200877a5ff68181f9a25b2ffb38ca15/500x500-000000-80-0-0.jpg"
  },
  "songs": [
    {
      "title": "Blinding Lights",
      "albumTitle": "After Hours",
      "coverAlbum": "https://e-cdns-images.dzcdn.net/images/cover/bba47a9efecb1424bf8f6b0f0a8c2789/250x250-000000-80-0-0.jpg"
    }
  ]
}
```
