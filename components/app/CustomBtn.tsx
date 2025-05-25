import { COLORS } from '@/commons/colors';
import React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';


interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  leftIcon,
  rightIcon,
  buttonStyle,
  textStyle,
  disabled,
  onPress,
  ...props
}) => {
  const pressAnimation = useSharedValue(0);
  const loadingAnimation = useSharedValue(0);

  React.useEffect(() => {
    loadingAnimation.value = withTiming(loading ? 1 : 0, { duration: 300 });
  }, [loading]);

  const handlePressIn = () => {
    pressAnimation.value = withSpring(1, {
      damping: 15,
      stiffness: 200,
    });
  };

  const handlePressOut = () => {
    pressAnimation.value = withSpring(0, {
      damping: 15,
      stiffness: 200,
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    const scale = 1 - pressAnimation.value * 0.05;
    const opacity = disabled ? 0.6 : 1 - pressAnimation.value * 0.1;

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const loadingStyle = useAnimatedStyle(() => {
    return {
      opacity: loadingAnimation.value,
      transform: [
        {
          rotate: `${loadingAnimation.value * 360}deg`,
        },
      ],
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    return {
      opacity: 1 - loadingAnimation.value,
    };
  });

  const getButtonStyle = () => {
    const baseStyle = [styles.button,];
    
    switch (variant) {
      case 'secondary':
        return [...baseStyle, styles.buttonSecondary];
      case 'outline':
        return [...baseStyle, styles.buttonOutline];
      default:
        return [...baseStyle, styles.buttonPrimary];
    }
  };

  const getTextStyle = () => {
    const baseStyle = [styles.buttonText,];
    
    switch (variant) {
      case 'secondary':
        return [...baseStyle, styles.buttonTextSecondary];
      case 'outline':
        return [...baseStyle, styles.buttonTextOutline];
      default:
        return [...baseStyle, styles.buttonTextPrimary];
    }
  };

  return (
    <TouchableOpacity
      {...props}
      onPress={disabled || loading ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={1}
    >
      <Animated.View style={[getButtonStyle(), buttonStyle, animatedStyle]}>
        {loading && (
          <Animated.View style={[styles.loadingContainer, loadingStyle]}>
            <View style={styles.spinner} />
          </Animated.View>
        )}
        
        <Animated.View style={[styles.buttonContent, contentStyle]}>
          {leftIcon && <View style={styles.buttonLeftIcon}>{leftIcon}</View>}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {rightIcon && <View style={styles.buttonRightIcon}>{rightIcon}</View>}
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default CustomButton;
const styles = StyleSheet.create({


   // Button Styles
  button: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 1,
    height: 60,

  },
  buttonSmall: {
    minHeight: 60,
    paddingHorizontal: 16,
  },
  buttonMedium: {
    minHeight: 60,
    paddingHorizontal: 24,
  },
  buttonLarge: {
    minHeight: 60,
    paddingHorizontal: 32,
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
    shadowColor: '#007AFF',
    shadowOpacity: 0.3,
  },
  buttonSecondary: {
    backgroundColor: "red",
    shadowColor: '#34C759',
    shadowOpacity: 0.3,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowOpacity: 0,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: '600',
  },
  buttonTextSmall: {
    fontSize: 14,
  },
  buttonTextMedium: {
    fontSize: 16,
  },
  buttonTextLarge: {
    fontSize: 18,
  },
  buttonTextPrimary: {
    color: '#FFFFFF',
  },
  buttonTextSecondary: {
    color: '#FFFFFF',
  },
  buttonTextOutline: {
    color: '#007AFF',
  },
  buttonLeftIcon: {
    marginRight: 8,
  },
  buttonRightIcon: {
    marginLeft: 8,
  },
  buttonIcon: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  loadingContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderTopColor: 'transparent',
    borderRadius: 10,
  },
  buttonContainer: {
    marginTop: 32,
  },


});
