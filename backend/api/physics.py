"""
Physics Engine for Asteroid Impact Simulation
Person 2: Calculate impact energy, crater size, blast radius, seismic effects
"""
import math


class ImpactPhysics:
    """Physics calculations for asteroid impact simulation"""
    
    # Constants
    EARTH_RADIUS_KM = 6371  # Earth's radius in kilometers
    GRAVITY = 9.81  # m/s^2
    ASTEROID_DENSITY = 3000  # kg/m^3 (typical rocky asteroid)
    TNT_ENERGY = 4.184e9  # Joules per kiloton of TNT
    
    def __init__(self):
        pass
    
    def calculate_mass(self, diameter_km, density=None):
        """
        Calculate asteroid mass from diameter
        
        Args:
            diameter_km: Asteroid diameter in kilometers
            density: Asteroid density in kg/m^3 (default: 3000)
        
        Returns:
            float: Mass in kilograms
        """
        if density is None:
            density = self.ASTEROID_DENSITY
        
        # Convert diameter to meters
        diameter_m = diameter_km * 1000
        
        # Calculate volume (assuming sphere)
        radius_m = diameter_m / 2
        volume_m3 = (4/3) * math.pi * (radius_m ** 3)
        
        # Calculate mass
        mass_kg = volume_m3 * density
        
        return mass_kg
    
    def calculate_impact_energy(self, mass_kg, velocity_kmps):
        """
        Calculate impact energy: E = 0.5 * m * v^2
        
        Args:
            mass_kg: Mass in kilograms
            velocity_kmps: Velocity in kilometers per second
        
        Returns:
            dict: Energy in various units
        """
        # Convert velocity to m/s
        velocity_mps = velocity_kmps * 1000
        
        # Calculate kinetic energy (Joules)
        energy_joules = 0.5 * mass_kg * (velocity_mps ** 2)
        
        # Convert to megatons of TNT
        energy_kilotons = energy_joules / self.TNT_ENERGY
        energy_megatons = energy_kilotons / 1000
        
        # Compare to nuclear bombs
        hiroshima_equivalent = energy_kilotons / 15  # Hiroshima was ~15 kilotons
        
        return {
            'energy_joules': energy_joules,
            'energy_kilotons_tnt': energy_kilotons,
            'energy_megatons_tnt': energy_megatons,
            'hiroshima_equivalent': hiroshima_equivalent
        }
    
    def calculate_crater_size(self, diameter_km, velocity_kmps, impact_angle=45):
        """
        Estimate crater diameter and depth
        Uses simplified scaling laws
        
        Args:
            diameter_km: Asteroid diameter in kilometers
            velocity_kmps: Impact velocity in km/s
            impact_angle: Angle of impact in degrees (default: 45)
        
        Returns:
            dict: Crater dimensions
        """
        # Calculate mass
        mass_kg = self.calculate_mass(diameter_km)
        
        # Calculate energy
        energy = self.calculate_impact_energy(mass_kg, velocity_kmps)
        energy_megatons = energy['energy_megatons_tnt']
        
        # Crater diameter scaling (simplified formula)
        # D_crater ≈ 1.8 * (E^0.3) where E is in megatons
        crater_diameter_km = 1.8 * (energy_megatons ** 0.3)
        
        # Adjust for impact angle (oblique impacts create smaller craters)
        angle_factor = math.sin(math.radians(impact_angle))
        crater_diameter_km *= angle_factor ** 0.5
        
        # Crater depth is typically 1/5 to 1/10 of diameter
        crater_depth_km = crater_diameter_km / 7
        
        return {
            'crater_diameter_km': crater_diameter_km,
            'crater_diameter_m': crater_diameter_km * 1000,
            'crater_depth_km': crater_depth_km,
            'crater_depth_m': crater_depth_km * 1000,
            'impact_angle': impact_angle
        }
    
    def calculate_blast_radius(self, diameter_km, velocity_kmps):
        """
        Calculate blast and thermal radiation zones
        
        Args:
            diameter_km: Asteroid diameter in kilometers
            velocity_kmps: Impact velocity in km/s
        
        Returns:
            dict: Damage zones in kilometers
        """
        # Calculate energy
        mass_kg = self.calculate_mass(diameter_km)
        energy = self.calculate_impact_energy(mass_kg, velocity_kmps)
        energy_megatons = energy['energy_megatons_tnt']
        
        # Scaling laws for blast effects
        # Based on nuclear weapon effects scaled to impact energy
        
        # Total destruction zone (overpressure > 20 psi)
        total_destruction_km = 2.2 * (energy_megatons ** 0.33)
        
        # Severe damage zone (overpressure 5-20 psi)
        severe_damage_km = 4.7 * (energy_megatons ** 0.33)
        
        # Moderate damage zone (overpressure 2-5 psi)
        moderate_damage_km = 7.5 * (energy_megatons ** 0.33)
        
        # Thermal radiation (third-degree burns)
        thermal_radiation_km = 9.0 * (energy_megatons ** 0.38)
        
        # Fireball radius
        fireball_km = 0.28 * (energy_megatons ** 0.4)
        
        return {
            'fireball_radius_km': fireball_km,
            'total_destruction_radius_km': total_destruction_km,
            'severe_damage_radius_km': severe_damage_km,
            'moderate_damage_radius_km': moderate_damage_km,
            'thermal_radiation_radius_km': thermal_radiation_km,
            'energy_megatons': energy_megatons
        }
    
    def calculate_seismic_effects(self, diameter_km, velocity_kmps):
        """
        Estimate seismic effects (earthquake magnitude)
        
        Args:
            diameter_km: Asteroid diameter in kilometers
            velocity_kmps: Impact velocity in km/s
        
        Returns:
            dict: Seismic data
        """
        # Calculate energy
        mass_kg = self.calculate_mass(diameter_km)
        energy = self.calculate_impact_energy(mass_kg, velocity_kmps)
        energy_joules = energy['energy_joules']
        
        # Convert energy to Richter scale magnitude
        # M = (2/3) * log10(E) - 2.9 (where E is in ergs)
        energy_ergs = energy_joules * 1e7  # Convert Joules to ergs
        magnitude = (2/3) * math.log10(energy_ergs) - 2.9
        
        return {
            'richter_magnitude': magnitude,
            'seismic_radius_km': magnitude * 100,  # Rough estimate
            'description': self._get_seismic_description(magnitude)
        }
    
    def _get_seismic_description(self, magnitude):
        """Get description of seismic intensity"""
        if magnitude < 4.0:
            return "Minor tremors"
        elif magnitude < 5.0:
            return "Moderate earthquake"
        elif magnitude < 6.0:
            return "Strong earthquake"
        elif magnitude < 7.0:
            return "Major earthquake"
        elif magnitude < 8.0:
            return "Great earthquake"
        else:
            return "Catastrophic earthquake"
    
    def calculate_full_impact_simulation(self, diameter_km, velocity_kmps, 
                                        impact_lat=0, impact_lon=0, 
                                        impact_angle=45, density=None):
        """
        Complete impact simulation with all effects
        
        Args:
            diameter_km: Asteroid diameter in kilometers
            velocity_kmps: Impact velocity in km/s
            impact_lat: Impact latitude
            impact_lon: Impact longitude
            impact_angle: Impact angle in degrees
            density: Asteroid density (optional)
        
        Returns:
            dict: Complete impact simulation data
        """
        # Calculate mass
        mass_kg = self.calculate_mass(diameter_km, density)
        
        # Calculate all effects
        energy = self.calculate_impact_energy(mass_kg, velocity_kmps)
        crater = self.calculate_crater_size(diameter_km, velocity_kmps, impact_angle)
        blast = self.calculate_blast_radius(diameter_km, velocity_kmps)
        seismic = self.calculate_seismic_effects(diameter_km, velocity_kmps)
        
        # Check if impact is in ocean (simplified: assume 70% of Earth is ocean)
        is_ocean_impact = False  # Would need real geographic data
        
        return {
            'asteroid': {
                'diameter_km': diameter_km,
                'diameter_m': diameter_km * 1000,
                'mass_kg': mass_kg,
                'mass_tons': mass_kg / 1000,
                'velocity_kmps': velocity_kmps,
                'density_kg_m3': density or self.ASTEROID_DENSITY
            },
            'impact_location': {
                'latitude': impact_lat,
                'longitude': impact_lon,
                'angle': impact_angle,
                'is_ocean': is_ocean_impact
            },
            'energy': energy,
            'crater': crater,
            'blast_zones': blast,
            'seismic_effects': seismic,
            'severity': self._assess_severity(energy['energy_megatons_tnt'])
        }
    
    def _assess_severity(self, energy_megatons):
        """Assess impact severity"""
        if energy_megatons < 1:
            return "Minor - Local damage"
        elif energy_megatons < 100:
            return "Moderate - Regional catastrophe"
        elif energy_megatons < 10000:
            return "Major - Continental devastation"
        else:
            return "Catastrophic - Global extinction event"
    
    def simulate_deflection(self, original_velocity_kmps, deflection_method, 
                           deflection_params):
        """
        Simulate asteroid deflection strategies
        
        Args:
            original_velocity_kmps: Original asteroid velocity
            deflection_method: 'kinetic_impactor', 'gravity_tractor', 'nuclear'
            deflection_params: Method-specific parameters
        
        Returns:
            dict: Updated trajectory data
        """
        if deflection_method == 'kinetic_impactor':
            # Kinetic impactor: Change velocity by momentum transfer
            impactor_mass = deflection_params.get('impactor_mass_kg', 500)
            impactor_velocity = deflection_params.get('impactor_velocity_kmps', 10)
            asteroid_mass = deflection_params.get('asteroid_mass_kg', 1e12)
            
            # Delta-v from momentum conservation
            delta_v_mps = (impactor_mass * impactor_velocity * 1000) / asteroid_mass
            delta_v_kmps = delta_v_mps / 1000
            
            new_velocity = original_velocity_kmps + delta_v_kmps
            
            return {
                'method': 'kinetic_impactor',
                'original_velocity_kmps': original_velocity_kmps,
                'new_velocity_kmps': new_velocity,
                'delta_v_kmps': delta_v_kmps,
                'effectiveness': min(abs(delta_v_kmps / original_velocity_kmps) * 100, 100)
            }
        
        elif deflection_method == 'gravity_tractor':
            # Gravity tractor: Slow continuous pull
            duration_days = deflection_params.get('duration_days', 365)
            spacecraft_mass_kg = deflection_params.get('spacecraft_mass_kg', 1000)
            
            # Very small but continuous acceleration
            delta_v_mps = 0.0001 * duration_days  # Simplified
            delta_v_kmps = delta_v_mps / 1000
            
            new_velocity = original_velocity_kmps + delta_v_kmps
            
            return {
                'method': 'gravity_tractor',
                'original_velocity_kmps': original_velocity_kmps,
                'new_velocity_kmps': new_velocity,
                'delta_v_kmps': delta_v_kmps,
                'duration_days': duration_days,
                'effectiveness': min(abs(delta_v_kmps / original_velocity_kmps) * 100, 100)
            }
        
        elif deflection_method == 'nuclear':
            # Nuclear deflection: Large instantaneous change
            yield_megatons = deflection_params.get('yield_megatons', 1)
            
            # Simplified delta-v estimate
            delta_v_kmps = 0.001 * (yield_megatons ** 0.5)
            new_velocity = original_velocity_kmps + delta_v_kmps
            
            return {
                'method': 'nuclear_deflection',
                'original_velocity_kmps': original_velocity_kmps,
                'new_velocity_kmps': new_velocity,
                'delta_v_kmps': delta_v_kmps,
                'yield_megatons': yield_megatons,
                'effectiveness': min(abs(delta_v_kmps / original_velocity_kmps) * 100, 100)
            }
        
        else:
            return {'error': 'Unknown deflection method'}


# Singleton instance
physics_engine = ImpactPhysics()
