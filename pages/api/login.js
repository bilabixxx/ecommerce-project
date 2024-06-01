import connectDB from '../../lib/mongodb';
import User from '../../models/User';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const loginHandler = async (req, res) => {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    await connectDB();

    try {
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      res.setHeader('Set-Cookie', cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 3600,
        sameSite: 'strict',
        path: '/',
      }));

      res.status(200).json({ message: 'Logged in successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default loginHandler;
