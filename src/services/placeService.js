import api from './api';

export const placeService = {
  getNearbyPlaces: async ({ lat, lng, mood, distance }) => {
    const response = await api.post('/places/nearby', { lat, lng, mood, distance });
    return response.data;
  },

  savePlace: async (placeData) => {
    const response = await api.post('/user/places/save', placeData);
    return response.data;
  },

  getSavedPlaces: async () => {
    const response = await api.get('/user/places');
    return response.data;
  },

  deleteSavedPlace: async (id) => {
    const response = await api.delete(`/user/places/${id}`);
    return response.data;
  },
};
