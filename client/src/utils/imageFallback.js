// Unsplash photo IDs that are actually relevant to each Indian car brand/model
// All images are free to use (Unsplash licence)

const CAR_IMAGE_MAP = {
  // Maruti Suzuki
  'maruti swift': 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=900&h=600&fit=crop',
  'maruti dzire': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&h=600&fit=crop',
  'maruti baleno': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&h=600&fit=crop',
  'maruti brezza': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=900&h=600&fit=crop',
  'maruti ertiga': 'https://images.unsplash.com/photo-1543465077-db45d34b88a5?w=900&h=600&fit=crop',
  'maruti alto': 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=900&h=600&fit=crop',
  'maruti wagon': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=900&h=600&fit=crop',
  'maruti celerio': 'https://images.unsplash.com/photo-1605559424843-9073c6223949?w=900&h=600&fit=crop',
  'maruti ignis': 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=900&h=600&fit=crop',
  'maruti xl6': 'https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?w=900&h=600&fit=crop',
  'maruti ciaz': 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=900&h=600&fit=crop',
  'maruti s-cross': 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=900&h=600&fit=crop',
  'maruti grand vitara': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=900&h=600&fit=crop',
  'maruti fronx': 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=900&h=600&fit=crop',
  'maruti jimny': 'https://images.unsplash.com/photo-1532581140115-3e355d1ed1de?w=900&h=600&fit=crop',

  // Hyundai
  'hyundai creta': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=900&h=600&fit=crop',
  'hyundai i20': 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=900&h=600&fit=crop',
  'hyundai verna': 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=900&h=600&fit=crop',
  'hyundai venue': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=900&h=600&fit=crop',
  'hyundai tucson': 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=900&h=600&fit=crop',
  'hyundai alcazar': 'https://images.unsplash.com/photo-1626668011687-8a114cf5a34c?w=900&h=600&fit=crop',
  'hyundai ioniq': 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=900&h=600&fit=crop',
  'hyundai exter': 'https://images.unsplash.com/photo-1611016186353-9af58c69a533?w=900&h=600&fit=crop',

  // Tata
  'tata nexon': 'https://images.unsplash.com/photo-1622225345630-59e2bca4a0ba?w=900&h=600&fit=crop',
  'tata harrier': 'https://images.unsplash.com/photo-1613214049841-028981a2eb71?w=900&h=600&fit=crop',
  'tata safari': 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=900&h=600&fit=crop',
  'tata punch': 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=900&h=600&fit=crop',
  'tata altroz': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=900&h=600&fit=crop',
  'tata tiago': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=900&h=600&fit=crop',
  'tata tigor': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&h=600&fit=crop',
  'tata curvv': 'https://images.unsplash.com/photo-1617469767824-848dda9bed73?w=900&h=600&fit=crop',

  // Mahindra
  'mahindra scorpio': 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=900&h=600&fit=crop',
  'mahindra thar': 'https://images.unsplash.com/photo-1532581140115-3e355d1ed1de?w=900&h=600&fit=crop',
  'mahindra xuv700': 'https://images.unsplash.com/photo-1626668011687-8a114cf5a34c?w=900&h=600&fit=crop',
  'mahindra bolero': 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=900&h=600&fit=crop',
  'mahindra xuv300': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=900&h=600&fit=crop',
  'mahindra be 6': 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=900&h=600&fit=crop',
  'mahindra xuv 3xo': 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=900&h=600&fit=crop',

  // Kia
  'kia seltos': 'https://images.unsplash.com/photo-1619362280286-3a2c3893e2c1?w=900&h=600&fit=crop',
  'kia sonet': 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=900&h=600&fit=crop',
  'kia carens': 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=900&h=600&fit=crop',
  'kia ev6': 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=900&h=600&fit=crop',

  // Honda
  'honda city': 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=900&h=600&fit=crop',
  'honda amaze': 'https://images.unsplash.com/photo-1617469767824-848dda9bed73?w=900&h=600&fit=crop',
  'honda elevate': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=900&h=600&fit=crop',

  // Toyota
  'toyota fortuner': 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=900&h=600&fit=crop',
  'toyota innova': 'https://images.unsplash.com/photo-1543465077-db45d34b88a5?w=900&h=600&fit=crop',
  'toyota glanza': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=900&h=600&fit=crop',
  'toyota hyryder': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=900&h=600&fit=crop',
  'toyota hilux': 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=900&h=600&fit=crop',

  // MG
  'mg hector': 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=900&h=600&fit=crop',
  'mg astor': 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=900&h=600&fit=crop',
  'mg zs ev': 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=900&h=600&fit=crop',
  'mg comet': 'https://images.unsplash.com/photo-1611016186353-9af58c69a533?w=900&h=600&fit=crop',

  // VW / Skoda
  'volkswagen taigun': 'https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?w=900&h=600&fit=crop',
  'volkswagen virtus': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&h=600&fit=crop',
  'skoda kushaq': 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=900&h=600&fit=crop',
  'skoda slavia': 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=900&h=600&fit=crop',

  // Others
  'renault kwid': 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=900&h=600&fit=crop',
  'renault triber': 'https://images.unsplash.com/photo-1543465077-db45d34b88a5?w=900&h=600&fit=crop',
  'nissan magnite': 'https://images.unsplash.com/photo-1605559424843-9073c6223949?w=900&h=600&fit=crop',
  'ford ecosport': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&h=600&fit=crop',
  'jeep compass': 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=900&h=600&fit=crop',
  'jeep meridian': 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=900&h=600&fit=crop',

  // Commercial vehicles
  'tata ace': 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=900&h=600&fit=crop',
  'tata ultra': 'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?w=900&h=600&fit=crop',
  'tata prima': 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=900&h=600&fit=crop',
  'tata signa': 'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?w=900&h=600&fit=crop',
  'ashok leyland dost': 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=900&h=600&fit=crop',
  'ashok leyland': 'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?w=900&h=600&fit=crop',
  'mahindra supro': 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=900&h=600&fit=crop',
  'mahindra jeeto': 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=900&h=600&fit=crop',
  'eicher': 'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?w=900&h=600&fit=crop',
  'force': 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=900&h=600&fit=crop',
};

// Diverse car pool for variety (no repeated same stock photo)
const CAR_POOL = [
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&h=600&fit=crop',
  'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=900&h=600&fit=crop',
  'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&h=600&fit=crop',
  'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=900&h=600&fit=crop',
  'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=900&h=600&fit=crop',
  'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=900&h=600&fit=crop',
  'https://images.unsplash.com/photo-1542362567-b07e54358753?w=900&h=600&fit=crop',
  'https://images.unsplash.com/photo-1605559424843-9073c6223949?w=900&h=600&fit=crop',
  'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=900&h=600&fit=crop',
  'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=900&h=600&fit=crop',
  'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=900&h=600&fit=crop',
  'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=900&h=600&fit=crop',
  'https://images.unsplash.com/photo-1617469767824-848dda9bed73?w=900&h=600&fit=crop',
  'https://images.unsplash.com/photo-1622225345630-59e2bca4a0ba?w=900&h=600&fit=crop',
  'https://images.unsplash.com/photo-1626668011687-8a114cf5a34c?w=900&h=600&fit=crop',
  'https://images.unsplash.com/photo-1613214049841-028981a2eb71?w=900&h=600&fit=crop',
  'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=900&h=600&fit=crop',
  'https://images.unsplash.com/photo-1532581140115-3e355d1ed1de?w=900&h=600&fit=crop',
  'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=900&h=600&fit=crop',
  'https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?w=900&h=600&fit=crop',
];

const CV_POOL = [
  'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?w=900&h=600&fit=crop',
  'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=900&h=600&fit=crop',
  'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=900&h=600&fit=crop',
  'https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=900&h=600&fit=crop',
  'https://images.unsplash.com/photo-1530049478892-b84c6b46e4a5?w=900&h=600&fit=crop',
];

// Interior / detail shots for galleries
const INTERIOR_POOL = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=600&fit=crop',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&h=600&fit=crop',
  'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=900&h=600&fit=crop',
  'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=900&h=600&fit=crop',
  'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=900&h=600&fit=crop',
];

function hashStr(str) {
  return str.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
}

export function getFreeImage(brand = '', model = '', category = 'car', vehicleId = '') {
  const brandLower = brand.toLowerCase().trim();
  const modelLower = model.toLowerCase().trim();
  const vehicleIdLower = (vehicleId || '').toLowerCase();

  // Toyota Fortuner variant specific images
  if (brandLower === 'toyota' && modelLower === 'fortuner') {
    if (vehicleIdLower.includes('legender')) {
      return '/src/assets/images/cars/toyota_fortuner_legender.png';
    }
    return '/src/assets/images/cars/toyota_fortuner_standard.png';
  }

  // Toyota Innova Crysta variant specific images
  if (brandLower === 'toyota' && (modelLower === 'innova crysta' || modelLower === 'innova')) {
    if (vehicleIdLower.includes('gx')) {
      return '/src/assets/images/cars/toyota_innova_crysta_gx.png';
    }
    if (vehicleIdLower.includes('zx')) {
      return '/src/assets/images/cars/toyota_innova_crysta_zx.png';
    }
  }


  // Jeep Compass variant specific images
  if (brandLower === 'jeep' && modelLower === 'compass') {
    if (vehicleIdLower.includes('sport')) {
      return '/src/assets/images/cars/jeep_compass_sport.png';
    }
  }

  // Maruti Suzuki Swift variant specific images
  if (brandLower === 'maruti suzuki' && modelLower === 'swift') {
    return '/src/assets/images/cars/maruti_swift.png';
  }

  // Maruti Suzuki Alto variant specific images
  if (brandLower === 'maruti suzuki' && modelLower === 'alto') {
    if (vehicleIdLower.includes('lxi')) {
      return '/src/assets/images/cars/maruti_alto_lxi.png';
    }
    if (vehicleIdLower.includes('vxi')) {
      return '/src/assets/images/cars/maruti_alto_vxi.png';
    }
  }

  // Honda City variant specific images
  if (brandLower === 'honda' && modelLower === 'city') {
    if (vehicleIdLower.includes('v_1.5l') || vehicleIdLower.includes('_v_')) {
      return '/src/assets/images/cars/honda_city_v.png';
    }
  }

  // Hyundai Creta variant specific images
  if (brandLower === 'hyundai' && modelLower === 'creta') {
    if (vehicleIdLower.includes('sx_o') || vehicleIdLower.includes('sxo')) {
      return '/src/assets/images/cars/hyundai_creta_sxo.png';
    }
    return '/src/assets/images/cars/hyundai_creta_sx.png';
  }

  // Hyundai i20 variant specific images
  if (brandLower === 'hyundai' && modelLower === 'i20') {
    if (vehicleIdLower.includes('asta')) {
      return '/src/assets/images/cars/hyundai_i20_asta.png';
    }
    if (vehicleIdLower.includes('magna')) {
      return '/src/assets/images/cars/hyundai_i20_magna.png';
    }
  }

  // Mahindra Thar variant specific images
  if (brandLower === 'mahindra' && modelLower === 'thar') {
    return '/src/assets/images/cars/mahindra_thar.png';
  }

  // Commercial Vehicles fallback images mapping
  if (category === 'commercial') {
    if (brandLower === 'swaraj' || modelLower.includes('744') || modelLower.includes('tractor')) {
      return '/src/assets/images/cv/tractor.png';
    }
    if (brandLower === 'omega seiki' || modelLower.includes('m1ka')) {
      return '/src/assets/images/cv/omega_seiki_m1ka.png';
    }
    if (brandLower === 'mahindra' && (modelLower.includes('zor') || modelLower.includes('ev') || modelLower.includes('grand'))) {
      return '/src/assets/images/cv/mahindra_ev_truck.png';
    }
    if (brandLower === 'tata motors' || modelLower.includes('ace')) {
      return '/src/assets/images/cv/tata_ace_gold.png';
    }
    if (brandLower === 'mahindra' || modelLower.includes('bolero')) {
      return '/src/assets/images/cv/mahindra_bolero.png';
    }
    if (brandLower === 'ashok leyland' || modelLower.includes('dost')) {
      return '/src/assets/images/cv/ashok_leyland_dost.png';
    }
    if (brandLower === 'eicher' || modelLower.includes('pro')) {
      return '/src/assets/images/cv/eicher_pro.png';
    }
    if (brandLower === 'force motors' || modelLower.includes('traveller')) {
      return '/src/assets/images/cv/force_traveller.png';
    }
  }

  const key = `${brand} ${model}`.toLowerCase().trim();

  // 1. Exact brand+model match
  if (CAR_IMAGE_MAP[key]) return CAR_IMAGE_MAP[key];

  // 2. Try model-only match
  const modelKey = Object.keys(CAR_IMAGE_MAP).find((k) => k.includes(model.toLowerCase()) && model.length > 2);
  if (modelKey) return CAR_IMAGE_MAP[modelKey];

  // 3. Brand-only match (first entry for that brand)
  const brandKey = Object.keys(CAR_IMAGE_MAP).find((k) => k.startsWith(brand.toLowerCase()));
  if (brandKey) return CAR_IMAGE_MAP[brandKey];

  // 4. Category pool with deterministic selection via hash
  const pool = (category === 'commercial' || category === 'cv') ? CV_POOL : CAR_POOL;
  const hash = vehicleId ? hashStr(vehicleId) : hashStr(brand + model);
  return pool[hash % pool.length];
}

// Returns 5 gallery images — main shot + different angles/interiors
export function getGalleryImages(brand = '', model = '', category = 'car', vehicleId = '') {
  const mainImage = getFreeImage(brand, model, category, vehicleId);
  const pool = (category === 'commercial' || category === 'cv') ? CV_POOL : CAR_POOL;
  const hash = vehicleId ? hashStr(vehicleId) : hashStr(brand + model);

  // Pick 2 more exterior shots from pool (different indices)
  const ext1 = pool[(hash + 1) % pool.length];
  const ext2 = pool[(hash + 3) % pool.length];

  // Pick 2 interiors
  const int1 = INTERIOR_POOL[hash % INTERIOR_POOL.length];
  const int2 = INTERIOR_POOL[(hash + 2) % INTERIOR_POOL.length];

  // Deduplicate
  const result = [mainImage];
  for (const img of [ext1, ext2, int1, int2]) {
    if (!result.includes(img)) result.push(img);
  }
  return result.slice(0, 5);
}
