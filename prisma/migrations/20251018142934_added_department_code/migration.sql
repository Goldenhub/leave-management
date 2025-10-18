/*
  Warnings:

  - Added the required column `code` to the `departments` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_departments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_departments" ("created_at", "id", "name", "updated_at") SELECT "created_at", "id", "name", "updated_at" FROM "departments";
DROP TABLE "departments";
ALTER TABLE "new_departments" RENAME TO "departments";
CREATE UNIQUE INDEX "departments_code_key" ON "departments"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
