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

export type RegisterResponse = unknown;
export type VerifyEmailResponse = unknown;
export type LoginResponse = unknown;
export type ForgotPasswordResponse = unknown;
export type ResetPasswordResponse = unknown;
