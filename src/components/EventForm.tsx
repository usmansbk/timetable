import {StyleSheet, View} from 'react-native';
import {
  Appbar,
  HelperText,
  Modal,
  Portal,
  TextInput,
  useTheme,
} from 'react-native-paper';
import {memo, useCallback, useEffect, useMemo} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {EventInput} from '~types';
import {formatToUTCdate} from '~utils/date';
import DateTimeInput from './DateTimeInput';

interface Props {
  autoFocus?: boolean;
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (input: EventInput) => void;
  title?: string;
  defaultValues?: EventInput;
  blurOnSubmit?: boolean;
}

function EventForm({
  visible,
  autoFocus,
  onDismiss,
  onSubmit,
  title,
  defaultValues,
  blurOnSubmit = true,
}: Props) {
  const {colors} = useTheme();

  const schema = useMemo(
    () =>
      yup
        .object<Record<keyof EventInput, yup.AnySchema>>({
          title: yup
            .string()
            .trim()
            .min(3, 'Title too short')
            .max(80, 'Title too long')
            .required('Add a Title'),
          startDate: yup.string().required(),
          startTime: yup.string().optional(),
          endTime: yup.string().optional(),
        })
        .required(),
    [],
  );

  const {
    control,
    handleSubmit,
    formState: {errors, touchedFields},
    reset,
  } = useForm<EventInput>({
    resolver: yupResolver(schema),
  });

  const handleReset = useCallback(() => {
    reset(
      Object.assign(
        {
          title: '',
          startDate: formatToUTCdate(new Date()),
        },
        defaultValues,
      ),
    );
  }, [reset, defaultValues]);

  const _onSubmit = handleSubmit(values => {
    onSubmit(values);
    if (blurOnSubmit) {
      onDismiss();
    } else {
      handleReset();
    }
  });

  useEffect(() => {
    if (visible) {
      handleReset();
    }
  }, [visible, handleReset]);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.contentContainer}>
        <View
          style={{
            backgroundColor: colors.background,
          }}>
          <Appbar.Header>
            <Appbar.Action icon="close" onPress={onDismiss} />
            <Appbar.Content title={title} />
            <Appbar.Action icon="check" onPress={_onSubmit} />
          </Appbar.Header>
          <Controller
            control={control}
            name="title"
            render={({field: {onBlur, onChange, value}}) => (
              <TextInput
                autoFocus={autoFocus}
                label="Title"
                placeholder={defaultValues?.title}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {errors.title && !!touchedFields.title && (
            <HelperText type="error" visible>
              {errors.title.message}
            </HelperText>
          )}
          <Controller
            control={control}
            name="startDate"
            render={({field: {onChange, value}}) => (
              <DateTimeInput
                label="Date"
                onChange={onChange}
                value={value}
                mode="date"
              />
            )}
          />
          <View style={styles.row}>
            <View style={styles.time}>
              <Controller
                control={control}
                name="startTime"
                render={({field: {onChange, value}}) => (
                  <DateTimeInput
                    optional
                    label="From"
                    onChange={onChange}
                    value={value}
                    mode="time"
                  />
                )}
              />
            </View>
            <View style={styles.time}>
              <Controller
                control={control}
                name="endTime"
                render={({field: {onChange, value}}) => (
                  <DateTimeInput
                    optional
                    label="To"
                    onChange={onChange}
                    value={value}
                    mode="time"
                  />
                )}
              />
            </View>
          </View>
        </View>
      </Modal>
    </Portal>
  );
}

export default memo(EventForm);

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  row: {
    flexDirection: 'row',
  },
  time: {
    flex: 1,
  },
});
