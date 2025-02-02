import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon from 'argon2';
import { DataSource, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { CreateAddressDto } from '../addresses/dto/create-address.dto';
import { Address } from '../addresses/entities/address.entity';
import { DeviceTokenStatus } from '../common/enums/device-token-status.enum';
import { UserRole } from '../common/enums/user-role.enum';
import { DeviceTokensService } from '../device-tokens/device-tokens.service';
import { DeviceToken } from '../device-tokens/entities/device-token.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDTO } from './dtos/login.dto';
import { LogoutDTO } from './dtos/logout.dto';
import { RegisterCustomerDTO } from './dtos/register.dto';
import { UpdatePasswordDTO } from './dtos/update-password-dto';

@Injectable()
export class AuthService {
  constructor(
    private dataSource: DataSource,
    private deviceTokensService: DeviceTokensService,
    private usersService: UsersService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(DeviceToken)
    private deviceTokensRepository: Repository<DeviceToken>,
  ) {}

  // async sendMobileVerificationCode(id: string) {
  //   const user = await this.usersService.findOneOrFail(id);
  //   if (!user || user.isMobileVerified)
  //     throw new BadRequestException('Invalid User!');

  //   const verificationCode: number = Math.floor(
  //     100000 + Math.random() * 900000,
  //   );
  //   const verificationCodeExpires: Date = new Date();
  //   const expirationTime = 2 * 24 * 60 * 60 * 1000;
  //   verificationCodeExpires.setTime(
  //     verificationCodeExpires.getTime() + expirationTime,
  //   );

  //   user.mobileVerificationCode = verificationCode.toString();
  //   user.mobileVerificationCodeExpiry = verificationCodeExpires;

  //   await this.usersRepository.save(user).catch((err) => {
  //     throw new BadRequestException('Error updating user', err);
  //   });
  //   // return await sendWhatsappMessage(
  //   //   user.phoneNumber.toString(),
  //   //   'You verification code is: ' + verificationCode,
  //   // );
  // }

  // async sendEmailVerificationCode(id: string) {
  //   const user = await this.usersService.findOneOrFail(id);
  //   if (!user || !user.email || user.isEmailVerified)
  //     throw new BadRequestException('Invalid User!');

  //   const verificationCode: number = Math.floor(
  //     100000 + Math.random() * 900000,
  //   );
  //   const verificationCodeExpires: Date = new Date();
  //   const expirationTime = 2 * 24 * 60 * 60 * 1000;
  //   verificationCodeExpires.setTime(
  //     verificationCodeExpires.getTime() + expirationTime,
  //   );

  //   user.emailVerificationCode = verificationCode.toString();
  //   user.emailVerificationCodeExpiry = verificationCodeExpires;

  //   await this.usersRepository.save(user).catch((err) => {
  //     throw new BadRequestException('Error updating user', err);
  //   });

  //   this.mailService.send({
  //     from: process.env.MAIL_FROM_USER,
  //     to: user.email,
  //     subject: 'Clean Clinic Verification Code',
  //     text: `Your email verification code is: ${verificationCode.toString()}`,
  //     html: `<h3>Dear ${user.firstName},</h3>
  //           <p>Your email verification code is: ${verificationCode.toString()}</p>
  //           <p>Thank you for using Clean Clinic!</p>`,
  //   });
  // }

  // async verifyMobileNumber(id: string, code: string): Promise<boolean> {
  //   if (!code) return false;

  //   const user = await this.usersService.findOneOrFail(id);

  //   if (user.isMobileVerified)
  //     throw new BadRequestException('Mobile already verified');

  //   if (user.mobileVerificationCode != code) {
  //     throw new BadRequestException('Invalid code');
  //   }

  //   const todayDate = new Date();
  //   if (todayDate > user.mobileVerificationCodeExpiry) {
  //     throw new BadRequestException('Verification code expired');
  //   }

  //   user.isMobileVerified = true;
  //   user.mobileVerificationDate = new Date();
  //   await this.usersRepository.save(user).catch((err) => {
  //     throw new BadRequestException(err);
  //   });

  //   return true;
  // }

  // async verifyEmail(id: string, code: string): Promise<boolean> {
  //   if (!code) return false;

  //   const user = await this.usersService.findOneOrFail(id);

  //   if (user.isEmailVerified)
  //     throw new BadRequestException('Email already verified');

  //   if (user.emailVerificationCode != code) {
  //     throw new BadRequestException('Invalid email');
  //   }

  //   const todayDate = new Date();
  //   if (todayDate > user.emailVerificationCodeExpiry) {
  //     throw new BadRequestException('Verification email expired');
  //   }

  //   user.isEmailVerified = true;
  //   user.emailVerificationDate = new Date();
  //   await this.usersRepository.save(user).catch((err) => {
  //     throw new BadRequestException(err);
  //   });

  //   return true;
  // }

  async registerUser(data: RegisterCustomerDTO) {
    const exists = await this.usersService.findByPhoneNumber(data.phoneNumber);

    if (exists) throw new BadRequestException('User already exists!');

    // if (data.addresses?.length < 1)
    //   throw new BadRequestException('At least 1 address should be provided!');

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();
    try {
      let addresses: CreateAddressDto[] = data.addresses;
      delete data.addresses;

      let user = this.usersRepository.create({
        ...data,
        role: UserRole.CUSTOMER,
      });

      user = await queryRunner.manager.save(user);

      addresses = addresses.map((address) => {
        address['userId'] = user.id;
        return address;
      });

      const createdAddresses = await queryRunner.manager.save(
        Address,
        addresses,
      );

      await queryRunner.commitTransaction();

      user.addresses = createdAddresses;
      return user;
    } catch (err) {
      console.error(err);
      await queryRunner.rollbackTransaction();
      throw err;
      // throw new BadRequestException('Error registering user!');
    } finally {
      await queryRunner.release();
    }
  }

  async login(data: LoginDTO): Promise<{ access_token: string; user: User }> {
    let user: User = await this.usersService.findByPhoneNumber(
      data.phoneNumber,
    );

    if (!user) throw new BadRequestException('Error user not found!');

    const match = await argon.verify(user.password, data.password);
    if (!match) throw new BadRequestException('Password incorrect!');

    const token = uuid();

    await this.deviceTokensService.createDeviceToken(
      {
        accessToken: token,
        deviceId: data.deviceId,
        fcmToken: data.fcmToken,
        status: DeviceTokenStatus.ACTIVE,
        ...data.deviceInfo,
        userId: user.id,
      },
      this.dataSource.manager,
    );

    return {
      access_token: token,
      user,
    };
  }

  async updateUserPassword(userOrId: User | string, body: UpdatePasswordDTO) {
    // const user: User = await this.usersService.findById(id);
    let user: User;
    if (typeof userOrId === 'string') {
      user = await this.usersService.findById(userOrId);
    } else {
      user = userOrId;
    }

    const match = await argon.verify(user.password, body.oldPassword);

    if (!match) throw new BadRequestException('Old password incorrect!');

    if (body.newPassword !== body.confirmPassword)
      throw new BadRequestException(
        'New password and confirm password do not match!',
      );
    user.password = await argon.hash(body.newPassword);
    return await this.usersRepository.save(user).catch((err) => {
      console.log(err);
      throw new BadRequestException('Error updating password');
    });
  }

  async logout(body: LogoutDTO) {
    const deviceToken = await this.deviceTokensRepository
      .findOneOrFail({
        where: {
          accessToken: body.access_token,
        },
      })
      .catch(() => {
        throw new BadRequestException('Session not found!');
      });

    return await this.deviceTokensService.logoutToken(
      deviceToken.id,
      DeviceTokenStatus.LOGGED_OUT,
    );
  }

  // async sendTestEmail() {
  //   try {
  //     return this.mailService.send({
  //       from: process.env.MAIL_FROM_USER,
  //       to: 'alikashmar888888888@gmail.com',
  //       subject: 'Test Email From Washer Backend',
  //       text: 'This is a test email from the Washer Backend!',
  //       html: 'This is a test email from the Washer Backend!',
  //     });
  //   } catch (err) {
  //     console.log(err);
  //     throw new BadRequestException('Error sending test email');
  //   }
  // }

  // async forgetPasswordByEmail(email: string): Promise<{ success: boolean }> {
  //   const user = await this.usersService.findByEmail(email);
  //   if (!user) throw new BadRequestException('Error user not found!');
  //   if (user.isSocialMediaLogin)
  //     throw new BadRequestException('Invalid action for social media account');

  //   const passwordResetCode: number = Math.floor(
  //     100000 + Math.random() * 900000,
  //   );
  //   const passwordResetExpires: Date = new Date();
  //   const codeExpireIn = 120; //minutes
  //   passwordResetExpires.setTime(
  //     passwordResetExpires.getTime() + codeExpireIn * 60 * 1000, //120 minutes
  //   );

  //   user.passwordResetCode = passwordResetCode + '';
  //   user.passwordResetExpiry = passwordResetExpires;

  //   await this.usersRepository.save(user).catch((err) => {
  //     console.log("Error saving user's password reset code");
  //     throw new BadRequestException('Error generating code', err);
  //   });

  //   const mailData = {
  //     from: process.env.MAIL_FROM_USER,
  //     to: user.email,
  //     subject: 'Reset Password Code',
  //     text: `Please use this code ${passwordResetCode} to reset your password. Code will expire in ${codeExpireIn} minutes.`,
  //     html: `
  //         <h3>Hello ${user.firstName}!</h3>
  //         <p>Please use this code ${passwordResetCode} to reset your password. Code will expire in ${codeExpireIn} minutes.</p>
  //     `,
  //   };

  //   this.mailService.send(mailData);

  //   return { success: true };
  // }

  // async passwordReset(data: PasswordResetDTO) {
  //   const user = await this.usersService.findByEmail(data.email);
  //   if (!user) throw new BadRequestException('Error user not found!');
  //   if (user.passwordResetCode != data.passwordResetCode)
  //     throw new BadRequestException('Invalid code');

  //   const todayDate = new Date();
  //   if (todayDate > user.passwordResetExpiry)
  //     throw new BadRequestException('Reset code expired');

  //   const hash = await argon.hash(data.newPassword);
  //   user.password = hash;

  //   return await this.usersRepository.save(user).catch((err) => {
  //     console.log(err);
  //     throw new BadRequestException('Error updating password!', err);
  //   });
  // }

  // async deleteUserAccount(id: string) {
  //   return await this.dataSource.transaction(async (manager) => {
  //     const user = await manager
  //       .findOneOrFail(User, {
  //         where: { id },
  //         relations: ['deviceTokens'],
  //       })
  //       .catch((err) => {
  //         throw new BadRequestException('Account not found!', err);
  //       });

  //     await manager
  //       .update(
  //         DeviceToken,
  //         user.deviceTokens.map((token) => token.id),
  //         {
  //           status: DeviceTokenStatus.TERMINATED,
  //           loggedOutAt: new Date(),
  //         },
  //       )
  //       .catch((err) => {
  //         console.error(err);
  //         throw new BadRequestException('Error deleting account');
  //       });

  //     return await manager.softDelete(User, id).catch((err) => {
  //       console.error(err);
  //       throw new BadRequestException('Error deleting account');
  //     });
  //   });
  // }
}
