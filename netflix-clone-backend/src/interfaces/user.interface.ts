export interface IUserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: string;
  language: string;
  accountActivation: boolean;
  status: "active" | "inactive";
  refreshToken?: string | null;
  referredBy?: number | null;
  hasReferralBonus: boolean;
  failedAttempts: number; // Track the number of failed login attempts
  lockUntil: Date | null; // Store lock time if the account is blocked
}

export interface IUserCreationAttributes {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
  language?: string;
  accountActivation?: boolean;
  status?: "active" | "inactive";
  refreshToken?: string | null;
  referredBy?: number | null;
  hasReferralBonus?: boolean;
  failedAttempts?: number; // Initialize failedAttempts to 0
  lockUntil?: Date | null; // Set lockUntil to null initially
}

export interface IUserMethods {
  generateToken(): string;
  generateRefreshToken(): string;
  validatePassword(password: string): Promise<boolean>;
}
