declare namespace Express {
  export interface Request {
    user?: { userId: number; name: string; role: string };
  }
}
