import connectDB from '../../lib/mongodb';
import User from '../../models/User';
import redirectIfAuthenticated from '../../middlewares/redirectIfAuthenticated ';

const registerHandler = async (req, res) => {
  if (req.method === 'POST') {
    const { email, password, name } = req.body;

    await connectDB();

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      const user = new User({ email, password, name });
      await user.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default redirectIfAuthenticated(registerHandler);
