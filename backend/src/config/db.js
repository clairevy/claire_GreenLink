import mongoose from 'mongoose';

const connectDB = async (retries = 5, delay = 5000) => {
    for (let i = 0; i < retries; i++) {
        try {
            if (!process.env.MONGODB_CONNECTION_STRING) {
                throw new Error("MONGODB_CONNECTION_STRING is not defined in environment variables");
            }

            await mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
                serverSelectionTimeoutMS: 10000, // 10 seconds timeout
            }); 
            
            console.log("✅ Database connected successfully");
            console.log(`📊 Database: ${mongoose.connection.name}`);
            return; // Success, exit function
        }
        catch (error) {
            console.error(`❌ Database connection attempt ${i + 1}/${retries} failed:`, error.message);
            
            if (i < retries - 1) {
                console.log(`⏳ Retrying in ${delay / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error("❌ All database connection attempts failed");
                console.log("⚠️  Server will continue running, but database operations will fail");
                console.log("💡 Check your MONGODB_CONNECTION_STRING environment variable");
                console.log("💡 Current connection string format:", 
                    process.env.MONGODB_CONNECTION_STRING ? 
                    process.env.MONGODB_CONNECTION_STRING.substring(0, 30) + "..." : 
                    "NOT SET");
                
                // Don't exit in production - let health check respond
                if (process.env.NODE_ENV !== 'production') {
                    process.exit(1);
                }
            }
        }
    }
}

// Handle connection events
mongoose.connection.on('connected', () => {
    console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  Mongoose disconnected from MongoDB');
});

export default connectDB;