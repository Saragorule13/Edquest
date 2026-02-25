import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDatabase, getDb } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// ─── POST /api/activity-logs ─────────────────────────────────────────────────
// Receives activity logs from the frontend and persists them to MongoDB
app.post('/api/activity-logs', async (req, res) => {
    try {
        const { testId, userId, sessionId, logs } = req.body;

        if (!testId || !logs || !Array.isArray(logs) || logs.length === 0) {
            return res.status(400).json({
                error: 'Invalid payload. Required: testId, logs[]',
            });
        }

        const db = getDb();
        const collection = db.collection('activity_logs');

        const document = {
            testId,
            userId: userId || 'anonymous',
            sessionId: sessionId || 'unknown',
            logCount: logs.length,
            logs,
            createdAt: new Date(),
        };

        const result = await collection.insertOne(document);

        console.log(
            `📋 Activity log saved — session: ${sessionId}, test: ${testId}, entries: ${logs.length}`
        );

        res.status(201).json({
            message: 'Activity logs saved successfully',
            insertedId: result.insertedId,
        });
    } catch (error) {
        console.error('❌ Error saving activity logs:', error.message);
        res.status(500).json({ error: 'Failed to save activity logs' });
    }
});

// ─── GET /api/activity-logs/:testId ──────────────────────────────────────────
// Utility endpoint to retrieve all log sessions for a given test
app.get('/api/activity-logs/:testId', async (req, res) => {
    try {
        const { testId } = req.params;
        const db = getDb();
        const collection = db.collection('activity_logs');

        const logs = await collection
            .find({ testId })
            .sort({ createdAt: -1 })
            .toArray();

        res.status(200).json({ testId, count: logs.length, logs });
    } catch (error) {
        console.error('❌ Error fetching activity logs:', error.message);
        res.status(500).json({ error: 'Failed to fetch activity logs' });
    }
});

// ─── Health check ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Start server ────────────────────────────────────────────────────────────
async function start() {
    await connectToDatabase();
    app.listen(PORT, () => {
        console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    });
}

start();
