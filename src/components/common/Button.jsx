import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../../config/theme';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon = null,
  style,
  textStyle,
}) => {
  const getButtonStyle = () => {
    const styles = [buttonStyles.base];

    // Variant styles
    if (variant === 'primary') {
      styles.push(buttonStyles.primary);
    } else if (variant === 'secondary') {
      styles.push(buttonStyles.secondary);
    } else if (variant === 'outline') {
      styles.push(buttonStyles.outline);
    } else if (variant === 'ghost') {
      styles.push(buttonStyles.ghost);
    }

    // Size styles
    if (size === 'small') {
      styles.push(buttonStyles.small);
    } else if (size === 'large') {
      styles.push(buttonStyles.large);
    } else {
      styles.push(buttonStyles.medium);
    }

    // Disabled state
    if (disabled || loading) {
      styles.push(buttonStyles.disabled);
    }

    return styles;
  };

  const getTextStyle = () => {
    const styles = [buttonStyles.text];

    if (variant === 'primary') {
      styles.push(buttonStyles.textPrimary);
    } else if (variant === 'secondary') {
      styles.push(buttonStyles.textSecondary);
    } else if (variant === 'outline') {
      styles.push(buttonStyles.textOutline);
    } else if (variant === 'ghost') {
      styles.push(buttonStyles.textGhost);
    }

    if (size === 'small') {
      styles.push(buttonStyles.textSmall);
    } else if (size === 'large') {
      styles.push(buttonStyles.textLarge);
    }

    return styles;
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? COLORS.white : COLORS.primary}
        />
      ) : (
        <>
          {icon && icon}
          <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const buttonStyles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
  },
  // Variants
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  // Sizes
  small: {
    height: 36,
    paddingHorizontal: SPACING.md,
  },
  medium: {
    height: 48,
  },
  large: {
    height: 56,
  },
  // States
  disabled: {
    opacity: 0.5,
  },
  // Text
  text: {
    fontWeight: '600',
  },
  textPrimary: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
  },
  textSecondary: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
  },
  textOutline: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.md,
  },
  textGhost: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.md,
  },
  textSmall: {
    fontSize: FONT_SIZES.sm,
  },
  textLarge: {
    fontSize: FONT_SIZES.lg,
  },
});

export default Button;