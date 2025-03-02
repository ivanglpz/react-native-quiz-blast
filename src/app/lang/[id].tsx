import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { InputSelect } from "../../components/input_select";
import { Gap } from "../../constants/styles";
import { fetchLanguage } from "../../services/languages";
import { listVerbsById } from "../../services/verbs";

const LangScreen = () => {
  const params = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();

  const { data } = useQuery({
    queryKey: ["lang", db, params?.id],
    queryFn: () => fetchLanguage(db, params?.id),
  });
  const { data: ListVerbs } = useQuery({
    queryKey: ["verbs", db, params?.id],
    queryFn: () => listVerbsById(db, params?.id),
  });
  const [optionVerbTense, setoptionVerbTense] = useState<string | null>(null);
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
        <View>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 24,
            }}
          >
            Quiz - {data?.name}
          </Text>
          <Text>
            Easily create your own quizzes and start testing your knowledge in
            no time.
          </Text>
        </View>
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
            value={optionVerbTense}
            onChange={(v) => {
              setoptionVerbTense(v?.value);
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
              optionVerbTense === null || optionVerbTense === undefined;
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
                onPress={handleSubmit}
              >
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
              </TouchableOpacity>
            );
          })()}
        </View>
      </View>
    </SafeAreaView>
  );
};
export default LangScreen;
