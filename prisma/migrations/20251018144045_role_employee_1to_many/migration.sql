/*
  Warnings:

  - You are about to drop the `_EmployeeRoles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `departmentId` on the `Employee` table. All the data in the column will be lost.
  - Added the required column `department_id` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_id` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_EmployeeRoles_B_index";

-- DropIndex
DROP INDEX "_EmployeeRoles_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_EmployeeRoles";
PRAGMA foreign_keys=on;

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
    "department_id" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Employee_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Employee_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Employee" ("address", "createdAt", "email", "employee_id", "employment_date", "employment_status", "first_name", "id", "last_name", "password", "password_updated", "phone", "termination_date", "updatedAt") SELECT "address", "createdAt", "email", "employee_id", "employment_date", "employment_status", "first_name", "id", "last_name", "password", "password_updated", "phone", "termination_date", "updatedAt" FROM "Employee";
DROP TABLE "Employee";
ALTER TABLE "new_Employee" RENAME TO "Employee";
CREATE UNIQUE INDEX "Employee_employee_id_key" ON "Employee"("employee_id");
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
