import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { getChainsConfig, getPrivateKey, ServiceClient } from '@project/shared';
import * as NFTManager from '@/abi/NFTManager.json';
import { Model } from 'mongoose';
import { NFT } from '@/entity/nft.entity';
import { InjectModel } from '@nestjs/mongoose';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class NFTService {
  private readonly logger = new Logger(NFTService.name);
  private chainConfigs: Record<
    string,
    { provider: ethers.JsonRpcProvider; signer: ethers.Wallet }
  >;

  constructor(
    @InjectModel(NFT.name) private readonly nftModel: Model<NFT>,
    private readonly serviceClient: ServiceClient,
    @InjectRedis() private readonly redis: Redis,
  ) {
    const privateKey = getPrivateKey();
    if (!privateKey) throw new Error('PRIVATE_KEY not found');

    this.chainConfigs = getChainsConfig();
  }

  private async getContract(collectionId: string, chain: string) {
    const collection: {
      status: string;
      chain: string;
      contractAddress: string;
    } = await this.serviceClient.sendToService(
      'collection-service',
      { cmd: 'get_collection' },
      { collectionId },
    );
    if (!collection || collection.status !== 'approved')
      throw new BadRequestException('Collection not approved');
    if (collection.chain !== chain)
      throw new BadRequestException('Chain mismatch with collection');
    const { provider, signer } = this.chainConfigs[chain];
    return new ethers.Contract(
      collection.contractAddress,
      NFTManager.abi,
      signer.connect(provider),
    );
  }

  async bulkMintManual(data: {
    collectionId: string;
    wallet_address: string;
    chain: string;
    tokenURIs: string[];
  }) {
    if (!this.chainConfigs[data.chain])
      throw new BadRequestException('Unsupported chain');
    const contract = await this.getContract(data.collectionId, data.chain);

    const tx = await contract.bulkMint(data.wallet_address, data.tokenURIs);
    const receipt = await tx.wait();
    const tokenIds = receipt.logs
      .filter(
        (log) =>
          log.topics[0] === ethers.id('NFTMinted(uint256,address,string)'),
      )
      .map((log) =>
        ethers.AbiCoder.defaultAbiCoder()
          .decode(['uint256'], log.topics[1])[0]
          .toString(),
      );

    const nfts = tokenIds.map((tokenId, index) => ({
      tokenId,
      tokenURI: data.tokenURIs[index],
      owner: data.wallet_address,
      collectionId: data.collectionId,
      chain: data.chain,
      metadata: {},
      isLazy: false,
      status: 'minted',
    }));
    await this.nftModel.insertMany(nfts);

    await this.serviceClient.sendToService(
      'collection-service',
      { cmd: 'update_nft_count' },
      { collectionId: data.collectionId, count: tokenIds.length },
    );
    await this.redis.del('nfts:marketplace:*'); // Xóa tất cả cache liên quan

    this.logger.log(
      `Bulk minted ${tokenIds.length} NFTs on ${data.chain} for ${data.wallet_address}`,
    );
    return { txHash: tx.hash, tokenIds, success: true };
  }

  async mintManual(data: {
    collectionId: string;
    wallet_address: string;
    chain: string;
    tokenURI: string;
  }) {
    const contract = await this.getContract(data.collectionId, data.chain);
    const tx = await contract.mintManual(data.wallet_address, data.tokenURI);
    const receipt = await tx.wait();
    const tokenId = receipt.logs
      .filter(
        (log) =>
          log.topics[0] === ethers.id('NFTMinted(uint256,address,string)'),
      )
      .map((log) =>
        ethers.AbiCoder.defaultAbiCoder()
          .decode(['uint256'], log.topics[1])[0]
          .toString(),
      )[0];

    const nft = {
      tokenId,
      tokenURI: data.tokenURI,
      owner: data.wallet_address,
      collectionId: data.collectionId,
      chain: data.chain,
      metadata: {},
      isLazy: false,
      status: 'minted',
    };
    await this.nftModel.create(nft);

    await this.serviceClient.sendToService(
      'collection-service',
      { cmd: 'update_nft_count' },
      { collectionId: data.collectionId, count: 1 },
    );
    await this.redis.del('nfts:marketplace:*');
    return { txHash: tx.hash, tokenId, success: true };
  }

  async lazyMintManual(data: {
    collectionId: string;
    wallet_address: string;
    chain: string;
    tokenURI: string;
    royaltyPercentage: number;
    signature: string;
  }) {
    const contract = await this.getContract(data.collectionId, data.chain);
    const tx = await contract.lazyMint(
      data.wallet_address,
      data.tokenURI,
      data.royaltyPercentage,
      data.signature,
    );
    const receipt = await tx.wait();
    const tokenId = receipt.logs
      .filter(
        (log) =>
          log.topics[0] === ethers.id('LazyMinted(uint256,address,string)'),
      )
      .map((log) =>
        ethers.AbiCoder.defaultAbiCoder()
          .decode(['uint256'], log.topics[1])[0]
          .toString(),
      )[0];

    const nft = {
      tokenId,
      tokenURI: data.tokenURI,
      owner: data.wallet_address,
      collectionId: data.collectionId,
      chain: data.chain,
      metadata: {},
      isLazy: true,
      status: 'minted',
    };
    await this.nftModel.create(nft);

    await this.serviceClient.sendToService(
      'collection-service',
      { cmd: 'update_nft_count' },
      { collectionId: data.collectionId, count: 1 },
    );
    await this.redis.del('nfts:marketplace:*');
    return { txHash: tx.hash, tokenId, success: true };
  }

  async createAuction(data: {
    collectionId: string;
    chain: string;
    tokenId: string;
    minBid: string;
    duration: number;
    seller: string;
  }) {
    const contract = await this.getContract(data.collectionId, data.chain);
    const tx = await contract.createAuction(
      data.tokenId,
      data.minBid,
      data.duration,
      { from: data.seller },
    );
    await tx.wait();
    return { txHash: tx.hash, success: true };
  }

  async placeBid(data: {
    collectionId: string;
    chain: string;
    tokenId: string;
    bidAmount: string;
    bidder: string;
  }) {
    const contract = await this.getContract(data.collectionId, data.chain);
    const tx = await contract.placeBid(data.tokenId, {
      value: data.bidAmount,
      from: data.bidder,
    });
    await tx.wait();
    return { txHash: tx.hash, success: true };
  }

  async endAuction(data: {
    collectionId: string;
    chain: string;
    tokenId: string;
  }) {
    const contract = await this.getContract(data.collectionId, data.chain);
    const tx = await contract.endAuction(data.tokenId);
    await tx.wait();
    return { txHash: tx.hash, success: true };
  }

  async getMarketplaceNFTs(page: number = 1, limit: number = 10) {
    const cacheKey = `nfts:marketplace:${page}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      this.logger.log(`Cache hit for ${cacheKey}`);
      return JSON.parse(cached);
    }

    const skip = (page - 1) * limit;
    const nfts = await this.nftModel
      .find({ status: 'minted' })
      .skip(skip)
      .limit(limit)
      .lean();
    const result = {
      nfts: nfts.map((nft) => ({
        id: nft._id,
        name: nft.metadata.name,
        tokenURI: nft.tokenURI,
        owner: nft.owner,
      })),
    };
    await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 300); // 5 phút
    this.logger.log(`Cache miss for ${cacheKey}, stored new data`);
    return result;
  }
}
