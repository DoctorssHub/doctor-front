export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
  affiliateCode: string;
};

export type VerifyEmailRequest = {
  verificationToken: string;
  code: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  token: string;
  newPassword: string;
};

export type UserBalanceType = "WATCH_POINTS" | "GAME_POINTS";

export type UserBalance = {
  value: string;
  balanceType: UserBalanceType;
};

export type MeResponse = {
  id: string;
  email: string;
  username: string;
  profileImgUrl: string | null;
  createdAt: string;
  isBanned: boolean;
  hasVerifiedRoleOnDiscordGuild: boolean;
  userAuthProvider: unknown[];
  userCryptoAddresses: {
    btcAddress: string | null;
    ethAddress: string | null;
    ltcAddress: string | null;
  };
  userBalances: UserBalance[];
  userDegencity: unknown | null;
  hasPassword: boolean;
  affiliateReferralsCount: number;
};

export type RegisterResponse = unknown;
export type VerifyEmailResponse = unknown;
export type LoginResponse = unknown;
export type MeResponse = unknown;
export type SessionResponse = {
  authenticated: boolean;
  user: unknown;
};
export type RefreshResponse = unknown;
export type ForgotPasswordResponse = unknown;
export type ResetPasswordResponse = unknown;
export type LogoutResponse = unknown;
