const DAY_ORDER = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const createEmptySchedule = () => ({
  id: `sched-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  day: '',
  startTime: '',
  endTime: '',
});

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  const text = String(value).trim();
  if (!text) return [];
  if (text.startsWith('[') && text.endsWith(']')) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // fall through
    }
  }
  return text
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const toTimeInputValue = (value) => {
  const text = String(value || '').trim();
  if (!text) return '';
  if (/^\d{2}:\d{2}$/.test(text)) return text;

  const parsed = new Date(`1970-01-01T${text}`);
  if (Number.isNaN(parsed.getTime())) return '';

  const hours = String(parsed.getHours()).padStart(2, '0');
  const minutes = String(parsed.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const toTimeRangeInputValue = (value) => {
  const text = String(value || '').trim();
  if (!text) return { startTime: '', endTime: '' };

  const parts = text
    .split('-')
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length >= 2) {
    return {
      startTime: toTimeInputValue(parts[0]),
      endTime: toTimeInputValue(parts[1]),
    };
  }

  return { startTime: toTimeInputValue(text), endTime: '' };
};

const sortDays = (days = []) =>
  [...days].sort((a, b) => {
    const ai = DAY_ORDER.indexOf(a);
    const bi = DAY_ORDER.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

export const timeToMinutes = (value) => {
  const normalized = toTimeInputValue(value);
  if (!normalized) return null;
  const [hours, minutes] = normalized.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  return hours * 60 + minutes;
};

export const isEndAfterStart = (startTime, endTime) => {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  if (start == null || end == null) return false;
  return end > start;
};

export const normalizeScheduleRows = (rows = []) =>
  rows
    .map((row) => ({
      id: row?.id || createEmptySchedule().id,
      day: String(row?.day || row?.sessonDay || '').trim(),
      startTime: toTimeInputValue(row?.startTime || row?.timeFrom || ''),
      endTime: toTimeInputValue(row?.endTime || row?.timeTo || ''),
    }))
    .filter((row) => row.day || row.startTime || row.endTime);

export const getValidSchedules = (rows = []) =>
  normalizeScheduleRows(rows).filter(
    (row) => row.day && row.startTime && row.endTime && isEndAfterStart(row.startTime, row.endTime)
  );

const parseScheduleJson = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return normalizeScheduleRows(value);
  if (typeof value === 'string') {
    const text = value.trim();
    if (!text) return [];
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) return normalizeScheduleRows(parsed);
    } catch {
      return [];
    }
  }
  return [];
};

/** Parse "Tuesday 19:00-20:30 | Thursday 18:30-20:00" style strings */
const parseEncodedScheduleLine = (value) => {
  const text = String(value || '').trim();
  if (!text || !text.includes('|')) return [];

  return text
    .split('|')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const match = part.match(/^([A-Za-z]+)\s+(.+)$/);
      if (!match) return null;
      const day = match[1];
      const range = toTimeRangeInputValue(match[2]);
      if (!DAY_ORDER.includes(day) || !range.startTime || !range.endTime) return null;
      return {
        id: createEmptySchedule().id,
        day,
        startTime: range.startTime,
        endTime: range.endTime,
      };
    })
    .filter(Boolean);
};

export const parseSchedulesFromService = (service = {}) => {
  const jsonCandidates = [
    service.sessionSchedules,
    service.schedules,
    service.timeSlots,
  ];

  for (const candidate of jsonCandidates) {
    const parsed = parseScheduleJson(candidate);
    if (parsed.length > 0) {
      return parsed.map((row) => ({ ...row, id: row.id || createEmptySchedule().id }));
    }
  }

  const encoded = parseEncodedScheduleLine(service.timeSlote || service.timeSlots);
  if (encoded.length > 0) return encoded;

  const days = sortDays([
    ...new Set(
      [
        ...toArray(service.availableDays),
        ...toArray(service.sessonDay),
      ]
        .flatMap((day) =>
          String(day || '')
            .split(/\s*(?:&|,|and)\s*/i)
            .map((part) => part.trim())
            .filter(Boolean)
        )
    ),
  ]);

  const range = toTimeRangeInputValue(
    service.timeSlote ||
      (service.timeFrom && service.timeTo
        ? `${service.timeFrom} - ${service.timeTo}`
        : '') ||
      (service.startTime && service.endTime
        ? `${service.startTime} - ${service.endTime}`
        : '')
  );

  const startTime = range.startTime || toTimeInputValue(service.timeFrom || service.startTime);
  const endTime = range.endTime || toTimeInputValue(service.timeTo || service.endTime);

  if (days.length > 0) {
    return days.map((day) => ({
      id: createEmptySchedule().id,
      day,
      startTime,
      endTime,
    }));
  }

  if (startTime || endTime) {
    return [
      {
        id: createEmptySchedule().id,
        day: '',
        startTime,
        endTime,
      },
    ];
  }

  return [createEmptySchedule()];
};

export const formatDaysLabel = (days = []) => {
  const unique = sortDays([...new Set(days.map((d) => String(d || '').trim()).filter(Boolean))]);
  if (unique.length === 0) return '';
  if (unique.length === 1) return unique[0];
  if (unique.length === 2) return `${unique[0]} & ${unique[1]}`;
  return `${unique.slice(0, -1).join(', ')} & ${unique[unique.length - 1]}`;
};

export const formatTime12h = (value) => {
  const normalized = toTimeInputValue(value);
  if (!normalized) return '';

  const [hourStr, minuteStr] = normalized.split(':');
  let hour = Number(hourStr);
  const minutes = minuteStr;
  const suffix = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${minutes} ${suffix}`;
};

export const formatTimeRange12h = (startTime, endTime) => {
  const start = formatTime12h(startTime);
  const end = formatTime12h(endTime);
  if (!start || !end) return [start, end].filter(Boolean).join(' – ');

  const startParts = start.split(' ');
  const endParts = end.split(' ');
  // Same meridiem: "7:00–8:30 PM"
  if (startParts[1] && startParts[1] === endParts[1]) {
    return `${startParts[0]}–${endParts[0]} ${endParts[1]}`;
  }
  return `${start} – ${end}`;
};

export const formatScheduleTimeLine = (rows = []) => {
  const schedules = getValidSchedules(rows);
  if (schedules.length === 0) return '';

  const firstKey = `${schedules[0].startTime}|${schedules[0].endTime}`;
  const allSameTime = schedules.every(
    (row) => `${row.startTime}|${row.endTime}` === firstKey
  );

  if (allSameTime) {
    return formatTimeRange12h(schedules[0].startTime, schedules[0].endTime);
  }

  return schedules
    .map((row) => `${row.day} ${formatTimeRange12h(row.startTime, row.endTime)}`)
    .join(' | ');
};

export const formatScheduleDaysLabel = (rows = []) => {
  const schedules = getValidSchedules(rows);
  return formatDaysLabel(schedules.map((row) => row.day));
};

/** Legacy-friendly combined slot string for APIs that only store one timeSlote */
export const buildLegacyTimeSlote = (rows = []) => {
  const schedules = getValidSchedules(rows);
  if (schedules.length === 0) return '';

  const firstKey = `${schedules[0].startTime}|${schedules[0].endTime}`;
  const allSameTime = schedules.every(
    (row) => `${row.startTime}|${row.endTime}` === firstKey
  );

  if (allSameTime) {
    return `${schedules[0].startTime} - ${schedules[0].endTime}`;
  }

  return schedules
    .map((row) => `${row.day} ${row.startTime}-${row.endTime}`)
    .join(' | ');
};

export const buildSchedulePayload = (rows = []) => {
  const schedules = getValidSchedules(rows).map(({ day, startTime, endTime }) => ({
    day,
    startTime,
    endTime,
  }));

  const availableDays = sortDays([...new Set(schedules.map((row) => row.day))]);
  const first = schedules[0] || { startTime: '', endTime: '' };

  return {
    schedules,
    availableDays,
    sessonDay: formatDaysLabel(availableDays),
    timeFrom: first.startTime || '',
    timeTo: first.endTime || '',
    timeSlote: buildLegacyTimeSlote(rows),
  };
};
