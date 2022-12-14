import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as PaperProvider} from 'react-native-paper';
import {Provider as StoreProvider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {useAppTheme} from '~config/theme';
import store, {persistor} from '~redux/store';
import Screens from '~screens';
import '~config/i18n';
import '~config/notifications';

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
      <PersistGate persistor={persistor} loading={null}>
        <Main />
      </PersistGate>
    </StoreProvider>
  );
}
