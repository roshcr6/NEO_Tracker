"""
URL Configuration for API endpoints
"""
from django.urls import path
from . import views

urlpatterns = [
    # Health check
    path('health', views.health_check, name='health_check'),
    
    # NASA API endpoints
    path('asteroids', views.get_asteroids, name='get_asteroids'),
    path('asteroids/<str:asteroid_id>', views.get_asteroid_detail, name='get_asteroid_detail'),
    
    # Impact simulation endpoints
    path('simulate-impact', views.simulate_impact, name='simulate_impact'),
    path('impact-from-asteroid', views.calculate_impact_from_asteroid, name='impact_from_asteroid'),
    
    # Deflection simulation
    path('simulate-deflection', views.simulate_deflection, name='simulate_deflection'),
]
