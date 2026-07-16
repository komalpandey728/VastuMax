import test from 'node:test';
import assert from 'node:assert/strict';
import { buildVehicleSearchParams } from './searchParams.js';

test('buildVehicleSearchParams maps hero search input to catalog filters', () => {
  const params = buildVehicleSearchParams({
    search: 'Model S',
    city: 'Pune',
  });

  assert.equal(params.get('search'), 'Model S');
  assert.equal(params.get('city'), 'Pune');
});

test('buildVehicleSearchParams omits empty values', () => {
  const params = buildVehicleSearchParams({ search: '', city: '' });
  assert.equal(params.toString(), '');
});
