import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials"; //It's a specific authentication provider for handling credentials (username/password).
import bcrypt from "bcryptjs";
import User from "@/models/user";
import connectDB from "@/config/db";

// provider for github for instagram??, what is credentialsProvider?

//authOptions: Configuration object for NextAuth.
export const authOptions = {
  //providers: An array of authentication providers. In this case, there's only one provider (CredentialsProvider) that handles username/password authentication.
  // istilah "providers" merujuk pada metode atau sumber daya yang digunakan untuk mengautentikasi pengguna.
  providers: [
    CredentialsProvider({
      id: "credientals",
      name: "Credientals",
      credentials: {
        email: {
          label: "Email",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      //authorize: A callback function called during the authentication process. It checks if the provided email and password match a user in the database.
      async authorize(credentials) {
        await connectDB();
        try {
          const user = await User.findOne({ email: credentials.email });

          if (user) {
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user.password
            );

            if (isPasswordCorrect) {
              return user;
            }
          }
        } catch (error) {
          throw new Error(error);
        }
      },
    }),
  ],

  //callbacks: Additional callbacks for handling authentication events. In this case, there's a signIn callback that returns true if the authentication provider is 'credentials'.
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider == "credientals") {
        return true;
      }
    },
  },
};

//handler: It's the NextAuth authentication handler created using NextAuth with the specified options.
// export the handler for both GET and POST requests, making it available for use in the Next.js API routes.
export const handler = NextAuth(authOptions);
// export the handler for both GET and POST requests, making it available for use in the Next.js API routes.
export { handler as GET, handler as POST };
