import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { NFT } from 'src/database/entities/nft.entity';
import { CreateNFTDto } from 'src/nft/dto/create-nft.dto';
import { NftService } from 'src/nft/nft.service';

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
