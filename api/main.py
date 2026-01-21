"""
Simple API backend for SlowChat to handle IP tracking and geolocation.
This is a lightweight Python FastAPI service that captures user IP and country information.
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import httpx
from datetime import datetime
import os

app = FastAPI(title="SlowChat Analytics API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def get_ip_country(ip: str):
    """
    Get country and region information from IP address using ipapi.co
    Returns country name and region in a non-intrusive way.
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"https://ipapi.co/{ip}/json/")
            data = response.json()
            return data.get("country_name", "Unknown"), data.get("region", "Unknown")
    except:
        return "Unknown", "Unknown"

def get_client_ip(request: Request) -> str:
    """
    Extract client IP from request, handling proxy headers.
    """
    # Check for proxy headers first
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip
    
    # Fallback to direct client host
    return request.client.host if request.client else "Unknown"

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "ok", "service": "SlowChat Analytics API"}

@app.post("/api/track-login")
async def track_login(request: Request):
    """
    Non-intrusive endpoint to track user login with IP and approximate location.
    Called after successful authentication.
    """
    try:
        # Get client IP
        client_ip = get_client_ip(request)
        
        # Get country and region
        country, region = await get_ip_country(client_ip)
        
        # Return data for client to store in Firestore
        return {
            "success": True,
            "data": {
                "ip": client_ip,
                "country": country,
                "region": region,
                "timestamp": datetime.utcnow().isoformat()
            }
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@app.get("/api/get-location")
async def get_location(request: Request):
    """
    Simple endpoint to get location info without storing anything.
    Used for anonymous location detection.
    """
    try:
        client_ip = get_client_ip(request)
        country, region = await get_ip_country(client_ip)
        
        return {
            "country": country,
            "region": region
        }
    except Exception as e:
        return {
            "country": "Unknown",
            "region": "Unknown"
        }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
