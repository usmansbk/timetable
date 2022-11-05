import React, {memo} from 'react';
import {Text, useTheme, TextProps} from 'react-native-paper';
import {Linking} from 'react-native';
import isUrl from 'is-url';

interface Props extends Omit<TextProps, 'children'> {
  text: string;
}

function HyperlinkedText({text, ...props}: Props) {
  const {colors} = useTheme();
  const tokens = text.split(/(\s+)/);
  return (
    <Text {...props}>
      {tokens.map((token, index) => {
        if (isUrl(token)) {
          return (
            <Text
              {...props}
              key={index}
              onPress={() => Linking.openURL(token)}
              style={{
                color: colors.tertiary,
                textDecorationLine: 'underline',
              }}>
              {token}
            </Text>
          );
        }

        return (
          <Text key={index} {...props}>
            {token}
          </Text>
        );
      })}
    </Text>
  );
}

export default memo(HyperlinkedText);
