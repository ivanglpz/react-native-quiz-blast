import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import OpenAI from "openai";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BackHeader } from "../../components/BackHeader";
import { InputSelect } from "../../components/input_select";
import { fetchLanguage } from "../../services/languages";
import { convertCSVToArray, createPrompt } from "../../services/openia";
import { createQuestionQuiz, createQuiz, listQuiz } from "../../services/quiz";
import { listVerbsById } from "../../services/verbs";

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

const client = new OpenAI({
  apiKey: API_KEY, // This is the default and can be omitted
});

const LangScreen = () => {
  const params = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  const { data } = useQuery({
    queryKey: ["lang", db, params?.id],
    queryFn: () => fetchLanguage(db, params?.id),
  });
  const { data: ListVerbs } = useQuery({
    queryKey: ["verbs", db, params?.id],
    queryFn: () => listVerbsById(db, params?.id),
  });

  const { data: DataListQuiz, refetch } = useQuery({
    queryKey: ["quiz", db, data?.id],
    queryFn: () => listQuiz(db, data?.id),
  });

  const [optionVerbTenseId, setoptionVerbTenseId] = useState<string | null>(
    null
  );

  const mutate = useMutation({
    mutationKey: ["quiz_create_submit", data?.name, optionVerbTenseId, refetch],
    mutationFn: async () => {
      if (!data?.name) return;
      const option = ListVerbs?.find((e) => e?.id === optionVerbTenseId);
      if (!option) return;

      try {
        const chatCompletion = await client.chat.completions.create({
          messages: [
            {
              role: "user",
              content: createPrompt(data?.name, option?.name),
            },
          ], // Aquí el cambio

          model: "gpt-4o-mini",
        });

        const csv = chatCompletion.choices[0]?.message?.content?.trim?.() ?? "";
        const questions = await convertCSVToArray(csv, data?.id);

        const quiz = await createQuiz(db, {
          language_id: data?.id,
          title: `${data?.name} Quiz #${Number(DataListQuiz?.length) + 1}`,
          subtitle: `${option?.name}`,
        });
        for (const iterator of questions) {
          await createQuestionQuiz(db, {
            ...iterator,
            quiz_id: quiz?.id,
          });
        }
        await refetch();
      } catch (error) {
        const text = `Error in ChatGPT API:, ${error}`;
        console.log(text);
      }
    },
    onSuccess: () => {
      Alert.alert("Successfully", "The quiz has been created", [
        {
          isPreferred: true,
          onPress: () => {
            scrollRef.current?.scrollToEnd({ animated: true });
          },
          text: "OK",
        },
      ]);
    },
    onError: () => {
      Alert.alert("Error", "The quiz could'nt be created");
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
          padding: 20,
          gap: 12,
          flex: 1,
        }}
      >
        <BackHeader path={`/`} title={`Quiz - ${data?.name}`} />
        <Text>
          Easily create your own quizzes and start testing your knowledge in no
          time.
        </Text>

        <ScrollView ref={scrollRef} style={{ flex: 1 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            {DataListQuiz?.map((item) => {
              return (
                <View
                  key={item?.id}
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
                    {item?.title}
                  </Text>
                  <Text>{item?.subtitle}</Text>
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
                        router.push(`/quiz/${item?.id}/answers`);
                      }}
                    >
                      <Text>Answers</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        paddingVertical: 8,
                        paddingHorizontal: 15,
                        backgroundColor: "#87E561",
                        borderRadius: 6,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                      }}
                      onPress={() => {
                        router.push(`/quiz/${item?.id}/start`);
                      }}
                    >
                      <Ionicons name="play" size={18} color="black" />
                      <Text
                        style={{
                          fontWeight: "bold",
                        }}
                      >
                        Start
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 12,
          }}
        >
          <InputSelect
            label="Verb Tense"
            value={optionVerbTenseId}
            onChange={(v) => {
              setoptionVerbTenseId(v?.value);
            }}
            options={ListVerbs?.map((e) => {
              return {
                id: e?.id,
                label: e?.name,
                value: e?.id,
              };
            })}
          />
          {(() => {
            const isDisabled =
              optionVerbTenseId === null || optionVerbTenseId === undefined;
            return (
              <TouchableOpacity
                style={{
                  backgroundColor: isDisabled ? "#e0e0e0" : "#151515",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 10,
                  gap: 6,
                  borderRadius: 6,
                  width: "auto",
                  height: "auto",
                }}
                disabled={isDisabled}
                onPress={() => mutate?.mutateAsync()}
              >
                {mutate?.isPending ? (
                  <>
                    <ActivityIndicator size={"small"} color={"white"} />
                  </>
                ) : (
                  <>
                    <Ionicons
                      name="add-circle"
                      size={16}
                      color={isDisabled ? "gray" : "#F6F6F6"}
                    />
                    <Text
                      style={{
                        color: isDisabled ? "gray" : "#F6F6F6",
                        fontWeight: "700",
                      }}
                    >
                      Create
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            );
          })()}
        </View>
      </View>
    </SafeAreaView>
  );
};
export default LangScreen;
