import express from "express";
import path from 'node:path';
import * as dotenv from 'dotenv';
import bootstrap from "./src/app.controller.js";

const app = express();
dotenv.config({ path: path.resolve("./src/config/.env.dev") });
const port = process.env.PORT || 5000;
bootstrap(app,express);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
