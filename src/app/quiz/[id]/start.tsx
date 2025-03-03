import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Gap } from "../../../constants/styles";
import { Question } from "../../../db/types";
import {
  GET_QUIZ_QUESTIONS_ATOM,
  IQUIZ_FORM,
  SET_QUIZ_QUESTIONS_ATOM,
} from "../../../jotai/quiz";
import { fetchQuestions } from "../../../services/questions";
import { fetchQuiz } from "../../../services/quiz";

type Item = {
  item: IQUIZ_FORM;
  index: number;
};

const QuestionItem = ({ item, index }: Item) => {
  const [answer, setAnswer] = useAtom(item?.answer);
  const [isError, setisError] = useAtom(item?.isError);
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <Text>
        {index + 1}.{item?.question?.question}
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 6,
        }}
      >
        {[
          item?.question?.option_one,
          item?.question?.option_two,
          item?.question?.option_three,
        ]?.map((e) => {
          return (
            <TouchableOpacity
              key={`${e}${item?.id}${item?.question?.id}`}
              onPress={() => {
                setisError(false);
                setAnswer({
                  selected_option: e,
                  is_correct:
                    item?.question[item?.question?.answer as keyof Question] ===
                    e,
                  attempt_id: undefined,
                  id: "",
                  question_id: item?.question?.id,
                });
              }}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 15,
                borderRadius: 6,
                borderWidth: 1,
                borderColor:
                  answer?.selected_option === e ? "#46becb" : "black",
                backgroundColor:
                  answer?.selected_option === e ? "#88dce5" : "white",
              }}
            >
              <Text>{e}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {isError ? (
        <Text
          style={{
            fontSize: 14,
            color: "red",
          }}
        >
          Please select an option
        </Text>
      ) : null}
    </View>
  );
};

const ScreenStartQuiz = () => {
  const local = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();

  const { data: Quiz } = useQuery({
    queryKey: ["quiz", local?.id],
    queryFn: () => fetchQuiz(db, local?.id),
  });

  const questions = useAtomValue(GET_QUIZ_QUESTIONS_ATOM);
  const setFormQuestions = useSetAtom(SET_QUIZ_QUESTIONS_ATOM);

  const mutateFetchQuestions = useMutation({
    mutationKey: ["fetching_questions", local?.id, db],
    mutationFn: async () => {
      const response = await fetchQuestions(db, local?.id);
      setFormQuestions(response);
    },
  });

  useEffect(() => {
    if (!local?.id) return;
    mutateFetchQuestions?.mutateAsync();
  }, [local?.id]);
  const handleSubmit = async () => {};
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
        <FlatList
          data={questions ?? []}
          ListHeaderComponent={() => {
            return (
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
            );
          }}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: 20,
              }}
            />
          )}
          keyExtractor={(i) => i?.id}
          renderItem={({ item, index }) => {
            return <QuestionItem item={item} index={index} />;
          }}
          ListFooterComponent={() => {
            return (
              <TouchableOpacity
                style={{
                  width: "100%",
                  backgroundColor: "black",
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Submit
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};
export default ScreenStartQuiz;
