import { User } from 'src/users/entities/user.entity';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { v4 as uuid } from 'uuid';
import { AuthService } from './auth.service';
import {
  ForgetPasswordDTO,
  PasswordResetDTO,
} from './dtos/forget-password.dto';
import { LoginDTO } from './dtos/login.dto';
import { LogoutDTO } from './dtos/logout.dto';
import { UpdatePasswordDTO } from './dtos/update-password-dto';
import { RegisterCustomerDTO } from './dtos/register.dto';
import { IsLoggedInGuard } from './guards/is-logged-in.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
@UsePipes(new ValidationPipe())
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async registerUser(@Body() body: RegisterCustomerDTO) {
    return await this.authService.registerUser(body);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDTO, @Request() request) {
    if (request.useragent.isMobile && !loginDto.deviceId) {
      throw new BadRequestException('Required data is missing!');
    }
    loginDto.deviceInfo = {
      isMobile: request.useragent.isMobile,
      browser: request.useragent.browser,
      os: request.useragent.os,
      platform: request.useragent.platform,
      source: request.useragent.source,
      version: request.useragent.version,
    };
    return await this.authService.login(loginDto);
  }

  @UseGuards(IsLoggedInGuard)
  @Post('logout')
  async logoutUsers(@Body() body: LogoutDTO) {
    return await this.authService.logout(body);
  }

  @UseGuards(IsLoggedInGuard)
  @Patch('update-password')
  async updateUserPassword(
    @CurrentUser() user: User,
    @Body() body: UpdatePasswordDTO,
  ) {
    return await this.authService.updateUserPassword(user.id, body);
  }

  // @UseGuards(IsUserGuard)
  // @Delete('users/:id')
  // async deleteUserAccount(@Param('id') id: string, @CurrentUser() user: User) {
  //   return await this.authService.deleteUserAccount(id);
  // }

  // @UseGuards(IsUserGuard)
  // @ApiBearerAuth('access_token')
  // @Get('sendMobileVerificationCode')
  // async sendMobileVerificationCode(@CurrentUser() user: User) {
  //   return await this.authService.sendMobileVerificationCode(user.id);
  // }

  // @UseGuards(IsUserGuard)
  // @ApiBearerAuth('access_token')
  // @Post('verifyMobileNumber')
  // async checkValidWhatsAppCode(
  //   @CurrentUser() user: User,
  //   @Body('code') code: string,
  // ) {
  //   return await this.authService.verifyMobileNumber(user.id, code);
  // }

  // @UseGuards(IsUserGuard)
  // @ApiBearerAuth('access_token')
  // @Get('sendEmailVerificationCode')
  // async sendEmailVerificationCode(@CurrentUser() user: User) {
  //   return await this.authService.sendEmailVerificationCode(user.id);
  // }

  // @UseGuards(IsUserGuard)
  // @ApiBearerAuth('access_token')
  // @Post('verifyEmailNumber')
  // async checkValidEmailCode(
  //   @CurrentUser() user: User,
  //   @Body('code') code: string,
  // ) {
  //   return await this.authService.verifyEmail(user.id, code);
  // }

  // @UseGuards(IsLoggedInGuard)
  // @Post('forgetPassword')
  // async forgotPassword(
  //   @Body() data: ForgetPasswordDTO,
  // ): Promise<{ success: boolean }> {
  //   return await this.authService.forgetPasswordByEmail(data.email);
  // }

  // @Post('passwordReset')
  // async validatePasswordResetCode(@Body() data: PasswordResetDTO) {
  //   return await this.authService.passwordReset(data);
  // }

  // //TODO remove
  // @Get('sendTestEmail')
  // async sendTestEmail() {
  //   return await this.authService.sendTestEmail();
  // }
}
