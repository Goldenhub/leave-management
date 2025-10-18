/*
  Warnings:

  - Added the required column `employment_date` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Employee" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "password_updated" BOOLEAN NOT NULL DEFAULT false,
    "employment_date" DATETIME NOT NULL,
    "termination_date" DATETIME,
    "employment_status" TEXT NOT NULL DEFAULT 'Active',
    "departmentId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Employee_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Employee" ("address", "createdAt", "departmentId", "email", "employee_id", "employment_status", "first_name", "id", "last_name", "password", "password_updated", "phone", "updatedAt") SELECT "address", "createdAt", "departmentId", "email", "employee_id", "employment_status", "first_name", "id", "last_name", "password", "password_updated", "phone", "updatedAt" FROM "Employee";
DROP TABLE "Employee";
ALTER TABLE "new_Employee" RENAME TO "Employee";
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");
CREATE UNIQUE INDEX "Employee_employee_id_key" ON "Employee"("employee_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
