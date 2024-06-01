import jwt from 'jsonwebtoken';

const redirectIfAuthenticated = (handler) => {
  return async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded) {
          // Se l'utente è autenticato, reindirizzalo alla homepage
          res.writeHead(302, { Location: '/' });
          res.end();
          return;
        }
      } catch (error) {
        // Il token non è valido o è scaduto, continua con la richiesta
      }
    }
    return handler(req, res);
  };
};

export default redirectIfAuthenticated;
