import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserInputDTO } from 'src/api/dtos/users/create-user.input.dto';
import { UpdateUserInputDTO } from 'src/api/dtos/users/update-user.input.dto';
import { Nullable } from 'src/common/types';
import { PokemonModel } from 'src/infra/postgres/entities/pokemon.entity';
import { UserPokemonEntity, UserPokemonModel } from 'src/infra/postgres/entities/user-pokemon.entity';
import { UserEntity, UserModel } from 'src/infra/postgres/entities/user.entity';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  public constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,

    @InjectRepository(UserPokemonEntity)
    private readonly userPokemonsRepository: Repository<UserPokemonEntity>,
  ) {}

  public async preload<
    T extends FindOptionsRelations<UserEntity> = {},
  >(
    user: UserModel,
    relations?: T,
  ): Promise<UserModel<T>> {
    return this.findOne({ id: user.id }, relations).then(user => user!);
  }

  public async findOne<
    T extends FindOptionsRelations<UserEntity> = {},
  >(
    where?: FindOptionsWhere<UserEntity<T>>,
    relations?: T,
  ): Promise<Nullable<UserModel<T>>> {

    return this.usersRepository.findOne({
      where,
      relations,
    }) as Promise<Nullable<UserModel<T>>>;
  }

  public async createOne(dto: CreateUserInputDTO): Promise<UserModel> {
    const user = this.usersRepository.create(dto);

    return this.usersRepository.save(user);
  }

  public async updateOne<
    T extends FindOptionsRelations<UserEntity> = {},
  >(
    user: UserModel<T>,
    dto: UpdateUserInputDTO
  ): Promise<UserModel<T>> {
    const updatedUser = this.usersRepository.merge(user, dto);

    return this.usersRepository.save(updatedUser) as Promise<UserModel<T>>;
  }


  public async addPokemon(
    user: UserModel,
    pokemon: PokemonModel,
  ): Promise<UserPokemonModel<{ user: true, pokemon: true }>> {
    const userPokemon = this.userPokemonsRepository.create({
      user,
      pokemon,
    });

    return this.userPokemonsRepository.save(userPokemon);
  }
}
