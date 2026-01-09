import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import About from '../model/About.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sahnazy99_db_user:kuYvCuVPPUSM6McA@cluster0.8pluv4n.mongodb.net/portfolio?retryWrites=true&w=majority';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

const seedAbout = async () => {
    await connectDB();

    try {
        // Check if about already exists
        const aboutExists = await About.findOne();

        if (aboutExists) {
            console.log('❌ About information already exists');
            console.log('Name:', aboutExists.name);
            process.exit(1);
        }

        // Create about info - CUSTOMIZE THIS!
        const about = await About.create({
            name: 'RUMMAN AHMED',
            title: 'Full Stack Developer',
            bio: 'Passionate full-stack developer with expertise in React, Node.js, and modern web technologies. I love building beautiful, functional applications that solve real-world problems.',
            email: 'rumman.ahmed.work@gmail.com',
            phone: '+91 6002364082',
            location: 'Sivasagar, Assam, India'
        });

        console.log('\n✅ About information created successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Name:', about.name);
        console.log('Title:', about.title);
        console.log('Email:', about.email);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('⚠️  Update this information from the admin panel!\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating about:', error);
        process.exit(1);
    }
};

seedAbout();