import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  padding: 16,
  borderRadius: 12,
  buttonRadius: 8,
  cardRadius: 16,
  headerHeight: Platform.OS === 'ios' ? 44 : 56,
  tabBarHeight: Platform.OS === 'ios' ? 83 : 49,
};