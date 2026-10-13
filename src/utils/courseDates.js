// Course dates are stored as UTC midnight, so format in UTC to keep the calendar day
const formatDay = (date, withYear) =>
  date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    ...(withYear ? { year: 'numeric' } : {}),
    timeZone: 'UTC',
  });

const toDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const isFixedTermCourse = (item) =>
  item?.scheduleType === 'FIXED_TERM' && Boolean(item?.courseStartDate && item?.courseEndDate);

/** e.g. "9 Nov – 30 Nov 2026", or "9 Dec 2026 – 30 Jan 2027" across years */
export const formatCourseDateRange = (start, end) => {
  const startDate = toDate(start);
  const endDate = toDate(end);
  if (!startDate || !endDate) return '';
  const sameYear = startDate.getUTCFullYear() === endDate.getUTCFullYear();
  return `${formatDay(startDate, !sameYear)} – ${formatDay(endDate, true)}`;
};

export const getCourseDateRange = (item) =>
  isFixedTermCourse(item) ? formatCourseDateRange(item.courseStartDate, item.courseEndDate) : '';

export const isCourseEnded = (item) => {
  if (typeof item?.courseEnded === 'boolean') return item.courseEnded;
  if (!isFixedTermCourse(item)) return false;
  const end = toDate(item.courseEndDate);
  const now = new Date();
  const todayUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return end ? end.getTime() < todayUtc : false;
};
