# SlowChat Analytics API

Simple Python FastAPI backend for tracking user analytics in a non-intrusive way.

## Features

- IP address capture from requests
- Approximate country and region detection using ipapi.co
- Non-intrusive tracking (only on login/signup)
- CORS enabled for frontend integration

## Setup

```bash
cd api
pip install -r requirements.txt
```

## Running Locally

```bash
python main.py
# Server runs on http://localhost:8000
```

Or with uvicorn:

```bash
uvicorn main:app --reload --port 8000
```

## Deployment

### Option 1: Deploy to Heroku
```bash
heroku create slowchat-api
git push heroku main
```

### Option 2: Deploy to Google Cloud Run
```bash
gcloud run deploy slowchat-api --source . --platform managed
```

### Option 3: Deploy as Firebase Cloud Function
Convert to Cloud Function format and deploy to Firebase.

## API Endpoints

### POST /api/track-login
Track user login with IP and location data.

**Response:**
```json
{
  "success": true,
  "data": {
    "ip": "123.45.67.89",
    "country": "United States",
    "region": "California",
    "timestamp": "2026-01-21T10:15:00"
  }
}
```

### GET /api/get-location
Get location info without storing.

**Response:**
```json
{
  "country": "United States",
  "region": "California"
}
```

## Environment Variables

- `PORT`: Server port (default: 8000)
- Configure CORS origins in production in `main.py`

## Privacy

This API is designed to be non-intrusive:
- Only captures IP and approximate location (country/region)
- No tracking of user behavior or activity
- Data is returned to client for storage in their own Firestore
- Compliant with basic privacy requirements
