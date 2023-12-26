import { Column, Entity, OneToMany, FindOptionsRelations } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { OpenedPackEntity } from './opened-pack.entity';
import { GetEntityRelations, CreateModel, From } from '../other/types';
import { BaseWithDateEntity } from '../other/base-with-date.entity';
import { UserInventoryEntryEntity } from './user-inventory-entry.entity';

@Entity('users')
export class UserEntity<
  T extends FindOptionsRelations<UserEntity> = {},
> extends BaseWithDateEntity {
  @AutoMap()
  @Column({ type: 'text', unique: true })
  public readonly name: string;

  @Column({ type: 'text' })
  public readonly hashedPassword: string;

  // TODO: consider adding check constraint
  @AutoMap()
  @Column({ type: 'integer', default: 0 })
  public readonly balance: number;

  @AutoMap(() => [UserInventoryEntryEntity])
  @OneToMany(() => UserInventoryEntryEntity, (inventoryEntry) => inventoryEntry.user)
  public readonly inventory: Array<UserInventoryEntryEntity<From<T['inventory']>>>;

  @AutoMap(() => [OpenedPackEntity])
  @OneToMany(() => OpenedPackEntity, (openedPack) => openedPack.user)
  public readonly openedPacks: Array<OpenedPackEntity<From<T['openedPacks']>>>;
}

type UserEntityRelations = GetEntityRelations<UserEntity, 'inventory' | 'openedPacks'>;

export type UserModel<
  T extends FindOptionsRelations<UserEntity> = {},
> = CreateModel<UserEntity<T>, UserEntityRelations, T>;
