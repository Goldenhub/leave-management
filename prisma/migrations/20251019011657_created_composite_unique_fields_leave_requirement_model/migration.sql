/*
  Warnings:

  - A unique constraint covering the columns `[name,leave_type_id]` on the table `leave_requirements` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "leave_requirements_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "leave_requirements_name_leave_type_id_key" ON "leave_requirements"("name", "leave_type_id");
