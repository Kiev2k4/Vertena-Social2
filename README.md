# Vertena Social

**Connect through Culture** — A full-stack social media platform built for language and culture enthusiasts. Share posts, stories, and direct messages with a global community.

🌐 **Live Demo:** [vertena-social.vercel.app](https://vertena-social.vercel.app/)

---

## Features

### 🔐 Authentication & Security
- Seamless sign-up and login via **Clerk** (OAuth, email/password)
- Automatic user sync between Clerk and MongoDB via **Inngest** webhooks
- JWT-based route protection on all API endpoints

### 📰 Feed & Posts
- Create text, image, or mixed posts
- Like and unlike posts with real-time counter updates
- Hashtag highlighting in post content
- Personalised feed showing posts from connections and followed users

### 📸 Stories / Snippets
- Create 24-hour stories with text (custom background colour), images, or videos
- Automatic deletion after 24 hours via **Inngest** scheduled functions
- Progress bar viewer with auto-advance for non-video stories
- Stories visible from connections and followed accounts

### 💬 Comments
- Add, delete, and like comments on any post
- Notifications triggered on comment and like actions

### 👥 Social Graph
- **Follow / Unfollow** users
- **Connection Requests** — mutual acceptance unlocks direct messaging
- Rate-limiting on connection requests (max 20 per 24 hours)
- Dedicated pages for Followers, Following, Pending, and Connections

### 📩 Real-Time Messaging
- Direct messages between connected users
- Text and image support in chat
- **Server-Sent Events (SSE)** for instant message delivery without polling
- In-app toast notifications for messages received outside the active chat
- Message seen/unseen tracking

### 🔔 Notifications
- In-app notification bell with unread badge count
- Notifications for: post likes, comments, comment likes, follows, connection requests, and acceptances
- Mark individual or all notifications as read
- 30-second polling interval for unread count refresh

### 📬 Email Notifications (Inngest + Brevo SMTP)
- Connection request email sent immediately on request
- 24-hour reminder email if request is still pending
- Daily digest email for unseen messages (9 AM ET via cron)

### 👤 User Profiles
- Editable profile: name, username, bio, location, profile picture, cover photo
- Tabs for Posts, Media gallery, and Likes
- Image uploads optimised and stored via **ImageKit** (auto WebP conversion)

### 🔍 Discover
- Search users by name, username, bio, or location
- Follow or send a connection request directly from results

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Vite | 7 | Build tool & dev server |
| Tailwind CSS | 4 | Utility-first styling |
| React Router DOM | 7 | Client-side routing |
| Redux Toolkit + React Redux | 2.9 / 9.2 | Global state management |
| Clerk React | 5 | Authentication UI & hooks |
| Axios | 1.12 | HTTP client |
| Lucide React | 0.536 | Icon library |
| Moment.js | 2.30 | Relative timestamps |
| React Hot Toast | 2.5 | Toast notifications |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js + Express | 5.1 | REST API server |
| MongoDB + Mongoose | 8.18 | Database & ODM |
| Clerk Express SDK | 1.7 | Auth middleware & user sync |
| ImageKit | 6 | Cloud image/video storage & CDN |
| Inngest | 3.40 | Background jobs, cron, webhooks |
| Multer | 2 | Multipart file upload handling |
| Nodemailer | 7 | Transactional email via Brevo SMTP |
| CORS + dotenv | — | Cross-origin config & env management |

---

## Architecture

```
vertena-social/
├── client/                     # React + Vite frontend
│   └── src/
│       ├── app/                # Redux store
│       ├── assets/             # Static assets (logo, images)
│       ├── components/         # Reusable UI components
│       │   ├── Comments.jsx
│       │   ├── NotificationBell.jsx
│       │   ├── PostCard.jsx
│       │   ├── RecentMessages.jsx
│       │   ├── Sidebar.jsx
│       │   ├── StoriesBar.jsx
│       │   └── ...
│       ├── features/           # Redux slices
│       │   ├── connections/
│       │   ├── messages/
│       │   └── user/
│       └── pages/              # Route-level page components
│           ├── Feed.jsx
│           ├── ChatBox.jsx
│           ├── Connections.jsx
│           ├── Discover.jsx
│           ├── Profile.jsx
│           └── ...
│
└── server/                     # Express backend
    ├── configs/                # DB, ImageKit, Multer, Nodemailer
    ├── controllers/            # Business logic
    │   ├── userController.js
    │   ├── postController.js
    │   ├── messageController.js
    │   ├── storyController.js
    │   ├── commentController.js
    │   └── notificationController.js
    ├── inngest/                # Background functions & Clerk webhooks
    ├── middlewares/            # Auth middleware
    ├── models/                 # Mongoose schemas
    │   ├── User.js
    │   ├── Post.js
    │   ├── Story.js
    │   ├── Message.js
    │   ├── Comment.js
    │   ├── Connection.js
    │   └── Notification.js
    ├── routes/                 # Express routers
    └── server.js               # Entry point
```

---

## Data Models

**User** — `_id` (Clerk ID), email, full_name, username, bio, profile_picture, cover_photo, location, followers[], following[], connections[]

**Post** — user ref, content, image_urls[], post_type (text | image | text_with_image), likes_count[]

**Story** — user ref, content, media_url, media_type (text | image | video), background_color, views_count[]

**Message** — from_user_id, to_user_id, text, message_type (text | image), media_url, seen

**Comment** — post_id, user ref, text, likes[]

**Connection** — from_user_id, to_user_id, status (pending | accepted)

**Notification** — to_user_id, from_user_id, type (like_post | comment_post | like_comment | follow | connection_request | connection_accepted | message), read

---

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB instance (Atlas or local)
- Clerk account
- ImageKit account
- Inngest account (or local dev server)
- Brevo SMTP credentials (for email)

### 1. Clone the repository

```bash
git clone https://github.com/Kiev2k4/vertena-social.git
cd vertena-social
```

### 2. Install dependencies

```bash
# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### 3. Configure environment variables

**`server/.env`**
```env
MONGODB_URL=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
SMTP_USER=your_brevo_smtp_user
SMTP_PASS=your_brevo_smtp_password
SENDER_EMAIL=your_sender_email
FRONTEND_URL=http://localhost:5173
PORT=4000
```

**`client/.env`**
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BASEURL=http://localhost:4000
```

### 4. Run locally

```bash
# Terminal 1 — backend
cd server && npm run server

# Terminal 2 — frontend
cd client && npm run dev
```

### 5. Inngest dev server (optional, for background jobs)

```bash
npx inngest-cli@latest dev
```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/user/data` | Get current user data |
| POST | `/api/user/update` | Update profile (multipart) |
| POST | `/api/user/discover` | Search users |
| POST | `/api/user/follow` | Follow a user |
| POST | `/api/user/unfollow` | Unfollow a user |
| POST | `/api/user/connect` | Send connection request |
| POST | `/api/user/accept` | Accept connection request |
| GET | `/api/user/connections` | Get all social graph data |
| POST | `/api/user/profiles` | Get a user's profile + posts |
| GET | `/api/user/recent-messages` | Get recent message threads |
| POST | `/api/post/add` | Create a post (multipart) |
| GET | `/api/post/feed` | Get personalised feed |
| POST | `/api/post/like` | Like / unlike a post |
| POST | `/api/story/create` | Create a story (multipart) |
| GET | `/api/story/get` | Get stories from network |
| GET | `/api/message/:userId` | SSE stream for incoming messages |
| POST | `/api/message/send` | Send a message (multipart) |
| POST | `/api/message/get` | Get chat history |
| POST | `/api/comment/add` | Add a comment |
| POST | `/api/comment/get` | Get comments for a post |
| POST | `/api/comment/delete` | Delete a comment |
| POST | `/api/comment/like` | Like / unlike a comment |
| GET | `/api/notification/get` | Get notifications |
| GET | `/api/notification/unread-count` | Get unread notification count |
| POST | `/api/notification/mark-read` | Mark one notification as read |
| POST | `/api/notification/mark-all-read` | Mark all notifications as read |

---

## Deployment

The project is deployed as two separate services:

- **Frontend** → [Vercel](https://vercel.com/) — `client/vercel.json` rewrites all routes to `index.html` for SPA support
- **Backend** → [Vercel](https://vercel.com/) — `server/vercel.json` routes all requests to `server.js` via `@vercel/node`

---

## Potential Improvements

- Pagination / infinite scroll for feed and comments
- Post sharing and bookmarking
- Group chats and channels
- Video posts in the feed
- Story reactions and view counts
- Search for posts by hashtag
- PWA / mobile app wrapper

---

## Author

**Hau Nguyen**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/hau-nguyen-521233254/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/Kiev2k4)
