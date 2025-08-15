import Elysia from 'elysia';
import { ILoginPayload, IRegisterPayload } from '../../interfaces/payload';
import {
    getLoggedUser,
    login,
    logOut,
    register,
    resetPassword,
    resetPasswordWithToken,
} from '../../controllers/auth.controller';
import { catchResponse } from '../../utils/response';
import jwt from '@elysiajs/jwt';
const authRouter = new Elysia({
    prefix: '/auth',
})
    .use(
        jwt({
            name: 'jwt',
            secret: process.env.JWT_SECRET!,
        }),
    )
    .post('/login', async ({ body, set, jwt }) => {
        try {
            const user = await login(body as ILoginPayload, set, jwt);
            return user;
        } catch (error) {
            return catchResponse(set, error);
        }
    })
    .post('/register', async ({ body, set, jwt }) => {
        try {
            const user = await register(body as IRegisterPayload, set, jwt);
            return user;
        } catch (error) {
            console.log('Error during registration:', error);
            return catchResponse(set, error);
        }
    })
    .get('/me', async ({ jwt, set, cookie: { token } }) => {
        try {
            const supplier = await getLoggedUser(jwt, set, token);
            return supplier;
        } catch (error) {
            return catchResponse(set, error);
        }
    })
    .post('/logout', async ({ set }) => {
        try {
            const response = await logOut(set);
            return response;
        } catch (error) {
            return catchResponse(set, error);
        }
    })
    .post('/recover', async ({ headers, body, set }) => {
        try {
            const { LoginName } = body as { LoginName: string };
            const res = await resetPassword(LoginName, headers);
            return res;
        } catch (error) {
            return catchResponse(set, error);
        }
    })
    .put('/reset-password', async ({ body, set }) => {
        try {
            const { token, SupplierPass } = body as { token: string; SupplierPass: string };
            const res = await resetPasswordWithToken(token, SupplierPass);
            return res;
        } catch (error) {
            return catchResponse(set, error);
        }
    });

export default authRouter;
