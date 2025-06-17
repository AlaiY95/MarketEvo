-- MarketEvo Database Schema
-- Run this script in psql to create all tables

-- Create users table
CREATE TABLE "users" (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    "displayName" TEXT,
    password TEXT NOT NULL,
    timezone TEXT DEFAULT 'Eastern Time (ET)',
    "tradingBio" TEXT,
    "isPremium" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "analysesUsed" INTEGER DEFAULT 0,
    "lastResetDate" TEXT DEFAULT '',
    "totalTrades" INTEGER DEFAULT 0,
    "winningTrades" INTEGER DEFAULT 0,
    "totalProfit" DOUBLE PRECISION DEFAULT 0.0,
    "totalLoss" DOUBLE PRECISION DEFAULT 0.0,
    "lessonsCompleted" INTEGER DEFAULT 0,
    "stripeCustomerId" TEXT UNIQUE,
    "stripeSubscriptionId" TEXT UNIQUE,
    "subscriptionStatus" TEXT,
    "subscriptionPeriodEnd" TIMESTAMP WITH TIME ZONE
);

-- Create chart_analyses table
CREATE TABLE "chart_analyses" (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "imageName" TEXT NOT NULL,
    "imageSize" INTEGER NOT NULL,
    "tradingStyle" TEXT NOT NULL,
    pattern TEXT,
    confidence TEXT,
    timeframe TEXT,
    trend TEXT,
    "entryPoint" DOUBLE PRECISION,
    "stopLoss" DOUBLE PRECISION,
    target DOUBLE PRECISION,
    "riskReward" TEXT,
    explanation TEXT,
    "fullAnalysis" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY ("userId") REFERENCES "users"(id) ON DELETE CASCADE
);

-- Create trades table
CREATE TABLE "trades" (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    symbol TEXT NOT NULL,
    "tradingStyle" TEXT NOT NULL,
    "entryPrice" DOUBLE PRECISION NOT NULL,
    "exitPrice" DOUBLE PRECISION,
    "stopLoss" DOUBLE PRECISION,
    "takeProfit" DOUBLE PRECISION,
    quantity INTEGER NOT NULL,
    status TEXT DEFAULT 'open',
    "isWin" BOOLEAN,
    "profitLoss" DOUBLE PRECISION,
    "entryDate" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "exitDate" TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    "analysisId" TEXT,
    FOREIGN KEY ("userId") REFERENCES "users"(id) ON DELETE CASCADE
);

-- Create user_sessions table
CREATE TABLE "user_sessions" (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT UNIQUE NOT NULL,
    "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY ("userId") REFERENCES "users"(id) ON DELETE CASCADE
);

-- Create support_tickets table
CREATE TABLE "support_tickets" (
    id TEXT PRIMARY KEY,
    "userId" TEXT,
    email TEXT NOT NULL,
    reason TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'open',
    priority TEXT DEFAULT 'normal',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY ("userId") REFERENCES "users"(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON "users"(email);
CREATE INDEX idx_users_stripe_customer ON "users"("stripeCustomerId");
CREATE INDEX idx_chart_analyses_user ON "chart_analyses"("userId");
CREATE INDEX idx_chart_analyses_created ON "chart_analyses"("createdAt");
CREATE INDEX idx_trades_user ON "trades"("userId");
CREATE INDEX idx_trades_symbol ON "trades"(symbol);
CREATE INDEX idx_trades_status ON "trades"(status);
CREATE INDEX idx_user_sessions_user ON "user_sessions"("userId");
CREATE INDEX idx_user_sessions_session ON "user_sessions"("sessionId");
CREATE INDEX idx_support_tickets_user ON "support_tickets"("userId");
CREATE INDEX idx_support_tickets_status ON "support_tickets"(status);

-- Add updated_at trigger for users table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON "users"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chart_analyses_updated_at BEFORE UPDATE ON "chart_analyses"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON "support_tickets"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verify tables were created
\dt

-- Show table structure
\d "users"