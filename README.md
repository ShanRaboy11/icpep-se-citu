# 🔵  ICPEP.SE CIT-U CHAPTER OFFICIAL WEBSITE

This project uses the **MERN stack** (MongoDB, Express, React/Next.js, Node.js) with **Docker Compose** for easy setup and consistency across all devices.

---

## 📦 Prerequisites
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop)
- Install [Git](https://git-scm.com/)


## ⚙️ Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/ShanRaboy11/icpep-se-citu.git
   cd icpep.se-cit-u
````

2. Create `.env` file in the project root
   Add your MongoDB connection string:

   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<db-name>?retryWrites=true&w=majority
   PORT=5000
   ```

3. Run the project with Docker**

   ```bash
   docker compose up --build
   ````

   * Backend (Express) → **[http://localhost:5000](http://localhost:5000)**
   * Frontend (Next.js) → **[http://localhost:3000](http://localhost:3000)**
   * MongoDB → runs inside Docker container

4. **Stop containers**

   ```bash
   docker compose down
   ```

---

## 🔄 Updating After Pulling New Code

When you pull the latest changes from GitHub:

```bash
git pull origin main
docker compose up --build
```

* `--build` ensures images are rebuilt with new code & dependencies.
* Use just `docker compose up` if nothing has changed.

---

## ✅ Verify Setup

* Open **[http://localhost:3000](http://localhost:3000)** → Next.js frontend.
* Open **[http://localhost:5000](http://localhost:5000)** → Backend should return: `API is running...`.
* Docker logs should show:

  ```
  🚀 Server running on http://localhost:5000
  ✅ MongoDB connected successfully
  ```

---

## 🛠 Development Notes

* **Backend (server/)** → Express + MongoDB, auto-restarts with `nodemon`.
* **Frontend (client/)** → Next.js + TailwindCSS, supports hot reload.
* **Database** → MongoDB 6.0, stored in a Docker volume (`mongo-data`) so data persists across restarts.

---

## 📝 Common Issues

* **`nodemon: not found`** → rebuild without cache:

  ```bash
  docker compose build --no-cache
  ```
* **MongoDB auth error** → check `.env` credentials.
* **Port already in use** → stop old containers or apps using `3000`/`5000`.
* **Fresh DB reset** → remove volumes:

  ```bash
  docker compose down -v
  ```

---

## 🤝 Contributing

1. Pull the latest code:

   ```bash
   git pull origin main
   ```
2. Create a new branch:

   ```bash
   git checkout -b feature/my-feature
   ```
3. Commit and push:

   ```bash
   git add .
   git commit -m "Add my feature"
   git push origin feature/my-feature
   ```
