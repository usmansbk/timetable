import {useColorScheme} from 'react-native';
import {MD3LightTheme, MD3DarkTheme} from 'react-native-paper';
import {AppSchemeName} from '~types';

const light = {
  ...MD3LightTheme,
};

const dark = {
  ...MD3DarkTheme,
};

export const usePaperTheme = (appScheme?: AppSchemeName) => {
  const scheme = useColorScheme();

  if (appScheme === 'system') {
    return scheme === 'dark' ? dark : light;
  }

  return appScheme === 'dark' ? dark : light;
};
