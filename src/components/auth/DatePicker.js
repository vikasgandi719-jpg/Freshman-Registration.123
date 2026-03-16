import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal, FlatList,
} from 'react-native';

/**
 * DatePicker
 * Props:
 *  - label: string
 *  - value: Date | null
 *  - onChange: (date: Date) => void
 *  - placeholder: string
 *  - minimumDate: Date | null
 *  - maximumDate: Date | null
 *  - error: string | null
 */

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

const DAYS_OF_WEEK = ['Su','Mo','Tu','We','Th','Fr','Sa'];

const DatePicker = ({
  label = 'Date of Birth',
  value = null,
  onChange,
  placeholder = 'Select date',
  minimumDate = null,
  maximumDate = null,
  error = null,
}) => {
  const today = new Date();
  const [visible, setVisible]       = useState(false);
  const [viewMonth, setViewMonth]   = useState(value ? value.getMonth() : today.getMonth());
  const [viewYear, setViewYear]     = useState(value ? value.getFullYear() : today.getFullYear());
  const [mode, setMode]             = useState('day'); // 'day' | 'month' | 'year'

  const formatDisplay = (date) => {
    if (!date) return null;
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const isDisabled = (day) => {
    const d = new Date(viewYear, viewMonth, day);
    if (minimumDate && d < minimumDate) return true;
    if (maximumDate && d > maximumDate) return true;
    return false;
  };

  const isSelected = (day) => {
    if (!value) return false;
    return (
      value.getDate() === day &&
      value.getMonth() === viewMonth &&
      value.getFullYear() === viewYear
    );
  };

  const isToday = (day) => {
    return (
      today.getDate() === day &&
      today.getMonth() === viewMonth &&
      today.getFullYear() === viewYear
    );
  };

  const handleDayPress = (day) => {
    if (isDisabled(day)) return;
    const selected = new Date(viewYear, viewMonth, day);
    onChange && onChange(selected);
    setVisible(false);
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const renderDays = () => {
    const totalDays = getDaysInMonth(viewMonth, viewYear);
    const firstDay  = getFirstDayOfMonth(viewMonth, viewYear);
    const cells = [];

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= totalDays; d++) cells.push(d);

    return cells;
  };

  const yearRange = [];
  const baseYear = maximumDate ? maximumDate.getFullYear() : today.getFullYear();
  for (let y = baseYear; y >= baseYear - 100; y--) yearRange.push(y);

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TouchableOpacity
        style={[styles.selector, error && styles.selectorError, visible && styles.selectorFocused]}
        onPress={() => setVisible(true)}
        activeOpacity={0.85}
      >
        <Text style={styles.calIcon}>📅</Text>
        <Text style={[styles.selectorText, !value && styles.placeholder]}>
          {value ? formatDisplay(value) : placeholder}
        </Text>
        <Text style={styles.chevron}>▼</Text>
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>⚠ {error}</Text> : null}

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setVisible(false)}>
          <View style={styles.pickerCard} onStartShouldSetResponder={() => true}>

            {/* Header */}
            <View style={styles.pickerHeader}>
              <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
                <Text style={styles.navBtnText}>‹</Text>
              </TouchableOpacity>

              <View style={styles.headerCenter}>
                <TouchableOpacity onPress={() => setMode(mode === 'month' ? 'day' : 'month')}>
                  <Text style={styles.headerMonth}>{MONTHS[viewMonth]}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setMode(mode === 'year' ? 'day' : 'year')}>
                  <Text style={styles.headerYear}>{viewYear}</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
                <Text style={styles.navBtnText}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Month picker */}
            {mode === 'month' && (
              <View style={styles.monthGrid}>
                {MONTHS.map((m, i) => (
                  <TouchableOpacity
                    key={m}
                    style={[styles.monthCell, viewMonth === i && styles.monthCellActive]}
                    onPress={() => { setViewMonth(i); setMode('day'); }}
                  >
                    <Text style={[styles.monthCellText, viewMonth === i && styles.monthCellTextActive]}>
                      {m.slice(0, 3)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Year picker */}
            {mode === 'year' && (
              <FlatList
                data={yearRange}
                keyExtractor={(y) => String(y)}
                style={styles.yearList}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.yearItem, viewYear === item && styles.yearItemActive]}
                    onPress={() => { setViewYear(item); setMode('day'); }}
                  >
                    <Text style={[styles.yearItemText, viewYear === item && styles.yearItemTextActive]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}

            {/* Day picker */}
            {mode === 'day' && (
              <>
                {/* Day of week headers */}
                <View style={styles.dowRow}>
                  {DAYS_OF_WEEK.map((d) => (
                    <Text key={d} style={styles.dowText}>{d}</Text>
                  ))}
                </View>

                {/* Days grid */}
                <View style={styles.daysGrid}>
                  {renderDays().map((day, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.dayCell,
                        day && isSelected(day) && styles.dayCellSelected,
                        day && isToday(day) && !isSelected(day) && styles.dayCellToday,
                        day && isDisabled(day) && styles.dayCellDisabled,
                      ]}
                      onPress={() => day && handleDayPress(day)}
                      disabled={!day || isDisabled(day)}
                    >
                      {day ? (
                        <Text style={[
                          styles.dayText,
                          isSelected(day) && styles.dayTextSelected,
                          isToday(day) && !isSelected(day) && styles.dayTextToday,
                          isDisabled(day) && styles.dayTextDisabled,
                        ]}>
                          {day}
                        </Text>
                      ) : null}
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {/* Footer */}
            <View style={styles.pickerFooter}>
              <TouchableOpacity onPress={() => setVisible(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { handleDayPress(today.getDate()); setViewMonth(today.getMonth()); setViewYear(today.getFullYear()); }}
                style={styles.todayBtn}
              >
                <Text style={styles.todayBtnText}>Today</Text>
              </TouchableOpacity>
            </View>

          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  selector: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F8FAFC', borderWidth: 1.5, borderColor: '#E2E8F0',
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13,
  },
  selectorError:   { borderColor: '#EF4444' },
  selectorFocused: { borderColor: '#1D4ED8' },
  calIcon: { fontSize: 18, marginRight: 10 },
  selectorText: { flex: 1, fontSize: 14, color: '#1E293B', fontWeight: '500' },
  placeholder: { color: '#94A3B8' },
  chevron: { fontSize: 11, color: '#94A3B8' },
  errorText: { fontSize: 12, color: '#EF4444', marginTop: 4 },
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center', paddingHorizontal: 20,
  },
  pickerCard: {
    backgroundColor: '#FFFFFF', borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2, shadowRadius: 24, elevation: 12,
  },
  pickerHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 16,
    backgroundColor: '#1D4ED8',
  },
  navBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  navBtnText: { fontSize: 22, color: '#FFFFFF', fontWeight: '700' },
  headerCenter: { flexDirection: 'row', gap: 8 },
  headerMonth: { fontSize: 17, fontWeight: '700', color: '#FFFFFF' },
  headerYear: { fontSize: 17, fontWeight: '400', color: '#BFDBFE' },
  dowRow: { flexDirection: 'row', paddingHorizontal: 12, paddingTop: 14, paddingBottom: 6 },
  dowText: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '600', color: '#94A3B8' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, paddingBottom: 10 },
  dayCell: { width: '14.28%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 100 },
  dayCellSelected: { backgroundColor: '#1D4ED8' },
  dayCellToday: { borderWidth: 1.5, borderColor: '#1D4ED8' },
  dayCellDisabled: { opacity: 0.3 },
  dayText: { fontSize: 13, color: '#1E293B', fontWeight: '500' },
  dayTextSelected: { color: '#FFFFFF', fontWeight: '700' },
  dayTextToday: { color: '#1D4ED8', fontWeight: '700' },
  dayTextDisabled: { color: '#CBD5E1' },
  monthGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 16, gap: 8 },
  monthCell: { width: '30%', paddingVertical: 10, borderRadius: 10, alignItems: 'center', backgroundColor: '#F1F5F9' },
  monthCellActive: { backgroundColor: '#1D4ED8' },
  monthCellText: { fontSize: 13, color: '#334155', fontWeight: '600' },
  monthCellTextActive: { color: '#FFFFFF' },
  yearList: { height: 220 },
  yearItem: { paddingVertical: 12, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  yearItemActive: { backgroundColor: '#EFF6FF' },
  yearItemText: { fontSize: 15, color: '#334155', fontWeight: '500' },
  yearItemTextActive: { color: '#1D4ED8', fontWeight: '700' },
  pickerFooter: {
    flexDirection: 'row', justifyContent: 'flex-end', gap: 10,
    paddingHorizontal: 16, paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: '#F1F5F9',
  },
  cancelBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, backgroundColor: '#F1F5F9' },
  cancelBtnText: { fontSize: 13, color: '#64748B', fontWeight: '600' },
  todayBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, backgroundColor: '#1D4ED8' },
  todayBtnText: { fontSize: 13, color: '#FFFFFF', fontWeight: '700' },
});

export default DatePicker;