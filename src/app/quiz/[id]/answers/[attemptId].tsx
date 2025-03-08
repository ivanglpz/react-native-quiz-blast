import { useLocalSearchParams } from "expo-router";
import { SafeAreaView, Text, View } from "react-native";
import { Gap } from "../../../../constants/styles";

const QuizAnswers = () => {
  const params = useLocalSearchParams<{ id: string; attemptId: string }>();
  console.log(params);

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
          flex: 1,
        }}
      >
        <Text>hello world</Text>
      </View>
    </SafeAreaView>
  );
};
export default QuizAnswers;
