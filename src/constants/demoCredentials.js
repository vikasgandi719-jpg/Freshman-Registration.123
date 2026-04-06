import { BRANCHES } from "./branches";

export const generateDemoCredentials = () => {
  const credentials = [];

  // Super Admin
  credentials.push({
    role:     "Super Admin",
    roleKey:  "super_admin",
    name:     "Super Admin",
    email:    "super@bvritn.ac.in",
    password: "SuperAdmin@123",
    branch:   "All Branches",
  });

  // Principals (3)
  [1, 2, 3].forEach((n) => {
    credentials.push({
      role:     "Principal",
      roleKey:  "principal",
      name:     `Principal ${n}`,
      email:    `principal_${n}@bvritn.ac.in`,
      password: `Principal${n}@123`,
      branch:   "All Branches",
      note:     "Read-only access to all student records and cross-branch reports.",
    });
  });

  // Branch Managers (one per branch)
  BRANCHES.forEach((branch) => {
    credentials.push({
      role:     "Branch Manager",
      roleKey:  "branch_manager",
      name:     `${branch.shortName} Branch Manager`,
      email:    `bm_${branch.id}@bvritn.ac.in`,
      password: `BranchMgr_${branch.shortName}@123`,
      branch:   branch.shortName,
      note:     "Manages all student applications within their assigned branch only.",
    });
  });

  // Verification Officers (3 per branch)
  BRANCHES.forEach((branch) => {
    [1, 2, 3].forEach((n) => {
      credentials.push({
        role:     "Verification Officer",
        roleKey:  "verification_officer",
        name:     `${branch.shortName} Verification Officer ${n}`,
        email:    `vo_${branch.id}_${n}@bvritn.ac.in`,
        password: `VerifyOfficer_${branch.shortName}${n}@123`,
        branch:   branch.shortName,
        note:     "Verifies OCR data, flags mismatches, adds notes. Cannot approve/reject student profiles.",
      });
    });
  });

  // Officers (3 total)
  [1, 2, 3].forEach((n) => {
    credentials.push({
      role:     "Officer",
      roleKey:  "officer",
      name:     `Officer ${n}`,
      email:    `officer_${n}@bvritn.ac.in`,
      password: `Officer${n}@123`,
      branch:   "All Branches",
      note:     "Manages document repository and resubmission requests. No approval access.",
    });
  });

  return credentials;
};

export const CREDENTIALS_MAP = (() => {
  const map = {};
  generateDemoCredentials().forEach((c) => {
    map[c.email.toLowerCase()] = c;
  });
  return map;
})();