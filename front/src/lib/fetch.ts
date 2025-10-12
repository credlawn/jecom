const BASE_URL = process.env.BASE_URL;
const API_PATH = process.env.API_PATH;

if (!BASE_URL) {
  throw new Error("BASE_URL is not defined in environment variables");
}

async function authApi(input: RequestInfo, init?: RequestInit) {
  const url = typeof input === "string" ? new URL(input, BASE_URL).href : input;

  const headers = new Headers(init?.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const config: RequestInit = {
    ...init,
    headers,
    credentials: "include",
  };

  return await fetch(url, config);
}

async function api(apiPath: string, init?: RequestInit) {
  const fullPath = `${API_PATH}.${apiPath}`;
  return await authApi(fullPath, init);
}

export { authApi, api };