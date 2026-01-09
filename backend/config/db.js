import mongoose from 'mongoose';

// Cached connection for serverless
let cachedConnection = null;

const connectDB = async () => {
    // Return cached connection if it exists
    if (cachedConnection && mongoose.connection.readyState === 1) {
        console.log('📦 Using cached MongoDB connection');
        return cachedConnection;
    }

    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // Serverless-friendly options
            maxPoolSize: 10,
            minPoolSize: 2,
            socketTimeoutMS: 45000,
            serverSelectionTimeoutMS: 10000,
            family: 4, // Use IPv4
        });

        cachedConnection = conn;
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        // Don't exit process in serverless
        throw error;
    }
};

export default connectDB;