const STORAGE_KEY = "lumio.session";

function decodeJwtPayload(token) {
  try {
    const payload = token.split(".")[1];
    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

function isExpired(token) {
  const payload = decodeJwtPayload(token);
  return !payload?.exp || payload.exp * 1000 <= Date.now();
}

function isValidSession(value) {
  return (
    value &&
    typeof value === "object" &&
    typeof value.token === "string" &&
    value.token &&
    value.user &&
    typeof value.user.id === "string" &&
    typeof value.user.email === "string" &&
    ["user", "admin"].includes(value.user.role) &&
    !isExpired(value.token)
  );
}

export function readAuthSession() {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    if (!isValidSession(parsed)) {
      clearAuthSession();
      return null;
    }

    return parsed;
  } catch {
    clearAuthSession();
    return null;
  }
}

export function writeAuthSession(session) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  sessionStorage.removeItem(STORAGE_KEY);
}
