-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_leave_requirements" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "leave_type_id" INTEGER NOT NULL,
    CONSTRAINT "leave_requirements_leave_type_id_fkey" FOREIGN KEY ("leave_type_id") REFERENCES "leave_types" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_leave_requirements" ("id", "leave_type_id", "type", "value") SELECT "id", "leave_type_id", "type", "value" FROM "leave_requirements";
DROP TABLE "leave_requirements";
ALTER TABLE "new_leave_requirements" RENAME TO "leave_requirements";
CREATE UNIQUE INDEX "leave_requirements_type_leave_type_id_key" ON "leave_requirements"("type", "leave_type_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
