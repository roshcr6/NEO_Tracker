"""
API Views for Asteroid Impact Simulator
Integrates NASA API and Physics Engine
"""
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .nasa_api import nasa_api
from .physics import physics_engine


@api_view(['GET'])
def get_asteroids(request):
    """
    GET /api/asteroids
    Fetch Near Earth Objects from NASA API
    
    Query params:
        - start_date: Start date (YYYY-MM-DD)
        - end_date: End date (YYYY-MM-DD)
        - hazardous_only: Filter potentially hazardous asteroids (true/false)
    """
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    hazardous_only = request.GET.get('hazardous_only', '').lower() == 'true'
    
    # Fetch from NASA API
    if hazardous_only:
        result = nasa_api.search_asteroids(is_potentially_hazardous=True)
    else:
        result = nasa_api.get_neo_feed(start_date, end_date)
    
    if 'error' in result:
        return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response(result, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_asteroid_detail(request, asteroid_id):
    """
    GET /api/asteroids/<id>
    Get detailed information about a specific asteroid
    """
    result = nasa_api.get_asteroid_by_id(asteroid_id)
    
    if 'error' in result:
        return Response(result, status=status.HTTP_404_NOT_FOUND)
    
    return Response(result, status=status.HTTP_200_OK)


@api_view(['POST'])
def simulate_impact(request):
    """
    POST /api/simulate-impact
    Calculate impact effects for given asteroid parameters
    
    Body:
        {
            "diameter_km": 1.0,
            "velocity_kmps": 20,
            "impact_lat": 40.7128,
            "impact_lon": -74.0060,
            "impact_angle": 45,
            "density": 3000 (optional)
        }
    """
    try:
        data = request.data
        
        diameter_km = float(data.get('diameter_km', 0))
        velocity_kmps = float(data.get('velocity_kmps', 0))
        impact_lat = float(data.get('impact_lat', 0))
        impact_lon = float(data.get('impact_lon', 0))
        impact_angle = float(data.get('impact_angle', 45))
        density = data.get('density')
        
        if diameter_km <= 0 or velocity_kmps <= 0:
            return Response(
                {'error': 'Invalid parameters. Diameter and velocity must be positive.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Run full impact simulation
        result = physics_engine.calculate_full_impact_simulation(
            diameter_km=diameter_km,
            velocity_kmps=velocity_kmps,
            impact_lat=impact_lat,
            impact_lon=impact_lon,
            impact_angle=impact_angle,
            density=float(density) if density else None
        )
        
        return Response(result, status=status.HTTP_200_OK)
        
    except (ValueError, TypeError) as e:
        return Response(
            {'error': f'Invalid data format: {str(e)}'},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
def simulate_deflection(request):
    """
    POST /api/simulate-deflection
    Simulate asteroid deflection strategies
    
    Body:
        {
            "original_velocity_kmps": 20,
            "method": "kinetic_impactor" | "gravity_tractor" | "nuclear",
            "params": {
                // Method-specific parameters
                "impactor_mass_kg": 500,
                "impactor_velocity_kmps": 10,
                "asteroid_mass_kg": 1e12
            }
        }
    """
    try:
        data = request.data
        
        original_velocity = float(data.get('original_velocity_kmps', 0))
        method = data.get('method', '')
        params = data.get('params', {})
        
        if original_velocity <= 0:
            return Response(
                {'error': 'Invalid velocity'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if method not in ['kinetic_impactor', 'gravity_tractor', 'nuclear']:
            return Response(
                {'error': 'Invalid deflection method. Choose: kinetic_impactor, gravity_tractor, or nuclear'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        result = physics_engine.simulate_deflection(
            original_velocity_kmps=original_velocity,
            deflection_method=method,
            deflection_params=params
        )
        
        return Response(result, status=status.HTTP_200_OK)
        
    except (ValueError, TypeError) as e:
        return Response(
            {'error': f'Invalid data format: {str(e)}'},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
def calculate_impact_from_asteroid(request):
    """
    POST /api/impact-from-asteroid
    Calculate impact effects directly from NASA asteroid data
    
    Body:
        {
            "asteroid_id": "3542519",
            "impact_lat": 40.7128,
            "impact_lon": -74.0060,
            "impact_angle": 45
        }
    """
    try:
        data = request.data
        
        asteroid_id = data.get('asteroid_id')
        impact_lat = float(data.get('impact_lat', 0))
        impact_lon = float(data.get('impact_lon', 0))
        impact_angle = float(data.get('impact_angle', 45))
        
        # Fetch asteroid data
        asteroid_data = nasa_api.get_asteroid_by_id(asteroid_id)
        
        if 'error' in asteroid_data:
            return Response(asteroid_data, status=status.HTTP_404_NOT_FOUND)
        
        # Run impact simulation with asteroid data
        result = physics_engine.calculate_full_impact_simulation(
            diameter_km=asteroid_data['diameter_km'],
            velocity_kmps=asteroid_data['velocity_kmps'],
            impact_lat=impact_lat,
            impact_lon=impact_lon,
            impact_angle=impact_angle
        )
        
        # Add asteroid metadata
        result['asteroid_info'] = {
            'id': asteroid_data['id'],
            'name': asteroid_data['name'],
            'is_potentially_hazardous': asteroid_data['is_potentially_hazardous']
        }
        
        return Response(result, status=status.HTTP_200_OK)
        
    except (ValueError, TypeError) as e:
        return Response(
            {'error': f'Invalid data format: {str(e)}'},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET'])
def get_earth_imagery(request):
    """
    GET /api/earth-imagery
    Get real Earth imagery from NASA EPIC API
    """
    try:
        import requests
        from django.conf import settings
        
        # NASA EPIC API endpoint
        epic_url = 'https://api.nasa.gov/EPIC/api/natural'
        params = {'api_key': settings.NASA_API_KEY}
        
        response = requests.get(epic_url, params=params, timeout=10)
        response.raise_for_status()
        
        return Response(response.json(), status=status.HTTP_200_OK)
        
    except requests.exceptions.RequestException as e:
        return Response(
            {'error': f'Failed to fetch Earth imagery: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_planetary_imagery(request):
    """
    GET /api/planetary-imagery?planet=<planet_key>
    Get planetary imagery from NASA APOD API
    
    Query params:
        - planet: Planet key (e.g., 'mars', 'jupiter', 'saturn')
    """
    try:
        import requests
        from django.conf import settings
        
        planet_key = request.GET.get('planet', '')
        
        # NASA Planetary APOD API endpoint
        apod_url = 'https://api.nasa.gov/planetary/apod'
        params = {'api_key': settings.NASA_API_KEY}
        
        response = requests.get(apod_url, params=params, timeout=10)
        response.raise_for_status()
        
        return Response(response.json(), status=status.HTTP_200_OK)
        
    except requests.exceptions.RequestException as e:
        return Response(
            {'error': f'Failed to fetch planetary imagery: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def health_check(request):
    """
    GET /api/health
    Simple health check endpoint
    """
    return Response({
        'status': 'healthy',
        'service': 'Asteroid Impact Simulator API',
        'version': '1.0.0'
    }, status=status.HTTP_200_OK)
