import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id/parse-mongo-id.pipe';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>, //se crea un Modelo de mongo de tipo Pokemon
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
      const pokemon = await this.pokemonModel.create(createPokemonDto);

      return pokemon;
    } catch (error) {
      throw new InternalServerErrorException(
        `ERROR: No se ha podido insertar ${error}`,
      );
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon: Pokemon | null = null;

    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findById({ no: term });
    }

    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    // 🔎 Buscar por nombre
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase().trim(),
      });
    }

    if (!pokemon) {
      throw new NotFoundException(`Pokemon with term ${term} not found`);
    }
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
      await pokemon.updateOne(updatePokemonDto, { new: true }); //esrto devuelva el true
    }

    //return pokemon;//esto retorna el que no esta actualizado
  }

  async remove(term: string) {
    //const result = await this.pokemonModel.findByIdAndDelete(term);
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: term }); //deletedCount es un valor que viene del deleteOne
    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon not found with this id: ${term}`);
    }
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon exist in db ${JSON.stringify(error.KeyValue)}`
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `can't create pockemon, check error log`,
    );
  }
}
