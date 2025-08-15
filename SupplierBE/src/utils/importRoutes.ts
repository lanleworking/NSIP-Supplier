import { Elysia } from 'elysia';
import fs from 'fs';
import path from 'path';

export const importRoutes = async (dir: string): Promise<Elysia> => {
    const router = new Elysia();
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            const nested = await importRoutes(filePath);
            router.use(nested);
        } else if (file.endsWith('.route.ts')) {
            const routeModule = await import(filePath);
            if (routeModule.default) {
                router.use(routeModule.default);
            }
        }
    }

    return router;
};
