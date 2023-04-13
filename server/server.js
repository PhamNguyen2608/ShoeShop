import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./config/MongoDb.js";
import ImportData from "./DataImport.js";
import productRoute from "./Routes/ProductRoutes.js";
import { errorHandler, notFound } from "./Middleware/Errors.js";
import userRouter from "./Routes/UserRoutes.js";
import orderRouter from "./Routes/orderRoutes.js";
import discountRoute from "./Routes/discountRoutes.js";
import categoriesRoute from "./Routes/categoriesRoutes.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
connectDatabase();
const app = express();
app.use(express.json());

// Serve static files from the 'client' directory
app.use(express.static(path.join(__dirname, "..", "client")));

// Handle other routes
app.get("*", (req, res, next) => {
  if (req.originalUrl.startsWith("/api")) return next();
  res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

// API
app.use("/api/import", ImportData);
app.use("/api/products", productRoute);
app.use("/api/discount", discountRoute);
app.use("/api/categories", categoriesRoute);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});

// ERROR HANDLER
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`server run in port ${PORT}`));
