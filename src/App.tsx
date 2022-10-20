import React from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {usePaperTheme} from '~config/theme';
import Navigator from '~screens';

function Main() {
  const theme = usePaperTheme();

  return (
    <PaperProvider theme={theme}>
      <Navigator />
    </PaperProvider>
  );
}

export default function App() {
  return <Main />;
}
