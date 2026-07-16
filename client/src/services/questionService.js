import api from './api';
import { USE_LOCAL_STORAGE } from './config';
import { getLocalData, saveLocalData } from './db';

export const askQuestion = async (questionData) => {
  if (USE_LOCAL_STORAGE) {
    const token = localStorage.getItem('vastu_token');
    const userId = token?.replace('mock_jwt_token_', '');
    if (!userId) throw new Error('Not authorized');

    const questions = getLocalData('vastu_questions');
    const vehicles = getLocalData('vastu_vehicles');

    const car = vehicles.find((v) => v._id === questionData.vehicleId);
    if (!car) throw new Error('Vehicle not found');

    const newQ = {
      _id: `q_${Date.now()}`,
      vehicle: questionData.vehicleId,
      customer: userId,
      vendor: car.vendor,
      questionText: questionData.questionText,
      answerText: '',
      isApproved: false, // moderated by admin before public
      isAnswered: false,
      createdAt: new Date().toISOString(),
    };

    questions.push(newQ);
    saveLocalData('vastu_questions', questions);

    // Notify Vendor about inquiry
    const notifications = getLocalData('vastu_notifications');
    notifications.push({
      _id: `nt_${Date.now()}`,
      user: car.vendor,
      title: 'New Vehicle Inquiry 💬',
      message: `A customer has asked a question about your listing "${car.name}": "${questionData.questionText.substring(0, 40)}..."`,
      type: 'question',
      isRead: false,
      link: '/vendor/dashboard',
      createdAt: new Date().toISOString(),
    });
    saveLocalData('vastu_notifications', notifications);

    return { success: true, question: newQ };
  }

  const { data } = await api.post('/questions', questionData);
  return data;
};

export const answerQuestion = async (id, answerText) => {
  if (USE_LOCAL_STORAGE) {
    const questions = getLocalData('vastu_questions');
    const idx = questions.findIndex((q) => q._id === id);
    if (idx !== -1) {
      questions[idx].answerText = answerText;
      questions[idx].isAnswered = true;
      questions[idx].isApproved = true; // Auto approve public view when vendor answers locally
      saveLocalData('vastu_questions', questions);

      // Notify customer
      const vehicles = getLocalData('vastu_vehicles');
      const car = vehicles.find((v) => v._id === questions[idx].vehicle);

      const notifications = getLocalData('vastu_notifications');
      notifications.push({
        _id: `nt_${Date.now()}`,
        user: questions[idx].customer,
        title: 'Question Answered! 💬',
        message: `The dealer answered your question about "${car?.name}": "${answerText.substring(0, 40)}..."`,
        type: 'question',
        isRead: false,
        link: '/customer/wishlist',
        createdAt: new Date().toISOString(),
      });
      saveLocalData('vastu_notifications', notifications);
    }
    return { success: true };
  }

  const { data } = await api.patch(`/questions/${id}/answer`, { answerText });
  return data;
};

export const getVehicleQuestions = async (vehicleId) => {
  if (USE_LOCAL_STORAGE) {
    const questions = getLocalData('vastu_questions');
    const users = getLocalData('vastu_users');

    const list = questions.filter((q) => q.vehicle === vehicleId && q.isApproved);
    const populated = list.map((q) => {
      const c = users.find((usr) => usr.id === q.customer);
      return {
        ...q,
        customer: c ? { name: c.name } : null,
      };
    });

    return { questions: populated };
  }

  const { data } = await api.get(`/questions/vehicle/${vehicleId}`);
  return data;
};

export const getVendorQuestions = async () => {
  if (USE_LOCAL_STORAGE) {
    const token = localStorage.getItem('vastu_token');
    const userId = token?.replace('mock_jwt_token_', '');
    if (!userId) throw new Error('Not authorized');

    const list = getLocalData('vastu_questions');
    const filtered = list.filter((q) => q.vendor === userId);

    const vehicles = getLocalData('vastu_vehicles');
    const users = getLocalData('vastu_users');

    const populated = filtered.map((q) => {
      const v = vehicles.find((car) => car._id === q.vehicle);
      const c = users.find((usr) => usr.id === q.customer);
      return {
        ...q,
        vehicle: v ? { name: v.name, brand: v.brand, model: v.model, images: v.images } : null,
        customer: c ? { name: c.name, email: c.email } : null,
      };
    });

    return { questions: populated };
  }

  const { data } = await api.get('/questions/vendor');
  return data;
};
