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
    description: string;
    artType: string;
    uri: string;
    collectionImageUrl: string;
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
    publicMint: any;
    contractAddress?: string;
    user: { id: string; role: string };
  }) {
    const {
      chain,
      name,
      uri,
      collectionImageUrl,
      mintPrice,
      royaltyFee,
      maxSupply,
      mintLimit,
      allowlistStages,
      publicMint,
      contractAddress,
      user,
      mintStartDate,
    } = data;

    if (!this.chainConfigs[chain])
      throw new BadRequestException('Unsupported chain');

    const { provider, signer } = this.chainConfigs[chain];
    const { marketplaceFeeRecipient, marketplaceFeePercentage } =
      getMarketplace();
    const factory = new ethers.ContractFactory(
      NFTManager.abi,
      NFTManager.bytecode,
      signer,
    );

    if (user.role === 'USER' && !contractAddress) {
      const deployData = factory.interface.encodeDeploy([
        name,
        uri,
        marketplaceFeeRecipient,
        marketplaceFeePercentage,
        ethers.parseUnits(maxSupply, 0),
        ethers.parseUnits(mintLimit, 0),
        ethers.parseEther(mintPrice),
      ]);
      const steps = [
        {
          id: 'create-token',
          params: JSON.stringify({
            from: user.id,
            to: null,
            value: '0',
            data: deployData,
          }), // Stringify params
        },
      ];

      for (const stage of allowlistStages) {
        const duration =
          parseInt(stage.durationDays) * 86400 +
          parseInt(stage.durationHours) * 3600;
        const startTime = Math.floor(
          new Date(stage.startDate).getTime() / 1000,
        );
        const stageData = factory.interface.encodeFunctionData(
          'addAllowlistStage',
          [
            stage.id,
            ethers.parseEther(stage.mintPrice),
            startTime,
            duration,
            stage.wallets,
          ],
        );
        steps.push({
          id: `set-whitelist-${stage.id}`,
          params: JSON.stringify({
            from: user.id,
            to: null,
            value: '0',
            data: stageData,
          }), // Stringify params
        });
      }

      return { steps };
    } else if (user.role === 'ADMIN' && !contractAddress) {
      const signerConnected = signer.connect(provider);
      const contract = await factory.deploy(
        name,
        uri,
        marketplaceFeeRecipient,
        marketplaceFeePercentage,
        ethers.parseUnits(maxSupply, 0),
        ethers.parseUnits(mintLimit, 0),
        ethers.parseEther(mintPrice),
      );
      await contract.waitForDeployment();
      const finalContractAddress = await contract.getAddress();

      const nftContract = new ethers.Contract(
        finalContractAddress,
        NFTManager.abi,
        signerConnected,
      );
      await nftContract.setRoyalty(
        marketplaceFeeRecipient,
        parseInt(royaltyFee),
      );

      for (const stage of allowlistStages) {
        const duration =
          parseInt(stage.durationDays) * 86400 +
          parseInt(stage.durationHours) * 3600;
        const startTime = Math.floor(
          new Date(stage.startDate).getTime() / 1000,
        );
        await nftContract.addAllowlistStage(
          stage.id,
          ethers.parseEther(stage.mintPrice),
          startTime,
          duration,
          stage.wallets,
        );
      }

      const collection = new this.collectionModel({
        creatorId: user.id,
        creatorRole: user.role,
        name,
        image: collectionImageUrl,
        uri,
        chain,
        contractAddress: finalContractAddress,
        mintPrice,
        royaltyFee,
        maxSupply,
        mintLimit,
        mintStartDate,
        allowlistStages,
        publicMint,
        isVerified: true,
      });
      const savedCollection = await collection.save();
      return {
        collectionId: savedCollection._id?.toString(),
        contractAddress: finalContractAddress,
      };
    } else if (contractAddress) {
      const collection = new this.collectionModel({
        creatorId: user.id,
        creatorRole: user.role,
        name,
        image: collectionImageUrl,
        uri,
        chain,
        contractAddress,
        mintPrice,
        royaltyFee,
        maxSupply,
        mintLimit,
        mintStartDate,
        allowlistStages,
        publicMint,
        isVerified: user.role === 'ADMIN',
      });
      const savedCollection = await collection.save();
      return { collectionId: savedCollection._id?.toString(), contractAddress };
    }

    throw new BadRequestException('Invalid request');
  }

  async approveCollection(collectionId: string) {
    const collection = await this.collectionModel.findById(collectionId);
    if (!collection) throw new BadRequestException('Collection not found');
    if (collection.isVerified)
      throw new BadRequestException('Collection already approved');
    collection.isVerified = true;
    await collection.save();
    return true;
  }

  async getPendingCollections() {
    const collections = await this.collectionModel
      .find({ isVerified: false })
      .select('name creatorId creatorRole createdAt')
      .exec();
    return collections.map((c) => ({
      collectionId: c._id?.toString(),
      name: c.name,
      creatorId: c.creatorId,
      creatorRole: c.creatorRole,
      // createdAt: c.createdAt.toISOString(),
    }));
  }
}
