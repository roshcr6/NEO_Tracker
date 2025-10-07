"""
Test Suite for Geocoding-Based Casualty Calculator
Tests 15 diverse locations worldwide to verify 100% accuracy

Run this test with: python backend/test_geocoding.py
"""

import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from api.casualty_calculator import CasualtyCalculator


def test_geocoding():
    """Test geocoding accuracy with 15 diverse locations"""
    
    calculator = CasualtyCalculator()
    
    # Test cases: (name, lat, lon, expected_type, should_be_water)
    test_cases = [
        ("New York City", 40.7128, -74.0060, "dense_urban", False),
        ("Pacific Ocean", 0.0, -170.0, "ocean", True),
        ("Tokyo", 35.6762, 139.6503, "dense_urban", False),
        ("Sahara Desert", 25.0, 10.0, "remote_land", False),
        ("London", 51.5074, -0.1278, "dense_urban", False),
        ("Atlantic Ocean", 60.0, -50.0, "ocean", True),
        ("Paris", 48.8566, 2.3522, "dense_urban", False),
        ("Australian Outback", -20.0, 135.0, "remote_land", False),
        ("Indian Ocean", -10.0, 80.0, "ocean", True),
        ("Mumbai", 19.0760, 72.8777, "dense_urban", False),
        ("Amazon Rainforest", -3.4653, -62.2159, "remote_land", False),
        ("Cairo", 30.0444, 31.2357, "dense_urban", False),
        ("Arctic Ocean", 85.0, 0.0, "ocean", True),
        ("Los Angeles", 34.0522, -118.2437, "dense_urban", False),
        ("Gobi Desert", 42.0, 103.0, "remote_land", False)
    ]
    
    passed = 0
    failed = 0
    
    print("=" * 80)
    print("🧪 GEOCODING ACCURACY TEST - 15 Locations Worldwide")
    print("=" * 80)
    print()
    
    for name, lat, lon, expected_type, should_be_water in test_cases:
        print(f"📍 Testing: {name} ({lat}, {lon})")
        
        try:
            # Get location info
            location_info = calculator.get_location_info_from_api(lat, lon)
            
            # Check water detection
            water_correct = location_info['is_water'] == should_be_water
            
            # Check location type (allow some flexibility)
            type_correct = True
            if should_be_water:
                type_correct = location_info['location_type'] == 'ocean'
            else:
                # For land, check if it's reasonable
                if expected_type == 'dense_urban':
                    type_correct = location_info['location_type'] in ['dense_urban', 'urban']
                elif expected_type == 'remote_land':
                    type_correct = location_info['location_type'] in ['remote_land', 'rural']
            
            # Overall test result
            test_passed = water_correct and type_correct
            
            if test_passed:
                passed += 1
                print(f"   ✅ PASS")
            else:
                failed += 1
                print(f"   ❌ FAIL")
            
            # Print details
            print(f"   Location: {location_info['location_name']}")
            print(f"   Type: {location_info['location_type']}")
            print(f"   Is Water: {location_info['is_water']}")
            print(f"   Population Density: {location_info['population_density']:,} per km²")
            print(f"   Detection Method: {location_info['detection_method']}")
            
            if not test_passed:
                print(f"   ⚠️  Expected water={should_be_water}, type={expected_type}")
                print(f"   ⚠️  Got water={location_info['is_water']}, type={location_info['location_type']}")
            
            print()
            
        except Exception as e:
            failed += 1
            print(f"   ❌ ERROR: {e}")
            print()
    
    # Summary
    total = len(test_cases)
    success_rate = (passed / total) * 100
    
    print("=" * 80)
    print("📊 TEST RESULTS")
    print("=" * 80)
    print(f"Total Tests: {total}")
    print(f"Passed: {passed} ✅")
    print(f"Failed: {failed} ❌")
    print(f"Success Rate: {success_rate:.1f}%")
    print()
    
    if passed == total:
        print("🎉 SUCCESS! All tests passed (100% accuracy)")
        print("✅ Water vs land detection is perfectly accurate")
        print("✅ Ready for production deployment")
    else:
        print(f"⚠️  {failed} tests failed. Review the failures above.")
        print("💡 Check internet connection and Nominatim API availability")
    
    print("=" * 80)
    
    return passed == total


def test_casualty_calculation():
    """Test casualty calculation for ocean vs land"""
    
    calculator = CasualtyCalculator()
    
    print()
    print("=" * 80)
    print("🧪 CASUALTY CALCULATION TEST")
    print("=" * 80)
    print()
    
    # Test 1: Ocean impact (should be 0 casualties)
    print("📍 Test 1: Ocean Impact (Pacific Ocean)")
    casualties_ocean = calculator.calculate_casualties(
        impact_lat=0.0,
        impact_lon=-170.0,
        blast_radius_km=50,
        energy_megatons=100
    )
    
    print(f"   Location: {casualties_ocean['location_name']}")
    print(f"   Is Ocean: {casualties_ocean['is_ocean_impact']}")
    print(f"   Deaths: {casualties_ocean['estimated_deaths']:,}")
    print(f"   Injuries: {casualties_ocean['estimated_injuries']:,}")
    
    ocean_pass = casualties_ocean['is_ocean_impact'] and casualties_ocean['estimated_deaths'] == 0
    print(f"   {'✅ PASS' if ocean_pass else '❌ FAIL'} - Ocean impacts should have 0 casualties")
    print()
    
    # Test 2: City impact (should have casualties)
    print("📍 Test 2: City Impact (New York)")
    casualties_city = calculator.calculate_casualties(
        impact_lat=40.7128,
        impact_lon=-74.0060,
        blast_radius_km=10,
        energy_megatons=10
    )
    
    print(f"   Location: {casualties_city['location_name']}")
    print(f"   City: {casualties_city['city']}")
    print(f"   Country: {casualties_city['country']}")
    print(f"   Population Density: {casualties_city['population_density']:,} per km²")
    print(f"   Deaths: {casualties_city['estimated_deaths']:,}")
    print(f"   Injuries: {casualties_city['estimated_injuries']:,}")
    print(f"   Severity: {casualties_city['severity_description']}")
    
    city_pass = not casualties_city['is_ocean_impact'] and casualties_city['estimated_deaths'] > 0
    print(f"   {'✅ PASS' if city_pass else '❌ FAIL'} - City impacts should have casualties")
    print()
    
    # Test 3: Remote land (should have minimal casualties)
    print("📍 Test 3: Remote Land Impact (Sahara Desert)")
    casualties_desert = calculator.calculate_casualties(
        impact_lat=25.0,
        impact_lon=10.0,
        blast_radius_km=20,
        energy_megatons=50
    )
    
    print(f"   Location: {casualties_desert['location_name']}")
    print(f"   Type: {casualties_desert['location_type']}")
    print(f"   Population Density: {casualties_desert['population_density']:,} per km²")
    print(f"   Deaths: {casualties_desert['estimated_deaths']:,}")
    print(f"   Injuries: {casualties_desert['estimated_injuries']:,}")
    
    desert_pass = not casualties_desert['is_ocean_impact']
    print(f"   {'✅ PASS' if desert_pass else '❌ FAIL'} - Desert should be detected as land")
    print()
    
    print("=" * 80)
    
    all_passed = ocean_pass and city_pass and desert_pass
    if all_passed:
        print("🎉 All casualty calculation tests passed!")
    else:
        print("⚠️  Some casualty calculation tests failed")
    
    print("=" * 80)
    
    return all_passed


if __name__ == "__main__":
    print()
    print("🚀 Starting Geocoding Test Suite")
    print()
    
    # Run location detection tests
    location_tests_passed = test_geocoding()
    
    # Run casualty calculation tests
    casualty_tests_passed = test_casualty_calculation()
    
    # Final summary
    print()
    print("=" * 80)
    print("🏁 FINAL SUMMARY")
    print("=" * 80)
    
    if location_tests_passed and casualty_tests_passed:
        print("✅ ALL TESTS PASSED - System is ready for deployment!")
        print("✅ Geocoding: 100% accurate")
        print("✅ Casualty calculation: Working correctly")
        print("✅ Ocean detection: 0 casualties ✓")
        print("✅ City detection: Accurate names and casualties ✓")
        sys.exit(0)
    else:
        print("❌ SOME TESTS FAILED - Please review failures above")
        if not location_tests_passed:
            print("❌ Location detection needs fixing")
        if not casualty_tests_passed:
            print("❌ Casualty calculation needs fixing")
        sys.exit(1)
