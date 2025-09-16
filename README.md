# 🎧 [Beatplay](https://beat-play-two.vercel.app/)

> Descubra músicas de um jeito novo conectando sua conta Spotify.

> ⚠️ Projeto em **início de desenvolvimento** - funcionalidades ainda estão sendo implementadas.

[![Deploy Vercel](https://img.shields.io/badge/deploy-Vercel-black?logo=vercel)](https://beat-play-two.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![NextAuth](https://img.shields.io/badge/Auth-NextAuth.js-2596be?logo=auth0)](https://next-auth.js.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://www.typescriptlang.org/)

---

## 🚀 Visão Geral

O **Beatplay** é uma aplicação web construída com **Next.js 15, TailwindCSS e NextAuth**, que permite ao usuário autenticar-se com sua conta do Spotify e começar a explorar músicas de forma diferente.

Atualmente, o projeto conta com:

- 🎨 Interface moderna com **TailwindCSS**
- 🔑 Login via **Spotify OAuth** (NextAuth)
- 🌐 Deploy automático na **Vercel**
- 📱 Layout responsivo

---

## 🛠️ Tecnologias Utilizadas

- [Next.js 15](https://nextjs.org/)
- [React 19](https://react.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [TypeScript](https://www.typescriptlang.org/)

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
3. Configurar variáveis de ambiente
Crie um arquivo **.env.local** na raiz do projeto:
```
SPOTIFY_CLIENT_ID=seu_client_id
SPOTIFY_CLIENT_SECRET=seu_client_secret
NEXTAUTH_SECRET=uma_chave_aleatoria
NEXTAUTH_URL=http://localhost:3000
```
4. Rodar em ambiente de desenvolvimento
```
npm run dev
```
5. Abrir no navegador
```
http://localhost:3000
```

---

## 📌 Roadmap

- Criar página de dashboard com integração real ao Spotify API
- Implementar recomendações musicais personalizadas
- Melhorar experiência mobile
- Adicionar testes automatizados

---

## 📜 Licença

Este projeto é de uso pessoal/educacional.


