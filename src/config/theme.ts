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
import {
  MD3Typescale,
  NavigationTheme,
} from 'react-native-paper/lib/typescript/types';
import {useAppSelector} from '~redux/hooks';
import {selectAppTheme} from '~redux/settings/slice';

const {LightTheme, DarkTheme} = adaptNavigationTheme({
  reactNavigationDark: NavigationDarkTheme,
  reactNavigationLight: NavigationLightTheme,
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
      fontFamily: 'Inter-Regular',
    },
    labelMedium: {
      fontFamily: 'Inter-Light',
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

export const useAppTheme = () => {
  const appScheme = useAppSelector(selectAppTheme);
  const scheme = useColorScheme();

  if (appScheme === 'system') {
    return scheme === 'dark' ? CombinedDarkTheme : CombinedLightTheme;
  }

  return appScheme === 'dark' ? CombinedDarkTheme : CombinedLightTheme;
};
