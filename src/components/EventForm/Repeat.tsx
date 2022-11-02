import {memo, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import DateTimeInput from '~components/DateTimeInput';
import Select from '~components/Select';
import {Recurrence} from '~types';

interface Props {
  value?: Recurrence;
  onChange: (value: Recurrence) => void;
}

function Repeat({}: Props) {
  const {t} = useTranslation();
  const options = useMemo(
    () => [
      {
        value: 'daily',
        label: t('Every day'),
      },
      {
        value: 'weekly',
        label: t('Every week'),
      },
      {
        value: 'monthly',
        label: t('Every month'),
      },
      {
        value: 'yearly',
        label: t('Every year'),
      },
    ],
    [t],
  );

  return (
    <View>
      <Select
        optional
        icon="repeat"
        onChange={() => null}
        label={t('Repeat')}
        options={options}
      />
      <DateTimeInput
        optional
        mode="date"
        label={t('Until')}
        onChange={() => null}
      />
    </View>
  );
}

export default memo(Repeat);
