import {useColorScheme} from 'react-native';
import {
  MD3LightTheme,
  MD3DarkTheme,
  adaptNavigationTheme,
} from 'react-native-paper';
import {
  DefaultTheme as NavigationLightTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import deepmarge from 'deepmerge';
import {AppSchemeName} from '~types';

const {LightTheme, DarkTheme} = adaptNavigationTheme({
  light: NavigationLightTheme,
  dark: NavigationDarkTheme,
});

type Theme = typeof MD3DarkTheme;

const CommonTheme: Partial<Theme> = {
  roundness: 2,
  fonts: deepmarge(MD3LightTheme.fonts, {
    displayLarge: {
      fontFamily: 'Inter-Black',
    },
    displayMedium: {
      fontFamily: 'Inter-ExtraBold',
    },
    displaySmall: {
      fontFamily: 'Inter-Bold',
    },
    headlineLarge: {
      fontFamily: 'Inter-ExtraBold',
    },
    headlineMedium: {
      fontFamily: 'Inter-Bold',
    },
    headlineSmall: {
      fontFamily: 'Inter-SemiBold',
    },
    titleLarge: {
      fontFamily: 'Inter-Bold',
    },
    titleMedium: {
      fontFamily: 'Inter-Medium',
    },
    titleSmall: {
      fontFamily: 'Inter-Regular',
    },
    bodyLarge: {
      fontFamily: 'Inter-Medium',
    },
    bodyMedium: {
      fontFamily: 'Inter-Regular',
    },
    bodySmall: {
      fontFamily: 'Inter-Light',
    },
    labelLarge: {
      fontFamily: 'Inter-Regular',
    },
    labelMedium: {
      fontFamily: 'Inter-Light',
    },
    labelSmall: {
      fontFamily: 'Inter-ExtraLight',
    },
  }),
};

const CommonColors: Partial<Theme['colors']> = {};

const CombinedLightTheme = {
  ...MD3LightTheme,
  ...LightTheme,
  ...CommonTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...LightTheme.colors,
    ...CommonColors,
  },
} as Theme;

const CombinedDarkTheme = {
  ...MD3DarkTheme,
  ...DarkTheme,
  ...CommonTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...DarkTheme.colors,
    ...CommonColors,
  },
} as Theme;

export const useAppTheme = (appScheme?: AppSchemeName) => {
  const scheme = useColorScheme();

  if (appScheme === 'system') {
    return scheme === 'dark' ? CombinedDarkTheme : CombinedLightTheme;
  }

  return appScheme === 'dark' ? CombinedDarkTheme : CombinedLightTheme;
};
