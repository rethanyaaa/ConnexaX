import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import postRoutes from "./routes/posts.routes.js"
import cors from "cors";
 

dotenv.config();
const app = express();

app.set("port", process.env.PORT || 8000);
app.use(cors());
app.use(postRoutes)
app.use(express.json({limit: "40kb"}));
app.use(express.urlencoded({limit: "40kb", extended: true}))


const start = async () => {
  app.set("mongo_user");
  const connectionDb = await mongoose.connect(
      "mongodb+srv://rethanya888:vHn6fzjH5qClw4Kx@cluster0.zex9c.mongodb.net/connexax?retryWrites=true&w=majority&appName=Cluster0"
  );
  console.log(`MONGO Connected DB Host: ${connectionDb.connection.host}`);
  app.listen(app.get("port"), () => {
    console.log("Listening on port 8000");
  });
};

start();
