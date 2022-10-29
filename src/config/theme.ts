import {useColorScheme} from 'react-native';
import {
  MD3LightTheme,
  MD3DarkTheme,
  adaptNavigationTheme,
  MD3Theme,
} from 'react-native-paper';
import {
  DefaultTheme as NavigationLightTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import deepmarge from 'deepmerge';
import {AppSchemeName} from '~types';
import {
  MD3Typescale,
  NavigationTheme,
} from 'react-native-paper/lib/typescript/types';

const {LightTheme, DarkTheme} = adaptNavigationTheme({
  light: NavigationLightTheme,
  dark: NavigationDarkTheme,
});

const CommonTheme: Partial<MD3Theme> = {
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
      fontFamily: 'Inter-SemiBold',
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
      fontFamily: 'Inter-Medium',
    },
    labelMedium: {
      fontFamily: 'Inter-Regular',
    },
    labelSmall: {
      fontFamily: 'Inter-ExtraLight',
    },
  } as MD3Typescale),
};

type Theme = MD3Theme & NavigationTheme;

const CombinedLightTheme = deepmarge.all([
  MD3LightTheme,
  LightTheme,
  CommonTheme,
]) as Theme;

const CombinedDarkTheme = deepmarge.all([
  MD3DarkTheme,
  DarkTheme,
  CommonTheme,
]) as Theme;

export const useAppTheme = (appScheme?: AppSchemeName) => {
  const scheme = useColorScheme();

  if (appScheme === 'system') {
    return scheme === 'dark' ? CombinedDarkTheme : CombinedLightTheme;
  }

  return appScheme === 'dark' ? CombinedDarkTheme : CombinedLightTheme;
};
