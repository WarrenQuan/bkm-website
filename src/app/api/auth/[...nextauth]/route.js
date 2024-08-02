// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler =  NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    secret:process.env.SECRET,
    // async signIn({ user }) {
    //   // Check if the domain matches the specific organization
    //   const allowedDomain = "brooklynmuseum.org"; // Replace with the organization's domain
    //   console.log(user)
    //   const userDomain = user.email.split('@')[1];
    //   return userDomain === allowedDomain;
    // },
    async session({ session }) {
      // You can add additional session data if needed
            // Check if the domain matches the specific organization
    //   const allowedDomain = "brooklynmuseum.org"; // Replace with the organization's domain
    //   console.log(user)
    //   const userDomain = user.email.split('@')[1];
    //   session.employee = userDomain === allowedDomain;
      return session;
    },
  },
});

export { handler as GET, handler as POST }; // <- THIS IS WHAT WORKED