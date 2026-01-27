/*
  Warnings:

  - Added the required column `updatedAt` to the `leave_attachments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `leave_requirements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `leave_types` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "leave_balance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employee_id" TEXT NOT NULL,
    "leave_type_id" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "allocated_days" INTEGER NOT NULL,
    "used_days" INTEGER NOT NULL,
    "remaining_days" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "leave_balance_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees" ("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "leave_balance_leave_type_id_fkey" FOREIGN KEY ("leave_type_id") REFERENCES "leave_types" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_leave_attachments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "leave_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "leave_attachments_leave_id_fkey" FOREIGN KEY ("leave_id") REFERENCES "leaves" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_leave_attachments" ("id", "leave_id", "type", "url") SELECT "id", "leave_id", "type", "url" FROM "leave_attachments";
DROP TABLE "leave_attachments";
ALTER TABLE "new_leave_attachments" RENAME TO "leave_attachments";
CREATE TABLE "new_leave_requirements" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "leave_type_id" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "leave_requirements_leave_type_id_fkey" FOREIGN KEY ("leave_type_id") REFERENCES "leave_types" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_leave_requirements" ("id", "leave_type_id", "type", "value") SELECT "id", "leave_type_id", "type", "value" FROM "leave_requirements";
DROP TABLE "leave_requirements";
ALTER TABLE "new_leave_requirements" RENAME TO "leave_requirements";
CREATE UNIQUE INDEX "leave_requirements_type_leave_type_id_key" ON "leave_requirements"("type", "leave_type_id");
CREATE TABLE "new_leave_types" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "max_days" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_leave_types" ("description", "id", "max_days", "name") SELECT "description", "id", "max_days", "name" FROM "leave_types";
DROP TABLE "leave_types";
ALTER TABLE "new_leave_types" RENAME TO "leave_types";
CREATE UNIQUE INDEX "leave_types_name_key" ON "leave_types"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
