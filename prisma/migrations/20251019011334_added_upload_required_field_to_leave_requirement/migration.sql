-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_leave_requirements" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "upload_required" BOOLEAN NOT NULL DEFAULT false,
    "leave_type_id" INTEGER NOT NULL,
    CONSTRAINT "leave_requirements_leave_type_id_fkey" FOREIGN KEY ("leave_type_id") REFERENCES "leave_types" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_leave_requirements" ("id", "leave_type_id", "name") SELECT "id", "leave_type_id", "name" FROM "leave_requirements";
DROP TABLE "leave_requirements";
ALTER TABLE "new_leave_requirements" RENAME TO "leave_requirements";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
