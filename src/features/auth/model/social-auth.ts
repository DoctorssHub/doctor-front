export type SocialAuthProvider = "google" | "discord" | "steam";

const SOCIAL_AUTH_RETURN_PATH_KEY = "doctor.socialAuthReturnPath";
const SOCIAL_AUTH_CALLBACK_PATH = "/auth/social/callback";

export function getSocialAuthUrl(provider: SocialAuthProvider) {
  return `/api/auth/${provider}`;
}

export function startSocialAuth(provider: SocialAuthProvider) {
  if (typeof window === "undefined") {
    return;
  }

  saveSocialAuthReturnPath(window.location);
  window.location.assign(getSocialAuthUrl(provider));
}

export function consumeSocialAuthReturnPath() {
  if (typeof window === "undefined") {
    return "/";
  }

  const storedPath = window.sessionStorage.getItem(SOCIAL_AUTH_RETURN_PATH_KEY);
  window.sessionStorage.removeItem(SOCIAL_AUTH_RETURN_PATH_KEY);

  return isSafeReturnPath(storedPath) ? storedPath : "/";
}

function saveSocialAuthReturnPath(location: Location) {
  const returnPath = `${location.pathname}${location.search}${location.hash}`;

  if (isSafeReturnPath(returnPath)) {
    window.sessionStorage.setItem(SOCIAL_AUTH_RETURN_PATH_KEY, returnPath);
  }
}

function isSafeReturnPath(path: string | null): path is string {
  return Boolean(
    path &&
      path.startsWith("/") &&
      !path.startsWith("//") &&
      !path.startsWith(SOCIAL_AUTH_CALLBACK_PATH),
  );
}
