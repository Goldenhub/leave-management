-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_employees" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employee_id" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "gender" TEXT,
    "date_of_birth" DATETIME NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "password_updated" BOOLEAN NOT NULL DEFAULT false,
    "employment_status" TEXT NOT NULL DEFAULT 'Active',
    "employment_date" DATETIME NOT NULL,
    "termination_date" DATETIME,
    "role_id" INTEGER NOT NULL,
    "designation_id" INTEGER NOT NULL,
    "department_id" INTEGER NOT NULL,
    "manager_id" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "employees_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "employees_designation_id_fkey" FOREIGN KEY ("designation_id") REFERENCES "designations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "employees_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "employees_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "employees" ("employee_id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_employees" ("address", "createdAt", "date_of_birth", "department_id", "designation_id", "email", "employee_id", "employment_date", "employment_status", "first_name", "gender", "id", "last_name", "manager_id", "password", "password_updated", "phone", "role_id", "termination_date", "updatedAt") SELECT "address", "createdAt", "date_of_birth", "department_id", "designation_id", "email", "employee_id", "employment_date", "employment_status", "first_name", "gender", "id", "last_name", "manager_id", "password", "password_updated", "phone", "role_id", "termination_date", "updatedAt" FROM "employees";
DROP TABLE "employees";
ALTER TABLE "new_employees" RENAME TO "employees";
CREATE UNIQUE INDEX "employees_employee_id_key" ON "employees"("employee_id");
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
