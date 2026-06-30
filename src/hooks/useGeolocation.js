import { useState } from 'react';

const useGeolocation = () => {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location access denied. Please allow location in your browser.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location unavailable. Try again.');
            break;
          case err.TIMEOUT:
            setError('Location request timed out. Try again.');
            break;
          default:
            setError('Could not get location. Try again.');
        }
        setLoading(false);
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  };

  return { location, loading, error, getLocation };
};

export default useGeolocation;
