![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![React Query](https://img.shields.io/badge/-React%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white)

# Custom OAI Translator

A translator app designed for local and custom LLM endpoints. It is a PWA that can be installed on your phone or desktop.
Note: Changes made from original repo are done by AI.

## Key Features

- **Custom API Support**: Connect to any OpenAI-compatible API endpoint (e.g., Ollama, LocalAI, vLLM, etc.).
- **Automatic Model Detection**: Dynamically fetches and lists available models from your configured API's `/v1/models` endpoint.
- **PWA Ready**: Installable on mobile and desktop for a native-like experience.
- **Streaming Support**: Real-time translation feedback.

## Tech Stack

- React 19
- Vite 6
- Tailwind CSS 3
- DaisyUI 4
- Axios
- React Router 7
- React Query 5
- PWA
- Cloudflare Pages

## Local Development

### 1. Install pnpm

Make sure that pnpm is installed on your computer. If it's not already installed, you can install it:

https://pnpm.io/installation

### 2. Download project dependencies

Navigate to the root directory of your project and run the following command to download project dependencies:

```bash
pnpm install
```

### 3. Start the local server

Run the following command to start the local development server:

```bash
pnpm dev
```

### 4. Open the application

Vite should automatically open your browser.

## Build the Project

### Docker Build

#### 1. Run docker build

Navigate to the root directory of your project in your command line interface and run the following command to build the Docker image:

```bash
docker build -t custom-oai-translator .
```

#### 2. Start the Container

Run the following command to start the container and map the port to your local machine:

```bash
docker run -p 3000:80 custom-oai-translator
```

### Local Build

#### 1. Build

Run the following command to build your project:

```bash
pnpm build
```

The compiled files will be placed in the `dist` folder.

#### 2. Deploy

Now you can treat the files in the `dist` folder as a static website and deploy it on the server.

## Credit

- Original project by [LanceMoe/openai-translator](https://github.com/LanceMoe/openai-translator)
- Inspired by https://github.com/yetone/bob-plugin-openai-translator
