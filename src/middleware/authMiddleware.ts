import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token: string | undefined = req.cookies.jwt;
  console.log(req.cookies);
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded: any = jwt.verify(token, 'uwaterlootradesecret');
    req.user = decoded;
    console.log(decoded);
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

export default authMiddleware;
