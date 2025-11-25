import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from './config';

@Module({
  imports: [UserModule,
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
       const { db, nodeEnv } = envs;
        return {
          ...db,
          entities: [__dirname + '/**/entities/*.entity{.ts,.js}'],
          synchronize: nodeEnv === 'development',
        }; 
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
