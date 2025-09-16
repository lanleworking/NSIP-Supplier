import Elysia from 'elysia';
import { insertDevice } from '../../controllers/device.controller';
import { catchResponse } from '../../utils/response';

const deviceRouter = new Elysia({
    prefix: '/device',
}).post('/insert', async ({ body, set }) => {
    try {
        const device = await insertDevice(body as any);
        return device;
    } catch (error) {
        return catchResponse(set, error);
    }
});

export default deviceRouter;
