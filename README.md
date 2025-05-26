# 🧠 Intelligent Resume Parser

An intelligent, asynchronous resume parsing system built using a microservices architecture. It leverages **Google Gemini** for LLM-based parsing, **RabbitMQ** for message queuing, **Redis** for fast status tracking, and **MongoDB** for persistent storage. All services are containerized using Docker and orchestrated with Docker Compose.

---

## 🚀 Features

* ✨ LLM-powered resume parsing using Google Gemini
* ⚙️ Microservice architecture with separate validation, parsing, and saving services
* 📬 Asynchronous job queueing using RabbitMQ
* 🔐 Input validation and field-level warnings
* 💾 Status tracking with Redis (`pending`, `completed`, `failed`)
* 📁 MongoDB for storing parsed resumes
* 🌐 Secure backend with CORS and rate limiting
* 🖥️ Frontend that polls backend every 5s for live updates

---

## 📦 Tech Stack

| Layer      | Technology                   |
| ---------- | -----------------------      |
| LLM        | Google Gemini                |
| Backend    | Node.js (Express,Typescript) |
| Messaging  | RabbitMQ                     |
| Storage    | MongoDB                      |
| Caching    | Redis                        |
| Deployment | Docker + Docker Compose      |
| Frontend   | Vite + React (Typescript)    |

---

## 🔎 Parsing & Validation Strategy

### Parsing

* Utilizes **Google Gemini** to convert resume text into structured JSON using a strict schema.
* Asynchronous processing via RabbitMQ ensures fast API responses.
* Dead Letter Queue (DLQ) used for tracking failed jobs.

### Validation

A separate microservice:

* Checks for required fields (name, email, phone).
* Validates dates (e.g., start year > 1950 and < current year).
* Flags invalid fields under a `warnings` object for UI display.

---

## 🧠 Edge Case Handling

| Scenario                   | Strategy                                                           |
| -------------------------- | ------------------------------------------------------------------ |
| Noisy/Unstructured Text    | Prompting with strict schema ensures structured LLM output         |
| LLM/API Failure or Timeout | Caught and moved to a Dead Letter Queue; status marked as `failed` |
| Invalid User Fields        | Highlighted in frontend via `warnings`                             |
| Multiple Submissions       | Handled via email tracking + resume history                        |
| Real-time Feedback         | Frontend polls backend every 5s to show processing updates         |

---

## ⚙️ Architecture Overview

```
User ↔️ Frontend (React)
          ↓
      Backend API (Express)
          ↓
   RabbitMQ Queues (4 queues)
  ↙️        ↓           ↘️
LLM Q   Validation Q     Save Q   DLQ
                           ↓         
                        MongoDB, Redis (status)     
```

---

## 🔐 Security & Middleware

* ✅ **CORS Enabled** – Secure cross-origin access
* ✅ **Rate Limiting** – Protects APIs from abuse

---

## 🧰 Setup Instructions

### 1. Prerequisites

* [Docker](https://www.docker.com/)
* [Docker Compose](https://docs.docker.com/compose/)
* A valid [Google Gemini API Key](https://aistudio.google.com/)

### 2. Clone the Repository

```bash
git clone https://github.com/hlvipulbohra/assignments-fullstack.git
cd intelligent-resume-parser
```

### 3. Create `.env` File

Inside the project root, add a `.env` file with the following:

```env
# MongoDB
MONGO_DB_URI=mongodb://mongodb:27017/resume_parser

# Redis
REDIS_HOST=redis

# RabbitMQ
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672/

# RabbitMQ Queues
RESUME_EXTRACTION_QUEUE=resume_extraction_queue
VALIDATE_RESUME_QUEUE=resume_validation_queue
DEAD_LETTER_QUEUE=dead_letter_queue
SAVE_RESUME_QUEUE=save_resume_queue

# Google Gemini
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### 4. Start the Application

```bash
docker-compose up --build
```

Wait a few minutes for services to initialize.

### 5. Access the App

* Frontend: [http://localhost:5173](http://localhost:5173)
* Backend APIs: [http://localhost:3000](http://localhost:3000)

---

### 5. Demo and screenshots

* Youtube video link of the demo of code and working application : https://youtu.be/37IsrfeVag8
* All the screenshots of the working demo are placed in the screenshots folder

---



## 📁 Folder Structure

```
intelligent-resume-parser/
│
├── backend/
│   ├── llm-parser-service/           # LLM microservice (Google Gemini)
│   ├── validator-service/            # Validation microservice
│   └── api-service/                  # Express API, routes & status polling
|
├── frontend/                 # React frontend (Vite)
├── docker-compose.yml
└── .env
```

---

## 🔧 To-Do / Improvements

* [ ] WebSocket support for real-time updates
* [ ] Resume upload history page with filters
* [ ] Admin dashboard to monitor failed jobs

---