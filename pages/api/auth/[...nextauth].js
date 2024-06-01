import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import connectDB from '../../../lib/mongodb';

import User from '../../../models/User';

export default NextAuth({
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials.email });
        if (user && user.password === credentials.password) {
          return { email: user.email };
        }
        return null;
      },
    }),
  ],
  database: process.env.MONGODB_URI,
});
