import {StyleSheet, View} from 'react-native';
import {
  Appbar,
  HelperText,
  Modal,
  Portal,
  TextInput,
  useTheme,
} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {EventInput} from '~types';
import {useMemo} from 'react';

interface Props {
  autoFocus?: boolean;
  visible: boolean;
  onDiscard: () => void;
  onSubmit: (input: EventInput) => void;
  title?: string;
  defaultValues?: EventInput;
}

export default function EventForm({
  visible,
  autoFocus,
  onDiscard,
  onSubmit,
  title,
  defaultValues,
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
  } = useForm<EventInput>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const _onSubmit = handleSubmit(values => onSubmit(values));

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDiscard}
        contentContainerStyle={styles.contentContainer}>
        <View
          style={{
            backgroundColor: colors.background,
          }}>
          <Appbar.Header>
            <Appbar.Action icon="close" onPress={onDiscard} />
            <Appbar.Content title={title} />
            <Appbar.Action icon="check" onPress={_onSubmit} />
          </Appbar.Header>
          <Controller
            control={control}
            name="title"
            render={({field: {onBlur, onChange, value}}) => (
              <TextInput
                autoFocus={autoFocus}
                placeholder="Title"
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
        </View>
      </Modal>
    </Portal>
  );
}

EventForm.defaultProps = {
  defualtValues: {
    title: '',
  } as EventInput,
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
