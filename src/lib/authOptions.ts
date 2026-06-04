import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@sujoodmate.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:5000";

        try {
          const res = await fetch(`${backendUrl}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.error || "Invalid login credentials.");
          }

          // Return user details including backend JWT token
          return {
            id: data.admin.id,
            email: data.admin.email,
            accessToken: data.token, // Store JWT token
          };
        } catch (error: any) {
          throw new Error(error.message || "Failed to connect to backend server.");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).accessToken = token.accessToken;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-sujood-mate-development",
};
