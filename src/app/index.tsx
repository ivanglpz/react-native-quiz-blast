import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { listLanguages } from "../services/languages";

const HomeScreen = () => {
  const db = useSQLiteContext();
  const { data } = useQuery({
    queryKey: ["languages", db],
    queryFn: () => listLanguages(db),
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
          padding: 20,
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 24,
          }}
        >
          Quiz Blast
        </Text>
        <Text>What language do you want to practice?</Text>
        <View style={styles.separator} />
        <FlatList
          data={data ?? []}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  router.push(`/lang/${item?.id}`);
                }}
              >
                <Text style={styles.button_text}>{item?.name}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  separator: {
    backgroundColor: "#EEEEEE",
    width: "100%",
    height: 2,
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#F6F6F6",
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 15,
    display: "flex",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#EEEEEE",
    borderRadius: 6,
  },
  button_text: {
    fontWeight: "600",
  },
});
export default HomeScreen;
