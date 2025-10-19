-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_leaves" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "start_date" DATETIME NOT NULL,
    "end_date" DATETIME NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "employee_id" TEXT NOT NULL,
    "leave_type_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "leaves_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee" ("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "leaves_leave_type_id_fkey" FOREIGN KEY ("leave_type_id") REFERENCES "leave_types" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_leaves" ("created_at", "employee_id", "end_date", "id", "leave_type_id", "reason", "start_date", "status", "type", "updated_at") SELECT "created_at", "employee_id", "end_date", "id", "leave_type_id", "reason", "start_date", "status", "type", "updated_at" FROM "leaves";
DROP TABLE "leaves";
ALTER TABLE "new_leaves" RENAME TO "leaves";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
