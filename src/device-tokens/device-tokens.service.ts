import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceTokenStatus } from 'src/common/enums/device-token-status.enum';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CreateEmployeeDeviceTokenDto } from './dto/create-employee-device-token.dto';
import { UpdateDeviceTokenDto } from './dto/update-device-token.dto';
import { DeviceToken } from './entities/device-token.entity';
import { CreateDeviceTokenDto } from './dto/create-device-token.dto';

@Injectable()
export class DeviceTokensService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(DeviceToken)
    private deviceTokensRepository: Repository<DeviceToken>,
  ) {}

  async createDeviceToken(data: CreateDeviceTokenDto, manager: EntityManager) {
    let tokens = await manager.getRepository(DeviceToken).find({
      where: {
        userId: data.userId,
        deviceId: data.deviceId,
      },
    });

    tokens = tokens.map((token) => {
      token.status = DeviceTokenStatus.TERMINATED;
      token.loggedOutAt = new Date();
      return token;
    });

    await manager.save(tokens);

    return await manager
      .getRepository(DeviceToken)
      .save(data)
      .catch((err) => {
        console.error(err);
        throw new BadRequestException('Error registering device token', err);
      });
  }

  // async createEmployeeDeviceToken(data: CreateEmployeeDeviceTokenDto) {
  //   const tokens = await this.deviceTokensRepository.find({
  //     where: {
  //       employeeId: data.employeeId,
  //       fcmToken: data.fcmToken ? data.fcmToken : null,
  //     },
  //   });
  //   tokens.forEach(async (token) => {
  //     token.status = DeviceTokenStatus.TERMINATED;
  //     token.loggedOutAt = new Date();
  //     await this.deviceTokensRepository.save(token);
  //   });

  //   // const deviceToken = await this.deviceTokensRepository.update(
  //   //   {
  //   //     employeeId: data.employeeId,
  //   //     fcmToken: data.fcmToken ? data.fcmToken : null,
  //   //   },
  //   //   {
  //   //     status: DeviceTokenStatus.TERMINATED,
  //   //     loggedOutAt: new Date(),
  //   //   },
  //   // );
  //   return await this.deviceTokensRepository.save(data).catch((err) => {
  //     throw new BadRequestException('Error registering device token', err);
  //   });
  // }

  findAll() {
    return `This action returns all deviceTokens`;
  }

  findOne(id: number) {
    return `This action returns a #${id} deviceToken`;
  }

  update(id: number, updateDeviceTokenDto: UpdateDeviceTokenDto) {
    return `This action updates a #${id} deviceToken`;
  }

  async remove(id: string) {
    return await this.deviceTokensRepository.delete(id).catch((err) => {
      throw new BadRequestException('Error removing session!', err);
    });
  }

  async logoutToken(
    deviceTokenOrId: string | DeviceToken,
    logoutType: DeviceTokenStatus,
  ) {
    const token =
      typeof deviceTokenOrId === 'string'
        ? await this.deviceTokensRepository
            .findOneOrFail({ where: { id: deviceTokenOrId } })
            .catch((err) => {
              throw new BadRequestException(
                'Error logging out device token',
                err,
              );
            })
        : deviceTokenOrId;

    token.status = logoutType;
    token.loggedOutAt = new Date();

    return await this.deviceTokensRepository.save(token).catch((err) => {
      throw new BadRequestException('Error logging out device token', err);
    });
  }
}
