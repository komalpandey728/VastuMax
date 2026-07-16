import api from './api';

export const createLead = async ({ vehicleId, name, phone, message }) => {
  const { data } = await api.post('/leads', { vehicleId, name, phone, message });
  return data;
};

export const getLeads = async () => {
  const { data } = await api.get('/leads');
  return data;
};

export const updateLeadStatus = async (id, status) => {
  const { data } = await api.patch(`/leads/${id}`, { status });
  return data;
};
