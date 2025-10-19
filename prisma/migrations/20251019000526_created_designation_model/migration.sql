/*
  Warnings:

  - You are about to drop the column `job_title` on the `Employee` table. All the data in the column will be lost.
  - Added the required column `designation_id` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "designations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "designations_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Employee" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employee_id" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "password_updated" BOOLEAN NOT NULL DEFAULT false,
    "employment_status" TEXT NOT NULL DEFAULT 'Active',
    "employment_date" DATETIME NOT NULL,
    "termination_date" DATETIME,
    "role_id" INTEGER NOT NULL,
    "designation_id" INTEGER NOT NULL,
    "department_id" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Employee_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Employee_designation_id_fkey" FOREIGN KEY ("designation_id") REFERENCES "designations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Employee_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Employee" ("address", "createdAt", "department_id", "email", "employee_id", "employment_date", "employment_status", "first_name", "id", "last_name", "password", "password_updated", "phone", "role_id", "termination_date", "updatedAt") SELECT "address", "createdAt", "department_id", "email", "employee_id", "employment_date", "employment_status", "first_name", "id", "last_name", "password", "password_updated", "phone", "role_id", "termination_date", "updatedAt" FROM "Employee";
DROP TABLE "Employee";
ALTER TABLE "new_Employee" RENAME TO "Employee";
CREATE UNIQUE INDEX "Employee_employee_id_key" ON "Employee"("employee_id");
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "designations_title_key" ON "designations"("title");
