import { Auction } from '@/entity/auction.entity';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceClient } from '@project/shared';
import Redis from 'ioredis';
import { Repository } from 'typeorm';

@Injectable()
export class AuctionService {
  private readonly logger = new Logger(AuctionService.name);

  constructor(
    @InjectRepository(Auction)
    private readonly auctionRepository: Repository<Auction>,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async createAuction(data: {
    nft_id: string;
    seller: string;
    starting_price: string;
    end_time: string;
    chain: string;
  }) {
    const auction = this.auctionRepository.create({
      nft_id: data.nft_id,
      seller: data.seller,
      starting_price: data.starting_price,
      end_time: new Date(data.end_time),
      chain: data.chain,
    });
    const savedAuction = await this.auctionRepository.save(auction);
    this.logger.log(`Created auction ${savedAuction.id}`);
    return { auctionId: savedAuction.id };
  }

  async updateBid(data: {
    auctionId: string;
    bidder: string;
    current_bid: string;
  }) {
    const auction = await this.auctionRepository.findOne({
      where: { id: data.auctionId },
    });
    if (!auction || auction.status !== 'active')
      throw new BadRequestException('Auction not found or ended');
    auction.bidder = data.bidder;
    auction.current_bid = data.current_bid;
    await this.auctionRepository.save(auction);

    const cacheKey = `auction:${data.auctionId}:bids`;
    const bids = (await this.redis.lrange(cacheKey, 0, -1)) || [];
    bids.push(`${data.bidder}:${data.current_bid}`);
    const ttl = Math.floor(
      (new Date(auction.end_time).getTime() - Date.now()) / 1000,
    );
    await this.redis.rpush(cacheKey, `${data.bidder}:${data.current_bid}`);
    if (ttl > 0) await this.redis.expire(cacheKey, ttl);
    this.logger.log(`Updated bid for auction ${data.auctionId}`);
    return { success: true };
  }

  async endAuction(auctionId: string) {
    const auction = await this.auctionRepository.findOne({
      where: { id: auctionId },
    });
    if (!auction || auction.status !== 'active')
      throw new BadRequestException('Auction not found or already ended');
    auction.status = 'ended';
    await this.auctionRepository.save(auction);
    await this.redis.del(`auction:${auctionId}:bids`);
    this.logger.log(`Ended auction ${auctionId}`);
    return {
      success: true,
      bidder: auction.bidder,
      current_bid: auction.current_bid,
    };
  }

  async getAuctionBids(auctionId: string) {
    const cacheKey = `auction:${auctionId}:bids`;
    const cached = await this.redis.lrange(cacheKey, 0, -1);
    if (cached && cached.length > 0) return cached;

    const auction = await this.auctionRepository.findOne({
      where: { id: auctionId },
    });
    if (!auction) throw new BadRequestException('Auction not found');
    const bids =
      auction.bidder && auction.current_bid
        ? [`${auction.bidder}:${auction.current_bid}`]
        : [];
    const ttl = Math.floor(
      (new Date(auction.end_time).getTime() - Date.now()) / 1000,
    );
    if (bids.length > 0 && ttl > 0) {
      await this.redis.rpush(cacheKey, ...bids);
      await this.redis.expire(cacheKey, ttl);
    }
    return bids;
  }
}
