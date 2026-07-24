const API_BASE = "/api";

let getAccessToken = () => null;
let handleUnauthorized = () => {};

export class ApiError extends Error {
  constructor({ status = 0, message, errors = [], code, data = null }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = Array.isArray(errors) ? errors : [];
    this.code = code;
    this.data = data;
  }
}

export function configureApiClient({ getToken, onUnauthorized }) {
  getAccessToken = typeof getToken === "function" ? getToken : () => null;
  handleUnauthorized =
    typeof onUnauthorized === "function" ? onUnauthorized : () => {};

  return () => {
    getAccessToken = () => null;
    handleUnauthorized = () => {};
  };
}

function isJsonResponse(response) {
  return response.headers.get("content-type")?.includes("application/json");
}

async function parseResponse(response) {
  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  if (!text) {
    return null;
  }

  if (isJsonResponse(response)) {
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function getErrorMessage(status, data) {
  if (status >= 500) {
    return "The service could not complete this request. Please try again.";
  }

  if (typeof data === "object" && typeof data?.message === "string") {
    return data.message;
  }

  if (status === 429) {
    return "Too many requests. Please wait a moment and try again.";
  }

  if (status === 404) {
    return "The requested resource was not found.";
  }

  return "The request could not be completed.";
}

export async function apiRequest(
  path,
  { method = "GET", body, signal, headers: customHeaders, auth = true } = {},
) {
  const headers = new Headers(customHeaders);
  headers.set("Accept", "application/json");

  const token = auth ? getAccessToken() : null;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let requestBody = body;
  if (body !== undefined && body !== null && !(body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
    requestBody = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      body: requestBody,
      headers,
      signal,
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    throw new ApiError({
      message: "Unable to reach the service. Check your connection and try again.",
    });
  }

  const data = await parseResponse(response);

  if (!response.ok) {
    const apiError = new ApiError({
      status: response.status,
      message: getErrorMessage(response.status, data),
      errors: typeof data === "object" ? data?.errors : [],
      code: typeof data === "object" ? data?.code : undefined,
      data: response.status < 500 && typeof data === "object" ? data : null,
    });

    if (response.status === 401 && token) {
      handleUnauthorized(apiError);
    }

    throw apiError;
  }

  return data;
}
