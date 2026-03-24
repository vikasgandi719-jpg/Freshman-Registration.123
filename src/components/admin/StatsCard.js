import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../../context/ThemeContext";

const StatsCard = ({
  title = "Total Students",
  value = 0,
  subtitle = "",
  icon = "T",
  color = "#1D4ED8",
  trend = null,
  onPress,
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const bg = color + "15";

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.card, borderLeftColor: color },
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      <View style={[styles.iconCircle, { backgroundColor: bg }]}>
        <Text style={[styles.icon, { color }]}>{icon}</Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textSecondary }]}>
          {title}
        </Text>
        <Text style={[styles.value, { color }]}>{value}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: colors.textTertiary }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trend && (
        <View
          style={[
            styles.trendBadge,
            { backgroundColor: trend.isUp ? "#F0FDF4" : "#FFF1F2" },
          ]}
        >
          <Text
            style={{ fontSize: 12, color: trend.isUp ? "#15803D" : "#BE123C" }}
          >
            {trend.isUp ? "+" : "-"}
          </Text>
          <Text
            style={[
              styles.trendText,
              { color: trend.isUp ? "#15803D" : "#BE123C" },
            ]}
          >
            {Math.abs(trend.value)}%
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 8,
    marginVertical: 6,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    flex: 1,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  icon: { fontSize: 18, fontWeight: "700" },
  content: { flex: 1 },
  title: { fontSize: 12, fontWeight: "500", marginBottom: 4 },
  value: { fontSize: 26, fontWeight: "800" },
  subtitle: { fontSize: 11, marginTop: 2 },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 2,
  },
  trendText: { fontSize: 12, fontWeight: "700" },
});

export default StatsCard;
