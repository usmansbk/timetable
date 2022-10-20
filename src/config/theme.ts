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
import {AppSchemeName} from '~types';

const {LightTheme, DarkTheme} = adaptNavigationTheme({
  light: NavigationLightTheme,
  dark: NavigationDarkTheme,
});

const CommonTheme: Partial<typeof MD3DarkTheme> = {
  roundness: 2,
};

const CombinedLightTheme = {
  ...MD3LightTheme,
  ...LightTheme,
  ...CommonTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...LightTheme.colors,
  },
};

const CombinedDarkTheme = {
  ...MD3DarkTheme,
  ...DarkTheme,
  ...CommonTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...DarkTheme.colors,
  },
};

export const useAppTheme = (appScheme?: AppSchemeName) => {
  const scheme = useColorScheme();

  if (appScheme === 'system') {
    return scheme === 'dark' ? CombinedDarkTheme : CombinedLightTheme;
  }

  return appScheme === 'dark' ? CombinedDarkTheme : CombinedLightTheme;
};
