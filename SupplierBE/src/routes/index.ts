import { Elysia } from 'elysia';
import jwtVerify from '../middlewares/jwtVerify';
import path from 'path';
import { importRoutes } from '../utils/importRoutes';
import jwt from '@elysiajs/jwt';

const routes = new Elysia().get('/', () => 'Hello Elysia');
const setupRoutes = async () => {
    const publicRoutes = await importRoutes(path.join(__dirname, 'public'));
    const protectedRoutes = await importRoutes(path.join(__dirname, 'protected'));

    routes.use(publicRoutes);
    routes
        .use(
            jwt({
                name: 'jwt',
                secret: process.env.JWT_SECRET!,
            }),
        )
        .derive(async ({ cookie: { token }, jwt, set }) => {
            const user = await jwtVerify(token, jwt, set);
            return { user };
        });
    routes.use(protectedRoutes);

    return routes;
};

export default setupRoutes;
