import mongoose from 'mongoose';

const connect = async () => {
    try {
        // Connection events
        mongoose.connection.on('connecting', () => {
            console.log('Connecting to MongoDB...');
        });

        mongoose.connection.on('connected', () => {
            console.log('✅ MongoDB connected successfully!');
            console.log(`Database: ${mongoose.connection.db.databaseName}`);
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('ℹ️  MongoDB disconnected');
        });

        // Connection options
        const options = {
            serverSelectionTimeoutMS: 10000, // 10 seconds
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000,
            family: 4, // Use IPv4, skip trying IPv6
        };

        // Attempt to connect
        await mongoose.connect(process.env.MONGO_URL, options);
        
        return mongoose.connection;
    } catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error.message);
        console.error('Error details:', error);
        process.exit(1);
    }
};

export default connect;