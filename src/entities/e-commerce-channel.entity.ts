import { CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { EcommercePlatformEntity } from './e-commerce-platform.entity';
import { PartnerEntity } from './partner.entity';

import { createForeignKeyConstraintName } from '@/constants';

@Entity({ name: 'e_commerce_channel', comment: 'e-커머스 채널' })
export class EcommerceChannelEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true, comment: 'e-커머스 채널 PK' })
  readonly id: number;

  @ManyToOne(() => EcommercePlatformEntity, (e) => e.ecommerceChannels, { onDelete: 'CASCADE' })
  @JoinColumn({ foreignKeyConstraintName: createForeignKeyConstraintName('e_commerce_channel', 'e_commerce_platform', 'id') })
  ecommercePlatform: EcommercePlatformEntity;

  @ManyToOne(() => PartnerEntity, (e) => e.ecommerceChannels, { onDelete: 'CASCADE' })
  @JoinColumn({ foreignKeyConstraintName: createForeignKeyConstraintName('e_commerce_channel', 'partner', 'id') })
  partner: PartnerEntity;

  @CreateDateColumn({ type: 'timestamp', comment: '생성일시' })
  readonly createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', comment: '수정일시' })
  readonly updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', comment: '삭제일시' })
  readonly deletedAt: Date | null;
}
