const WOMEN_ONLY_LABEL = 'Women only';
const MIXED_LABEL = 'Mixed, women welcome';

export const toWomensOnlyBoolean = (value, fallback = true) => {
  if (typeof value === 'boolean') return value;

  const text = String(value ?? '').trim().toLowerCase();
  if (!text) return fallback;

  if (text.includes('mixed') || text.includes('women welcome')) return false;
  if (
    text === 'true' ||
    text === 'yes' ||
    text === 'women only' ||
    text === 'women-only' ||
    text === 'women_only' ||
    text.includes('women only') ||
    text.includes('women-only')
  ) {
    return true;
  }
  if (text === 'false' || text === 'no') return false;

  return fallback;
};

export const getWhoCanTakePartLabel = (event) => {
  const who = String(event?.whoCanTakePart || '').trim().toLowerCase();
  if (who.includes('mixed') || who.includes('women welcome')) return MIXED_LABEL;
  if (
    who.includes('women only') ||
    who.includes('women-only') ||
    who === 'women_only'
  ) {
    return WOMEN_ONLY_LABEL;
  }

  const flag = event?.womenOnly ?? event?.womensOnly;
  if (flag === undefined || flag === null || String(flag).trim() === '') {
    return '';
  }

  return toWomensOnlyBoolean(flag, true) ? WOMEN_ONLY_LABEL : MIXED_LABEL;
};
