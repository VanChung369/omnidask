const AUTH_SESSION_MARKER_KEY = "omnidask-has-session";

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

export function hasClientAuthSession() {
  return getStorage()?.getItem(AUTH_SESSION_MARKER_KEY) === "true";
}

export function rememberClientAuthSession() {
  getStorage()?.setItem(AUTH_SESSION_MARKER_KEY, "true");
}

export function forgetClientAuthSession() {
  getStorage()?.removeItem(AUTH_SESSION_MARKER_KEY);
}
