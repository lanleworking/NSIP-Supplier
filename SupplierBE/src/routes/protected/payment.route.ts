import Elysia from 'elysia';
import {
    createNewPayment,
    getAllPayments,
    getAllPaymentsOptions,
    removeAllPayments,
    removePayment,
} from '../../controllers/payment.controller';
import { IOnlyPaymentIDPayload, IPaymentPayload } from '../../interfaces/payload';
import { catchResponse } from '../../utils/response';

const paymentRouter = new Elysia({
    prefix: '/payment',
})
    .post('/create', async ({ body, set }) => {
        try {
            const result = await createNewPayment(body as IPaymentPayload);
            return result;
        } catch (error) {
            console.error(error);
            return catchResponse(set, error);
        }
    })
    .delete('/remove', async ({ body, set }) => {
        try {
            const paymentBody = body as IOnlyPaymentIDPayload;
            const result = await removePayment(paymentBody?.PaymentID);
            return result;
        } catch (error) {
            console.error(error);
            return catchResponse(set, error);
        }
    })
    .delete('/remove-all', async ({ set }) => {
        try {
            const result = await removeAllPayments();
            return result;
        } catch (error) {
            console.error(error);
            return catchResponse(set, error);
        }
    })
    .get('/get-all', async ({ set }) => {
        try {
            const payments = await getAllPayments();
            return payments;
        } catch (error) {
            console.error(error);
            return catchResponse(set, error);
        }
    })
    .get('/get-options', async ({ set }) => {
        try {
            const options = await getAllPaymentsOptions();
            return options;
        } catch (error) {
            console.error(error);
            return catchResponse(set, error);
        }
    });

export default paymentRouter;
