/*
  Warnings:

  - A unique constraint covering the columns `[title,departmentId]` on the table `designations` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "designations_title_key";

-- CreateIndex
CREATE UNIQUE INDEX "designations_title_departmentId_key" ON "designations"("title", "departmentId");
