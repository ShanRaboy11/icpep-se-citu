# REST API Reference Manual

Base URL: `http://localhost:5000/api` (Local) or `https://<backend-domain>/api` (Production)

All API responses follow a standardized JSON envelope:
```json
{
  "success": true,
  "message": "Optional human-readable message",
  "data": { ... }
}
```

Protected endpoints require the standard Bearer token header:
```http
Authorization: Bearer <jwt_token>
```

---

## 📑 Route Modules Directory

1. [Authentication (`/api/auth`)](#1-authentication-apiauth)
2. [User Management (`/api/users`)](#2-user-management-apiusers)
3. [Announcements (`/api/announcements`)](#3-announcements-apiannouncements)
4. [Events (`/api/events`)](#4-events-apievents)
5. [Meetings (`/api/meetings`)](#5-meetings-apimeetings)
6. [Availability (`/api/availability`)](#6-availability-apiavailability)
7. [Merchandise (`/api/merch`)](#7-merchandise-apimerch)
8. [Notifications (`/api/notifications`)](#8-notifications-apinotifications)
9. [Officers (`/api/officers`)](#9-officers-apiofficers)
10. [Sponsors (`/api/sponsors`)](#10-sponsors-apisponsors)
11. [Testimonials (`/api/testimonials`)](#11-testimonials-apitestimonials)
12. [FAQs (`/api/faqs`)](#12-faqs-apifaqs)
13. [Health & Root Endpoints](#13-health--root-endpoints)

---

## 1. Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticates user with student number & password |
| `POST` | `/api/auth/logout` | Public | Logs out user (client token removal) |
| `POST` | `/api/auth/forgot-password`| Public | Dispatches OTP reset code to user's email |
| `POST` | `/api/auth/verify-code` | Public | Validates OTP reset code |
| `POST` | `/api/auth/reset-password` | Public | Resets user password using verified reset code |
| `POST` | `/api/auth/first-login-password` | Private | Changes password on initial first login |
| `POST` | `/api/auth/change-password` | Private | Changes password (requires `currentPassword`) |
| `GET` | `/api/auth/me` | Private | Retrieves currently authenticated user profile |

### `POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "studentNumber": "ADMIN-001",
    "password": "Admin@12345"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOi...",
    "user": {
      "_id": "67...",
      "studentNumber": "ADMIN-001",
      "firstName": "Super",
      "lastName": "Administrator",
      "role": "admin",
      "firstLogin": false
    }
  }
  ```

---

## 2. User Management (`/api/users`)

All user management endpoints require an authenticated user with elevated privileges.

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users` | Private | Retrieves paginated user list |
| `GET` | `/api/users/search` | Private | Searches users by name, student number, or role |
| `GET` | `/api/users/stats` | Private | Retrieves organization membership statistics |
| `POST` | `/api/users` | Private | Creates a single user record |
| `POST` | `/api/users/bulk-upload` | Private | Bulk imports users from Excel/CSV roster |
| `POST` | `/api/users/sync-upsert-batch`| Private | Synchronizes multiple user records |
| `POST` | `/api/users/sync-delete` | Private | Batch removes user records |
| `GET` | `/api/users/:id` | Private | Retrieves user record by ID |
| `PUT` | `/api/users/:id` | Private | Updates user profile and membership fields |
| `PATCH`| `/api/users/:id/toggle-status`| Private | Activates or deactivates user account |
| `DELETE`| `/api/users/:id` | Private | Permanently removes user account |

---

## 3. Announcements (`/api/announcements`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/announcements` | Public | Retrieves all published announcements |
| `GET` | `/api/announcements/:id` | Public | Retrieves detailed announcement by ID |
| `POST` | `/api/announcements` | Private | Creates a new announcement (supports schedule) |
| `PUT` | `/api/announcements/:id` | Private | Updates announcement content |
| `DELETE`| `/api/announcements/:id` | Private | Deletes an announcement |
| `PATCH`| `/api/announcements/:id/pin` | Private | Toggles pinned status |

---

## 4. Events (`/api/events`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/events` | Public | Retrieves published events |
| `GET` | `/api/events/:id` | Public | Retrieves specific event details |
| `POST` | `/api/events` | Private | Creates a new event record |
| `PUT` | `/api/events/:id` | Private | Updates event details |
| `DELETE`| `/api/events/:id` | Private | Deletes an event |
| `POST` | `/api/events/:id/register` | Private | Registers authenticated user for event |
| `POST` | `/api/events/:id/unregister` | Private | Cancels event registration |

---

## 5. Meetings (`/api/meetings`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/meetings` | Private | Retrieves scheduled committee meetings |
| `POST` | `/api/meetings` | Private | Schedules a new committee meeting |
| `GET` | `/api/meetings/:id` | Private | Retrieves meeting details |
| `PUT` | `/api/meetings/:id` | Private | Updates meeting time/link |
| `DELETE`| `/api/meetings/:id` | Private | Cancels a meeting |

---

## 6. Availability (`/api/availability`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/availability` | Private | Retrieves submitted availability slots |
| `POST` | `/api/availability` | Private | Submits/updates officer weekly availability |

---

## 7. Merchandise (`/api/merch`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/merch` | Public | Retrieves all merchandise items |
| `GET` | `/api/merch/:id` | Public | Retrieves specific merch item details |
| `POST` | `/api/merch` | Private | Creates a new merch product |
| `PUT` | `/api/merch/:id` | Private | Updates merch item, sizing, stock |
| `DELETE`| `/api/merch/:id` | Private | Removes merch product |

---

## 8. Notifications (`/api/notifications`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/notifications` | Private | Retrieves notifications for authenticated user |
| `GET` | `/api/notifications/unread-count` | Private | Retrieves unread notification badge count |
| `PATCH`| `/api/notifications/:id/read` | Private | Marks single notification as read |
| `PATCH`| `/api/notifications/read-all` | Private | Marks all user notifications as read |

---

## 9. Officers (`/api/officers`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/officers` | Public | Retrieves active council officers & committee heads |
| `POST` | `/api/officers` | Private | Creates an officer roster entry |
| `PUT` | `/api/officers/:id` | Private | Updates officer profile, position, or tenure |
| `DELETE`| `/api/officers/:id` | Private | Removes an officer entry |

---

## 10. Sponsors (`/api/sponsors`) & Partners (`/api/partners`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/sponsors` | Public | Retrieves corporate & community sponsors |
| `POST` | `/api/sponsors` | Private | Adds a new sponsor record |
| `PUT` | `/api/sponsors/:id` | Private | Updates sponsor details/logo |
| `DELETE`| `/api/sponsors/:id` | Private | Deletes sponsor record |

---

## 11. Testimonials (`/api/testimonials`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/testimonials` | Public | Retrieves featured member/alumni testimonials |
| `POST` | `/api/testimonials` | Private | Adds a new testimonial entry |
| `DELETE`| `/api/testimonials/:id` | Private | Removes a testimonial entry |

---

## 12. FAQs (`/api/faqs`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/faqs` | Public | Retrieves published FAQs grouped by category |
| `POST` | `/api/faqs` | Private | Creates an FAQ entry |
| `PUT` | `/api/faqs/:id` | Private | Updates FAQ question/answer |
| `DELETE`| `/api/faqs/:id` | Private | Removes an FAQ entry |

---

## 13. Health & Root Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Public | API status, welcome banner, and root endpoints map |
| `GET` | `/health` | Public | Health check (uptime, environment, DB connection state) |
| `GET` | `/api` | Public | Route index of all available endpoint paths |
| `GET` | `/api/debug/env` | Public | Development debug info (masked status of env vars) |
