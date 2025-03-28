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
    name: string;
    description: string;
    image: string;
    images: string[];
    chain: string;
    user: { id: number; address: string; role?: string };
  }) {
    const { name, description, image, images, chain, user } = data;

    if (!this.chainConfigs[chain]) {
      throw new BadRequestException('Unsupported chain');
    }

    const { provider, signer } = this.chainConfigs[chain];
    const signerConnected = signer.connect(provider);
    const factory = new ethers.ContractFactory(
      NFTManager.abi,
      NFTManager.bytecode,
      signerConnected,
    );

    const contract = await factory.deploy(
      name,
      'NFTC',
      ...Object.values(getMarketplace()),
    );
    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();

    const collection = new this.collectionModel({
      creatorId: user.id.toString(),
      creatorRole: user.role || 'user',
      name,
      description,
      image,
      images: images || [],
      isVerified: false,
      chain,
      contractAddress,
      nftCount: 0,
    });

    const savedCollection = (await collection.save()) as { _id: string };
    this.logger.log(
      `Created collection ${savedCollection._id} with contract ${contractAddress}`,
    );
    return { collectionId: savedCollection._id.toString(), contractAddress };
  }

  // Các phương thức khác giữ nguyên
  async approveCollection(data: {
    collectionId: string;
    user: { id: number; address: string; role?: string };
  }) {
    if (data.user.role !== 'admin') {
      throw new BadRequestException('Only admins can approve collections');
    }
    const collection = await this.collectionModel.findById(data.collectionId);
    if (!collection) throw new BadRequestException('Collection not found');
    collection.isVerified = true;
    await collection.save();
    this.logger.log(
      `Approved collection ${data.collectionId} by admin ${data.user.id}`,
    );
    return { status: 'approved' };
  }

  async getCollection(collectionId: string) {
    const collection = await this.collectionModel.findById(collectionId);
    if (!collection) throw new BadRequestException('Collection not found');
    return {
      status: collection.isVerified ? 'approved' : 'pending',
      chain: collection.chain,
      contractAddress: collection.contractAddress,
      nftCount: collection.nftCount,
    };
  }

  async updateNftCount(collectionId: string, count: number) {
    const collection = await this.collectionModel.findById(collectionId);
    if (!collection) throw new BadRequestException('Collection not found');
    collection.nftCount += count;
    await collection.save();
    this.logger.log(
      `Updated nftCount for collection ${collectionId} to ${collection.nftCount}`,
    );
    return { success: true };
  }
}
