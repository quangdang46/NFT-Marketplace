import { Module } from '@nestjs/common';
import { NFTResolver } from 'src/nft/nft.resolver';
import { NftService } from 'src/nft/nft.service';

@Module({
  providers: [NftService, NFTResolver],
})
export class NftModule {}
