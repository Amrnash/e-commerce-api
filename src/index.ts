import mongoose from "mongoose";
import { app } from "./app";

mongoose
  .connect(process.env.MONGO_DB!)
  .then(() => {
    console.log("Successfully connected to MongoDB!");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server is running on ${PORT}`);
});
