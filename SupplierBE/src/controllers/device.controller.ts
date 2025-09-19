import { EStatusCodes } from '../interfaces/http';
import { Device } from '../models/Device';
import { AppDataSourceGlobal } from '../sql/config';
import { throwResponse } from '../utils/response';

export const insertDevice = async (payload: {
    deviceData: Partial<Device>;
    userId: string;
    username: string;
    pass: string;
}): Promise<Device> => {
    if (!payload?.pass || !payload?.username || !payload?.userId || !payload?.deviceData?.SystemSerialNumber)
        throw throwResponse(EStatusCodes.BAD_REQUEST, 'Invalid pass, username, userId, or SystemSerialNumber');

    const envPass = process.env.DEVICE_INSERT_PASS;
    if (!envPass) throw throwResponse(EStatusCodes.INTERNAL_SERVER_ERROR, 'Device insert pass not set');
    if (payload.pass !== envPass) throw throwResponse(EStatusCodes.UNAUTHORIZED, 'Unauthorized');

    if (!AppDataSourceGlobal.isInitialized) {
        await AppDataSourceGlobal.initialize();
    }
    const deviceRepo = AppDataSourceGlobal.getRepository(Device);

    const existingDevice = await deviceRepo.findOneBy({
        SystemSerialNumber: payload.deviceData.SystemSerialNumber,
    });
    if (existingDevice)
        throw throwResponse(EStatusCodes.CONFLICT, 'Device with this SystemSerialNumber already exists');

    const device = deviceRepo.create({
        ...payload.deviceData,
        UserId: payload.userId,
        Username: payload.username,
    });
    return await deviceRepo.save(device);
};
