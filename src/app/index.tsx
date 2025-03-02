import { useSQLiteContext } from "expo-sqlite";
import { useEffect } from "react";
import { Text, View } from "react-native";

const HomeScreen = () => {
  const db = useSQLiteContext();
  useEffect(() => {
    async function setup() {
      const result = await db.getAllAsync("SELECT * FROM languages");
      console.log(result, "result");
    }
    setup();
  }, []);
  return (
    <View>
      <Text>hello world</Text>
    </View>
  );
};
export default HomeScreen;
