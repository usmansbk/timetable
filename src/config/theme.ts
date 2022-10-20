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
import deepmerge from 'deepmerge';
import {AppSchemeName} from '~types';

const {LightTheme, DarkTheme} = adaptNavigationTheme({
  light: NavigationLightTheme,
  dark: NavigationDarkTheme,
});

const CombinedLightTheme = deepmerge(MD3LightTheme, LightTheme);
const CombinedDarkTheme = deepmerge(MD3DarkTheme, DarkTheme);

export const useAppTheme = (appScheme?: AppSchemeName) => {
  const scheme = useColorScheme();

  if (appScheme === 'system') {
    return scheme === 'dark' ? CombinedDarkTheme : CombinedLightTheme;
  }

  return appScheme === 'dark' ? CombinedDarkTheme : CombinedLightTheme;
};
