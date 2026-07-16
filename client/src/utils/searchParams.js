export const buildVehicleSearchParams = ({ search = '', city = '', brand = '', fuel = '', transmission = '', ownership = '', minPrice = '', maxPrice = '', sort = '' }) => {
  const params = new URLSearchParams();

  const values = [
    ['search', search],
    ['city', city],
    ['brand', brand],
    ['fuel', fuel],
    ['transmission', transmission],
    ['ownership', ownership],
    ['minPrice', minPrice],
    ['maxPrice', maxPrice],
  ];

  if (sort) params.set('sort', sort);

  values.forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  return params;
};
