import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Gap } from "../../../../constants/styles";
import { fetchQuiz } from "../../../../services/quiz";
import { ListhQuizAttempts } from "../../../../services/quizAttempts";

const AnswersQuiz = () => {
  const db = useSQLiteContext();

  const params = useLocalSearchParams<{ id: string }>();

  const { data: Quiz } = useQuery({
    queryKey: ["quizAttempt", params?.id],
    queryFn: async () => fetchQuiz(db, params?.id),
  });

  const { data } = useQuery({
    queryKey: ["list_answers_attempts", params?.id],
    queryFn: async () => ListhQuizAttempts(db, params?.id),
  });
  const router = useRouter();

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
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: 15,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 22,
            }}
          >
            {Quiz?.title}
          </Text>
          <Text
            style={{
              fontSize: 17,
            }}
          >
            {Quiz?.subtitle}
          </Text>
        </View>
        <ScrollView style={{ flex: 1 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 25,
            }}
          >
            {data?.map?.((item, index) => {
              return (
                <View
                  style={{
                    width: "100%",
                    backgroundColor: "#F6F6F6",
                    height: 100,
                    borderWidth: 1,
                    borderColor: "#EEEEEE",
                    borderRadius: 6,
                    padding: 12,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                    }}
                  >
                    Quiz Answered #{index + 1}
                  </Text>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                      justifyContent: "flex-end",
                      gap: 12,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        padding: 12,
                        borderRadius: 6,
                      }}
                      onPress={() => {
                        router.push(`./answers/${item?.id}`);
                      }}
                    >
                      <Text>See Answers</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
export default AnswersQuiz;
