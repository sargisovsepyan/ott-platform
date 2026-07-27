const mongoose = require("mongoose");

// Функция подключения к базе данных.
const connectDB = async () => {

    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        throw new Error("MONGO_URI is not defined");
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ MongoDB connected successfully");
    } catch (error) {
        console.error("❌ MongoDB connection failed");
        console.error(error.message);

        process.exit(1);
    }
};

module.exports = connectDB;
