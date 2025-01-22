import jsonwebtoken from 'jsonwebtoken';

const {
    USER_JWT_SECRET = 'secret',
    USER_JWT_EXPIRATION = '1h'
} = process.env;

export const sign = (payload: any) => {
  return jsonwebtoken.sign(payload, USER_JWT_SECRET, { expiresIn: USER_JWT_EXPIRATION })
}

export const verify = (token: string) => {
  return jsonwebtoken.verify(token, USER_JWT_SECRET)
}
