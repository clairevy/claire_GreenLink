import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const MONGO =
  process.env.MONGODB_CONNECTION_STRING ||
  "mongodb://localhost:27017/greencoop";

const samples = [
  {
    username: "htx_cuchi_1",
    email: "htx1@example.com",
    password: "password123",
    role: "cooperative",
    companyName: "HTX Củ Chi - Nông Nghiệp Xanh",
    address: "Củ Chi, TP.HCM",
    phone: "+84 90 111 2222",
    imageUrls: [
      "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg",
    ],
  },
  {
    username: "htx_greenlink",
    email: "htx2@example.com",
    password: "password123",
    role: "cooperative",
    companyName: "GreenLink Coop",
    address: "Huyện Củ Chi, TP.HCM",
    phone: "+84 90 333 4444",
    imageUrls: [
      "https://images.pexels.com/photos/1619311/pexels-photo-1619311.jpeg",
    ],
  },
];

async function seed() {
  await mongoose.connect(MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to MongoDB for coop seeding");

  for (const s of samples) {
    const existing = await User.findOne({ email: s.email });
    if (existing) {
      console.log(`Skipping existing: ${s.email}`);
      continue;
    }

    const user = new User({
      username: s.username,
      email: s.email,
      password: s.password,
      role: s.role,
      companyName: s.companyName,
      address: s.address,
      phone: s.phone,
      imageUrls: s.imageUrls,
      isConfirmed: true,
    });

    await user.save();
    console.log(`Created cooperative: ${s.username}`);
  }

  await mongoose.disconnect();
  console.log("Seeding finished");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
