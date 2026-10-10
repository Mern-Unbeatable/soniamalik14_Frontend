// Some saved profiles hold arrays as nested JSON strings (e.g. ['["[\\"Other\\"]"]']),
// so unwrap until plain names remain.
export const normalizeStringList = (value) => {
  if (value === null || value === undefined) return [];

  if (Array.isArray(value)) {
    return [...new Set(value.flatMap((item) => normalizeStringList(item)))];
  }

  const text = String(value).trim();
  if (!text) return [];

  if (text.startsWith('[') || text.startsWith('"')) {
    try {
      return normalizeStringList(JSON.parse(text));
    } catch {
      // Not valid JSON; treat as plain text
    }
  }

  return text
    .split(',')
    .map((item) => item.trim().replace(/^["'\\[\]]+|["'\\[\]]+$/g, '').trim())
    .filter(Boolean);
};
