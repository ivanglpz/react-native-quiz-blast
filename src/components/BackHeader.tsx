import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";

export const BackHeader = ({ path }: { path: string }) => {
  const router = useRouter();
  return (
    <View>
      <TouchableOpacity onPress={() => router.push(path)}>
        <Ionicons name="arrow-back" size={16} color={"black"} />
      </TouchableOpacity>
    </View>
  );
};
