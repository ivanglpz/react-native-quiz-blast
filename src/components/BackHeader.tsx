import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export const BackHeader = ({ title }: { title: string }) => {
  const router = useRouter();
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <TouchableOpacity
        style={{
          flexGrow: 1,
        }}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={22} color={"black"} />
      </TouchableOpacity>
      <View
        style={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
          }}
        >
          {title ?? ""}
        </Text>
      </View>
      <View
        style={{
          flexGrow: 1,
        }}
      ></View>
    </View>
  );
};
