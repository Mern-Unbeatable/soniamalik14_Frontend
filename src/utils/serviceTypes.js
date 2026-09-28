export const SERVICE_TYPE_OPTIONS = [
  'Physiotherapy & Injury Recovery',
  'Nutrition',
  'Personal Training',
  'Sports Massage',
  'Strength & Conditioning',
  'Mental Health & Wellbeing',
  'Sports Coaching',
  'Other',
];

export const ALL_SERVICES_FILTER = 'All services';

export const SERVICE_FILTER_OPTIONS = [ALL_SERVICES_FILTER, ...SERVICE_TYPE_OPTIONS];

const SERVICE_TYPE_ALIASES = {
  physiotherapy: 'Physiotherapy & Injury Recovery',
  'physiotherapy & injury recovery': 'Physiotherapy & Injury Recovery',
  physios: 'Physiotherapy & Injury Recovery',
  physio: 'Physiotherapy & Injury Recovery',
  nutrition: 'Nutrition',
  'personal training': 'Personal Training',
  'sports massage': 'Sports Massage',
  'sports massage therapist': 'Sports Massage',
  'strength & conditioning': 'Strength & Conditioning',
  'strength and conditioning': 'Strength & Conditioning',
  'mental health & wellbeing': 'Mental Health & Wellbeing',
  'mental health and wellbeing': 'Mental Health & Wellbeing',
  'mental wellbeing': 'Mental Health & Wellbeing',
  'mental health': 'Mental Health & Wellbeing',
  wellbeing: 'Mental Health & Wellbeing',
  coaching: 'Sports Coaching',
  'sports coaching': 'Sports Coaching',
  '1:1 coaching': 'Sports Coaching',
  '1-1 coaching': 'Sports Coaching',
  other: 'Other',
};

export const normalizeServiceType = (value) => {
  const text = String(value || '').trim();
  if (!text) return '';

  const exact = SERVICE_TYPE_OPTIONS.find(
    (option) => option.toLowerCase() === text.toLowerCase()
  );
  if (exact) return exact;

  return SERVICE_TYPE_ALIASES[text.toLowerCase()] || text;
};

export const toServiceTypeOption = (value) => {
  const normalized = normalizeServiceType(value);
  return SERVICE_TYPE_OPTIONS.includes(normalized) ? normalized : '';
};

export const isAllServicesFilter = (value) => {
  const selected = String(value || '').trim().toLowerCase();
  return !selected || selected === 'all' || selected === 'all services' || selected === 'services';
};

export const serviceTypeMatchesFilter = (itemType, selectedFilter) => {
  if (isAllServicesFilter(selectedFilter)) return true;
  return normalizeServiceType(itemType) === normalizeServiceType(selectedFilter);
};
