import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING); 
        console.log("✅ Database connected successfully");
    }
    catch (error) {
        console.error("❌ Error connecting to the database:", error.message);
        console.log("⚠️  Server will continue running, but database operations will fail");
        console.log("💡 Check your MONGODB_CONNECTION_STRING environment variable");
        // Don't exit in production - let health check respond
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
    }
}
export default connectDB;