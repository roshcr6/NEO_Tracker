"""
NASA Near Earth Object (NEO) API Integration
Person 1: Fetch live NEO data (size, velocity, trajectory)
"""
import requests
from datetime import datetime, timedelta
from django.conf import settings


class NASANeoAPI:
    """Interface for NASA NEO API"""
    
    def __init__(self):
        self.api_key = settings.NASA_API_KEY
        self.base_url = settings.NASA_API_BASE_URL
    
    def get_neo_feed(self, start_date=None, end_date=None):
        """
        Fetch Near Earth Objects for a date range (max 7 days)
        
        Args:
            start_date: Start date (YYYY-MM-DD). Defaults to today.
            end_date: End date (YYYY-MM-DD). Defaults to 7 days from start.
        
        Returns:
            dict: NEO data from NASA API
        """
        if not start_date:
            start_date = datetime.now().strftime('%Y-%m-%d')
        if not end_date:
            end_date = (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d')
        
        url = f"{self.base_url}/feed"
        params = {
            'start_date': start_date,
            'end_date': end_date,
            'api_key': self.api_key
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            return self._parse_neo_feed(response.json())
        except requests.exceptions.RequestException as e:
            return {'error': f'NASA API request failed: {str(e)}'}
    
    def get_asteroid_by_id(self, asteroid_id):
        """
        Fetch detailed data for a specific asteroid
        
        Args:
            asteroid_id: NASA NEO ID
        
        Returns:
            dict: Detailed asteroid data
        """
        url = f"{self.base_url}/neo/{asteroid_id}"
        params = {'api_key': self.api_key}
        
        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            return self._parse_asteroid_details(response.json())
        except requests.exceptions.RequestException as e:
            return {'error': f'Failed to fetch asteroid {asteroid_id}: {str(e)}'}
    
    def search_asteroids(self, is_potentially_hazardous=None):
        """
        Browse all asteroids with optional filtering
        
        Args:
            is_potentially_hazardous: Filter by hazardous status (True/False)
        
        Returns:
            dict: List of asteroids matching criteria
        """
        url = f"{self.base_url}/neo/browse"
        params = {
            'api_key': self.api_key,
            'size': 20  # Request 20 asteroids per page (NASA API limit)
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            asteroids = data.get('near_earth_objects', [])
            
            # Filter by hazardous status if specified
            if is_potentially_hazardous is not None:
                asteroids = [
                    a for a in asteroids 
                    if a.get('is_potentially_hazardous_asteroid') == is_potentially_hazardous
                ]
            
            return self._parse_asteroid_list(asteroids)
        except requests.exceptions.RequestException as e:
            return {'error': f'Failed to search asteroids: {str(e)}'}
    
    def _parse_neo_feed(self, data):
        """Parse NEO feed response"""
        neo_data = data.get('near_earth_objects', {})
        parsed_asteroids = []
        
        for date, asteroids in neo_data.items():
            for asteroid in asteroids:
                parsed_asteroids.append(self._extract_asteroid_info(asteroid))
        
        return {
            'element_count': data.get('element_count', 0),
            'asteroids': parsed_asteroids
        }
    
    def _parse_asteroid_details(self, data):
        """Parse detailed asteroid response"""
        return self._extract_asteroid_info(data)
    
    def _parse_asteroid_list(self, asteroids):
        """Parse list of asteroids"""
        return {
            'count': len(asteroids),
            'asteroids': [self._extract_asteroid_info(a) for a in asteroids]
        }
    
    def _extract_asteroid_info(self, asteroid):
        """
        Extract relevant asteroid information for simulation
        
        Returns:
            dict: Simplified asteroid data with physics parameters
        """
        # Get close approach data
        close_approach_data = asteroid.get('close_approach_data', [])
        next_approach = close_approach_data[0] if close_approach_data else {}
        
        # Extract orbital data
        orbital_data = asteroid.get('orbital_data', {})
        
        # Get size estimates
        estimated_diameter = asteroid.get('estimated_diameter', {})
        diameter_km = estimated_diameter.get('kilometers', {})
        
        # Calculate average diameter
        min_diameter = diameter_km.get('estimated_diameter_min', 0)
        max_diameter = diameter_km.get('estimated_diameter_max', 0)
        avg_diameter_km = (min_diameter + max_diameter) / 2
        
        # Get velocity data
        relative_velocity = next_approach.get('relative_velocity', {})
        velocity_kmps = float(relative_velocity.get('kilometers_per_second', 0))
        
        # Get miss distance
        miss_distance = next_approach.get('miss_distance', {})
        
        return {
            'id': asteroid.get('id'),
            'name': asteroid.get('name'),
            'nasa_jpl_url': asteroid.get('nasa_jpl_url'),
            'absolute_magnitude': asteroid.get('absolute_magnitude_h'),
            'is_potentially_hazardous': asteroid.get('is_potentially_hazardous_asteroid', False),
            
            # Size data
            'diameter_km': avg_diameter_km,
            'diameter_min_km': min_diameter,
            'diameter_max_km': max_diameter,
            'diameter_meters': avg_diameter_km * 1000,
            
            # Velocity data
            'velocity_kmps': velocity_kmps,
            'velocity_kmph': float(relative_velocity.get('kilometers_per_hour', 0)),
            'velocity_mph': float(relative_velocity.get('miles_per_hour', 0)),
            
            # Distance data
            'miss_distance_km': float(miss_distance.get('kilometers', 0)),
            'miss_distance_lunar': float(miss_distance.get('lunar', 0)),
            'miss_distance_au': float(miss_distance.get('astronomical', 0)),
            
            # Close approach data
            'close_approach_date': next_approach.get('close_approach_date'),
            'close_approach_date_full': next_approach.get('close_approach_date_full'),
            'orbiting_body': next_approach.get('orbiting_body', 'Earth'),
            
            # Orbital elements (for trajectory visualization)
            'orbital_data': {
                'orbit_id': orbital_data.get('orbit_id'),
                'orbit_determination_date': orbital_data.get('orbit_determination_date'),
                'orbit_uncertainty': orbital_data.get('orbit_uncertainty'),
                'semi_major_axis': orbital_data.get('semi_major_axis'),
                'eccentricity': orbital_data.get('eccentricity'),
                'inclination': orbital_data.get('inclination'),
                'ascending_node_longitude': orbital_data.get('ascending_node_longitude'),
                'orbital_period': orbital_data.get('orbital_period'),
                'perihelion_distance': orbital_data.get('perihelion_distance'),
                'aphelion_distance': orbital_data.get('aphelion_distance'),
                'perihelion_argument': orbital_data.get('perihelion_argument'),
                'mean_anomaly': orbital_data.get('mean_anomaly'),
            }
        }


# Singleton instance
nasa_api = NASANeoAPI()
