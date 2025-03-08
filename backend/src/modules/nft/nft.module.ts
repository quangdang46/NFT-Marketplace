import { NFTResolver } from '@/modules/nft/nft.resolver';
import { NftService } from '@/modules/nft/nft.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [NftService, NFTResolver],
})
export class NftModule {}
