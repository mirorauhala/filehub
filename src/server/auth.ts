import { Adapter } from "next-auth/adapters";

export default function KyselyAdapter(client, options = {}): Adapter {
  return {
    async createUser(user) {

        if()

      await db.insertInto("users").values(user).execute();
      return;
    },
    async getUser(id) {
      return;
    },
    async getUserByEmail(email) {
      return;
    },
    async getUserByAccount({ providerAccountId, provider }) {
      return;
    },
    async updateUser(user) {
      return;
    },
    async deleteUser(userId) {
      return;
    },
    async linkAccount(account) {
      return;
    },
    async unlinkAccount({ providerAccountId, provider }) {
      return;
    },
    async createSession({ sessionToken, userId, expires }) {
      return;
    },
    async getSessionAndUser(sessionToken) {
      return;
    },
    async updateSession({ sessionToken }) {
      return;
    },
    async deleteSession(sessionToken) {
      return;
    },
    async createVerificationToken({ identifier, expires, token }) {
      return;
    },
    async useVerificationToken({ identifier, token }) {
      return;
    },
  };
}
