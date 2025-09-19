import { Elysia } from 'elysia';
import cors from '@elysiajs/cors';
import setupRoutes from './routes';
import staticPlugin from '@elysiajs/static';
import { AppDataSourceGlobal } from './sql/config';
import 'dotenv/config';

await AppDataSourceGlobal.initialize()
    .then(() => console.log('✅ | Global Database connection established'))
    .catch((error) => {
        console.error('❌ | Error during Global Data Source initialization:', error);
        process.exit(1);
    });

const app = new Elysia().use(staticPlugin()).use(
    cors({
        origin: true,
        credentials: true,
    }),
);

const routes = await setupRoutes();

app.use(routes);

app.listen(5080, () => {
    console.log(`✅ | Server is running on ${process.env.CODE_ENV} mode`);
    console.log(`✅ | Server is running on ${app.server?.url}`);
});
