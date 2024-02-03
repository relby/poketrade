import { Injectable } from "@nestjs/common";
import { Seeder } from "nestjs-seeder";
import { PokemonsRepository } from 'src/core/repositories/pokemons.repository';

@Injectable()
export class PokemonsSeeder implements Seeder {
  constructor(private readonly pokemonsRepository: PokemonsRepository) {}

  async seed() {
    // TODO: Maybe i can do that with a single request? Research on that
    const requests = [...Array(152).keys()]
      .map((i) => fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}`));

    const apiPokemons = await Promise.all(
      requests.map(request => request.then(response => response.json())),
    );

    const createPokemonDTOs = apiPokemons.map((apiPokemon) => ({
        id: apiPokemon['id'],
        name: apiPokemon['name'],
        worth: apiPokemon['base_experience'],
        height: apiPokemon['height'],
        weight: apiPokemon['weight'],
        image: apiPokemon['sprites']['other']['official-artwork']['front_default'],
    }));

    return this.pokemonsRepository.createPokemons(createPokemonDTOs);
  }

  async drop() {
    return this.pokemonsRepository.deleteAllPokemons();
  }
}
