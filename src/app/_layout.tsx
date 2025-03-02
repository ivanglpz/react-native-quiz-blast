import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { migrateDbIfNeeded } from "../db/migration";
const queryClient = new QueryClient();
export default function HomeLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SQLiteProvider databaseName="app_1.db" onInit={migrateDbIfNeeded}>
        <Slot />
      </SQLiteProvider>
    </QueryClientProvider>
  );
}
