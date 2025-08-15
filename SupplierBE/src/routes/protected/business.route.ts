import Elysia from 'elysia';
import { getAllBusinessOptions, getBusinessByCode } from '../../controllers/business.controller';
import { catchResponse } from '../../utils/response';

const businessRouter = new Elysia({
    prefix: '/business',
})
    .get('/:code', async ({ params, set }) => {
        const { code } = params;
        try {
            const business = await getBusinessByCode(code);
            return business;
        } catch (error) {
            catchResponse(set, error);
        }
    })
    .get('/options', async ({ set }) => {
        try {
            const options = await getAllBusinessOptions();
            return options;
        } catch (error) {
            catchResponse(set, error);
        }
    });

export default businessRouter;
