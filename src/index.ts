import http from "http";
import app from "./app.js";
import { env } from "./config/env.js";

const server = http.createServer(app);
const PORT = env.PORT || 3000;
server.listen(PORT, () => {
  console.warn(`Server is running on port ${PORT}`);
});