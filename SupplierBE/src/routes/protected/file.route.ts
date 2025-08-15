import jwt from '@elysiajs/jwt';
import Elysia from 'elysia';
import { ISupplier } from '../../interfaces/data';
import { catchResponse } from '../../utils/response';
import { removeFile, uploadFile } from '../../controllers/file.controller';

const fileRouter = new Elysia({
    prefix: '/file',
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
    .post(
        '/upload',
        async ({ body, set, supplier }) => {
            try {
                const files = (body as any).files || (body as any)['files[]'] || [];
                const removeFileIds = (body as any).removeFileIds || (body as any)['removeFileIds[]'] || [];

                const res = await uploadFile({
                    files: Array.isArray(files) ? files : [files],
                    supplierId: supplier.supplierID,
                    requestId: (body as any)?.requestId,
                    removeFileIds: Array.isArray(removeFileIds) ? removeFileIds : [removeFileIds],
                });

                return res;
            } catch (error) {
                catchResponse(set, error);
            }
        },
        {
            parse: 'multipart/form-data',
        },
    )
    .delete('/remove/:fileId', async ({ params, set }) => {
        try {
            const fileId = Number(params.fileId);
            const res = await removeFile(fileId);
            return res;
        } catch (error) {
            catchResponse(set, error);
        }
    });

export default fileRouter;
