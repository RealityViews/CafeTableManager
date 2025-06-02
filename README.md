# Cafe Table Manager

Веб-приложение для управления столиками в кафе.

## Разработка

```bash
# Установка зависимостей
npm install

# Запуск клиента
cd client
npm run dev

# Запуск сервера
cd server
npm run dev
```

## Деплой

Приложение автоматически деплоится на GitHub Pages при пуше в ветку `main`.

1. Убедитесь, что у вас есть репозиторий на GitHub
2. Настройте GitHub Pages в настройках репозитория:
   - Перейдите в Settings > Pages
   - В разделе "Source" выберите "Deploy from a branch"
   - Выберите ветку "gh-pages" и папку "/ (root)"
3. Закоммитьте и запушьте изменения в ветку `main`
4. GitHub Actions автоматически соберет и задеплоит приложение

## Технологии

- React + TypeScript
- Vite
- Tailwind CSS
- Express.js
- PostgreSQL
- Drizzle ORM
