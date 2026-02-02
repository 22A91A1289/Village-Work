import * as Location from 'expo-location';
import { Alert } from 'react-native';

/**
 * Request location permissions from the user
 * @returns {Promise<boolean>} true if permission granted, false otherwise
 */
export const requestLocationPermission = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'Location permission is required to fetch your current location. Please enable it in settings.'
      );
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error requesting location permission:', error);
    Alert.alert('Error', 'Failed to request location permission');
    return false;
  }
};

/**
 * Get current location coordinates
 * @returns {Promise<{latitude: number, longitude: number} | null>}
 */
export const getCurrentLocation = async () => {
  try {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return null;

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Error getting current location:', error);
    Alert.alert('Error', 'Failed to get your current location. Please try again.');
    return null;
  }
};

/**
 * Reverse geocode coordinates to get address
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<string>} formatted address string
 */
export const reverseGeocode = async (latitude, longitude) => {
  try {
    const addresses = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (addresses && addresses.length > 0) {
      const address = addresses[0];
      
      // Format: City, State
      const parts = [];
      if (address.city) parts.push(address.city);
      if (address.region) parts.push(address.region);
      
      return parts.length > 0 ? parts.join(', ') : 'Unknown Location';
    }

    return 'Unknown Location';
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return 'Unknown Location';
  }
};

/**
 * Get current location and return formatted address
 * @returns {Promise<string | null>} formatted address or null if failed
 */
export const getCurrentLocationAddress = async () => {
  try {
    const coords = await getCurrentLocation();
    if (!coords) return null;

    const address = await reverseGeocode(coords.latitude, coords.longitude);
    return address;
  } catch (error) {
    console.error('Error getting location address:', error);
    return null;
  }
};

/**
 * Calculate distance between two coordinates in kilometers
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns {number} distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

/**
 * Format distance for display
 * @param {number} distanceInKm 
 * @returns {string} formatted distance
 */
export const formatDistance = (distanceInKm) => {
  if (distanceInKm < 1) {
    return `${Math.round(distanceInKm * 1000)} m`;
  }
  return `${distanceInKm.toFixed(1)} km`;
};
