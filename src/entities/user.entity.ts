import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { FulfillmentEntity } from './fulfillment.entity';
import { PartnerGroupEntity } from './partner-group.entity';
import { PartnerEntity } from './partner.entity';

import { createForeignKeyConstraintName, createIndexConstraintName, UserPrivilige } from '@/constants';

@Index(createIndexConstraintName('user', 'email'), ['email'], { unique: true })
@Entity({ name: 'user', comment: '사용자' })
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true, comment: '사용자 PK' })
  readonly id: number;

  @Column({ type: 'varchar', length: 340, comment: '사용자 이메일 계정' })
  email: string;

  @Column({ type: 'varchar', length: 255, comment: '사용자 비밀번호' })
  password: string;

  @Column({ type: 'varchar', length: 50, comment: '사용자 이름' })
  name: string;

  @Column({ type: 'tinyint', unsigned: true, default: UserPrivilige.User, comment: '사용자 권한' })
  privilige: UserPrivilige;

  @Column({ type: 'boolean', default: true, comment: '사용자 계정 활성 여부' })
  isActivated: boolean;

  @ManyToOne(() => PartnerGroupEntity, (e) => e.users, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ foreignKeyConstraintName: createForeignKeyConstraintName('user', 'partner_group', 'id') })
  partnerGroup: PartnerGroupEntity | null;

  @ManyToOne(() => PartnerEntity, (e) => e.users, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ foreignKeyConstraintName: createForeignKeyConstraintName('user', 'partner', 'id') })
  partner: PartnerEntity | null;

  @ManyToOne(() => FulfillmentEntity, (e) => e.users, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ foreignKeyConstraintName: createForeignKeyConstraintName('user', 'fulfillment', 'id') })
  fulfillment: FulfillmentEntity | null;

  @CreateDateColumn({ type: 'timestamp', comment: '생성일시' })
  readonly createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', comment: '수정일시' })
  readonly updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', comment: '삭제일시' })
  readonly deletedAt: Date | null;
}