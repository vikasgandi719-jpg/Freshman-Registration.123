import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";

const Header = ({
  title = "",
  subtitle = null,
  onBack = null,
  rightComponent = null,
  variant = "default",
  showBorder = true,
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const isDark = variant === "dark";

  return (
    <View
      style={[
        styles.container,
        isDark && { backgroundColor: colors.background },
        variant === "transparent" && styles.containerTransparent,
        showBorder && !isDark && { borderBottomColor: colors.border },
        showBorder && { borderBottomWidth: 1 },
      ]}
    >
      <View style={styles.side}>
        {onBack && (
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: colors.input }]}
            onPress={onBack}
            activeOpacity={0.75}
          >
            <Text style={[styles.backIcon, { color: colors.text }]}>‹</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.center}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[styles.subtitle, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
      </View>

      <View style={[styles.side, styles.sideRight]}>
        {rightComponent || null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 54 : StatusBar.currentHeight + 10 || 10,
    paddingBottom: 14,
    paddingHorizontal: 16,
  },
  containerTransparent: {
    backgroundColor: "transparent",
  },
  side: {
    width: 44,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  sideRight: {
    alignItems: "flex-end",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 26,
    lineHeight: 30,
    fontWeight: "600",
    marginTop: -2,
  },
  center: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default Header;
