-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "avatar" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Wager" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "stakeAmount" DECIMAL,
    "stakeCurrency" TEXT NOT NULL DEFAULT 'USD',
    "deadline" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "resolution" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Wager_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WagerParticipant" (
    "wagerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("wagerId", "userId"),
    CONSTRAINT "WagerParticipant_wagerId_fkey" FOREIGN KEY ("wagerId") REFERENCES "Wager" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WagerParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Proof" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wagerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "evidence" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Proof_wagerId_fkey" FOREIGN KEY ("wagerId") REFERENCES "Wager" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Proof_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wagerId" TEXT NOT NULL,
    "voterId" TEXT NOT NULL,
    "isValid" BOOLEAN NOT NULL,
    "comment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Vote_wagerId_fkey" FOREIGN KEY ("wagerId") REFERENCES "Wager" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Vote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wagerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Comment_wagerId_fkey" FOREIGN KEY ("wagerId") REFERENCES "Wager" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Wager_status_idx" ON "Wager"("status");

-- CreateIndex
CREATE INDEX "Wager_deadline_idx" ON "Wager"("deadline");

-- CreateIndex
CREATE INDEX "Wager_createdBy_idx" ON "Wager"("createdBy");

-- CreateIndex
CREATE INDEX "Proof_wagerId_idx" ON "Proof"("wagerId");

-- CreateIndex
CREATE INDEX "Proof_userId_idx" ON "Proof"("userId");

-- CreateIndex
CREATE INDEX "Vote_wagerId_idx" ON "Vote"("wagerId");

-- CreateIndex
CREATE INDEX "Vote_voterId_idx" ON "Vote"("voterId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_wagerId_voterId_key" ON "Vote"("wagerId", "voterId");

-- CreateIndex
CREATE INDEX "Comment_wagerId_idx" ON "Comment"("wagerId");

-- CreateIndex
CREATE INDEX "Comment_userId_idx" ON "Comment"("userId");
