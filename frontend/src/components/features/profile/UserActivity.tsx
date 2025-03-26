"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpRight,
  ArrowDownRight,
  Hammer,
  Clock,
  Tag,
  Heart,
  ArrowRight,
} from "lucide-react";
import { mockNFTs } from "../../../data/mockData";
import { Button } from "@/components/ui/button";

interface UserActivityProps {
  userId: string;
  showAll?: boolean;
}

interface ActivityItem {
  id: string;
  type: "purchase" | "sale" | "mint" | "bid" | "auction" | "like";
  date: Date;
  nft: {
    id: string;
    name: string;
    image: string;
  };
  price?: number;
  from?: string;
  to?: string;
  chain: {
    id: string;
    name: string;
    icon: string;
    symbol: string;
    color: string;
  };
}

export function UserActivity({ userId, showAll = false }: UserActivityProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch user's activity
    const fetchActivity = async () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        const activityTypes = [
          "purchase",
          "sale",
          "mint",
          "bid",
          "auction",
          "like",
        ];

        // Generate random activity items
        const mockActivities = Array(showAll ? 30 : 20)
          .fill(null)
          .map((_, index) => {
            const nft = mockNFTs[Math.floor(Math.random() * mockNFTs.length)];
            const type = activityTypes[
              Math.floor(Math.random() * activityTypes.length)
            ] as ActivityItem["type"];
            const daysAgo = Math.floor(Math.random() * 30);
            const date = new Date();
            date.setDate(date.getDate() - daysAgo);

            return {
              id: `activity-${index}`,
              type,
              date,
              nft: {
                id: nft.id,
                name: nft.name,
                image: nft.image,
              },
              price: type !== "like" ? Number.parseFloat(nft.price) : undefined,
              from:
                type === "purchase"
                  ? `User${Math.floor(Math.random() * 1000)}`
                  : userId === "me"
                  ? "You"
                  : `User${userId}`,
              to:
                type === "sale"
                  ? `User${Math.floor(Math.random() * 1000)}`
                  : userId === "me"
                  ? "You"
                  : `User${userId}`,
              chain: nft.chain,
            };
          })
          .sort((a, b) => b.date.getTime() - a.date.getTime());

        setActivities(mockActivities);
        setLoading(false);
        setHasMore(showAll && mockActivities.length >= 30);
      }, 1500);
    };

    fetchActivity();
  }, [userId, showAll, page]);

  const loadMore = () => {
    if (!hasMore || loading) return;

    setPage((prevPage) => prevPage + 1);
    setLoading(true);
  };

  // Filter activities
  const filteredActivities =
    filter === "all"
      ? activities
      : activities.filter((activity) => activity.type === filter);

  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "purchase":
        return <ArrowDownRight className="h-4 w-4 text-green-500" />;
      case "sale":
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case "mint":
        return <Hammer className="h-4 w-4 text-blue-500" />;
      case "bid":
        return <Tag className="h-4 w-4 text-yellow-500" />;
      case "auction":
        return <Clock className="h-4 w-4 text-purple-500" />;
      case "like":
        return <Heart className="h-4 w-4 text-pink-500" />;
    }
  };

  const getActivityText = (activity: ActivityItem) => {
    const isOwnProfile = userId === "me";
    const userName = isOwnProfile ? "You" : `User ${userId}`;

    switch (activity.type) {
      case "purchase":
        return isOwnProfile
          ? `You purchased ${activity.nft.name}`
          : `Purchased ${activity.nft.name}`;
      case "sale":
        return isOwnProfile
          ? `You sold ${activity.nft.name}`
          : `Sold ${activity.nft.name}`;
      case "mint":
        return isOwnProfile
          ? `You minted ${activity.nft.name}`
          : `Minted ${activity.nft.name}`;
      case "bid":
        return isOwnProfile
          ? `You placed a bid on ${activity.nft.name}`
          : `Placed a bid on ${activity.nft.name}`;
      case "auction":
        return isOwnProfile
          ? `You created an auction for ${activity.nft.name}`
          : `Created an auction for ${activity.nft.name}`;
      case "like":
        return isOwnProfile
          ? `You liked ${activity.nft.name}`
          : `Liked ${activity.nft.name}`;
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
      }
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading && activities.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Activity</h2>
          <div className="h-10 w-32 bg-muted rounded animate-pulse"></div>
        </div>

        <div className="space-y-4">
          {Array(5)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="bg-card rounded-lg p-4 animate-pulse flex items-center gap-4"
              >
                <div className="h-12 w-12 bg-muted rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
                <div className="h-8 w-20 bg-muted rounded"></div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  if (filteredActivities.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Activity</h2>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activity</SelectItem>
              <SelectItem value="purchase">Purchases</SelectItem>
              <SelectItem value="sale">Sales</SelectItem>
              <SelectItem value="mint">Mints</SelectItem>
              <SelectItem value="bid">Bids</SelectItem>
              <SelectItem value="auction">Auctions</SelectItem>
              <SelectItem value="like">Likes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-card p-8 rounded-lg text-center">
          <p className="text-muted-foreground">No activity found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Activity</h2>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Activity</SelectItem>
            <SelectItem value="purchase">Purchases</SelectItem>
            <SelectItem value="sale">Sales</SelectItem>
            <SelectItem value="mint">Mints</SelectItem>
            <SelectItem value="bid">Bids</SelectItem>
            <SelectItem value="auction">Auctions</SelectItem>
            <SelectItem value="like">Likes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredActivities.map((activity) => (
          <Link
            key={activity.id}
            href={`/nfts/${activity.nft.id}`}
            className="bg-card rounded-lg p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className="relative h-12 w-12 rounded-lg overflow-hidden">
              <Image
                src={
                  activity.nft.image ||
                  "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20"
                }
                alt={activity.nft.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {getActivityIcon(activity.type)}
                <p className="font-medium truncate">
                  {getActivityText(activity)}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <span>{formatDate(activity.date)}</span>
                {activity.type !== "like" && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <div
                        className="w-3 h-3 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: activity.chain.color }}
                      >
                        <Image
                          src={
                            activity.chain.icon ||
                            "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20"
                          }
                          alt={activity.chain.name}
                          width={8}
                          height={8}
                        />
                      </div>
                      <span>{activity.chain.name}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {activity.price && (
              <div className="text-right">
                <p className="font-medium">
                  {activity.price.toFixed(2)} {activity.chain.symbol}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activity.type === "purchase" && `From: ${activity.from}`}
                  {activity.type === "sale" && `To: ${activity.to}`}
                </p>
              </div>
            )}
          </Link>
        ))}
      </div>

      {loading && activities.length > 0 && (
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {hasMore && !loading && (
        <div className="flex justify-center">
          <Button onClick={loadMore} variant="outline">
            Load More
          </Button>
        </div>
      )}

      {!showAll && (
        <div className="flex justify-center">
          <Button variant="outline" asChild>
            <Link
              href={`/profile/${userId}/activity`}
              className="flex items-center gap-2"
            >
              View All Activity
              <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
