// ─── Date formatters ───────────────────────────────────────────────────────────
export const formatDate = (dateStr, options = {}) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Invalid Date';
  return date.toLocaleDateString('en-IN', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
    ...options,
  });
};

export const formatDateLong = (dateStr) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Invalid Date';
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    day:     '2-digit',
    month:   'long',
    year:    'numeric',
  });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Invalid Date';
  return date.toLocaleString('en-IN', {
    day:    '2-digit',
    month:  'short',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  });
};

export const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('en-IN', {
    hour:   '2-digit',
    minute: '2-digit',
  });
};

export const formatRelativeTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now  = new Date();
  const diff = Math.floor((now - date) / 1000); // seconds

  if (diff < 60)     return 'Just now';
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(dateStr);
};

export const formatDateForInput = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const day   = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year  = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatDateISO = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0]; // YYYY-MM-DD
};

// ─── Name formatters ───────────────────────────────────────────────────────────
export const formatName = (name = '') => {
  return name
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

export const getInitials = (name = '', max = 2) => {
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, max);
};

export const getFirstName = (name = '') => {
  return name.trim().split(' ')[0] || name;
};

// ─── Phone formatters ──────────────────────────────────────────────────────────
export const formatPhone = (phone = '') => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10)
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  if (digits.length === 12 && digits.startsWith('91'))
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  return phone;
};

export const maskPhone = (phone = '') => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10)
    return `${digits.slice(0, 2)}xxxxxx${digits.slice(8)}`;
  return phone.replace(/\d(?=\d{4})/g, 'x');
};

// ─── Email formatter ──────────────────────────────────────────────────────────
export const maskEmail = (email = '') => {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  const visible = local.slice(0, 2);
  const masked  = '*'.repeat(Math.max(local.length - 2, 3));
  return `${visible}${masked}@${domain}`;
};

// ─── File size formatter ───────────────────────────────────────────────────────
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  if (bytes < 1024)          return `${bytes} B`;
  if (bytes < 1024 * 1024)   return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// ─── Currency formatter ───────────────────────────────────────────────────────
export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style:    'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

// ─── Number formatter ─────────────────────────────────────────────────────────
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000)   return `${(num / 100000).toFixed(1)}L`;
  if (num >= 1000)     return `${(num / 1000).toFixed(1)}K`;
  return String(num);
};

// ─── Status label formatter ───────────────────────────────────────────────────
export const formatStatus = (status = '') => {
  const map = {
    not_uploaded: 'Not Uploaded',
    pending:      'Pending Review',
    approved:     'Approved',
    rejected:     'Rejected',
    incomplete:   'Incomplete',
    active:       'Active',
    inactive:     'Inactive',
    verified:     'Verified',
  };
  return (
    map[status] ||
    status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  );
};

// ─── Roll number ──────────────────────────────────────────────────────────────
export const formatRollNumber = (roll = '') => {
  return roll.trim().toUpperCase();
};

// ─── Percentage ───────────────────────────────────────────────────────────────
export const formatPercent = (value, total) => {
  if (!total || total === 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
};

// ─── Truncate text ────────────────────────────────────────────────────────────
export const truncate = (text = '', maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
};

export const truncateMiddle = (text = '', maxLength = 20) => {
  if (!text || text.length <= maxLength) return text;
  const half = Math.floor(maxLength / 2);
  return `${text.slice(0, half)}…${text.slice(-half)}`;
};