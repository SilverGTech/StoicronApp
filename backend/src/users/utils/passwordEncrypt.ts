import bcrypt from 'bcrypt';

const saltRounds = bcrypt.genSaltSync(10);

export const encryptPassword = (password: string): string => {
  return bcrypt.hashSync(password, saltRounds);
};

export const comparePassword = (password: string, hash: string|any): boolean => {
  return bcrypt.compareSync(password, hash);
};