"""
Casualty Calculator with Geocoding API for Asteroid Impact Simulator
Uses OpenStreetMap Nominatim API for accurate location detection
NO API KEY REQUIRED - Completely FREE
"""
import requests
import math
from typing import Dict, Tuple, Optional


class CasualtyCalculator:
    """Calculate casualties from asteroid impacts using real geocoding data"""
    
    # Population density estimates by location type (people per km²)
    POPULATION_DENSITIES = {
        'dense_urban': 15000,      # Dense cities like NYC, Tokyo
        'urban': 5000,              # Cities
        'suburban': 2000,           # Suburbs
        'rural': 200,               # Rural areas
        'remote_land': 50,          # Remote areas
        'ocean': 0,                 # Oceans, seas, lakes
    }
    
    # Major cities with known population densities
    MAJOR_CITIES = {
        'New York': 10800, 'Tokyo': 6300, 'Mumbai': 20700,
        'London': 5700, 'Paris': 21000, 'Moscow': 8500,
        'Cairo': 19400, 'Los Angeles': 3200, 'Chicago': 4600,
        'Beijing': 1300, 'Shanghai': 3800, 'Singapore': 8000,
        'São Paulo': 7400, 'Mexico City': 6000, 'Seoul': 16000,
        'Manila': 43000, 'Delhi': 11300, 'Istanbul': 2900,
        'Bangkok': 5300, 'Tehran': 11800, 'Buenos Aires': 14500,
        'Karachi': 24000, 'Dhaka': 44500, 'Lagos': 13100,
        'Jakarta': 14400, 'Hong Kong': 6800, 'Sydney': 400,
        'Toronto': 4300, 'Berlin': 4100, 'Madrid': 5400
    }
    
    def __init__(self):
        self.api_base_url = 'https://nominatim.openstreetmap.org/reverse'
        self.user_agent = 'AsteroidImpactSimulator/1.0'
    
    def get_location_info_from_api(self, lat: float, lon: float) -> Dict:
        """
        Get location information using OpenStreetMap Nominatim reverse geocoding API
        
        This API is FREE and requires NO API KEY!
        
        Args:
            lat: Latitude (-90 to 90)
            lon: Longitude (-180 to 180)
            
        Returns:
            Dict with location info including:
                - is_water: bool
                - city: str or None
                - country: str
                - location_name: str
                - population_density: int
                - location_type: str
                - detection_method: str
        """
        params = {
            'lat': lat,
            'lon': lon,
            'format': 'json',
            'zoom': 10,
            'addressdetails': 1
        }
        
        try:
            # Call OpenStreetMap Nominatim API
            response = requests.get(
                self.api_base_url,
                params=params,
                headers={'User-Agent': self.user_agent},
                timeout=5
            )
            
            # If API fails, use fallback
            if response.status_code != 200:
                print(f"Geocoding API returned status {response.status_code}, using fallback")
                return self._fallback_location_detection(lat, lon)
            
            data = response.json()
            
            # Check if response is valid
            if not data or 'display_name' not in data:
                print("Geocoding API returned invalid data, using fallback")
                return self._fallback_location_detection(lat, lon)
            
            # Extract display name
            display_name = data.get('display_name', '').lower()
            
            # Check if water body (ocean, sea, lake, river, etc.)
            water_bodies = ['ocean', 'sea', 'lake', 'river', 'bay', 'gulf', 'strait', 'water']
            is_water = any(water in display_name for water in water_bodies)
            
            if is_water:
                # Extract water body name
                water_name = display_name.split(',')[0].title()
                
                return {
                    'is_water': True,
                    'location_name': water_name,
                    'location_type': 'ocean',
                    'population_density': 0,
                    'city': None,
                    'country': None,
                    'detection_method': 'geocoding_api',
                    'full_address': display_name
                }
            
            # Extract address components
            address = data.get('address', {})
            
            # Get city name (try multiple fields)
            city = (address.get('city') or 
                   address.get('town') or 
                   address.get('village') or 
                   address.get('municipality') or
                   address.get('county'))
            
            # Get country
            country = address.get('country', 'Unknown')
            
            # Estimate population density
            population_density = self._estimate_population_density(address, city, country, lat, lon)
            
            # Classify location type
            location_type = self._classify_location_type(address, population_density)
            
            # Determine location name
            if city:
                location_name = f"{city}, {country}"
            else:
                # Use first part of display name
                location_name = display_name.split(',')[0].title()
            
            return {
                'is_water': False,
                'city': city,
                'country': country,
                'location_name': location_name,
                'population_density': population_density,
                'location_type': location_type,
                'detection_method': 'geocoding_api',
                'full_address': display_name
            }
            
        except requests.exceptions.Timeout:
            print("Geocoding API timeout, using fallback")
            return self._fallback_location_detection(lat, lon)
        except requests.exceptions.RequestException as e:
            print(f"Geocoding API error: {e}, using fallback")
            return self._fallback_location_detection(lat, lon)
        except Exception as e:
            print(f"Unexpected error in geocoding: {e}, using fallback")
            return self._fallback_location_detection(lat, lon)
    
    def _estimate_population_density(self, address: Dict, city: Optional[str], 
                                     country: str, lat: float, lon: float) -> int:
        """
        Estimate population density based on location characteristics
        
        Args:
            address: Address components from geocoding API
            city: City name (if available)
            country: Country name
            lat: Latitude
            lon: Longitude
        
        Returns:
            int: Population density (people per km²)
        """
        # Check if city is in our major cities database
        if city and city in self.MAJOR_CITIES:
            return self.MAJOR_CITIES[city]
        
        # Check address components for clues about population density
        
        # Dense urban indicators
        if (address.get('city') and 
            (address.get('city_district') or 
             address.get('suburb') or 
             address.get('neighbourhood'))):
            return 10000  # Dense urban area
        
        # City
        if address.get('city'):
            return 5000  # Urban area
        
        # Town
        if address.get('town'):
            # Check if it's a large town (has districts)
            if address.get('suburb') or address.get('district'):
                return 3000  # Large town
            return 2000  # Regular town
        
        # Village
        if address.get('village'):
            return 500  # Village
        
        # Hamlet/isolated dwelling
        if address.get('hamlet') or address.get('isolated_dwelling'):
            return 100  # Very sparse
        
        # Check country for baseline density
        high_density_countries = [
            'Singapore', 'Monaco', 'Vatican City', 'Malta', 
            'Bangladesh', 'Bahrain', 'Netherlands', 'South Korea',
            'Taiwan', 'India', 'Belgium', 'Japan', 'Philippines'
        ]
        
        if country in high_density_countries:
            return 8000  # High density country
        
        # Check for industrial/commercial areas
        if address.get('industrial') or address.get('commercial'):
            return 1000  # Industrial/commercial zones
        
        # Default to very low density (remote/rural)
        return 50  # Remote area
    
    def _classify_location_type(self, address: Dict, population_density: int) -> str:
        """
        Classify location type based on address and population density
        
        Args:
            address: Address components from geocoding API
            population_density: Estimated population density
        
        Returns:
            str: Location type ('ocean', 'dense_urban', 'urban', 'suburban', 'rural', 'remote_land')
        """
        if population_density == 0:
            return 'ocean'
        elif population_density > 10000:
            return 'dense_urban'
        elif population_density > 3000:
            return 'urban'
        elif population_density > 1000:
            return 'suburban'
        elif population_density > 100:
            return 'rural'
        else:
            return 'remote_land'
    
    def _fallback_location_detection(self, lat: float, lon: float) -> Dict:
        """
        Fallback method using hardcoded lat/lon ranges
        Only used if geocoding API fails
        
        Args:
            lat: Latitude
            lon: Longitude
        
        Returns:
            Dict with location info (less accurate than API)
        """
        # Detect major oceans (simplified)
        is_water = False
        location_name = "Remote Area"
        
        # Pacific Ocean (rough approximation)
        if -60 < lat < 60 and ((120 < lon <= 180) or (-180 <= lon < -70)):
            is_water = True
            location_name = "Pacific Ocean"
        
        # Atlantic Ocean
        elif -60 < lat < 70 and -70 < lon < -20:
            is_water = True
            location_name = "Atlantic Ocean"
        
        # Indian Ocean
        elif -60 < lat < 30 and 20 < lon < 120:
            is_water = True
            location_name = "Indian Ocean"
        
        # Arctic Ocean
        elif lat > 70:
            is_water = True
            location_name = "Arctic Ocean"
        
        # Antarctic Ocean
        elif lat < -60:
            is_water = True
            location_name = "Southern Ocean"
        
        if is_water:
            return {
                'is_water': True,
                'location_name': location_name,
                'location_type': 'ocean',
                'population_density': 0,
                'city': None,
                'country': None,
                'detection_method': 'fallback',
                'full_address': location_name
            }
        
        # Land - use very low density by default
        return {
            'is_water': False,
            'location_name': location_name,
            'location_type': 'remote_land',
            'population_density': 50,
            'city': None,
            'country': None,
            'detection_method': 'fallback',
            'full_address': location_name
        }
    
    def calculate_casualties(self, impact_lat: float, impact_lon: float,
                            blast_radius_km: float, energy_megatons: float) -> Dict:
        """
        Calculate estimated casualties from asteroid impact
        
        Args:
            impact_lat: Impact latitude
            impact_lon: Impact longitude
            blast_radius_km: Total destruction radius in kilometers
            energy_megatons: Impact energy in megatons of TNT
        
        Returns:
            Dict with casualty estimates and location info
        """
        # Get location info using geocoding API
        location_info = self.get_location_info_from_api(impact_lat, impact_lon)
        
        # If water impact, return 0 casualties
        if location_info['is_water']:
            return {
                'estimated_deaths': 0,
                'estimated_injuries': 0,
                'affected_population': 0,
                'location_type': location_info['location_type'],
                'location_name': location_info['location_name'],
                'city': location_info['city'],
                'country': location_info['country'],
                'population_density': 0,
                'blast_radius_km': blast_radius_km,
                'energy_megatons': energy_megatons,
                'is_ocean_impact': True,
                'detection_method': location_info['detection_method'],
                'note': 'Ocean impact - No direct casualties expected. May cause tsunamis.'
            }
        
        # Land impact - calculate casualties
        population_density = location_info['population_density']
        
        # Calculate affected area (circle)
        blast_area_km2 = math.pi * (blast_radius_km ** 2)
        
        # Estimate affected population
        affected_population = int(blast_area_km2 * population_density)
        
        # Mortality estimates based on blast zone
        # Total destruction zone: 90% mortality
        # Severe damage zone: 50% mortality
        # Moderate damage zone: 10% mortality
        
        # Simplified model: assume blast_radius_km is total destruction
        mortality_rate = 0.70  # 70% average mortality in blast zone
        injury_rate = 0.25     # 25% injuries among survivors
        
        estimated_deaths = int(affected_population * mortality_rate)
        estimated_injuries = int(affected_population * injury_rate)
        
        # Adjust for very small impacts
        if energy_megatons < 0.01:
            estimated_deaths = int(estimated_deaths * 0.5)
            estimated_injuries = int(estimated_injuries * 0.5)
        
        # Cap casualties for extremely large impacts
        max_casualties = 10_000_000_000  # 10 billion (more than world population)
        estimated_deaths = min(estimated_deaths, max_casualties)
        estimated_injuries = min(estimated_injuries, max_casualties)
        
        return {
            'estimated_deaths': estimated_deaths,
            'estimated_injuries': estimated_injuries,
            'affected_population': affected_population,
            'location_type': location_info['location_type'],
            'location_name': location_info['location_name'],
            'city': location_info['city'],
            'country': location_info['country'],
            'population_density': population_density,
            'blast_radius_km': blast_radius_km,
            'blast_area_km2': blast_area_km2,
            'energy_megatons': energy_megatons,
            'is_ocean_impact': False,
            'detection_method': location_info['detection_method'],
            'severity_description': self._get_severity_description(estimated_deaths)
        }
    
    def _get_severity_description(self, deaths: int) -> str:
        """Get human-readable severity description"""
        if deaths == 0:
            return "No casualties expected"
        elif deaths < 100:
            return "Minimal casualties - Local incident"
        elif deaths < 10000:
            return "Moderate casualties - Regional disaster"
        elif deaths < 100000:
            return "Severe casualties - Major disaster"
        elif deaths < 1000000:
            return "Catastrophic - National emergency"
        elif deaths < 10000000:
            return "Devastating - Continental catastrophe"
        else:
            return "Apocalyptic - Global extinction event"


# Singleton instance
casualty_calculator = CasualtyCalculator()
