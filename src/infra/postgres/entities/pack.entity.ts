import { Column, Entity, FindOptionsRelations, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from '../other/base.entity';
import { AutoMap } from '@automapper/classes';
import { PokemonEntity } from './pokemon.entity';
import { CreateModel, GetEntityRelations, From } from '../other/types';

@Entity('packs')
export class PackEntity<
  T extends FindOptionsRelations<PackEntity<T>> = {},
> extends BaseEntity {
  @AutoMap()
  @Column({ type: 'text' })
  public readonly name: string;

  @AutoMap()
  @Column({ type: 'text' })
  public readonly description: string;

  @AutoMap()
  @Column({ type: 'integer' })
  public readonly price: number;

  // NOTE: URL
  @AutoMap()
  @Column({ type: 'text' })
  public readonly image: string;

  @AutoMap(() => PokemonEntity)
  @ManyToMany(() => PokemonEntity)
  @JoinTable({
    name: 'packs_pokemons',
    joinColumn: { name: 'pack_id' },
    inverseJoinColumn: { name: 'pokemon_id' },
  })
  public readonly pokemons: Array<PokemonEntity<From<T['pokemons']>>>;
}

type PackEntityRelations = GetEntityRelations<PackEntity, 'pokemons'>;

export type PackModel<
  T extends FindOptionsRelations<PackEntity<T>> = {},
> = CreateModel<PackEntity<T>, PackEntityRelations, T>;
