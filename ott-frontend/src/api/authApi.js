import { ApiError, apiRequest } from "./client";

export function normalizeUser(user) {
  if (!user || typeof user !== "object") {
    return null;
  }

  const id = user.id ?? user._id;
  if (!id || !user.email || !user.role) {
    return null;
  }

  return {
    id: String(id),
    name: typeof user.name === "string" ? user.name : "",
    email: String(user.email),
    role: String(user.role),
    createdAt: user.createdAt ?? null,
  };
}

export async function registerUser(credentials, { signal } = {}) {
  const data = await apiRequest("/auth/register", {
    method: "POST",
    body: credentials,
    signal,
    auth: false,
  });

  return {
    message: data?.message ?? "Registration completed.",
    user: normalizeUser(data?.user),
  };
}

export async function loginUser(credentials, { signal } = {}) {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: credentials,
    signal,
    auth: false,
  });
  const user = normalizeUser(data?.user);

  if (!user || typeof data?.token !== "string" || !data.token) {
    throw new ApiError({
      message: "The login response was incomplete. Please try again.",
    });
  }

  return {
    message: data?.message ?? "Login successful.",
    user,
    token: data.token,
  };
}
