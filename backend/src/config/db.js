import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING); 
        console.log("Database connected successfully");
    }
    catch (error) {
        console.error("Error connecting to the database:", error);
        process.exit(1); // close the app if cannot connect to database
    }
}
export default connectDB;