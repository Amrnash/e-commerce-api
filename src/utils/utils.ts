import mongoose from "mongoose";

export async function clearDatabase() {
  try {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany();
    }
    console.log("Database cleared");
  } catch (error) {
    console.error("Error clearing database:", error);
  }
}
