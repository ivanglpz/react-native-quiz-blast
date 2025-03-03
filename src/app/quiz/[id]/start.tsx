import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import { SafeAreaView, Text, View } from "react-native";
import { Gap } from "../../../constants/styles";

const ScreenStartQuiz = () => {
  const glob = useGlobalSearchParams();
  const local = useLocalSearchParams();

  console.log("Local:", local, "Global:", glob);

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          gap: Gap.xxgl,
          padding: 20,
        }}
      >
        <Text>test</Text>
      </View>
    </SafeAreaView>
  );
};
export default ScreenStartQuiz;
