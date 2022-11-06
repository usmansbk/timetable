import React, {memo} from 'react';
import {Text, useTheme, TextProps} from 'react-native-paper';
import {Linking} from 'react-native';
import linkifyIt from 'linkify-it';

const linkify = linkifyIt();

linkify.add('git:', 'http:').add('ftp', null);

interface Props extends Omit<TextProps, 'children'> {
  text: string;
}

function HyperlinkedText({text, ...props}: Props) {
  const {colors} = useTheme();
  const tokens = text.split(/(\s+)/);
  return (
    <Text {...props}>
      {tokens.map((token, index) => {
        if (linkify.test(token)) {
          const [{url}] = linkify.match(token)!;

          return (
            <Text
              {...props}
              key={index}
              onPress={() => Linking.openURL(url)}
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
