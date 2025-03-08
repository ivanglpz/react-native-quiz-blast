import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { Gap } from "../../../../constants/styles";
import { Answer } from "../../../../db/types";
import { listAnswersQuizAttempt } from "../../../../services/answers";
import { fetchQuizAttempt } from "../../../../services/quizAttempts";

const QuizAnswers = () => {
  const db = useSQLiteContext();

  const params = useLocalSearchParams<{ id: string; attemptId: string }>();
  const { data: QuizAttempt } = useQuery({
    queryKey: ["quizAttempt", params?.attemptId],
    queryFn: async () => fetchQuizAttempt(db, params?.attemptId),
  });

  const { data: AnswersQuizAttempt } = useQuery({
    queryKey: ["answersQuizAttempt", db, params?.attemptId],
    queryFn: async () => listAnswersQuizAttempt(db, params?.attemptId),
  });

  console.log(AnswersQuizAttempt);

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
        <ScrollView
          style={{
            flex: 1,
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 30,
            }}
          >
            {AnswersQuizAttempt?.map((e, index) => {
              return (
                <View key={e?.id}>
                  <Text>{index + 1}. Question</Text>
                  <Text>{e?.question}</Text>
                  <Text
                    style={{
                      fontWeight: "bold",
                      marginTop: 10,
                    }}
                  >
                    Your Answer
                  </Text>

                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      gap: 5,
                    }}
                  >
                    <Ionicons
                      name={e?.is_correct ? "checkmark-circle" : "close"}
                      size={18}
                      color={e?.is_correct ? "#87E561" : "#FF3C60"}
                    />

                    {e?.question?.split(" ")?.map((i) => {
                      if (i.includes("_")) {
                        return <Text key={i}>{e?.selected_option}</Text>;
                      }
                      return <Text key={i}>{i}</Text>;
                    })}
                  </View>
                  {!e?.is_correct ? (
                    <View style={{ marginTop: 10 }}>
                      <Text
                        style={{
                          fontWeight: "bold",
                        }}
                      >
                        Correct Answer
                      </Text>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          flexWrap: "wrap",
                          gap: 5,
                        }}
                      >
                        {e?.question?.split(" ")?.map((i) => {
                          if (i.includes("_")) {
                            return (
                              <Text key={i}>
                                {e?.[e?.correct_answer as keyof Answer]}
                              </Text>
                            );
                          }
                          return <Text key={i}>{i}</Text>;
                        })}
                      </View>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
export default QuizAnswers;
