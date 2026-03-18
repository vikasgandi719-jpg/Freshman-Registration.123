import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const YEARS = Array.from(
  { length: 30 },
  (_, i) => new Date().getFullYear() - i,
);

const DatePicker = ({
  label = "Date of Birth",
  value = null,
  onChange,
  placeholder = "Select date",
  error = null,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const getInitialValues = () => {
    if (value) {
      return {
        day: value.getDate(),
        month: value.getMonth(),
        year: value.getFullYear(),
      };
    }
    return { day: 1, month: 0, year: YEARS[0] };
  };

  const [selected, setSelected] = useState(getInitialValues);

  const formatDisplay = (date) => {
    if (!date) return null;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleConfirm = () => {
    const newDate = new Date(selected.year, selected.month, selected.day);
    if (onChange) {
      onChange(newDate);
    }
    setShowPicker(false);
  };

  const handleCancel = () => {
    setSelected(getInitialValues());
    setShowPicker(false);
  };

  const handleOpen = () => {
    setSelected(getInitialValues());
    setShowPicker(true);
  };

  const renderOptionList = (options, selectedValue, onSelect, label) => (
    <View style={styles.optionColumn}>
      <Text style={styles.optionLabel}>{label}</Text>
      <ScrollView
        style={styles.optionList}
        showsVerticalScrollIndicator={false}
      >
        {options.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.optionItem,
              selectedValue === item && styles.optionItemSelected,
            ]}
            onPress={() => onSelect(item)}
          >
            <Text
              style={[
                styles.optionText,
                selectedValue === item && styles.optionTextSelected,
              ]}
            >
              {typeof item === "number" && label === "Day"
                ? String(item).padStart(2, "0")
                : item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TouchableOpacity
        style={[styles.selector, error ? styles.selectorError : null]}
        onPress={handleOpen}
      >
        <Text style={styles.calIcon}>📅</Text>
        <Text style={[styles.selectorText, !value ? styles.placeholder : null]}>
          {value ? formatDisplay(value) : placeholder}
        </Text>
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>⚠ {error}</Text> : null}

      <Modal
        visible={showPicker}
        transparent
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={styles.overlay}>
          <View style={styles.pickerContainer}>
            <View style={styles.header}>
              <TouchableOpacity onPress={handleCancel}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Select Date</Text>
              <TouchableOpacity onPress={handleConfirm}>
                <Text style={styles.doneText}>Done</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.pickerBody}>
              {renderOptionList(
                DAYS,
                selected.day,
                (day) => setSelected({ ...selected, day }),
                "Day",
              )}
              {renderOptionList(
                MONTHS,
                selected.month,
                (month) => setSelected({ ...selected, month }),
                "Month",
              )}
              {renderOptionList(
                YEARS,
                selected.year,
                (year) => setSelected({ ...selected, year }),
                "Year",
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 6 },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  selectorError: { borderColor: "#EF4444" },
  calIcon: { fontSize: 18, marginRight: 10 },
  selectorText: { flex: 1, fontSize: 14, color: "#1E293B", fontWeight: "500" },
  placeholder: { color: "#94A3B8" },
  errorText: { fontSize: 12, color: "#EF4444", marginTop: 4 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "50%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerTitle: { fontSize: 16, fontWeight: "600", color: "#1E293B" },
  cancelText: { fontSize: 16, color: "#64748B" },
  doneText: { fontSize: 16, color: "#1D4ED8", fontWeight: "600" },
  pickerBody: {
    flexDirection: "row",
    padding: 10,
    height: 250,
  },
  optionColumn: { flex: 1, marginHorizontal: 5 },
  optionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    textAlign: "center",
    marginBottom: 8,
  },
  optionList: { flex: 1 },
  optionItem: {
    padding: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  optionItemSelected: { backgroundColor: "#1D4ED8" },
  optionText: { fontSize: 14, color: "#1E293B" },
  optionTextSelected: { color: "#fff", fontWeight: "600" },
});

export default DatePicker;
