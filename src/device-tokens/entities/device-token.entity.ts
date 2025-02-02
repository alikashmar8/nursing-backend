import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../common/entities/base-entity.entity';
import { DeviceTokenStatus } from '../../common/enums/device-token-status.enum';
import { User } from '../../users/entities/user.entity';

@Entity('device-tokens')
export class DeviceToken extends BaseEntity {
  @Column({ name: 'accessToken', nullable: false })
  accessToken: string;

  @Column({ name: 'deviceId', nullable: true })
  deviceId?: string;

  @Column({ name: 'fcmToken', nullable: true })
  fcmToken?: string;

  @Column({ name: 'platform', nullable: false })
  platform: string;

  @Column({ name: 'isMobile', default: false })
  isMobile: boolean;

  @Column({ name: 'browser', nullable: true })
  browser?: string;

  @Column({ name: 'version', nullable: true })
  version?: string;

  @Column({ name: 'os', nullable: true })
  os?: string;

  @Column({ name: 'source', nullable: true })
  source?: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: DeviceTokenStatus,
    default: DeviceTokenStatus.ACTIVE,
  })
  status: DeviceTokenStatus;

  @Column({
    name: 'loggedOutAt',
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  loggedOutAt?: Date;

  @Column({
    name: 'lastRequestAt',
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  lastRequestAt?: Date;

  @Column({ name: 'userId', nullable: false })
  userId: string;

  @ManyToOne((type) => User, (user) => user.deviceTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;
}
