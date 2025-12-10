# 🎧 [Beatplay](https://beat-play-two.vercel.app/)

**Explore músicas de um jeito novo conectando sua conta Spotify**

> ⚠️ Status: projeto em início de desenvolvimento - funcionalidades estão sendo implementadas.

[![Deploy Vercel](https://img.shields.io/badge/deploy-Vercel-black?logo=vercel)](https://beat-play-two.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![NextAuth](https://img.shields.io/badge/Auth-NextAuth.js-2596be?logo=auth0)](https://next-auth.js.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://www.typescriptlang.org/)

---

## 🚀 Visão Geral

O **Beatplay** é uma aplicação web que permite login via **Spotify OAuth** e futuramente exibirá recomendações, playlists personalizadas e estatíscas musicais.

Este projeto demonstra domínio de:

- Next.js 15 e a nova estrutura de rotas
- TailwindCSS para interface moderna
- Autenticação com NextAuth
- Deploy e CI automático com Vercel
- TyperScript para maior segurança e escalabiilidade

---

## 📌 Funcionalidades atuais

- 🔑 Autenticação via Spotify (NextAuth)
- 🎨 UI moderna com TailwindCSS
- 📱 Layout responsivo
- 🌐 Deploy contínuo via Vercel

---

## 🛠️ Tecnologias Utilizadas

- Next.js 15
- React 19
- TailwindCSS
- NextAuth.js
- TypeScript
- Git & GitHub
- Vercel (Deploy)

---

## ⚙️ Como Rodar Localmente

1. **Clonar o repositório**
```
git clone https://github.com/UelintonHJ/beat-play
cd beatplay
```
2. Instalar dependências
```
npm install
```
3. Criar arquivo de variáveis de ambiente
Crie **.env.local** com:
```
SPOTIFY_CLIENT_ID=seu_client_id
SPOTIFY_CLIENT_SECRET=seu_client_secret
NEXTAUTH_SECRET=uma_chave_aleatoria
NEXTAUTH_URL=http://localhost:3000
```
4. Rodar o projeto
```
npm run dev
```
5. Acessar
```
http://localhost:3000
```

---

## 📚 Aprendizados

Neste projeto estou aprofundando:

- Flluxo de autenticação OAuth 2.0 real (Spotify)
- Organização de projeto Next.js 15 + React 19
- Estilização avançada com TailwindCSS
- Uso de NextAuth com providers externos
- Configuração de variáveis de ambiente e deploy com Vercel

---

## 🧑‍💻 Autor

**Uelinton Janke**

LinkedIn: https://www.linkedin.com/in/uelinton-janke/


