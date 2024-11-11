import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    port: process.env.PORT,
    hashSalt: Number(process.env.HASH_SALT) ?? 10,
    databaseUrl: process.env.DATABASE_URL,
    jwt: {
      expiresIn: process.env.JWT_EXPIRE_IN,
      secret: process.env.JWT_SECRET,
    },
  };
});
