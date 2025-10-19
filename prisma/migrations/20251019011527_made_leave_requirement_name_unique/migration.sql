/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `leave_requirements` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "leave_requirements_name_key" ON "leave_requirements"("name");
