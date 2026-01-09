import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Admin from '../model/Admin.js';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from backend root directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

console.log('📝 Environment Check:');
console.log('   PORT:', process.env.PORT);
console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✅ SET' : '❌ MISSING');

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in .env file');
        }

        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

const seedAdmin = async () => {
    await connectDB();

    try {
        // Check if admin exists
        const adminExists = await Admin.findOne();

        if (adminExists) {
            console.log('❌ Admin already exists');
            console.log('Email:', adminExists.email);
            console.log('Pass:', adminExists.password);
            process.exit(1);
        }

        // Create admin
        const admin = await Admin.create({
            name: 'Admin',
            email: 'rumman@portfolio.com',
            password: 'rumman@143'
        });

        console.log('\n✅ Admin created successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 Email: rumman@portfolio.com');
        console.log('🔑 Password: rumman@143');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('⚠️  IMPORTANT: Change your password after first login!\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        process.exit(1);
    }
};

seedAdmin();
