import { Injectable } from '@nestjs/common';
import { Database, Transaction } from 'src/infra/postgres/types';
import { InjectDatabase } from 'src/infra/ioc/decorators/inject-database.decorator';
import { CreatePokemonEntityValues, PokemonEntity, pokemonsTable } from 'src/infra/postgres/tables';

@Injectable()
export class PokemonsService {
  public constructor(
    @InjectDatabase()
    private readonly db: Database,
  ) {}

  public async createPokemons(
    values: Array<CreatePokemonEntityValues>,
    tx?: Transaction,
  ): Promise<Array<PokemonEntity>> {
    if (!values.length) return [];

    return (tx ?? this.db)
      .insert(pokemonsTable)
      .values(values)
      .returning()
  }

  public async deleteAllPokemons(
    tx?: Transaction,
  ): Promise<void> {
    await (tx ?? this.db)
      .delete(pokemonsTable)
      .returning();
  }
}
