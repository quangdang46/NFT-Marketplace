import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Collection } from '../entity/collection.entity';
import { ethers } from 'ethers';
import * as NFTManager from '@/abis/NFTManager.json';
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
    metadataUrl?: string;
    collectionImage: string;
    artworkUrl?: string;
    mintPrice: string;
    royaltyFee: string;
    maxSupply: string;
    mintLimit: string;
    mintStartDate: string;
    allowlistStages: {
      id: string;
      mintPrice: string;
      durationDays: string;
      durationHours: string;
      wallets: string[];
      startDate: string;
    }[];
    publicMint: {
      mintPrice: string;
      durationDays: string;
      durationHours: string;
      startDate?: string;
    };
    contractAddress?: string;
    creatorId: string;
    creatorRole: string;
  }) {
    const {
      chain,
      name,
      symbol,
      description,
      artType,
      metadataUrl,
      collectionImage,
      artworkUrl,
      mintPrice,
      royaltyFee,
      maxSupply,
      mintLimit,
      mintStartDate,
      allowlistStages,
      publicMint,
      contractAddress,
      creatorId,
      creatorRole,
    } = data;

    if (!this.chainConfigs[chain])
      throw new BadRequestException('Unsupported chain');

    let finalContractAddress = contractAddress;
    if (creatorRole === 'admin' && !contractAddress) {
      const { provider, signer } = this.chainConfigs[chain];
      const signerConnected = signer.connect(provider);
      const factory = new ethers.ContractFactory(
        NFTManager.abi,
        NFTManager.bytecode,
        signerConnected,
      );
      const contract = await factory.deploy(
        name,
        symbol,
        ethers.parseUnits(maxSupply, 0),
        ethers.parseUnits(mintLimit, 0),
        ethers.parseEther(mintPrice),
        ...Object.values(getMarketplace()),
      );
      await contract.waitForDeployment();
      finalContractAddress = await contract.getAddress();
    } else if (!contractAddress) {
      throw new BadRequestException('Contract address is required for users');
    }

    const isAdmin = creatorRole === 'admin';
    const isVerified = isAdmin;

    const collection = new this.collectionModel({
      creatorId,
      creatorRole,
      name,
      description,
      image: collectionImage,
      images: [],
      isVerified,
      chain,
      contractAddress: finalContractAddress,
      nftCount: 0,
      artType,
      metadataUrl,
      artworkUrl,
      mintPrice,
      royaltyFee,
      maxSupply,
      mintLimit,
      mintStartDate,
      allowlistStages,
      publicMint,
    });

    const savedCollection = (await collection.save()) as any;
    this.logger.log(
      `Created collection ${savedCollection._id} with contract ${finalContractAddress} by ${creatorRole}`,
    );

    return {
      collectionId: savedCollection._id.toString(),
      contractAddress: finalContractAddress,
    };
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
