import { Platform, Alert, Share } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Clipboard from "expo-clipboard";

const CSV_COLUMNS = [
  { key: "uniqueId",           label: "Unique ID" },
  { key: "name",               label: "Full Name" },
  { key: "firstName",          label: "First Name" },
  { key: "lastName",           label: "Last Name" },
  { key: "branchCode",         label: "Branch" },
  { key: "interhallTicket",    label: "Interhall Ticket" },
  { key: "parentPhone",        label: "Parent Phone" },
  { key: "phone",              label: "Student Phone" },
  { key: "email",              label: "Email" },
  { key: "address",            label: "Address" },
  { key: "dob",                label: "Date of Birth" },
  { key: "verificationStatus", label: "Status" },
  { key: "rejectionReason",    label: "Rejection Reason" },
  { key: "fatherName",         label: "Father Name" },
  { key: "fatherPhone",        label: "Father Phone" },
  { key: "motherName",         label: "Mother Name" },
  { key: "motherPhone",        label: "Mother Phone" },
  { key: "emacetHallTicket",   label: "EAPCET Hall Ticket" },
  { key: "emacetRank",         label: "EAPCET Rank" },
  { key: "createdAt",          label: "Registered At" },
  { key: "documentCount",      label: "Uploaded Docs" },
];

const escapeCsv = (val) => {
  if (val === null || val === undefined) return "";
  const s = String(val);
  if (s.includes(",") || s.includes("\n") || s.includes('"')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
};

const rowToCsv = (student) => {
  const enriched = {
    ...student,
    documentCount: Array.isArray(student.documents) ? student.documents.length : 0,
  };
  return CSV_COLUMNS.map((col) => escapeCsv(enriched[col.key])).join(",");
};

const buildCsv = (students) => {
  const header = CSV_COLUMNS.map((c) => c.label).join(",");
  const body = students.map(rowToCsv).join("\n");
  return `${header}\n${body}`;
};

const timestamp = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;
};

const downloadOnWeb = (csv, filename) => {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 200);
};

const downloadOnNative = async (csv, filename) => {
  try {
    const path = `${FileSystem.documentDirectory}${filename}`;
    await FileSystem.writeAsStringAsync(path, csv, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    await Share.share({
      title: filename,
      message: `Student export ready at:\n${path}`,
      url: path,
    });
  } catch (e) {
    // Last resort — copy the CSV text to clipboard
    await Clipboard.setStringAsync(csv);
    Alert.alert(
      "Export saved to clipboard",
      "Couldn't open share sheet, so the CSV data was copied to your clipboard.",
    );
  }
};

const exportService = {
  exportStudentsToCsv: async (students, { filenamePrefix = "students" } = {}) => {
    if (!Array.isArray(students) || students.length === 0) {
      Alert.alert("Nothing to export", "The student list is empty.");
      return { success: false, reason: "empty" };
    }
    const csv = buildCsv(students);
    const filename = `${filenamePrefix}_${timestamp()}.csv`;

    if (Platform.OS === "web") {
      downloadOnWeb(csv, filename);
    } else {
      await downloadOnNative(csv, filename);
    }

    return { success: true, filename, count: students.length };
  },

  exportStudentsToJson: async (students, { filenamePrefix = "students" } = {}) => {
    if (!Array.isArray(students) || students.length === 0) {
      Alert.alert("Nothing to export", "The student list is empty.");
      return { success: false, reason: "empty" };
    }
    const json = JSON.stringify(students, null, 2);
    const filename = `${filenamePrefix}_${timestamp()}.json`;

    if (Platform.OS === "web") {
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 200);
    } else {
      try {
        const path = `${FileSystem.documentDirectory}${filename}`;
        await FileSystem.writeAsStringAsync(path, json);
        await Share.share({ title: filename, url: path });
      } catch (e) {
        await Clipboard.setStringAsync(json);
        Alert.alert("Copied to clipboard", "Export shared via clipboard.");
      }
    }
    return { success: true, filename, count: students.length };
  },

  buildCsv,
  CSV_COLUMNS,
};

export default exportService;
