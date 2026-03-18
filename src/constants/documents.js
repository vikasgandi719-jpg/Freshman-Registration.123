export const DOCUMENT_TYPES = {
  PASSPORT_PHOTO: "passport_photo",
  INTER_HALL_TICKET: "inter_hall_ticket",
  INTER_MEMO: "inter_memo",
  TENTH_MEMO: "tenth_memo",
  SCHOOL_BONAFIDE: "school_bonafide",
  INTER_BONAFIDE: "inter_bonafide",
  EMACET_RANK_CARD: "emacet_rank_card",
  EMACET_HALL_TICKET: "emacet_hall_ticket",
  CASTE_CERTIFICATE: "caste_certificate",
  INCOME_CERTIFICATE: "income_certificate",
  AADHAAR_CARD: "aadhar_card",
};

export const DOCUMENT_LIST = [
  {
    id: "passport_photo",
    type: "passport_photo",
    title: "Passport Size Photo",
    description:
      "Upload your passport size photo. Background must be white. Max file size: 200KB.",
    icon: "📷",
    required: true,
    allowedTypes: ["image/jpeg", "image/png"],
    maxSizeMB: 0.2,
    note: "Background must be white. Max size: 200KB",
  },
  {
    id: "inter_hall_ticket",
    type: DOCUMENT_TYPES.INTER_HALL_TICKET,
    title: "Inter Hall Ticket",
    description: "Your intermediate examination hall ticket",
    icon: "🎫",
    required: true,
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxSizeMB: 5,
  },
  {
    id: "inter_memo",
    type: "inter_memo",
    title: "Inter Memo",
    description: "Your intermediate marks memo / certificate",
    icon: "📝",
    required: true,
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxSizeMB: 5,
  },
  {
    id: "tenth_memo",
    type: DOCUMENT_TYPES.TENTH_MEMO,
    title: "10th SSC Memo",
    description: "10th class marks memo / certificate",
    icon: "📜",
    required: true,
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxSizeMB: 5,
  },
  {
    id: "school_bonafide",
    type: DOCUMENT_TYPES.SCHOOL_BONAFIDE,
    title: "School Bonafide (Class 4-10)",
    description: "School bonafide certificate for class 4 to 10th",
    icon: "🏫",
    required: true,
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxSizeMB: 5,
  },
  {
    id: "inter_bonafide",
    type: DOCUMENT_TYPES.INTER_BONAFIDE,
    title: "Inter College Bonafide",
    description: "Bonafide certificate from intermediate college",
    icon: "🎓",
    required: true,
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxSizeMB: 5,
  },
  {
    id: "emacet_rank_card",
    type: DOCUMENT_TYPES.EMACET_RANK_CARD,
    title: "EMACET Rank Card",
    description: "EMACET entrance exam rank card",
    icon: "🏆",
    required: true,
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxSizeMB: 5,
  },
  {
    id: "emacet_hall_ticket",
    type: DOCUMENT_TYPES.EMACET_HALL_TICKET,
    title: "EMACET Hall Ticket",
    description: "EMACET entrance exam hall ticket",
    icon: "🎟️",
    required: true,
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxSizeMB: 5,
  },
  {
    id: "caste_certificate",
    type: DOCUMENT_TYPES.CASTE_CERTIFICATE,
    title: "Caste Certificate",
    description: "Caste certificate issued by competent authority",
    icon: "📃",
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
    required: false,
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxSizeMB: 2,
  },
  {
    id: "aadhar_card",
    type: DOCUMENT_TYPES.AADHAAR_CARD,
    title: "Aadhaar Card",
    description: "Aadhaar card (front and back)",
    icon: "🪪",
    required: true,
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxSizeMB: 5,
  },
];

export const DOCUMENT_STATUS = {
  NOT_UPLOADED: "not_uploaded",
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export const DOCUMENT_STATUS_LABELS = {
  not_uploaded: "Not Uploaded",
  pending: "Pending Review",
  approved: "Approved",
  rejected: "Rejected",
};

export const REQUIRED_DOCUMENTS = DOCUMENT_LIST.filter((d) => d.required);
export const OPTIONAL_DOCUMENTS = DOCUMENT_LIST.filter((d) => !d.required);

export const getDocumentById = (id) =>
  DOCUMENT_LIST.find((d) => d.id === id) || null;
export const getDocumentByType = (type) =>
  DOCUMENT_LIST.find((d) => d.type === type) || null;
