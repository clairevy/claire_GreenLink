import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Inventory from "../models/Inventory.js";

dotenv.config();

const run = async () => {
  try {
    await connectDB();
    console.log("Connected to DB for seeding");

    // Clear existing sample cooperatives & product (only sample ones)
    await User.deleteMany({ isSample: true });
    await Product.deleteMany({ isSample: true });
    await Inventory.deleteMany({ cooperative: { $exists: true } });

    // List of districts/locations in HCM area (southern region)
    const cooperativesData = [
      {
        username: "htx_cuchi_01",
        name: "HTX Củ Chi 1",
        location: "Củ Chi",
        price: 12.5,
      },
      {
        username: "htx_cuchi_02",
        name: "HTX Củ Chi 2",
        location: "Củ Chi",
        price: 11.0,
      },
      {
        username: "htx_thuduc",
        name: "HTX Thủ Đức",
        location: "Thủ Đức",
        price: 13.0,
      },
      {
        username: "htx_binhtan",
        name: "HTX Bình Tân",
        location: "Bình Tân",
        price: 12.0,
      },
      {
        username: "htx_tandiep",
        name: "HTX Tân Điệp",
        location: "Quận 12",
        price: 10.5,
      },
      {
        username: "htx_longphuoc",
        name: "HTX Long Phước",
        location: "Nhơn Trạch (Đồng Nai)",
        price: 9.8,
      },
    ];
    const createdCoops = [];
    // clean any existing docs for these sample usernames or products
    const usernames = cooperativesData.map((c) => c.username);
    await User.deleteMany({ username: { $in: usernames } });
    await Product.deleteMany({ name: "Rau cải ngọt" });
    for (const coop of cooperativesData) {
      const created = await User.create({
        username: coop.username,
        companyName: coop.name,
        password: "password123",
        role: "cooperative",
        email: `${coop.username}@example.test`,
        isConfirmed: true,
        isSample: true,
        address: coop.location,
      });

      // Create a Product document for this cooperative (same product name, different price and capacity)
      const product = await Product.create({
        name: "Rau cải ngọt",
        description: "Rau cải ngọt tươi, canh tác theo quy trình sạch",
        dailyCapacity: Math.floor(50 + Math.random() * 200),
        unit: "kg",
        pricePerUnit: coop.price,
        location: coop.location,
        cooperative: created._id,
      });

      // Create inventory entry for the cooperative/product
      await Inventory.create({
        cooperative: created._id,
        product: product._id,
        sku: `RAU-CN-${String(created.username).toUpperCase()}`,
        quantity: Math.floor(200 + Math.random() * 800),
        unit: "kg",
        location: created.address,
        updatedAt: new Date(),
      });

      createdCoops.push({ doc: created, product, price: coop.price });
    }

    console.log("Seed data created: cooperatives + products + inventories");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error", err);
    process.exit(1);
  }
};

run();
