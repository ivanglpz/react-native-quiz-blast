import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { BorderRadius, FontSize, Gap } from "../constants/styles";

type Props = {
  value?: string;
  onChange?: (newValue: string) => void;
  label: string;
  placeholder?: string;
  errors?: string[];
  type?: KeyboardTypeOptions;
  multiLine?: boolean;
};
export const Input = (props: Props) => {
  const {
    onChange,
    value,
    label,
    placeholder = null,
    errors,
    type = "default",
    multiLine = false,
  } = props;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        keyboardType={type}
        style={[
          styles.input,
          multiLine
            ? {
                height: 120,
              }
            : {},
        ]}
        onChangeText={onChange}
        value={value}
        placeholder={placeholder ?? "Escribe algo"}
        placeholderTextColor={"black"}
        multiline={multiLine}
        numberOfLines={multiLine ? 5 : 1}
        textAlignVertical="top"
      />
      {errors?.map((e, index) => {
        return (
          <Text
            key={`errors-${index}-${e}`}
            style={{
              fontWeight: "bold",
              color: "red",
            }}
          >
            {e}
          </Text>
        );
      })}
    </View>
  );
};

export const InputText = (props: Props) => {
  return <Input {...props} />;
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderWidth: 0.3,
    padding: 10,
    borderRadius: BorderRadius.lg,
    borderColor: "gray",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    gap: Gap.lg,
  },
  label: {
    fontWeight: "bold",
    fontSize: FontSize.large,
  },
});
