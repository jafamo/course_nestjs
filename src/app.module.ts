import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'public') }),
    MongooseModule.forRoot('mongodb://root:example@localhost:27017', {
      dbName: 'nest-pokemon',
    }),
    PokemonModule,
    CommonModule,
  ],
})
// eslint-disable-next-line prettier/prettier
export class AppModule { }
