import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "@/config/docs/swagger.config";
import { environment } from "@/config/enviroment";
import {
  authLimiter,
  generalLimiter,
  sensitiveApiLimiter
} from "@/config/rate-limit/rateLimit.config";
import router from "@/routes/router";

const app = express();
const PORT = environment.port;

app.use(
  cors({
    origin: true,
    credentials: true
  })
);
app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  })
);

app.get("/", (_req, res) => {
  res.redirect("/api-docs");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api/swagger.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

const isRateLimitEnabled = process.env.ENABLE_RATE_LIMIT?.toLowerCase() !== "false";

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "exploradores-api",
    timestamp: new Date().toISOString(),
    rateLimiting: isRateLimitEnabled
  });
});

if (isRateLimitEnabled) {
  app.use("/api/auth", authLimiter);
  app.use("/api/explorers", sensitiveApiLimiter);
  app.use("/api/commanders", sensitiveApiLimiter);
  app.use("/api", generalLimiter);
}

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Exploradores API ejecutandose en ${environment.apiBaseUrl}`);
  console.log(`Swagger en ${environment.apiBaseUrl}/api-docs`);
});
