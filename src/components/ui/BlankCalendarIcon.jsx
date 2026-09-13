/** Colorful blank calendar — no date number (avoids looking like “the 17th”). */
const BlankCalendarIcon = ({ className = 'mt-0.5 h-4 w-4 shrink-0' }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <rect x="3" y="4" width="18" height="17" rx="3" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1" />
    <path d="M3 7.5c0-1.7 1.3-3 3-3h12c1.7 0 3 1.3 3 3V9H3V7.5z" fill="#EF4444" />
    <rect x="7" y="2.5" width="2" height="4" rx="1" fill="#6B7280" />
    <rect x="15" y="2.5" width="2" height="4" rx="1" fill="#6B7280" />
    <rect x="6.5" y="12" width="3" height="2.5" rx="0.5" fill="#E5E7EB" />
    <rect x="10.5" y="12" width="3" height="2.5" rx="0.5" fill="#E5E7EB" />
    <rect x="14.5" y="12" width="3" height="2.5" rx="0.5" fill="#E5E7EB" />
    <rect x="6.5" y="16" width="3" height="2.5" rx="0.5" fill="#E5E7EB" />
    <rect x="10.5" y="16" width="3" height="2.5" rx="0.5" fill="#E5E7EB" />
    <rect x="14.5" y="16" width="3" height="2.5" rx="0.5" fill="#E5E7EB" />
  </svg>
);

export default BlankCalendarIcon;
