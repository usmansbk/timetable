import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as PaperProvider} from 'react-native-paper';
import {Provider as StoreProvider} from 'react-redux';
import {useAppTheme} from '~config/theme';
import store from '~redux/store';
import Screens from '~screens';

function Main() {
  const theme = useAppTheme();

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <Screens />
      </NavigationContainer>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <StoreProvider store={store}>
      <Main />
    </StoreProvider>
  );
}
