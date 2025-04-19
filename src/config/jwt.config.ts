export const jwtConfig = {
  expiresIn: Number(process.env.JWT_EXPIRATION_TIME),
  secret: process.env.JWT_SECRET,
}

export const cookieConfig = {
  maxAge: Number(process.env.COOKIE_AGE),
}
