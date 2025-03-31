import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Collection } from '../entity/collection.entity';
import { ethers } from 'ethers';
import * as NFTManager from '@/abi/NFTManager.json';
import {
  getChainsConfig,
  getMarketplace,
  getPrivateKey,
} from '@project/shared';

@Injectable()
export class CollectionService {
  private readonly logger = new Logger(CollectionService.name);
  private chainConfigs: Record<
    string,
    { provider: ethers.JsonRpcProvider; signer: ethers.Wallet }
  >;

  constructor(
    @InjectModel(Collection.name)
    private readonly collectionModel: Model<Collection>,
  ) {
    const privateKey = getPrivateKey();
    if (!privateKey) throw new Error('PRIVATE_KEY not found');
    this.chainConfigs = getChainsConfig();
  }

  async createCollection(data: {
    chain: string;
    name: string;
    symbol: string;
    description: string;
    artType: string;
    uri?: string;
    collectionImageUrl: string;
    artworkUrl?: string;
    mintPrice: string;
    royaltyFee: string;
    maxSupply: string;
    mintLimit: string;
    mintStartDate: string;
    allowlistStages: any[];
    publicMint: any;
    contractAddress?: string;
    user: { id: string; role: string };
  }) {
    const {
      chain,
      name,
      symbol,
      description,
      artType,
      uri,
      collectionImageUrl,
      artworkUrl,
      mintPrice,
      royaltyFee,
      maxSupply,
      mintLimit,
      mintStartDate,
      allowlistStages,
      publicMint,
      contractAddress,
      user,
    } = data;

    if (!this.chainConfigs[chain])
      throw new BadRequestException('Unsupported chain');

    const { provider, signer } = this.chainConfigs[chain];
    const { marketplaceFeeRecipient, marketplaceFeePercentage } =
      getMarketplace();

    if (user.role === 'user' && !contractAddress) {
      const factory = new ethers.ContractFactory(
        NFTManager.abi,
        NFTManager.bytecode,
        signer,
      );
      const deployData = factory.interface.encodeDeploy([
        name,
        uri || 'https://ipfs.io/ipfs/default',
        ethers.parseUnits(maxSupply, 0),
        ethers.parseUnits(mintLimit, 0),
        ethers.parseEther(mintPrice),
        marketplaceFeeRecipient,
        marketplaceFeePercentage,
      ]);
      const steps = [
        {
          id: 'create-token',
          params: { from: user.id, to: null, value: '0', data: deployData },
        },
      ];
      return { steps };
    } else if (user.role === 'admin' && !contractAddress) {
      const signerConnected = signer.connect(provider);
      const factory = new ethers.ContractFactory(
        NFTManager.abi,
        NFTManager.bytecode,
        signerConnected,
      );
      const contract = await factory.deploy(
        name,
        uri || 'https://ipfs.io/ipfs/default',
        ethers.parseUnits(maxSupply, 0),
        ethers.parseUnits(mintLimit, 0),
        ethers.parseEther(mintPrice),
        marketplaceFeeRecipient,
        marketplaceFeePercentage,
      );
      await contract.waitForDeployment();
      const finalContractAddress = await contract.getAddress();

      const collection = new this.collectionModel({
        creatorId: user.id,
        creatorRole: user.role,
        name,
        description,
        image: collectionImageUrl,
        uri,
        images: [],
        isVerified: true,
        chain,
        contractAddress: finalContractAddress,
        nftCount: 0,
        artType,
        artworkUrl, // Xóa metadataUrl
        mintPrice,
        royaltyFee,
        maxSupply,
        mintLimit,
        mintStartDate,
        allowlistStages,
        publicMint,
      });

      const savedCollection = (await collection.save()) as Collection;
      this.logger.log(`Created collection ${savedCollection._id} by admin`);
      return {
        collectionId: savedCollection._id.toString(),
        contractAddress: finalContractAddress,
      };
    } else if (contractAddress) {
      const collection = new this.collectionModel({
        creatorId: user.id,
        creatorRole: user.role,
        name,
        description,
        image: collectionImageUrl,
        uri,
        images: [],
        isVerified: user.role === 'admin',
        chain,
        contractAddress,
        nftCount: 0,
        artType,
        artworkUrl, // Xóa metadataUrl
        mintPrice,
        royaltyFee,
        maxSupply,
        mintLimit,
        mintStartDate,
        allowlistStages,
        publicMint,
      });

      const savedCollection = (await collection.save()) as Collection;
      this.logger.log(
        `Saved collection ${savedCollection._id} with contract ${contractAddress}`,
      );
      return {
        collectionId: savedCollection._id.toString(),
        contractAddress,
      };
    }

    throw new BadRequestException('Invalid request');
  }

  async approveCollection(collectionId: string) {
    const collection = await this.collectionModel.findById(collectionId);
    if (!collection) throw new BadRequestException('Collection not found');
    if (collection.isVerified)
      throw new BadRequestException('Collection is already approved');
    collection.isVerified = true;
    await collection.save();
    this.logger.log(`Approved collection ${collectionId}`);
    return true;
  }

  async getPendingCollections() {
    const collections = (await this.collectionModel
      .find({ isVerified: false })
      .select('name creatorId creatorRole createdAt')
      .exec()) as any[];
    return collections.map((collection) => ({
      collectionId: collection._id.toString(),
      name: collection.name,
      creatorId: collection.creatorId,
      creatorRole: collection.creatorRole,
      createdAt: collection.createdAt.toISOString(),
    }));
  }
}
