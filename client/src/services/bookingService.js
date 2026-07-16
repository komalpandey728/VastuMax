import api from './api';
import { USE_LOCAL_STORAGE } from './config';
import { getLocalData, saveLocalData } from './db';

export const createBooking = async (bookingData) => {
  if (USE_LOCAL_STORAGE) {
    const token = localStorage.getItem('vastu_token');
    const userId = token?.replace('mock_jwt_token_', '');
    if (!userId) throw new Error('Not authorized');

    const bookings = getLocalData('vastu_bookings');
    const vehicles = getLocalData('vastu_vehicles');

    const car = vehicles.find((v) => v._id === bookingData.vehicleId);
    if (!car) throw new Error('Vehicle not found');

    const newBooking = {
      _id: `bk_${Date.now()}`,
      vehicle: bookingData.vehicleId,
      customer: userId,
      vendor: car.vendor,
      bookingDate: bookingData.bookingDate,
      bookingTime: bookingData.bookingTime,
      status: 'pending',
      notes: bookingData.notes || '',
      createdAt: new Date().toISOString(),
    };

    bookings.push(newBooking);
    saveLocalData('vastu_bookings', bookings);

    // Notify dealer
    const notifications = getLocalData('vastu_notifications');
    notifications.push({
      _id: `nt_${Date.now()}`,
      user: car.vendor,
      title: 'New Test Drive Booking Request 🚗',
      message: `A customer has requested a test drive for your listing: "${car.name}" on ${bookingData.bookingDate} at ${bookingData.bookingTime}.`,
      type: 'booking',
      isRead: false,
      link: '/vendor/dashboard',
      createdAt: new Date().toISOString(),
    });
    saveLocalData('vastu_notifications', notifications);

    return { success: true, booking: newBooking };
  }

  const { data } = await api.post('/bookings', bookingData);
  return data;
};

export const getCustomerBookings = async () => {
  if (USE_LOCAL_STORAGE) {
    const token = localStorage.getItem('vastu_token');
    const userId = token?.replace('mock_jwt_token_', '');
    if (!userId) throw new Error('Not authorized');

    const list = getLocalData('vastu_bookings');
    const filtered = list.filter((b) => b.customer === userId);

    const vehicles = getLocalData('vastu_vehicles');
    const users = getLocalData('vastu_users');

    const populated = filtered.map((b) => {
      const v = vehicles.find((car) => car._id === b.vehicle);
      const vend = users.find((usr) => usr.id === b.vendor);
      return {
        ...b,
        vehicle: v ? { name: v.name, brand: v.brand, model: v.model, images: v.images, price: v.price, location: v.location } : null,
        vendor: vend ? { name: vend.name, email: vend.email, phone: vend.phone } : null,
      };
    });

    return { bookings: populated };
  }

  const { data } = await api.get('/bookings/customer');
  return data;
};

export const getVendorBookings = async () => {
  if (USE_LOCAL_STORAGE) {
    const token = localStorage.getItem('vastu_token');
    const userId = token?.replace('mock_jwt_token_', '');
    if (!userId) throw new Error('Not authorized');

    const list = getLocalData('vastu_bookings');
    const filtered = list.filter((b) => b.vendor === userId);

    const vehicles = getLocalData('vastu_vehicles');
    const users = getLocalData('vastu_users');

    const populated = filtered.map((b) => {
      const v = vehicles.find((car) => car._id === b.vehicle);
      const cust = users.find((usr) => usr.id === b.customer);
      return {
        ...b,
        vehicle: v ? { name: v.name, brand: v.brand, model: v.model, images: v.images, price: v.price } : null,
        customer: cust ? { name: cust.name, email: cust.email, phone: cust.phone } : null,
      };
    });

    return { bookings: populated };
  }

  const { data } = await api.get('/bookings/vendor');
  return data;
};

export const updateBookingStatus = async (id, status) => {
  if (USE_LOCAL_STORAGE) {
    const bookings = getLocalData('vastu_bookings');
    const idx = bookings.findIndex((b) => b._id === id);
    if (idx !== -1) {
      bookings[idx].status = status;
      saveLocalData('vastu_bookings', bookings);

      // Notify customer
      const vehicles = getLocalData('vastu_vehicles');
      const car = vehicles.find((v) => v._id === bookings[idx].vehicle);

      const notifications = getLocalData('vastu_notifications');
      let title = 'Test Drive Update 🚗';
      let message = `Your test drive booking request for "${car?.name}" has been ${status}.`;
      if (status === 'confirmed') {
        title = 'Test Drive Confirmed! ✅';
        message = `Awesome news! The dealer has confirmed your test drive for "${car?.name}" on ${new Date(bookings[idx].bookingDate).toDateString()} at ${bookings[idx].bookingTime}.`;
      } else if (status === 'cancelled') {
        title = 'Test Drive Cancelled ❌';
        message = `Your test drive request for "${car?.name}" was cancelled by the dealer.`;
      }

      notifications.push({
        _id: `nt_${Date.now()}`,
        user: bookings[idx].customer,
        title,
        message,
        type: 'booking',
        isRead: false,
        link: '/customer/wishlist',
        createdAt: new Date().toISOString(),
      });
      saveLocalData('vastu_notifications', notifications);
    }
    return { success: true };
  }

  const { data } = await api.patch(`/bookings/${id}/status`, { status });
  return data;
};
