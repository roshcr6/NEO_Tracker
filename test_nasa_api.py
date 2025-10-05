"""
Quick test script to verify NASA API is working
"""
import requests
import json

# NASA API Configuration
NASA_API_KEY = 'cXvyJSY51LQk5ElMYRGqUNotCpXn2fncclaKhnFm'
NASA_API_BASE_URL = 'https://api.nasa.gov/neo/rest/v1'

print("=" * 60)
print("🚀 Testing NASA API Connection")
print("=" * 60)

# Test 1: Browse asteroids
print("\n📡 Test 1: Fetching asteroids from NASA Browse API...")
try:
    url = f"{NASA_API_BASE_URL}/neo/browse"
    params = {
        'api_key': NASA_API_KEY,
        'size': 20
    }
    response = requests.get(url, params=params, timeout=10)
    
    if response.status_code == 200:
        data = response.json()
        asteroids = data.get('near_earth_objects', [])
        print(f"✅ SUCCESS! Fetched {len(asteroids)} asteroids")
        
        # Show first 5 asteroid names
        print("\n📋 Sample asteroids:")
        for i, asteroid in enumerate(asteroids[:5], 1):
            name = asteroid.get('name', 'Unknown')
            is_hazardous = asteroid.get('is_potentially_hazardous_asteroid', False)
            hazard_icon = "⚠️" if is_hazardous else "✓"
            print(f"  {i}. {name} {hazard_icon}")
            
        # Count hazardous asteroids
        hazardous_count = sum(1 for a in asteroids if a.get('is_potentially_hazardous_asteroid'))
        print(f"\n🎯 Stats:")
        print(f"   Total: {len(asteroids)}")
        print(f"   Hazardous: {hazardous_count}")
        print(f"   Safe: {len(asteroids) - hazardous_count}")
        
    else:
        print(f"❌ FAILED! Status code: {response.status_code}")
        print(f"   Response: {response.text[:200]}")
        
except Exception as e:
    print(f"❌ ERROR: {str(e)}")

# Test 2: NEO Feed (date-based)
print("\n📡 Test 2: Testing NEO Feed API...")
try:
    from datetime import datetime, timedelta
    
    start_date = datetime.now().strftime('%Y-%m-%d')
    end_date = (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d')
    
    url = f"{NASA_API_BASE_URL}/feed"
    params = {
        'start_date': start_date,
        'end_date': end_date,
        'api_key': NASA_API_KEY
    }
    response = requests.get(url, params=params, timeout=10)
    
    if response.status_code == 200:
        data = response.json()
        element_count = data.get('element_count', 0)
        print(f"✅ SUCCESS! Found {element_count} asteroids in next 7 days")
    else:
        print(f"❌ FAILED! Status code: {response.status_code}")
        
except Exception as e:
    print(f"❌ ERROR: {str(e)}")

# Test 3: Check API rate limit
print("\n📡 Test 3: Checking API rate limit...")
try:
    url = "https://api.nasa.gov/planetary/apod"
    params = {'api_key': NASA_API_KEY}
    response = requests.get(url, params=params, timeout=10)
    
    # Check rate limit headers
    if 'X-RateLimit-Limit' in response.headers:
        limit = response.headers['X-RateLimit-Limit']
        remaining = response.headers.get('X-RateLimit-Remaining', 'Unknown')
        print(f"✅ API Key Active!")
        print(f"   Rate Limit: {limit} requests/hour")
        print(f"   Remaining: {remaining} requests")
    else:
        print(f"✅ API responding (status: {response.status_code})")
        
except Exception as e:
    print(f"⚠️  Could not check rate limit: {str(e)}")

print("\n" + "=" * 60)
print("🎉 NASA API Test Complete!")
print("=" * 60)
print("\n✅ If you see SUCCESS messages above, the API is working!")
print("🌐 Your backend should be able to fetch asteroid data.\n")
