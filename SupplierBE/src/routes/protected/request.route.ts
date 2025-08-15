import Elysia from 'elysia';
import { getAllRequest, getChartRequestList, getRequestById } from '../../controllers/request.controller';
import { catchResponse } from '../../utils/response';
import { IRequestItemParams, IRequestListParams } from '../../interfaces/params';
import jwt from '@elysiajs/jwt';
import { ISupplier } from '../../interfaces/data';
import { updateRequestItemPrice } from '../../controllers/requestPrice.controller';
import { RequestItemPrice } from '../../models/sync/RequestItemPrice';

const requestRouter = new Elysia({
    prefix: '/request',
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
    .get('/getAll', async ({ query, set, supplier }) => {
        try {
            const result = await getAllRequest(query as unknown as IRequestListParams, supplier.supplierID);
            return result;
        } catch (error) {
            console.error(error);
            return catchResponse(set, error);
        }
    })
    .get('get/:requestId', async ({ params, query, set, supplier }) => {
        try {
            const requestId = Number(params.requestId);
            const result = await getRequestById(requestId, supplier.supplierID, query as unknown as IRequestItemParams);
            return result;
        } catch (error) {
            console.error(error);
            return catchResponse(set, error);
        }
    })
    .post('/migrate/:requestItemId', async ({ params, body, set, supplier }) => {
        try {
            const requestItemId = Number(params.requestItemId);

            const result = await updateRequestItemPrice(
                requestItemId,
                supplier.supplierID,
                body as Partial<RequestItemPrice>,
            );
            return result;
        } catch (error) {
            console.error(error);
            return catchResponse(set, error);
        }
    })
    .get('/sentChartData', async ({ set, supplier }) => {
        try {
            const chartData = await getChartRequestList(supplier.supplierID);
            return chartData;
        } catch (error) {
            return catchResponse(set, error);
        }
    });

export default requestRouter;
