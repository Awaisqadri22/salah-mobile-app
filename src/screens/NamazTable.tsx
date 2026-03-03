import React, { useCallback, useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  PRAYERS,
  completionKey,
  formatDateKey,
  getDaysInMonth,
  MONTH_NAMES,
  type CompletionsMap,
  type QazaMap,
  type PrayerKey,
} from '../types';

const PRAYER_LABELS: Record<string, string> = {
  fajr: 'Fajr',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
};

const COLUMN_WIDTH = 44;
const DATE_COLUMN_WIDTH = 72;
const QAZA_COLUMN_WIDTH = 40;

export default function NamazTable() {
  const today = useMemo(() => new Date(), []);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1); // 1–12
  const [completions, setCompletions] = useState<CompletionsMap>({});
  const [qaza, setQaza] = useState<QazaMap>({});

  const daysInMonth = getDaysInMonth(year, month);
  const monthLabel = `${MONTH_NAMES[month - 1]} ${year}`;

  const goPrevMonth = useCallback(() => {
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  }, [month]);

  const goNextMonth = useCallback(() => {
    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  }, [month]);

  const toggleCompletion = useCallback((dateKey: string, prayer: PrayerKey) => {
    const key = completionKey(dateKey, prayer);
    setCompletions((prev) => ({ ...prev, [key]: !prev[key] }));
    // TODO: POST /api/completions { key, completed }
  }, []);

  const cycleQaza = useCallback((dateKey: string) => {
    setQaza((prev) => {
      const next = (prev[dateKey] ?? 0) + 1;
      const value = next > 5 ? 0 : next;
      return { ...prev, [dateKey]: value };
    });
    // TODO: POST /api/completions { date: dateKey, qaza: value }
  }, []);

  const tableWidth =
    DATE_COLUMN_WIDTH + PRAYERS.length * COLUMN_WIDTH + QAZA_COLUMN_WIDTH;

  return (
    <View style={styles.container}>
      {/* Month navigation */}
      <View style={styles.monthRow}>
        <TouchableOpacity onPress={goPrevMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>‹ Prev</Text>
        </TouchableOpacity>
        <Text style={styles.monthTitle}>{monthLabel}</Text>
        <TouchableOpacity onPress={goNextMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>Next ›</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={true}
        style={styles.tableScroll}
        contentContainerStyle={styles.tableScrollContent}
      >
        <ScrollView
          style={[styles.verticalScroll, { width: tableWidth }]}
          showsVerticalScrollIndicator={true}
        >
          {/* Table header */}
          <View style={[styles.row, styles.headerRow]}>
            <View style={[styles.cell, styles.dateCell]}>
              <Text style={styles.headerText}>Date</Text>
            </View>
            {PRAYERS.map((p) => (
              <View key={p} style={[styles.cell, styles.prayerCell]}>
                <Text style={styles.headerText} numberOfLines={1}>
                  {PRAYER_LABELS[p]}
                </Text>
              </View>
            ))}
            <View style={[styles.cell, styles.qazaHeaderCell]}>
              <Text style={styles.headerText}>Qaza</Text>
            </View>
          </View>

          {/* Data rows: one per day */}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const dateKey = formatDateKey(year, month, day);
            return (
              <View key={dateKey} style={styles.row}>
                <View style={[styles.cell, styles.dateCell]}>
                  <Text style={styles.dateText}>{day}</Text>
                </View>
                {PRAYERS.map((prayer) => {
                  const key = completionKey(dateKey, prayer);
                  const completed = completions[key] === true;
                  return (
                    <TouchableOpacity
                      key={prayer}
                      style={[styles.cell, styles.prayerCell]}
                      onPress={() => toggleCompletion(dateKey, prayer)}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.checkBox,
                          completed ? styles.checkBoxCompleted : null,
                        ]}
                      >
                        {completed ? <Text style={styles.checkMark}>✓</Text> : null}
                      </View>
                    </TouchableOpacity>
                  );
                })}
                <TouchableOpacity
                  style={[styles.cell, styles.qazaCell]}
                  onPress={() => cycleQaza(dateKey)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.qazaText}>{qaza[dateKey] ?? 0}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 48,
    paddingHorizontal: 8,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
  },
  navButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  tableScroll: {
    flex: 1,
    maxHeight: '100%',
  },
  tableScrollContent: {
    paddingBottom: 24,
  },
  verticalScroll: {
    flexGrow: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#cbd5e1',
  },
  headerRow: {
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cell: {
    paddingVertical: 10,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateCell: {
    width: DATE_COLUMN_WIDTH,
    minWidth: DATE_COLUMN_WIDTH,
  },
  prayerCell: {
    width: COLUMN_WIDTH,
    minWidth: COLUMN_WIDTH,
  },
  qazaHeaderCell: {
    width: QAZA_COLUMN_WIDTH,
    minWidth: QAZA_COLUMN_WIDTH,
  },
  qazaCell: {
    width: QAZA_COLUMN_WIDTH,
    minWidth: QAZA_COLUMN_WIDTH,
  },
  headerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  checkBox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#94a3b8',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBoxCompleted: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  checkMark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  qazaText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
});
