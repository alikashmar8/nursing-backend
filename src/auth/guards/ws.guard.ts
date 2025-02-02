import {
  CanActivate,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
// import { EmployeesService } from 'src/employees/employees.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
    // @Inject(forwardRef(() => EmployeesService))
    // private employeesService: EmployeesService,
  ) {}

  private readonly logger = new Logger();

  async canActivate(
    context: any,
  ): Promise<
    boolean | any | Promise<boolean | any> | Observable<boolean | any>
  > {
    try {
      this.logger.log('Websocket Guard');
      const authorization = context.args[0].handshake.headers.authorization;
      this.logger.log('authorization: ', authorization?.slice(0, 10));
      if (!authorization) return false;
      const [, token] = authorization.split(' ');
      this.logger.log('token: ', token?.slice(0, 5));
      if (!token) return false;

      const user = await this.usersService.findOneByToken(token);
      // const employee = await this.employeesService.findOneByToken(token);

      // this.logger.log('user or emp found: ', user?.id || employee?.id);
      // if (!user && !employee) {
      //   return false;
      // }

      // return user ? user : employee;
    } catch (err) {
      this.logger.error(err);
      throw new HttpException('Token Invalid', HttpStatus.FORBIDDEN);
    }
  }
}
