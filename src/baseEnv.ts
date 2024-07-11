type Platform = "web" | "weapp";

function getPlatform(): Platform {
  if (document) {
    return "web";
  } else {
    return "weapp";
  }
}

console.log(process.env);
export default Object.freeze({
  platform: getPlatform(),
  baseURL: process.env.REMAX_APP_BASE_API_URL,
  requestTimeout: 30000,
  TENCENT_MAP_KEY: process.env.REMAX_APP_TENCENT_MAP_KEY,
});
