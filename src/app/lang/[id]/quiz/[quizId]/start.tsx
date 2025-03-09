import { BackHeader } from "@components/BackHeader";
import { Gap } from "@constants/styles";
import { Question } from "@db/types";
import {
  GET_QUIZ_QUESTIONS_ATOM,
  GET_RESULT_QUESTIONS,
  IQUIZ_FORM,
  SET_QUIZ_QUESTIONS_ATOM,
} from "@jotai/quiz";
import { createAnswerQuizAttempt } from "@services/answers";
import { fetchQuestions } from "@services/questions";
import { fetchQuiz } from "@services/quiz";
import { createQuizAttempts } from "@services/quizAttempts";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Fragment, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontWeight: "600",
          }}
        >
          {index + 1}.
        </Text>
        {item?.question?.question?.split(" ")?.map((e, index) => {
          if (e?.includes("_")) {
            return (
              <Text
                key={e + index}
                style={{
                  minWidth: 30,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderColor: "#46becb",
                  backgroundColor: "#88dce5",
                  borderWidth: 1,
                  borderRadius: 6,
                }}
              >
                {answer?.selected_option}
              </Text>
            );
          }
          return <Text key={e + index}>{e}</Text>;
        })}
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 12,
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
                  answer?.selected_option === e ? "#46becb" : "#e0e0e0",
                backgroundColor:
                  answer?.selected_option === e ? "#88dce5" : "white",
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
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
  const local = useLocalSearchParams<{ quizId: string }>();
  const db = useSQLiteContext();

  const router = useRouter();
  const { data: Quiz } = useQuery({
    queryKey: ["quiz", local?.quizId],
    queryFn: () => fetchQuiz(db, local?.quizId),
  });

  const questions = useAtomValue(GET_QUIZ_QUESTIONS_ATOM);
  const setFormQuestions = useSetAtom(SET_QUIZ_QUESTIONS_ATOM);
  const getAnswers = useSetAtom(GET_RESULT_QUESTIONS);

  const mutateFetchQuestions = useMutation({
    mutationKey: ["fetching_questions", local?.quizId, db],
    mutationFn: async () => {
      const response = await fetchQuestions(db, local?.quizId);
      setFormQuestions(response);
    },
  });

  useEffect(() => {
    if (!local?.quizId) return;
    mutateFetchQuestions?.mutateAsync();
  }, [local?.quizId]);

  const mutate = useMutation({
    mutationKey: ["submit", questions, getAnswers, db, Quiz],
    mutationFn: async () => {
      const data = getAnswers?.();
      if (data?.status === "error") {
        throw new Error(`${data?.status}: The form is not completed.`);
      }
      return data;
    },
    onSuccess: async ({ data }) => {
      const newQuizAttempt = await createQuizAttempts(db, {
        quiz_id: Quiz?.id,
        user_id: "323a2a46-1b01-434f-bea0-0730ace3c1a3",
      });
      for await (const iterator of data) {
        await createAnswerQuizAttempt(db, {
          attempt_id: newQuizAttempt?.id,
          is_correct: iterator?.answer?.is_correct,
          question_id: iterator?.answer?.question_id,
          selected_option: iterator?.answer?.selected_option,
        });
      }

      router.push({
        pathname: `./answers/[attemptId]`,
        params: {
          attemptId: newQuizAttempt?.id,
        },
      });
    },
    onError: () => {
      Alert.alert("Error", "The form is not completed.");
    },
  });
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

        <View
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
        </View>
        <ScrollView
          style={{
            flex: 1,
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 45,
            }}
          >
            {[...(questions ?? [])]?.map((item, index) => {
              return (
                <Fragment key={index}>
                  <QuestionItem item={item} index={index} />
                </Fragment>
              );
            })}
          </View>
        </ScrollView>

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
          onPress={() => mutate.mutate()}
        >
          {mutate?.isPending ? (
            <ActivityIndicator size={"small"} color={"white"} />
          ) : (
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
              }}
            >
              Submit
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default ScreenStartQuiz;
