
# Hydronia API Contract – Draft v1.1

This API serves as the backend interface for the Hydronia monitoring system. It allows ingestion and retrieval of sensor readings and daily plant images.

---

## Things to note:
Cycle is numerical and will be interpreted as such:

Cycle 0 = Germination = Seeds just sprouted
Cycle 1 = Seedling = Small leaves forming, weak roots
Cycle 2 = Vegetative = Rapid leaf growth, stronger roots
Cycle 3 = Maturing = Near harvest size, full leaf growth
Cycle 4 = Harvest-ready = Fully grown, ready to pick

---

## 📥 POST /sensors/

**Description:**  
Ingest a new sensor reading for a specific crop row and cycle.

**Request Body (JSON):**
```json
{
  "row": 1,
  "cycle": 1,
  "ph": 6.3,
  "ec": 1.8,
  "temperature": 24.5,
  "humidity": 65,
  "tph": 0.02
}
```

**Response:**
- `201 CREATED` if successfully stored
- `400 BAD REQUEST` if validation fails

---

## 📤 GET /sensors/{row}/{cycle}

**Description:**  
Retrieve recent sensor readings (last 10 entries) for a specific crop row and cycle.

**Path Parameters:**
- `row` (int): Crop row number
- `cycle` (int): Crop cycle number

**Example Response:**
```json
[
  {
    "row": 1,
    "cycle": 1,
    "timestamp": "2025-07-10T14:20:00Z",
    "ph": 5.2,
    "ec": 1.8,
    "temperature": 30.0,
    "humidity": 72,
    "tph": 0.05,
    "in_range": false,
    "warning": "pH out of range (5.5–6.5); Temp out of range (20–28°C); Humidity out of range (40–70%); TPH out of range (≤ 0.03)"
  }
]
```

---

## 🖼️ POST /images/

**Description:**  
Upload a daily plant image for a given row and cycle.

**Request Format:** `multipart/form-data`

**Form Fields:**
- `row` (int)
- `cycle` (int)
- `image` (file)

**Response:**
- `201 CREATED` with image metadata
- `400 BAD REQUEST` on validation failure

---

## 📸 GET /images/{row}/{cycle}

**Description:**  
Fetch metadata and links to stored plant images for a specific row and cycle.

**Response:**
```json
[
  {
    "timestamp": "2025-07-09T07:12:00Z",
    "image_url": "http://localhost:8000/media/plant_images/row1_cycle1/2025-07-09/lettuce.jpg"
  }
]
```

---

## Notes
- All timestamps are in ISO 8601 format
- Sensor `in_range` is a boolean flag indicating if all values are within optimal thresholds
- `warning` gives a human-readable explanation for any out-of-range values
