import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { SafeAreaView, Text, View } from "react-native";
import { fetchLanguage } from "../../services/languages";

const LangScreen = () => {
  const params = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();

  const { data } = useQuery({
    queryKey: ["lang", db, params?.id],
    queryFn: () => fetchLanguage(db, params?.id),
  });

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          padding: 20,
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 24,
          }}
        >
          Quiz - {data?.name}
        </Text>
        <Text>
          Easily create your own quizzes and start testing your knowledge in no
          time.
        </Text>
      </View>
    </SafeAreaView>
  );
};
export default LangScreen;
