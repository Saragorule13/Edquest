import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let db;

export async function connectToDatabase() {
    if (db) return db;

    try {
        await client.connect();
        db = client.db('edquest');
        console.log('✅ Connected to MongoDB Atlas — database: edquest');
        return db;
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        process.exit(1);
    }
}

export function getDb() {
    if (!db) {
        throw new Error('Database not initialized. Call connectToDatabase() first.');
    }
    return db;
}
