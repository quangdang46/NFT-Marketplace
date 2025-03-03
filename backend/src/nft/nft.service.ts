import { Injectable } from '@nestjs/common';

@Injectable()
export class NftService {
  create(createNFTDto: any) {
    return 'This action adds a new nft';
  }

  findAll() {
    return [
      { id: 1, name: 'NFT #1' },
      { id: 2, name: 'NFT #2' },
    ];
  }
}
