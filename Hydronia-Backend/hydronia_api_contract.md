
# Hydronia API Contract – Draft v1.0

This API serves as the backend interface for the Hydronia monitoring system. It allows ingestion and retrieval of sensor readings and daily plant images.

---

## POST /sensors/

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

## GET /sensors/{row}/{cycle}

**Description:**  
Retrieve historical sensor readings for a specific crop row and cycle.

**Path Parameters:**
- `row` (int): Crop row number
- `cycle` (int): Crop cycle number

**Example Response:**
```json
[
  {
    "timestamp": "2025-07-09T14:35:00Z",
    "ph": 6.2,
    "ec": 1.8,
    "temperature": 24.5,
    "humidity": 65,
    "tph": 0.02
  }
]
```

---

## POST /images/

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

## GET /images/{row}/{cycle}

**Description:**  
Fetch metadata and links to stored plant images for a specific row and cycle.

**Response:**
```json
[
  {
    "timestamp": "2025-07-09T07:12:00Z",
    "image_url": ".../pictures/lettucesideways.jpg"
  }
]
```

---

## Notes
- All timestamps are in ISO 8601 format
- All sensor values are assumed to be in metric units
- API responses will later include anomaly flags and threshold labels (e.g., "pH below optimal")
