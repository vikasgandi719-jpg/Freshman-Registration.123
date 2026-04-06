// ─── Document Types ────────────────────────────────────────────────────────────
export const DOCUMENT_TYPES = {
  PASSPORT_PHOTO: "passport_photo",

  // Schooling (1 to 9 Class)
  SCHOOL_BONAFIDE:  "school_bonafide",

  // Schooling — Intermediate
  INTER_HALL_TICKET: "inter_hall_ticket",
  INTER_MEMO:        "inter_memo",
  INTER_BONAFIDE:    "inter_bonafide",

  // 10th Documentation
  TENTH_MEMO:     "tenth_memo",
  TENTH_BONAFIDE: "tenth_bonafide",

  // EAPCET
  EAPCET_HALL_TICKET: "eapcet_hall_ticket",
  EAPCET_RANK_CARD:   "eapcet_rank_card",

  // JEE Mains
  JEE_HALL_TICKET: "jee_hall_ticket",
  JEE_RANK_CARD:   "jee_rank_card",

  // Other
  CASTE_CERTIFICATE:  "caste_certificate",
  INCOME_CERTIFICATE: "income_certificate",
  AADHAAR_CARD:       "aadhar_card",
};

// ─── Document Groups ───────────────────────────────────────────────────────────
export const DOCUMENT_GROUPS = {
  GENERAL:    "General",
  SCHOOL:     "Schooling (1 to 9 Class)",
  INTER:      "Schooling — Intermediate",
  TENTH:      "10th Documentation",
  EAPCET:     "EAPCET",
  JEE:        "JEE Mains",
  OTHER:      "Other Documents",
};

// ─── Full Document List ────────────────────────────────────────────────────────
export const DOCUMENT_LIST = [
  // ── General ─────────────────────────────────────────────────────────────────
  {
    id: "passport_photo",
    type: DOCUMENT_TYPES.PASSPORT_PHOTO,
    title: "Passport Size Photo",
    description: "Upload your passport size photo. Background must be white. Max file size: 200KB.",
    icon: "📷",
    group: DOCUMENT_GROUPS.GENERAL,
    required: true,
    allowedTypes: ["image/jpeg", "image/png"],
    maxSizeMB: 0.2,
    note: "Background must be white. Max size: 200KB",
  },
  {
    id: "aadhar_card",
    type: DOCUMENT_TYPES.AADHAAR_CARD,
    title: "Aadhaar Card",
    description: "Aadhaar card (front and back)",
    icon: "🪪",
    group: DOCUMENT_GROUPS.GENERAL,
    required: true,
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxSizeMB: 5,
  },

  // ── Schooling (1 to 9 Class) ─────────────────────────────────────────────────
  {
    id: "school_bonafide",
    type: DOCUMENT_TYPES.SCHOOL_BONAFIDE,
    title: "School Bonafide Certificate",
    description: "School bonafide certificate (Class 1–9)",
    icon: "🏫",
    group: DOCUMENT_GROUPS.SCHOOL,
    required: true,
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxSizeMB: 5,
  },

  // ── Schooling — Intermediate ─────────────────────────────────────────────────
  {
    id: "inter_hall_ticket",
    type: DOCUMENT_TYPES.INTER_HALL_TICKET,
    title: "Inter Hall Ticket",
    description: "Intermediate examination hall ticket",
    icon: "🎫",
    group: DOCUMENT_GROUPS.INTER,
    required: true,
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxSizeMB: 5,
  },
  {
    id: "inter_memo",
    type: DOCUMENT_TYPES.INTER_MEMO,
    title: "Inter Memo",
    description: "Intermediate marks memo / certificate",
    icon: "📝",
    group: DOCUMENT_GROUPS.INTER,
    required: true,
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxSizeMB: 5,
  },
  {
    id: "inter_bonafide",
    type: DOCUMENT_TYPES.INTER_BONAFIDE,
    title: "Inter Bonafide Certificate",
    description: "Bonafide certificate from intermediate college",
    icon: "🎓",
    group: DOCUMENT_GROUPS.INTER,
    required: true,
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxSizeMB: 5,
  },

  // ── 10th Documentation ───────────────────────────────────────────────────────
  {
    id: "tenth_memo",
    type: DOCUMENT_TYPES.TENTH_MEMO,
    title: "10th Memo",
    description: "10th / SSC marks memo",
    icon: "📄",
    group: DOCUMENT_GROUPS.TENTH,
    required: true,
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxSizeMB: 5,
  },
  {
    id: "tenth_bonafide",
    type: DOCUMENT_TYPES.TENTH_BONAFIDE,
    title: "10th Bonafide Certificate",
    description: "Bonafide certificate for 10th class",
    icon: "🏫",
    group: DOCUMENT_GROUPS.TENTH,
    required: true,
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxSizeMB: 5,
  },

  // ── EAPCET ───────────────────────────────────────────────────────────────────
  {
    id: "eapcet_hall_ticket",
    type: DOCUMENT_TYPES.EAPCET_HALL_TICKET,
    title: "EAPCET Hall Ticket",
    description: "EAPCET entrance exam hall ticket",
    icon: "🎟️",
    group: DOCUMENT_GROUPS.EAPCET,
    required: true,
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxSizeMB: 5,
  },
  {
    id: "eapcet_rank_card",
    type: DOCUMENT_TYPES.EAPCET_RANK_CARD,
    title: "EAPCET Rank Card",
    description: "EAPCET entrance exam rank card",
    icon: "🏆",
    group: DOCUMENT_GROUPS.EAPCET,
    required: true,
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxSizeMB: 5,
  },

  // ── JEE Mains ────────────────────────────────────────────────────────────────
  {
    id: "jee_hall_ticket",
    type: DOCUMENT_TYPES.JEE_HALL_TICKET,
    title: "JEE Mains Hall Ticket",
    description: "JEE Mains admit card / hall ticket",
    icon: "🎟️",
    group: DOCUMENT_GROUPS.JEE,
    required: false,
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxSizeMB: 5,
  },
  {
    id: "jee_rank_card",
    type: DOCUMENT_TYPES.JEE_RANK_CARD,
    title: "JEE Mains Rank Card",
    description: "JEE Mains result / rank card",
    icon: "🏅",
    group: DOCUMENT_GROUPS.JEE,
    required: false,
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxSizeMB: 5,
  },

  // ── Other ────────────────────────────────────────────────────────────────────
  {
    id: "caste_certificate",
    type: DOCUMENT_TYPES.CASTE_CERTIFICATE,
    title: "Caste Certificate",
    description: "Caste certificate issued by competent authority",
    icon: "📃",
    group: DOCUMENT_GROUPS.OTHER,
    required: false,
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxSizeMB: 2,
  },
  {
    id: "income_certificate",
    type: DOCUMENT_TYPES.INCOME_CERTIFICATE,
    title: "Income Certificate",
    description: "Family income certificate issued by MRO / Tahsildar",
    icon: "💰",
    group: DOCUMENT_GROUPS.OTHER,
    required: false,
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxSizeMB: 2,
  },
];

// ─── Status ────────────────────────────────────────────────────────────────────
export const DOCUMENT_STATUS = {
  NOT_UPLOADED: "not_uploaded",
  PENDING:      "pending",
  APPROVED:     "approved",
  REJECTED:     "rejected",
};

export const DOCUMENT_STATUS_LABELS = {
  not_uploaded: "Not Uploaded",
  pending:      "Pending Review",
  approved:     "Approved",
  rejected:     "Rejected",
};

export const REQUIRED_DOCUMENTS = DOCUMENT_LIST.filter((d) => d.required);
export const OPTIONAL_DOCUMENTS = DOCUMENT_LIST.filter((d) => !d.required);

export const getDocumentById     = (id)   => DOCUMENT_LIST.find((d) => d.id   === id)   || null;
export const getDocumentByType   = (type) => DOCUMENT_LIST.find((d) => d.type === type) || null;
export const getDocumentsByGroup = (group) => DOCUMENT_LIST.filter((d) => d.group === group);