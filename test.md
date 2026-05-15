# Cronix API - Postman Testing Guide

**Base URL:** `http://localhost:3001/api/v1`

---

## Authentication

The API uses **JWT tokens** stored in **httpOnly cookies**. Postman can handle cookies automatically.

### How to get authenticated:

1. **Via Google OAuth** — Open in browser:

   ```
   GET http://localhost:3001/api/v1/auth/google
   ```

   This redirects to Google login. After success, cookies are set automatically. Copy cookies from browser to Postman.

2. **Via GitHub OAuth**:

   ```
   GET http://localhost:3001/api/v1/auth/github
   ```

   Same flow as Google.

3. **For Postman (recommended):** After OAuth login, extract the `access_token` cookie and use it as:
   - **Header:** `Authorization: Bearer <token>`
   - JWT strategy checks cookies first, then falls back to `Authorization` header.

4. **Refresh token (if expired):**
   ```
   POST http://localhost:3001/api/v1/auth/refresh
   ```
   Requires `refresh_token` cookie to be present.

---

## Enums Reference

### JobType

| Value   | Description                               |
| ------- | ----------------------------------------- |
| `CRON`  | Scheduled job (requires `schedule` field) |
| `EVENT` | Event-driven job (webhook)                |

### HttpMethod

| Value    |
| -------- |
| `GET`    |
| `POST`   |
| `PUT`    |
| `PATCH`  |
| `DELETE` |

---

## 1. Health Check

### GET /

Check if API is running.

| Detail     | Value                           |
| ---------- | ------------------------------- |
| **URL**    | `http://localhost:3001/api/v1/` |
| **Method** | GET                             |
| **Auth**   | None                            |
| **Body**   | None                            |

**Response:**

```json
{
  "status": "OK",
  "service": "Cronix API",
  "timestamp": "2026-07-05T..."
}
```

---

## 2. Auth Endpoints

All auth endpoints have a rate limit of **10 requests per 15 minutes**.

### GET /auth/google

Initiate Google OAuth login.

| Detail     | Value                                      |
| ---------- | ------------------------------------------ |
| **URL**    | `http://localhost:3001/api/v1/auth/google` |
| **Method** | GET                                        |
| **Auth**   | None                                       |
| **Body**   | None                                       |

**Note:** Open in browser, not Postman. It redirects to Google.

---

### GET /auth/google/callback

Google OAuth callback (handled by Passport automatically).

| Detail           | Value                                               |
| ---------------- | --------------------------------------------------- |
| **URL**          | `http://localhost:3001/api/v1/auth/google/callback` |
| **Method**       | GET                                                 |
| **Auth**         | None                                                |
| **Query Params** | `code` (string), `state` (string) — sent by Google  |

---

### GET /auth/github

Initiate GitHub OAuth login.

| Detail     | Value                                      |
| ---------- | ------------------------------------------ |
| **URL**    | `http://localhost:3001/api/v1/auth/github` |
| **Method** | GET                                        |
| **Auth**   | None                                       |
| **Body**   | None                                       |

---

### GET /auth/github/callback

GitHub OAuth callback.

| Detail           | Value                                               |
| ---------------- | --------------------------------------------------- |
| **URL**          | `http://localhost:3001/api/v1/auth/github/callback` |
| **Method**       | GET                                                 |
| **Auth**         | None                                                |
| **Query Params** | `code` (string), `state` (string)                   |

---

### POST /auth/refresh

Refresh access token using refresh_token cookie.

| Detail     | Value                                       |
| ---------- | ------------------------------------------- |
| **URL**    | `http://localhost:3001/api/v1/auth/refresh` |
| **Method** | POST                                        |
| **Auth**   | None (reads `refresh_token` cookie)         |
| **Body**   | None                                        |

**Headers (required):**

```
Cookie: refresh_token=<token>
```

---

### POST /auth/logout

Logout and clear auth cookies.

| Detail     | Value                                      |
| ---------- | ------------------------------------------ |
| **URL**    | `http://localhost:3001/api/v1/auth/logout` |
| **Method** | POST                                       |
| **Auth**   | JWT required                               |
| **Body**   | None                                       |

---

### GET /auth/me

Get current user profile.

| Detail     | Value                                  |
| ---------- | -------------------------------------- |
| **URL**    | `http://localhost:3001/api/v1/auth/me` |
| **Method** | GET                                    |
| **Auth**   | JWT required                           |
| **Body**   | None                                   |

---

## 3. Workspaces Endpoints

All endpoints require JWT auth.

### POST /workspaces

Create a new workspace.

| Detail           | Value                                     |
| ---------------- | ----------------------------------------- |
| **URL**          | `http://localhost:3001/api/v1/workspaces` |
| **Method**       | POST                                      |
| **Auth**         | JWT required                              |
| **Content-Type** | `application/json`                        |

**Request Body:**

```json
{
  "name": "My Workspace"
}
```

| Field  | Type   | Required | Notes                    |
| ------ | ------ | -------- | ------------------------ |
| `name` | string | Yes      | Min 1 char, max 50 chars |

---

### GET /workspaces

Get all workspaces for the current user.

| Detail     | Value                                     |
| ---------- | ----------------------------------------- |
| **URL**    | `http://localhost:3001/api/v1/workspaces` |
| **Method** | GET                                       |
| **Auth**   | JWT required                              |
| **Body**   | None                                      |

**Query Params (all optional):**

| Param   | Type   | Default | Notes          |
| ------- | ------ | ------- | -------------- |
| `page`  | number | 1       | Min 1          |
| `limit` | number | 10      | Min 1, Max 100 |

---

### GET /workspaces/:id

Get a single workspace by ID.

| Detail     | Value                                         |
| ---------- | --------------------------------------------- |
| **URL**    | `http://localhost:3001/api/v1/workspaces/:id` |
| **Method** | GET                                           |
| **Auth**   | JWT required                                  |
| **Body**   | None                                          |

**Example:** `GET http://localhost:3001/api/v1/workspaces/clxx...`

---

### PATCH /workspaces/:id

Update a workspace name.

| Detail           | Value                                         |
| ---------------- | --------------------------------------------- |
| **URL**          | `http://localhost:3001/api/v1/workspaces/:id` |
| **Method**       | PATCH                                         |
| **Auth**         | JWT required                                  |
| **Content-Type** | `application/json`                            |

**Request Body:**

```json
{
  "name": "Updated Workspace Name"
}
```

| Field  | Type   | Required | Notes         |
| ------ | ------ | -------- | ------------- |
| `name` | string | No       | Min 1, Max 50 |

---

### DELETE /workspaces/:id

Delete a workspace.

| Detail     | Value                                         |
| ---------- | --------------------------------------------- |
| **URL**    | `http://localhost:3001/api/v1/workspaces/:id` |
| **Method** | DELETE                                        |
| **Auth**   | JWT required                                  |
| **Body**   | None                                          |

---

## 4. Jobs Endpoints

All endpoints require JWT auth.

### POST /jobs

Create a new job.

| Detail           | Value                               |
| ---------------- | ----------------------------------- |
| **URL**          | `http://localhost:3001/api/v1/jobs` |
| **Method**       | POST                                |
| **Auth**         | JWT required                        |
| **Content-Type** | `application/json`                  |

**Request Body (CRON type):**

```json
{
  "name": "My Cron Job",
  "type": "CRON",
  "workspaceId": "clxx...",
  "endpoint": "https://api.example.com/webhook",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer secret123"
  },
  "body": {
    "message": "hello"
  },
  "schedule": "*/5 * * * *",
  "retryCount": 3,
  "retryDelay": 60,
  "timeout": 30,
  "failureEmail": true
}
```

**Request Body (EVENT type):**

```json
{
  "name": "My Event Job",
  "type": "EVENT",
  "workspaceId": "clxx...",
  "endpoint": "https://api.example.com/webhook",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer secret123"
  },
  "body": {
    "message": "hello"
  },
  "retryCount": 3,
  "retryDelay": 60,
  "timeout": 30,
  "failureEmail": true
}
```

| Field          | Type             | Required              | Notes                                             |
| -------------- | ---------------- | --------------------- | ------------------------------------------------- |
| `name`         | string           | Yes                   | Max 100 chars                                     |
| `type`         | string           | Yes                   | `"CRON"` or `"EVENT"`                             |
| `workspaceId`  | string           | Yes                   | ID of the workspace                               |
| `endpoint`     | string (URL)     | Yes                   | Valid URL (TLD check disabled for localhost)      |
| `method`       | string           | Yes                   | `"GET"`, `"POST"`, `"PUT"`, `"PATCH"`, `"DELETE"` |
| `headers`      | object           | No                    | Key-value pairs                                   |
| `body`         | object           | No                    | Request body to send when job executes            |
| `schedule`     | string           | Only if type=`"CRON"` | Cron expression (e.g., `"*/5 * * * *"`)           |
| `retryCount`   | number           | No                    | Min 0, Max 10 (default: 0)                        |
| `retryDelay`   | number (seconds) | No                    | Min 10, Max 300 (default: 60)                     |
| `timeout`      | number (seconds) | No                    | Min 5, Max 300 (default: 30)                      |
| `failureEmail` | boolean          | No                    | Send email on failure (default: false)            |

---

### GET /jobs

Get all jobs for the current user.

| Detail     | Value                               |
| ---------- | ----------------------------------- |
| **URL**    | `http://localhost:3001/api/v1/jobs` |
| **Method** | GET                                 |
| **Auth**   | JWT required                        |
| **Body**   | None                                |

**Query Params (all optional):**

| Param         | Type   | Default | Notes               |
| ------------- | ------ | ------- | ------------------- |
| `workspaceId` | string | —       | Filter by workspace |
| `status`      | string | —       | Filter by status    |
| `page`        | number | 1       | Min 1               |
| `limit`       | number | 10      | Min 1, Max 100      |

---

### GET /jobs/:id

Get a single job by ID.

| Detail     | Value                                   |
| ---------- | --------------------------------------- |
| **URL**    | `http://localhost:3001/api/v1/jobs/:id` |
| **Method** | GET                                     |
| **Auth**   | JWT required                            |
| **Body**   | None                                    |

---

### PATCH /jobs/:id

Update a job.

| Detail           | Value                                   |
| ---------------- | --------------------------------------- |
| **URL**          | `http://localhost:3001/api/v1/jobs/:id` |
| **Method**       | PATCH                                   |
| **Auth**         | JWT required                            |
| **Content-Type** | `application/json`                      |

**Request Body (all fields optional):**

```json
{
  "name": "Updated Job Name",
  "endpoint": "https://api.example.com/new-webhook",
  "method": "GET",
  "headers": {
    "x-api-key": "new-key"
  },
  "body": {
    "key": "value"
  },
  "schedule": "0 */1 * * *",
  "retryCount": 5,
  "retryDelay": 30,
  "timeout": 60,
  "failureEmail": false
}
```

| Field          | Type    | Notes    |
| -------------- | ------- | -------- |
| `name`         | string  | Optional |
| `endpoint`     | string  | Optional |
| `method`       | string  | Optional |
| `headers`      | object  | Optional |
| `body`         | object  | Optional |
| `schedule`     | string  | Optional |
| `retryCount`   | number  | Optional |
| `retryDelay`   | number  | Optional |
| `timeout`      | number  | Optional |
| `failureEmail` | boolean | Optional |

**Note:** `type` and `workspaceId` cannot be updated.

---

### DELETE /jobs/:id

Delete a job.

| Detail     | Value                                   |
| ---------- | --------------------------------------- |
| **URL**    | `http://localhost:3001/api/v1/jobs/:id` |
| **Method** | DELETE                                  |
| **Auth**   | JWT required                            |
| **Body**   | None                                    |

---

### POST /jobs/:id/pause

Pause a job.

| Detail     | Value                                         |
| ---------- | --------------------------------------------- |
| **URL**    | `http://localhost:3001/api/v1/jobs/:id/pause` |
| **Method** | POST                                          |
| **Auth**   | JWT required                                  |
| **Body**   | None                                          |

---

### POST /jobs/:id/resume

Resume a paused job.

| Detail     | Value                                          |
| ---------- | ---------------------------------------------- |
| **URL**    | `http://localhost:3001/api/v1/jobs/:id/resume` |
| **Method** | POST                                           |
| **Auth**   | JWT required                                   |
| **Body**   | None                                           |

---

### POST /jobs/:id/run

Execute a job immediately. Rate limit: **10 requests per 60 seconds**.

| Detail     | Value                                       |
| ---------- | ------------------------------------------- |
| **URL**    | `http://localhost:3001/api/v1/jobs/:id/run` |
| **Method** | POST                                        |
| **Auth**   | JWT required                                |
| **Body**   | None                                        |

---

## 5. Dashboard Endpoints

### GET /dashboard/stats

Get dashboard statistics.

| Detail     | Value                                          |
| ---------- | ---------------------------------------------- |
| **URL**    | `http://localhost:3001/api/v1/dashboard/stats` |
| **Method** | GET                                            |
| **Auth**   | JWT required                                   |
| **Body**   | None                                           |

---

## 6. Webhooks Endpoints (Public)

### POST /webhooks/:token

Trigger a job via webhook. **No auth required.**

| Detail           | Value                                          |
| ---------------- | ---------------------------------------------- |
| **URL**          | `http://localhost:3001/api/v1/webhooks/:token` |
| **Method**       | POST                                           |
| **Auth**         | None                                           |
| **Content-Type** | `application/json`                             |

**Request Body:** Any JSON object (no validation).

```json
{
  "event": "push",
  "repository": "my-repo"
}
```

| Field | Type | Required | Notes                  |
| ----- | ---- | -------- | ---------------------- |
| (any) | any  | No       | Arbitrary JSON payload |

**Note:** Status `200` always returned. If job is not found: `{ "__message": "Not found", "statusCode": 404 }`. If job is paused/deleted: `{ "__message": "Job is not active", "statusCode": 400 }`.

---

## Quick Testing Flow (Postman)

1. **Create a workspace** → `POST /workspaces` → copy the `id` from response.
2. **Create a job** → `POST /jobs` using the workspace `id`.
3. **Get all jobs** → `GET /jobs`.
4. **Get single job** → `GET /jobs/:id`.
5. **Pause job** → `POST /jobs/:id/pause`.
6. **Resume job** → `POST /jobs/:id/resume`.
7. **Run job now** → `POST /jobs/:id/run`.
8. **Update job** → `PATCH /jobs/:id`.
9. **Test webhook** → `POST /webhooks/:token` (use `webhookToken` from create response).
10. **Delete job** → `DELETE /jobs/:id`.
11. **Check dashboard** → `GET /dashboard/stats`.
