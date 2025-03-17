import dotenv from 'dotenv';

dotenv.config();

export const env = {
    database: {
        url: process.env.DATABASE_URL as string,
    },
    port: parseInt(process.env.PORT || '3000', 10),
    jwtSecret: process.env.JWT_SECRET as string,
};
