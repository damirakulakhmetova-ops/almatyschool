# Школы Алматы

Агрегатор школ, гимназий и лицеев города Алматы. React-фронтенд отдаётся статикой,
а API реализовано на Cloudflare Worker — всё поднимается одним `npm run dev` через
`@cloudflare/vite-plugin`.

## Стек

- Vite + React + TypeScript — фронтенд (`src/`)
- Cloudflare Worker — API (`worker/`)
- `@cloudflare/vite-plugin` — единая dev-среда для фронтенда и воркера
- `wrangler` — деплой на Cloudflare

## Разработка

```bash
npm install
npm run dev
```

## Данные

`worker/data.ts` содержит placeholder-данные (названия школ реальные, но адреса,
телефоны и рейтинги — нет). Перед продакшеном нужно заменить на проверенные данные.

## Деплой

```bash
npm run deploy
```

Требует `wrangler login` и настроенный Cloudflare-аккаунт.
