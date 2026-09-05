# Школы Алматы

Прод: https://almaty-schools.kulakhmetova.workers.dev

Агрегатор школ, гимназий и лицеев города Алматы. React-фронтенд отдаётся статикой,
а API реализовано на Cloudflare Worker — всё поднимается одним `npm run dev` через
`@cloudflare/vite-plugin`.

## Стек

- Vite + React + TypeScript — фронтенд (`src/`)
- shadcn/ui (Base UI + Tailwind v4) — компоненты, светлая/тёмная тема
- Cloudflare Worker — API (`worker/`)
- Cloudflare D1 — база данных школ (`migrations/`)
- `@cloudflare/vite-plugin` — единая dev-среда для фронтенда, воркера и D1
- `wrangler` — деплой на Cloudflare

## Разработка

```bash
npm install
npm run dev
```

## Данные

343 школы собраны и объединены из open-almaty.kz и chastnye-shkoly.kz (дедуплицированы
по номеру школы), районы определены геокодированием адресов через OpenStreetMap/Nominatim
(302 из 343 сопоставлены). `data/schools_seed.sql` — снапшот данных для заполнения D1.

Применить схему и данные к новой базе:

```bash
npx wrangler d1 migrations apply almaty-schools-db --local   # или --remote
npx wrangler d1 execute almaty-schools-db --local --file=./data/schools_seed.sql
```

## Деплой

```bash
npm run deploy
```

Требует `wrangler login` и настроенный Cloudflare-аккаунт.
