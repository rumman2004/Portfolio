import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    bio: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    resume: {
        public_id: String,
        url: String
    },
    profileImage: {
        public_id: String,
        url: String
    },
    // NEW: Stats for homepage
    stats: {
        yearsExperience: {
            type: Number,
            default: 2
        },
        projectsCompleted: {
            type: Number,
            default: 10
        },
        certificatesEarned: {
            type: Number,
            default: 5
        },
        happyClients: {
            type: Number,
            default: 10
        }
    }
}, {
    timestamps: true
});

const About = mongoose.model('About', aboutSchema);

export default About;
