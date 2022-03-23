import jsonwebtoken from 'jsonwebtoken';

export const generateToken: Function = (id: number): string => {
  return jsonwebtoken.sign(id.toString(), process.env.TOKEN_SECRET as string);
};