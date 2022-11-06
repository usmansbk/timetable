import {Avatar} from 'react-native-paper';

interface Props {
  size?: number;
  uri?: string | null;
  name?: string;
}

function UserAvatar({uri, size, name}: Props) {
  if (uri) {
    return <Avatar.Image size={size} source={{uri}} />;
  }

  if (name) {
    return <Avatar.Text size={size} label={name[0]} />;
  }

  return <Avatar.Icon size={size} icon="account" />;
}

export default UserAvatar;
