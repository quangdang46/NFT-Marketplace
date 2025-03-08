import { CreateNFTDto } from '@/modules/nft/dto/create-nft.dto';
import { NFT } from '@/infrastructure/database/entities/nft.entity';
import { NftService } from '@/modules/nft/nft.service';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

@Resolver(() => NFT)
export class NFTResolver {
  constructor(private readonly nftService: NftService) {}

  @Query(() => [NFT])
  getAllNFTs() {
    return this.nftService.findAll();
  }

  @Mutation(() => NFT)
  createNFT(@Args('data') data: CreateNFTDto) {
    return this.nftService.create(data);
  }
}
