/*
  Warnings:

  - You are about to drop the column `name` on the `leave_requirements` table. All the data in the column will be lost.
  - You are about to drop the column `upload_required` on the `leave_requirements` table. All the data in the column will be lost.
  - Added the required column `type` to the `leave_requirements` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "LeaveAttachment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "leave_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    CONSTRAINT "LeaveAttachment_leave_id_fkey" FOREIGN KEY ("leave_id") REFERENCES "leaves" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_leave_requirements" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "value" TEXT,
    "leave_type_id" INTEGER NOT NULL,
    CONSTRAINT "leave_requirements_leave_type_id_fkey" FOREIGN KEY ("leave_type_id") REFERENCES "leave_types" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_leave_requirements" ("id", "leave_type_id") SELECT "id", "leave_type_id" FROM "leave_requirements";
DROP TABLE "leave_requirements";
ALTER TABLE "new_leave_requirements" RENAME TO "leave_requirements";
CREATE UNIQUE INDEX "leave_requirements_type_leave_type_id_key" ON "leave_requirements"("type", "leave_type_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
