import { SQLiteDatabase } from "expo-sqlite";
import { schema } from "./schema";

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  await db.execAsync(schema);
  console.log(
    "-------   The database has been successfully migrated.   ------"
  );
}
