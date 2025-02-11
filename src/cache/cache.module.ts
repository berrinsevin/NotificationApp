import { Module } from "@nestjs/common";
import { Cacheable, Keyv } from 'cacheable';
import KeyvRedis, { createKeyv } from '@keyv/redis';

@Module({
  providers: [
    {
      provide: 'CACHE_INSTANCE',
      useFactory: () => {
        const redisStore = new KeyvRedis('redis://127.0.0.1:6379');
        const keyv = new Keyv({ store: redisStore , useKeyPrefix: false, namespace: ''});

        return new Cacheable({ primary: keyv, ttl: '1h' });
      },
    },
  ],
  exports: ['CACHE_INSTANCE'],
})

export class CacheModule {}