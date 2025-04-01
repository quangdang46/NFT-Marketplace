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

  private getChainConfig(chain: string) {
    const config = this.chainConfigs[chain];
    if (!config) throw new BadRequestException('Unsupported chain');
    return config;
  }

  private generateUserSteps(data: any, factory: ethers.ContractFactory) {
    // Giữ nguyên logic
    const {
      name,
      uri,
      maxSupply,
      mintLimit,
      mintPrice,
      allowlistStages,
      user,
    } = data;
    const { marketplaceFeeRecipient, marketplaceFeePercentage } =
      getMarketplace();
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
        params: JSON.stringify({ from: user.id, value: '0', data: deployData }),
      },
    ];
    for (const stage of allowlistStages) {
      const duration =
        parseInt(stage.durationDays) * 86400 +
        parseInt(stage.durationHours) * 3600;
      const startTime = Math.floor(new Date(stage.startDate).getTime() / 1000);
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
        params: JSON.stringify({ from: user.id, value: '0', data: stageData }),
      });
    }
    return steps;
  }

  private async deployContractForAdmin(
    data: any,
    factory: ethers.ContractFactory,
    signer: ethers.Wallet,
  ) {
    const { name, uri, maxSupply, mintLimit, mintPrice } = data;
    const { marketplaceFeeRecipient, marketplaceFeePercentage } =
      getMarketplace();
    const signerConnected = signer.connect(
      this.chainConfigs[data.chain].provider,
    );
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
    return {
      contract,
      signerConnected,
      contractAddress: await contract.getAddress(),
    };
  }

  private async configureContract(
    contractAddress: string,
    signer: ethers.Wallet,
    data: any,
  ) {
    const { royaltyFee, allowlistStages, marketplaceFeeRecipient } = data;
    const contract = new ethers.Contract(
      contractAddress,
      NFTManager.abi,
      signer,
    );
    await contract.setRoyalty(marketplaceFeeRecipient, parseInt(royaltyFee));
    for (const stage of allowlistStages) {
      const duration =
        parseInt(stage.durationDays) * 86400 +
        parseInt(stage.durationHours) * 3600;
      const startTime = Math.floor(new Date(stage.startDate).getTime() / 1000);
      await contract.addAllowlistStage(
        stage.id,
        ethers.parseEther(stage.mintPrice),
        startTime,
        duration,
        stage.wallets,
      );
    }
  }

  private async saveCollection(data: any, contractAddress: string) {
    const collection = new this.collectionModel({
      creatorId: data.user.id,
      creatorRole: data.user.role,
      name: data.name,
      image: data.collectionImageUrl,
      uri: data.uri,
      chain: data.chain,
      contractAddress,
      mintPrice: data.mintPrice,
      royaltyFee: data.royaltyFee,
      maxSupply: data.maxSupply,
      mintLimit: data.mintLimit,
      mintStartDate: data.mintStartDate,
      allowlistStages: data.allowlistStages,
      publicMint: data.publicMint,
      isVerified: data.user.role === 'ADMIN',
    });
    const savedCollection = await collection.save();
    return savedCollection._id?.toString();
  }

  async createCollection(data: any) {
    const { chain, user, contractAddress } = data;
    const { provider, signer } = this.getChainConfig(chain);
    const factory = new ethers.ContractFactory(
      NFTManager.abi,
      NFTManager.bytecode,
      signer,
    );

    if (user.role === 'USER' && !contractAddress) {
      return { steps: this.generateUserSteps(data, factory) };
    }

    if (user.role === 'ADMIN' && !contractAddress) {
      const {
        contract,
        signerConnected,
        contractAddress: finalContractAddress,
      } = await this.deployContractForAdmin(data, factory, signer);
      await this.configureContract(finalContractAddress, signerConnected, data);
      const collectionId = await this.saveCollection(
        data,
        finalContractAddress,
      );
      return { collectionId, contractAddress: finalContractAddress };
    }

    if (contractAddress) {
      const collectionId = await this.saveCollection(data, contractAddress);
      return { collectionId, contractAddress };
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
