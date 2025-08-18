import { Elysia } from 'elysia';
import { AppDataSource, AppDataSourceGlobal } from './sql/config';
import cors from '@elysiajs/cors';
import setupRoutes from './routes';
import staticPlugin from '@elysiajs/static';

await AppDataSource.initialize()
    .then(() => console.log('✅ | Database connection established'))
    .catch((error) => {
        console.error('❌ | Error during Sync Data Source initialization:', error);
        process.exit(1);
    });

await AppDataSourceGlobal.initialize()
    .then(() => console.log('✅ | Global Database connection established'))
    .catch((error) => {
        console.error('❌ | Error during Global Data Source initialization:', error);
        process.exit(1);
    });

    const allowOrigins = ["http://192.168.1.178:3000","http://172.22.80.1:3000"];

const app = new Elysia().use(staticPlugin()).use(
    cors({
        origin: allowOrigins,
        credentials: true,
    }),
);

const routes = await setupRoutes();

app.use(routes);

app.listen(5080, () => {
    console.log(`✅ | Server is running on ${app.server?.url}`);
});
