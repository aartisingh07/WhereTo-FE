import api from './api';

export const roomService = {
  createRoom: async (name) => {
    const response = await api.post('/rooms/create', { name });
    return response.data;
  },

  joinRoom: async (code) => {
    const response = await api.post('/rooms/join', { code });
    return response.data;
  },

  getRoom: async (id) => {
    const response = await api.get(`/rooms/${id}`);
    return response.data;
  },

  setActivity: async (id, activity) => {
    const response = await api.patch(`/rooms/${id}/activity`, { activity });
    return response.data;
  },

  getMessages: async (id) => {
    const response = await api.get(`/rooms/${id}/messages`);
    return response.data;
  },

  leaveRoom: async (id) => {
    const response = await api.post(`/rooms/${id}/leave`);
    return response.data;
  },

  deleteRoom: async (id) => {
    const response = await api.delete(`/rooms/${id}`);
    return response.data;
  },

  getMyRooms: async () => {
    const response = await api.get('/rooms/my-rooms');
    return response.data;
  },

  getActiveRooms: async () => {
    const response = await api.get('/rooms/active');
    return response.data;
  },

  requestJoinRoom: async (id, note) => {
    const response = await api.post(`/rooms/${id}/request-join`, { note });
    return response.data;
  },

  respondJoinRequest: async (id, requestId, action) => {
    const response = await api.post(`/rooms/${id}/respond-request`, { requestId, action });
    return response.data;
  },

  removeMember: async (id, memberId) => {
    const response = await api.post(`/rooms/${id}/remove-member`, { memberId });
    return response.data;
  },
};
