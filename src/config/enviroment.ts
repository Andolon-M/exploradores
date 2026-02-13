const isProduction = process.env.EXPRESS_PRODUCTION?.toLowerCase() === "true";

const getProtocol = () => (isProduction ? "https" : "http");

const getBaseHost = () =>
  isProduction
    ? process.env.API_BASE_URL || "localhost"
    : process.env.API_BASE_URL_LOCAL || "localhost";

const getWebHost = () =>
  isProduction
    ? process.env.BASE_URL || "localhost"
    : process.env.BASE_URL_LOCAL || "localhost";

const port = Number(process.env.EXPRESS_PORT || 3010);

export const environment = {
  isProduction,
  port,
  apiBaseUrl: `${getProtocol()}://${getBaseHost()}:${port}`,
  baseUrl: `${getProtocol()}://${getWebHost()}:${port}`
};
