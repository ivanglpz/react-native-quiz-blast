import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { migrateDbIfNeeded } from "../db/migration";
const queryClient = new QueryClient();
export default function HomeLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SQLiteProvider databaseName="app_2.db" onInit={migrateDbIfNeeded}>
        <StatusBar style="dark" translucent={false} />
        <Slot />
      </SQLiteProvider>
    </QueryClientProvider>
  );
}
