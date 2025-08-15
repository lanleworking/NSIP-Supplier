import Elysia from 'elysia';
import { catchResponse } from '../../utils/response';
import { getBankById, getBankOptions } from '../../controllers/bank.controller';

const bankRouter = new Elysia({
    prefix: '/bank',
})
    .get('/:id', async ({ params, set }) => {
        const { id } = params;
        try {
            const business = await getBankById(Number(id));
            return business;
        } catch (error) {
            catchResponse(set, error);
        }
    })
    .get('/options', async ({ set }) => {
        try {
            const options = await getBankOptions();
            return options;
        } catch (error) {
            catchResponse(set, error);
        }
    });

export default bankRouter;
