import User from "../models/User.js";
import Product from "../models/Product.js";
import Inventory from "../models/Inventory.js";

export const seedData = async (req, res) => {
  try {
    // Security check - only allow in development or with secret key
    const secretKey = req.headers["x-seed-secret"] || req.query.secret;
    if (process.env.NODE_ENV === "production" && secretKey !== process.env.SEED_SECRET) {
      return res.status(403).json({ message: "Forbidden - Invalid seed secret" });
    }

    console.log("🌱 Starting seed process...");

    // Clear existing sample data
    await User.deleteMany({ isSample: true });
    await Product.deleteMany({ name: "Rau cải ngọt" });
    await Inventory.deleteMany({ cooperative: { $exists: true } });

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
    const usernames = cooperativesData.map((c) => c.username);
    await User.deleteMany({ username: { $in: usernames } });

    for (const coop of cooperativesData) {
      const created = await User.create({
        username: coop.username,
        companyName: coop.name,
        password: "password123", // Will be hashed by pre-save hook
        role: "cooperative",
        email: `${coop.username}@greenco-op.com`,
        isConfirmed: true,
        isSample: true,
        address: coop.location,
        phone: `028-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      });

      const product = await Product.create({
        name: "Rau cải ngọt",
        description: "Rau cải ngọt tươi, canh tác theo quy trình VietGAP",
        dailyCapacity: Math.floor(50 + Math.random() * 200),
        unit: "kg",
        pricePerUnit: coop.price,
        location: coop.location,
        cooperative: created._id,
      });

      await Inventory.create({
        cooperative: created._id,
        product: product._id,
        sku: `RAU-CN-${String(coop.username).toUpperCase()}`,
        quantity: Math.floor(200 + Math.random() * 800),
        unit: "kg",
        location: created.address,
        updatedAt: new Date(),
      });

      createdCoops.push({
        id: created._id,
        username: created.username,
        name: created.companyName,
        product: product.name,
        price: coop.price,
      });
    }

    console.log("✅ Seed data created successfully");

    res.status(200).json({
      success: true,
      message: `Successfully seeded ${createdCoops.length} cooperatives with products and inventory`,
      data: createdCoops,
    });
  } catch (error) {
    console.error("❌ Seeding error:", error);
    res.status(500).json({
      success: false,
      message: "Error seeding data",
      error: error.message,
    });
  }
};

export const checkDataStatus = async (req, res) => {
  try {
    const cooperativesCount = await User.countDocuments({ role: "cooperative" });
    const productsCount = await Product.countDocuments();
    const inventoryCount = await Inventory.countDocuments();

    res.status(200).json({
      cooperatives: cooperativesCount,
      products: productsCount,
      inventory: inventoryCount,
      needsSeed: cooperativesCount === 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
