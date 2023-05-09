import type { Generated } from "kysely";

export interface Database {
  account: AccountTable;
  session: Session;
  user: User;
  verification_token: VerificationToken;
}

export interface AccountTable {
  id: Generated<number>;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string | null;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
  scope: string | null;
  id_token: string | null;
  session_state: string | null;
}

export interface Session {
  id: Generated<string>;
  sessionToken: string;
  userId: string;
  expires: number;
}

export interface User {
  id: Generated<string>;
  name: string | null;
  email: string | null;
  emailVerified: number | null;
  image: string | null;
}

export interface VerificationToken {
  identifier: string;
  token: string;
  expires: number;
}
