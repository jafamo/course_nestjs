import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'public') }),
    MongooseModule.forRoot('mongodb://root:example@localhost:27017', {
      dbName: 'nest-pokemon',
    }),
    PokemonModule,
  ],
})
// eslint-disable-next-line prettier/prettier
export class AppModule { }
