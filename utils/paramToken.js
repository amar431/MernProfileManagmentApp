import JWT from 'jsonwebtoken'

export const verifyUser = (req, res, next) => {
    
  const token = req.params.token;
  if (!token) {
    return res.status(401).json({ message: 'Token is required' });
  }
  try {
    const decodedToken = JWT.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (Date.now() >= decodedToken.exp * 1000) {
      return res.status(401).json({ message: 'Token has expired' });
    }
    // Attach decoded token to request object for later use
    req.decodedToken = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

