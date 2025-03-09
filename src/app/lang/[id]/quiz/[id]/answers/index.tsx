import Ionicons from "@expo/vector-icons/Ionicons";
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

import { BackHeader } from "@components/BackHeader";
import { Gap } from "@constants/styles";
import { fetchQuiz } from "@services/quiz";
import { ListhQuizAttempts } from "@services/quizAttempts";

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
        <BackHeader title={Quiz?.title ?? ""} />

        {/* <View
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: 15,
          }}
        >
          <Text
            style={{
              fontSize: 17,
            }}
          >
            {Quiz?.subtitle}
          </Text>
        </View> */}
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
                  key={item?.id}
                  style={{
                    width: "100%",
                    backgroundColor: "#F6F6F6",
                    borderWidth: 1,
                    borderColor: "#EEEEEE",
                    borderRadius: 6,
                    padding: 12,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{}}>{index + 1}. Answered Quiz</Text>
                  <TouchableOpacity
                    style={{
                      borderRadius: 6,
                    }}
                    onPress={() => {
                      router.push(`./answers/${item?.id}`);
                    }}
                  >
                    <Text>See Answers</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </ScrollView>
        <TouchableOpacity
          style={{
            width: "100%",
            backgroundColor: "#87E561",
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: 10,
          }}
          onPress={() => router.push(`/quiz/${Quiz?.id}/start`)}
        >
          <Ionicons name="play" size={18} color="black" />

          <Text
            style={{
              color: "black",
              fontWeight: "bold",
            }}
          >
            Start
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default AnswersQuiz;
