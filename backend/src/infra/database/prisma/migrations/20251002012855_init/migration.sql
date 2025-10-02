-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "originalFileName" TEXT NOT NULL,
    "originalFilePath" TEXT NOT NULL,
    "originalFileType" TEXT NOT NULL,
    "objectives" TEXT,
    "activities" TEXT,
    "evaluation" TEXT,
    "resources" TEXT,
    "duration" TEXT,
    "targetAudience" TEXT,
    "subject" TEXT,
    "standardizedFilePath" TEXT,
    "standardizedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
