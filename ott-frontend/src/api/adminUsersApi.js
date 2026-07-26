import { ApiError, apiRequest } from "./client";

function normalizeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeAdminUser(user) {
  if (!user || typeof user !== "object") {
    return null;
  }

  const id = user._id ?? user.id;
  if (
    !id ||
    typeof user.name !== "string" ||
    typeof user.email !== "string" ||
    !["user", "admin"].includes(user.role)
  ) {
    return null;
  }

  return {
    id: String(id),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt ?? null,
    updatedAt: user.updatedAt ?? null,
  };
}

export async function fetchAdminUsers(
  { page = 1, limit = 10, search = "", role = "" } = {},
  { signal } = {},
) {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(page));
  searchParams.set("limit", String(limit));

  const normalizedSearch = search.trim();
  if (normalizedSearch) {
    searchParams.set("search", normalizedSearch);
  }
  if (role) {
    searchParams.set("role", role);
  }

  const data = await apiRequest(`/admin/users?${searchParams.toString()}`, {
    signal,
  });
  const users = Array.isArray(data?.users)
    ? data.users.map(normalizeAdminUser).filter(Boolean)
    : null;
  const pagination = data?.pagination;

  if (
    !users ||
    !pagination ||
    typeof pagination !== "object"
  ) {
    throw new ApiError({
      message: "The user-management response was incomplete. Please try again.",
    });
  }

  return {
    users,
    pagination: {
      page: Math.max(1, normalizeNumber(pagination.page, page)),
      limit: Math.max(1, normalizeNumber(pagination.limit, limit)),
      total: Math.max(0, normalizeNumber(pagination.total)),
      pages: Math.max(0, normalizeNumber(pagination.pages)),
    },
  };
}

export async function deleteAdminUser(userId, { signal } = {}) {
  const data = await apiRequest(
    `/admin/users/${encodeURIComponent(userId)}`,
    {
      method: "DELETE",
      signal,
    },
  );

  return {
    message: data?.message ?? "User deleted successfully.",
    deletedUser: normalizeAdminUser(data?.deletedUser),
  };
}
