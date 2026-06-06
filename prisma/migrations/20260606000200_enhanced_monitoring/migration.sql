-- AlterTable
ALTER TABLE "AiResponse"
ALTER COLUMN "keywordId" DROP NOT NULL,
ALTER COLUMN "questionId" DROP NOT NULL,
ADD COLUMN "questionText" TEXT NOT NULL DEFAULT '',
ADD COLUMN "enrichmentEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "webSearchUsed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "enrichmentError" TEXT,
ADD COLUMN "searchResults" TEXT NOT NULL DEFAULT '[]',
ADD COLUMN "prompt" TEXT,
ADD COLUMN "rawResponse" TEXT,
ADD COLUMN "mentionedBrand" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "mentionedAddress" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "mentionedPhone" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "mentionedWebsite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "matchedKeywords" TEXT NOT NULL DEFAULT '[]';

-- CreateTable
CREATE TABLE "ProjectKnowledge" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "aliases" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "website" TEXT NOT NULL DEFAULT '',
    "mapUrl" TEXT NOT NULL DEFAULT '',
    "introduction" TEXT NOT NULL DEFAULT '',
    "specialties" TEXT NOT NULL DEFAULT '',
    "webSearchEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectKnowledge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectKnowledge_projectId_key" ON "ProjectKnowledge"("projectId");

-- CreateIndex
CREATE INDEX "ProjectKnowledge_projectId_idx" ON "ProjectKnowledge"("projectId");

-- AddForeignKey
ALTER TABLE "ProjectKnowledge" ADD CONSTRAINT "ProjectKnowledge_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
