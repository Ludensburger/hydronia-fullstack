# Hydronia

## 🌱 Project Overview

Hydronia is a fullstack IoT-powered Aquaponic Lettuce Monitoring System that merges real-time environmental sensing, AI-driven plant health assessment, and user-friendly dashboards tailored for both farmers and system developers. It empowers proactive crop management by enabling early detection of stress conditions, nutrient imbalances, and biological threats—particularly fungal or pest infestations. Through seamless AI/ML integration, Hydronia supports intelligent decision-making and predictive insights for sustainable lettuce cultivation.

---

## 🛠️ Features

- 📡 Real-time Sensor Monitoring  
  Continuous tracking of pH, EC (Electrical Conductivity), TPH (Total Particulate Hardness), temperature, and humidity with timestamped logging per crop row.

- 🧠 AI-Powered Plant Health Analysis  
  CNN-based computer vision module evaluates daily plant images to detect early signs of stress, growth issues, or anomalies.

- 🦠 Fungal & Pest Infestation Detection  
  Image-based early warning system flags possible fungal infections and pest activity before visible damage occurs.

- 📈 Predictive Forecasting Engine  
  Fuzzy Logic–driven model analyzes trends to anticipate risks (e.g., nutrient depletion, environmental instability) and recommend proactive action.

- 🚨 Smart Alerts & Notifications  
  Real-time notifications for out-of-range values and predicted risks; farmers can acknowledge or override alerts within the dashboard.

- 🖼️ Daily Image Gallery & Health Scoring  
  Per-row image capture and storage with AI-derived health scoring over time, allowing visual tracking of crop development.

- 📓 Manual Logs & Farmer Annotations  
  Farmers can add photos, remarks, and corrective actions—feedback can be fed into model retraining for future accuracy improvement.

- 🧑‍🌾 Role-Based Dashboards  
  Tailored UI for Farmers (monitoring, alerts, logs) and Developers (model configs, thresholds, system status).

- 🧰 Developer Tools & AI Model Management  
  Upload, test, and manage AI models via the backend; configure alert thresholds, sampling intervals, and model confidence levels.

- 📊 Historical Data Visualization  
  Interactive charts and trend visualizations for environmental metrics, alerts, and plant health scores per row or cycle.

- 📤 Dataset Export & ML Retraining Support  
  Export structured sensor/image/log data for further analysis or machine learning retraining—including manually tagged events.

---

## 🌾 Farmer/User Recommendations

Hydronia is designed with practical farming workflows in mind. Here's how farmers and system users can make the most out of the platform:

- **👀 Monitor Conditions Daily**  
  Check your dashboard each morning to review real-time sensor data (pH, EC, TPH, temperature, humidity). Early trends can indicate brewing issues.

- **📷 Review Daily Plant Images**  
  Use the image gallery to visually inspect each row’s health. AI-generated scores help identify subtle stress or early fungal signs not visible to the naked eye.

- **🦠 Respond Promptly to Infestation Alerts**  
  If the system flags a potential fungal or pest risk, visually verify the row, isolate if needed, and follow your standard mitigation process. The sooner you respond, the less yield is lost.

- **📓 Keep Detailed Notes**  
  Use the manual log feature to record observations (e.g., unusual leaf discoloration, manual nutrient adjustments). These logs support better decision-making and improve AI retraining accuracy.

- **🚨 Acknowledge or Override Alerts Wisely**  
  Not every alert demands immediate action. Use your farming expertise to confirm or override recommendations. The system will learn from your feedback over time.

- **📊 Track Health Trends Across Cycles**  
  Review historical data to understand how your setup performs over time. Use this insight to tweak environmental controls, feeding schedules, or planting strategies.

- **🔁 Give Feedback to Improve AI**  
  Annotated logs and image feedback help refine the system’s AI models. The more feedback you give, the smarter Hydronia becomes.

- **📤 Export Data for Local Review**  
  Download sensor logs and image reports for offline analysis, compliance documentation, or consultation with agronomists.

---

## 🏗️ Architecture

### Frontend (Hydronia-Frontend)

- **Framework:** Angular + TailwindCSS
- **Key Features:**
  - Responsive dashboards for farmers and developers
  - Real-time sensor data cards with symbolic color mapping
  - Alerts, logs, and prediction tabs
  - Plant image gallery and AI health analysis
  - Role selection and authentication

### Backend (Hydronia-Backend)

- **Framework:** Django + Django REST Framework
- **Key Features:**
  - REST API for sensor data, images, alerts, logs, and user management
  - Modular AI/ML integration (CNN for image scoring, Fuzzy Logic for forecasting)
  - Out-of-range detection and alert logic
  - Role-based access control (RBAC)
  - Dataset export and admin tools

---

## 📂 Project Structure

```bash
hydronia-fullstack/
├── Hydronia-Frontend/   # Angular frontend app
│   └── ...
├── Hydronia-Backend/    # Django backend API and AI services
│   └── ...
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- Python 3.10+
- pip (Python package manager)

### Backend Setup

```bash
cd Hydronia-Backend
pip install -r requirements.txt
python manage.py migrate
# (Optional) Seed with sample data
python manage.py seed_sensor_readings
python manage.py create_default_users
python manage.py runserver
```

### Frontend Setup

```bash
cd Hydronia-Frontend
npm install
npm start
```

### Accessing the App

- Frontend: [http://localhost:4200](http://localhost:4200)
- Backend API: [http://localhost:8000/api/](http://localhost:8000/api/)

---

## 🧠 Backend Highlights

- Real-time sensor ingestion (REST/MQTT), timestamped storage, and out-of-range detection
- Modular AI/ML layer for image-based scoring and forecasting
- Dataset management, export, and manual log feedback loop
- Alert/notification system and forecast module
- Role-based access and admin tools
- Health monitoring, diagnostics, and model lifecycle management

---

## 🎨 Frontend Highlights

- Modern, responsive UI with symbolic color mapping for all metrics
- Inline SVG icons and compact metric cards for clarity
- Tabbed navigation: Monitoring, Images, Alerts, Predictions, Logs
- Real-time updates and live monitoring indicator
- Role selection and user authentication

---

## 👩‍💻 For Developers & Researchers

- Modular, model-agnostic backend (plug-and-play ML modules)
- Configurable via `.env` and `settings.py`
- Batched inference and caching for image scoring
- Advanced logging and debugging tools
- Supports SQLite (default), PostgreSQL, MySQL
- Deployment-ready (Gunicorn, Nginx, Docker)

---

## 👥 Authors

- [Tan, Robien Lee](https://github.com/RoT1337)
- [Mendoza, Ryu](https://github.com/Ludensburger)
- [Valencia, Percival Louis](https://github.com/keywordqwerty)

---

## 📄 License

This project is for academic and research purposes. Contact the authors for licensing details.
