<<<<<<< HEAD
# BVRITN Document Verification App

A React Native (Expo) mobile application for streamlined student document
submission and administrative verification at BVRITN College of Engineering.

---

## Features

### Student
- Register & login with OTP verification
- Upload required documents (PDF / image)
- Track real-time verification status per document
- View profile & verification badge

### Admin
- Secure admin login portal
- Dashboard with live stats & recent activity
- Review, approve, or reject student submissions with reason
- Filter students by branch, status, or search query
- Branch management

---

## Tech Stack

| Layer       | Technology                              |
|-------------|----------------------------------------|
| Framework   | React Native + Expo SDK 50             |
| Navigation  | React Navigation v6 (Stack/Tab/Drawer) |
| State       | React Context + useReducer             |
| Storage     | AsyncStorage                           |
| File upload | expo-document-picker / expo-image-picker |
| HTTP client | fetch (custom api.js wrapper)          |

---

## Project Structure
```
bvritn-document-verification/
├── App.js
├── app.json
├── babel.config.js
├── package.json
└── src/
    ├── assets/
    │   └── images/
    ├── components/
    │   ├── admin/          # AdminSidebar, BranchSelector, SearchFilter,
    │   │                   # StatsCard, StudentTable, VerificationControls
    │   ├── auth/           # DatePicker, OTPInput, PasswordInput
    │   ├── common/         # Avatar, Button, Card, Divider, Header,
    │   │                   # Input, Loading, Modal, StatusBadge
    │   └── student/        # DocumentCard, DocumentStatusList,
    │                       # DocumentUploader, PhotoUploader, ProfileCard
    ├── constants/
    │   ├── adminRoles.js
    │   ├── branches.js
    │   ├── colors.js
    │   ├── config.js
    │   └── documents.js
    ├── context/
    │   ├── AdminContext.js
    │   ├── AuthContext.js
    │   ├── StudentContext.js
    │   └── ThemeContext.js
    ├── hooks/
    │   ├── useAuth.js
    │   ├── useDocuments.js
    │   ├── useForm.js
    │   ├── useOTP.js
    │   └── useStudents.js
    ├── navigation/
    │   ├── AdminNavigator.js
    │   ├── AppNavigator.js
    │   ├── AuthNavigator.js
    │   └── StudentNavigator.js
    ├── screens/
    │   ├── admin/
    │   │   ├── AdminDashboard.js
    │   │   ├── AdminSettingsScreen.js
    │   │   ├── BranchManagementScreen.js
    │   │   ├── StudentDetailScreen.js
    │   │   ├── StudentListScreen.js
    │   │   └── VerificationScreen.js
    │   ├── auth/
    │   │   ├── AdminLoginScreen.js
    │   │   ├── LoginScreen.js
    │   │   ├── OTPVerificationScreen.js
    │   │   ├── RegisterScreen.js
    │   │   └── StartingScreen.js
    │   └── student/
    │       ├── DocumentDetailScreen.js
    │       ├── DocumentUploadScreen.js
    │       ├── ProfileScreen.js
    │       └── StudentDashboard.js
    ├── services/
    │   ├── adminService.js
    │   ├── api.js
    │   ├── authService.js
    │   ├── documentService.js
    │   ├── otpService.js
    │   └── studentService.js
    ├── styles/
    │   ├── globalStyles.js
    │   └── theme.js
    └── utils/
        ├── formatters.js
        ├── helpers.js
        ├── storage.js
        └── validators.js
```

---

## Getting Started

### Prerequisites
- Node.js >= 18
- Expo CLI: `npm install -g expo-cli`
- Android Studio or Xcode (for emulators)

### Install
```bash
git clone https://github.com/your-org/bvritn-document-verification.git
cd bvritn-document-verification
npm install
```

### Configure API

Edit `src/constants/config.js` and update the base URL:
```js
export const API = {
  BASE_URL: 'https://your-backend-api.com/v1',
  ...
};
```

### Run
```bash
# Start Expo dev server
npm start

# Android emulator
npm run android

# iOS simulator
npm run ios
```

---

## Environment

| Variable       | Description                  |
|----------------|------------------------------|
| `API.BASE_URL` | Backend REST API base URL    |
| `OTP.LENGTH`   | OTP digit length (default 6) |

---

## Build for Production
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure
eas build:configure

# Build Android APK / AAB
npm run build:android

# Build iOS IPA
npm run build:ios
```

---

## Permissions

| Permission              | Platform       | Purpose                        |
|-------------------------|----------------|--------------------------------|
| CAMERA                  | Android + iOS  | Capture document photos        |
| READ_EXTERNAL_STORAGE   | Android        | Select files for upload        |
| NSPhotoLibraryUsage     | iOS            | Access photo library           |

---

## License

© 2024 BVRITN College of Engineering. All rights reserved.
=======
# Freshman-Registration.1
>>>>>>> 1cc134f08e787383c9cba46cd288a49f0f807f84
