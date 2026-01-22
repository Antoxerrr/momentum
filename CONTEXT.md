# Momentum — контекст проекта

Короткий контекст, чтобы быстро включаться в проект без повторного парсинга.

## Суть
Momentum — личный кабинет продуктивности: задачи (одноразовые и повторяющиеся), сниппеты, профиль пользователя. В перспективе — трекер проектов, финансы и заметки (пока заглушки на фронте).

## Стек и архитектура
- Backend: Django 5 + DRF + drf-spectacular, PostgreSQL, токен‑аутентификация.
- Frontend: Vite + React + HeroUI + Tailwind, Zustand для стора, axios для API.
- Инфра: docker-compose, nginx как прокси (раздаёт фронт и проксирует /api).
- PWA: service worker и web manifest подключаются на фронте.

## Модули и фичи (backend)
### Users
- Регистрация, логин по token auth, профиль.
- Timezone пользователя хранится в модели.
- Эндпоинты: `/api/users/login/`, `/api/users/register/`, `/api/users/me/`, `/api/users/available_timezones/`.

### Tasks
- Задачи по дате или по периоду (daily/weekly/monthly).
- Автоматический расчёт `actual_deadline`, `completed`, `expired` через аннотации.
- Выполнение создаёт TaskCompletion; одноразовые задачи после выполнения архивируются.
- Фильтры: `current` и `archived`.
- Эндпоинты: `/api/tasks/` + actions `/complete/`, `/undo_complete/`, `/archive/`.

### Snippets
- Сниппеты (текст + категория), категории как дерево (MPTT).
- Фильтры: поиск по тексту + фильтр по категориям.
- Эндпоинты: `/api/snippets/`, `/api/snippets/categories/`.

### Tracker (зачаток)
- Модели проектов/эпиков/задач есть, но модуль незавершён.

## Модули и фичи (frontend)
- Маршруты: `/tasks`, `/tasks/:id`, `/tasks/:id/edit`, `/snippets`, `/profile`, `/tracker/projects`, `/finance`, `/notes`, `/login`, `/register`.
- Навигация: десктоп‑navbar + мобильная нижняя панель.
- Задачи: список с табами (текущие/предстоящие/архив), карточки, деталка, форма.
- Сниппеты: Markdown‑рендер, подсветка кода, поиск, фильтр по категориям, CRUD.
- Профиль: смена username и timezone.

## Важные файлы
- Backend:
  - `backend/momentum/tasks/models.py` — доменная логика задач.
  - `backend/momentum/tasks/views.py` — CRUD + actions.
  - `backend/momentum/snippets/models.py` — сниппеты и категории.
  - `backend/momentum/users/views.py` — регистрация/профиль.
  - `backend/momentum/urls.py` — вход в API.
- Frontend:
  - `frontend/src/App.jsx` — роутинг.
  - `frontend/src/core/api.js` — API клиент, заголовок `X-User-Timezone`.
  - `frontend/src/store/*` — Zustand‑сторы.
  - `frontend/src/components/tasks/*` — UI задач.
  - `frontend/src/components/snippets/*` — UI сниппетов.
  - `frontend/src/components/navbar/*` — навигация.

## Поведение и тональность UI
- Минималистичная подача, быстрые действия, мягкие анимации появления/сворачивания.
- HeroUI + Tailwind, кастомные мелкие стили (скроллбар, markdown).

## Кодстайл
- Frontend: React + HeroUI; утилитарные классы Tailwind, компоненты в `PascalCase`, файлы в `kebab-case`.
- Состояние: Zustand‑сторы с простым shape, без лишней абстракции.
- Стили: глобальные стили и локальные утилиты, минималистичные анимации (Fade/SlideDown).
- Backend: Django/DRF, сервисная логика в моделях/QuerySet, сериализаторы короткие, фильтры через django‑filters.
- Язык: тексты и лейблы на русском, тон — практичный, без лишнего «маркетинга».

## Известные зоны роста
- Модуль Tracker не завершён.
- Финансы/Заметки пока только страницы‑заглушки.
