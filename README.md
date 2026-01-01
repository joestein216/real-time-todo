# Amazon Robotics Todo Take-Home (React + Vite + RTK, Node + Express + TS)

This project is a **full-stack** Todo app with **categories**, **grouped views**, **client-side filter/sort**, and a **thin real-time layer** (Socket.io).

## Quick start

### Prereqs
- Node.js 18+ (20+ recommended)
- npm 9+

### Install
```bash
# from repo root
cd server && npm install
cd ../client && npm install
```

### Run (two terminals)
```bash
# terminal 1
cd server
npm run dev
```

```bash
# terminal 2
cd client
npm run dev
```

- Client: http://localhost:5173
- API: http://localhost:4000

## User stories (and where they are implemented)

1. **Create a new todo** (title, description, due date)
   - UI: `client/src/components/TodoForm.tsx`
   - Store: `client/src/store/todosSlice.ts` (`createTodo` thunk)
   - API: `server/src/routes/todos.ts` (`POST /todos`)

2. **Assign a category to each todo**
   - UI: category select in `TodoForm`
   - Validation: `server/src/validation.ts` requires `categoryId`

3. **View todos grouped by category**
   - UI: `client/src/components/TodoBoard.tsx`
   - Selector: `client/src/store/selectors.ts` (`selectTodosGroupedByCategory`)

4. **Mark complete / incomplete**
   - UI: checkbox in `client/src/components/TodoItem.tsx`
   - Store/API: `updateTodo` thunk -> `PUT /todos/:id`

5. **Edit a todo**
   - UI: edit opens `TodoForm` in edit mode
   - Store/API: `updateTodo` thunk -> `PUT /todos/:id`

6. **Delete a todo**
   - UI: delete button in `TodoItem`
   - Store/API: `deleteTodo` thunk -> `DELETE /todos/:id`
   - UX detail: transient `(deleted)` marker is supported in UI state (see `uiSlice`), but kept minimal.

7. **Create categories**
   - UI: `client/src/components/CategorySidebar.tsx`
   - Store/API: `createCategory` thunk -> `POST /categories`

8. **Filter by completion status** (all/active/completed)
   - UI: `client/src/components/FilterSortBar.tsx`
   - Selector: `client/src/store/selectors.ts` (`selectVisibleTodos`)

9. **Sort by due date or creation date**
   - UI: `FilterSortBar`
   - Selector: `selectVisibleTodos`

## Key implementation decisions (explicit)

### Client-side sorting & filtering
We fetch all todos once via `GET /todos` and treat sort/filter as **presentation-only** (selectors). This provides instant UI feedback and keeps the API a clean CRUD surface without query params.

### Thin WebSocket layer
Socket.io is used as a **change notification** layer:
- server emits `{ id }` on create/update/delete
- client reacts by fetching `/todos/:id` (or removing on delete)
This keeps the “authoritative shape” on the server and avoids complicated sync logic.

### In-memory persistence
Server stores data in-memory (Maps). This is acceptable for the take-home and keeps the focus on architecture, correctness, and UX.

## Testing
- Client: Jest + React Testing Library (smoke render + reducer test)
- Server: Jest + supertest (validation + basic CRUD)

## Scripts

### Server
- `npm run dev` - ts-node-dev
- `npm test` - jest

### Client
- `npm run dev` - Vite
- `npm test` - jest

