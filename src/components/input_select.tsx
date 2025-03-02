import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { G, Path } from "react-native-svg";
import { BorderRadius, FontSize, Gap } from "../constants/styles";
type Option = {
  id: string;
  label: string;
  value: string;
};
type Props = {
  label: string;
  value?: string | null;
  onChange?: (newValue: Option) => void;
  options: Option[] | null | undefined;
};
export const Input = (props: Props) => {
  const { label, onChange, options = [], value } = props;

  const [showOptions, setShowOptions] = useState(false);

  return (
    <View style={[styles.container]}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowOptions(true)}
      >
        <View>
          <Text>
            {options?.find?.((e) => e.value === value)?.label ??
              "Select an option"}
          </Text>
        </View>
        <Svg width="24" height="12" viewBox="0 0 24 12" fill="none">
          <G clip-path="url(#clip0_210_1404)">
            <Path
              d="M17.4198 2.45199L18.4798 3.51299L12.7028 9.29199C12.6102 9.38514 12.5001 9.45907 12.3789 9.50952C12.2576 9.55997 12.1276 9.58594 11.9963 9.58594C11.8649 9.58594 11.7349 9.55997 11.6137 9.50952C11.4924 9.45907 11.3823 9.38514 11.2898 9.29199L5.50977 3.51299L6.56977 2.45299L11.9948 7.87699L17.4198 2.45199Z"
              fill="black"
            />
          </G>
        </Svg>
      </TouchableOpacity>

      <Modal
        visible={showOptions}
        transparent={false}
        animationType="fade"
        onRequestClose={() => {
          setShowOptions(false);
        }}
      >
        <SafeAreaView
          style={{
            flex: 1,
          }}
        >
          <View
            style={{
              padding: 20,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <FlatList
              data={options}
              keyExtractor={(i) => i?.id}
              ListHeaderComponent={() => {
                return (
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 15,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 18,
                      }}
                    >
                      Select an option
                    </Text>
                    <TouchableOpacity onPress={() => setShowOptions(false)}>
                      <Ionicons name="close" size={26} color="black" />
                    </TouchableOpacity>
                  </View>
                );
              }}
              ItemSeparatorComponent={() => {
                return (
                  <View
                    style={{
                      height: 17,
                    }}
                  />
                );
              }}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => {
                      onChange?.(item);
                      setShowOptions(false);
                    }}
                  >
                    {item?.value === value ? (
                      <Ionicons
                        name="checkmark-circle"
                        size={26}
                        color="#53af2e"
                      />
                    ) : (
                      <Ionicons
                        name="checkmark-circle"
                        size={26}
                        color="#F6F6F6"
                      />
                    )}

                    <Text>{item?.label}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export const InputSelect = (props: Props) => {
  return <Input {...props} />;
};

const styles = StyleSheet.create({
  option: {
    backgroundColor: "#F6F6F6",
    borderWidth: 1,
    borderColor: "#EEEEEE",
    width: "100%",
    display: "flex",
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: Gap.lg,
  },
  input: {
    borderWidth: 0.3,
    padding: 10,
    borderRadius: BorderRadius.lg,
    borderColor: "gray",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    gap: Gap.lg,
    flex: 1,
  },
  label: {
    fontWeight: "bold",
    fontSize: FontSize.medium,
  },
});
