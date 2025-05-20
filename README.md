# Cluster Monitor

A modern full-stack web application for monitoring storage cluster metrics, managing snapshot policies, and providing real-time analytics and visualizations.

---

## 🚀 Project Overview

**Cluster Monitor** enables users to monitor IOPS (Input/Output Operations Per Second) and Throughput metrics for storage clusters, configure snapshot policies, and analyze cluster health and anomalies through interactive dashboards.

### Key Features

- **Real-time Monitoring:** Visualize IOPS and Throughput (Read/Write) using beautiful charts.
- **Snapshot Policy Management:** Create, update, and manage automated snapshot policies with flexible scheduling.
- **Cluster Selection:** Easily switch between multiple clusters from the dashboard header.
- **Anomaly Detection:** Visual indication of metric anomalies with customizable thresholds.
- **Responsive Design:** Intuitive UI with support for desktop and mobile.
- **Data Source:** Uses a local JSON-based data source for rapid development and demo purposes.

---

## 🛠 Tech Stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS, Recharts, Axios
- **Backend:** AdonisJS, Node.js, UUID, JSON for storage

---

## 📝 Getting Started

The repository contains two main folders:

- `frontend` – Next.js React app (UI)
- `backend` – AdonisJS REST API (Data & logic)

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+ recommended)
- [npm](https://www.npmjs.com/)

---

## ⚡️ Running the Project Locally

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/cluster-monitor.git
cd cluster-monitor

```

### 2. Setup & Run Backend

**Short summary to insert:**

> **Note:** The `.env` file for backend configuration will be emailed to you. Please check your inbox, download the file, and place it in the `backend` directory before starting the backend server.

---

```bash
cd backend
npm install
npm run dev
```
- The backend server will start on [http://localhost:3333](http://localhost:3333).

### 3. Setup & Run Frontend

Open a new terminal **(keep the backend running)**:

```bash
cd ../frontend
npm install
npm run dev
```
- The frontend app will start on [http://localhost:3000](http://localhost:3000).

---

## 📈 Usage

- Visit [http://localhost:3000](http://localhost:3000) in your browser.
- Use the dashboard to select clusters, view metrics, manage snapshot policies, and identify anomalies.
- All cluster and metrics data are served by the AdonisJS backend from local JSON files.

---

## 📚 Code Structure

```
cluster-monitor/
│
├── backend/        # AdonisJS API (data, policies, clusters)
│   └── ...
└── frontend/       # Next.js UI (dashboard, components, styles)
    └── ...
```

---

## Running Tests

To execute test cases, you can run the following commands in the respective folders:

- **Frontend:** Navigate to the frontend folder and run:
  
  ```bash
  npm run test
  ```

- **Backend:** Navigate to the backend folder and run:
  
  ```bash
  npm run test
  ```


Make sure you are in the correct directory (frontend or backend) before running the test commands.

----

## 📝 Notes

- **No external database required:** All data is persisted in JSON files for easy setup and demo.

---

## 💡 Room for Improvement

- **User Authentication & RBAC:** Add secure user authentication and role-based access control for multi-user environments.
- **Database Integration:** Replace JSON file storage with a robust database (e.g., PostgreSQL, MongoDB) for scalability and persistence.
- **Live WebSocket Updates:** Implement WebSocket or Server-Sent Events for real-time streaming of metrics and anomaly alerts.
- **Advanced Anomaly Detection:** Integrate ML-based anomaly detection or customizable rules engine.
- **Email & Slack Alerts:** Add automated notifications for policy breaches or detected anomalies.
- **Audit Logs:** Maintain detailed logs of user actions and policy changes.
- **Cluster Configuration Management:** Add UI and API endpoints for editing cluster configuration and metadata.
- **API Documentation:** Auto-generate OpenAPI (Swagger) docs for all backend endpoints.
- **Testing & CI/CD:** Add comprehensive unit, integration, and E2E tests, plus CI/CD workflows.
- **Theme Customization:** Allow users to switch between dark/light themes or customize the dashboard appearance.
- **Accessibility Improvements:** Enhance ARIA roles, keyboard navigation, and color contrast for WCAG compliance.

---![Screenshot 2025-05-20 at 1 52 10 AM](https://github.com/user-attachments/assets/7cd130b1-3ffb-41c4-94d0-f1f16de79370)
![Screenshot 2025-05-20 at 1 50 58 AM](https://github.com/user-attachments/assets/1c688609-ace3-432f-b833-19a4488c532e)
