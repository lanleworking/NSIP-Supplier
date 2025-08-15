import jwt from '@elysiajs/jwt';
import Elysia from 'elysia';
import { ISupplier } from '../../interfaces/data';
import { catchResponse } from '../../utils/response';
import { confirmRequest } from '../../controllers/confirm.controller';

const confirmRouter = new Elysia({
    prefix: '/confirm',
})
    .use(
        jwt({
            name: 'jwt',
            secret: process.env.JWT_SECRET!,
        }),
    )
    .derive(async ({ cookie, jwt }) => {
        const supplier = (await jwt.verify(cookie.token.value)) as unknown as ISupplier;
        return { supplier };
    })
    .post('/:requestId', async ({ params, set, supplier }) => {
        try {
            const { requestId } = params;
            const res = await confirmRequest(Number(requestId), supplier.supplierID);
            return res;
        } catch (error) {
            catchResponse(set, error);
        }
    });

export default confirmRouter;
