import jwt from '@elysiajs/jwt';
import Elysia from 'elysia';
import { ISupplier } from '../../interfaces/data';
import { catchResponse } from '../../utils/response';
import { updateSupplier, updateSupplierPassword } from '../../controllers/auth.controller';

const supplierRouter = new Elysia({
    prefix: '/supplier',
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
    .put('/update', async ({ set, supplier, body }) => {
        try {
            const res = await updateSupplier(supplier.supplierID, body as ISupplier);
            return res;
        } catch (error) {
            catchResponse(set, error);
        }
    })
    .put('update/password', async ({ set, supplier, body }) => {
        try {
            const res = await updateSupplierPassword(supplier.supplierID, body as { oldPass: string; newPass: string });
            return res;
        } catch (error) {
            catchResponse(set, error);
        }
    });

export default supplierRouter;
