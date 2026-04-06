export const ADMIN_ROLES = {
  SUPER_ADMIN:           "super_admin",
  PRINCIPAL:             "principal",
  BRANCH_MANAGER:        "branch_manager",
  VERIFICATION_OFFICER:  "verification_officer",
  OFFICER:               "officer",
};

export const ADMIN_ROLE_LABELS = {
  super_admin:          "Super Admin",
  principal:            "Principal",
  branch_manager:       "Branch Manager",
  verification_officer: "Verification Officer",
  officer:              "Officer",
};

export const ADMIN_ROLE_DESCRIPTIONS = {
  super_admin:
    "Full access to all features, branches, and settings.",
  principal:
    "Institution head with read-only visibility across all branches and reports. Does not perform direct document operations or approvals.",
  branch_manager:
    "Manages and monitors all student applications within their assigned branch. Cannot access other branches.",
  verification_officer:
    "Reviews OCR-extracted data, flags mismatches, and marks documents as verified or requiring resubmission. Cannot approve or reject student profiles.",
  officer:
    "Manages physical and digital document repository. Ensures all required documents are received and catalogued. No access to approval functions.",
};

export const ADMIN_ROLE_COLORS = {
  super_admin:          { bg: "#EFF6FF", text: "#1D4ED8", dot: "#3B82F6" },
  principal:            { bg: "#F5F3FF", text: "#6D28D9", dot: "#8B5CF6" },
  branch_manager:       { bg: "#F0FDF4", text: "#15803D", dot: "#22C55E" },
  verification_officer: { bg: "#FFF7ED", text: "#C2410C", dot: "#F97316" },
  officer:              { bg: "#FDF4FF", text: "#86198F", dot: "#D946EF" },
};

export const ADMIN_PERMISSIONS = {
  super_admin: [
    "view_all_students",
    "edit_all_students",
    "verify_documents",
    "flag_documents",
    "request_resubmission",
    "reject_documents",
    "approve_student",
    "reject_student",
    "manage_branches",
    "manage_admins",
    "view_reports",
    "view_cross_branch_reports",
    "export_data",
    "manage_settings",
    "view_document_repository",
    "manage_document_repository",
    "add_verification_notes",
  ],
  principal: [
    "view_all_students",
    "view_cross_branch_reports",
    "view_reports",
    "export_data",
  ],
  branch_manager: [
    "view_branch_students",
    "edit_branch_students",
    "view_branch_verification_status",
    "view_branch_document_status",
    "view_reports",
    "coordinate_branch_workflow",
  ],
  verification_officer: [
    "view_branch_students",
    "review_ocr_data",
    "flag_documents",
    "verify_documents",
    "request_resubmission",
    "add_verification_notes",
  ],
  officer: [
    "view_branch_students",
    "view_document_repository",
    "manage_document_repository",
    "request_resubmission",
    "catalogue_documents",
  ],
};

export const hasPermission = (role, permission) => {
  const perms = ADMIN_PERMISSIONS[role] || [];
  return perms.includes(permission);
};

export const ADMIN_ROLE_LIST = Object.entries(ADMIN_ROLE_LABELS).map(
  ([value, label]) => ({
    value,
    label,
    description: ADMIN_ROLE_DESCRIPTIONS[value],
    color:       ADMIN_ROLE_COLORS[value],
  }),
);