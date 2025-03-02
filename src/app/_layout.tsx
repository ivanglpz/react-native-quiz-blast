import { Slot } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { migrateDbIfNeeded } from "../db/migration";

export default function HomeLayout() {
  return (
    <SQLiteProvider databaseName="app_1.db" onInit={migrateDbIfNeeded}>
      <Slot />
    </SQLiteProvider>
  );
}
