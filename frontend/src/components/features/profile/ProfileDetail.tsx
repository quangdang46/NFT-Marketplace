"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Share2,
  Copy,
  ExternalLink,
  Twitter,
  Globe,
  Instagram,
  UserPlus,
  UserMinus,
  Settings,
  Wallet,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockChains } from "../../../data/mockData";
import { ProfileEditDialog } from "./ProfileEditDialog";
import { useProfileOwnership } from "../../../hooks/useProfileOwnership";
import Link from "next/link";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { toast } from "sonner";

interface ProfileDetailProps {
  userId: string;
}

interface UserProfile {
  id: string;
  name: string;
  username: string;
  address: string;
  bio: string;
  avatar: string;
  coverImage: string;
  isVerified: boolean;
  joinDate: string;
  followers: number;
  following: number;
  isFollowing: boolean;
  isOwnProfile: boolean;
  socialLinks: {
    twitter?: string;
    website?: string;
    instagram?: string;
  };
  stats: {
    totalNFTs: number;
    totalCollections: number;
    totalVolume: number;
  };
  preferredChain: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
}

export function ProfileDetail({ userId }: ProfileDetailProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Sử dụng hook để kiểm tra quyền sở hữu profile
  const { isOwner, isLoading: ownershipLoading } = useProfileOwnership(userId);

  // Lấy thông tin người dùng hiện tại từ Redux store
  const currentUser = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    // Simulate API call to fetch user profile
    const fetchProfile = async () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        const isOwnProfile = userId === "me" || isOwner;
        const randomChainIndex = Math.floor(Math.random() * mockChains.length);

        const mockProfile: UserProfile = {
          id: userId,
          name: isOwnProfile ? "Your Name" : `User ${userId}`,
          username: isOwnProfile ? "yournft" : `user${userId}`,
          address:
            isOwnProfile && currentUser
              ? currentUser.address
              : `0x${Math.random()
                  .toString(16)
                  .substring(2, 10)}...${Math.random()
                  .toString(16)
                  .substring(2, 6)}`,
          bio: "NFT enthusiast and digital art collector. Passionate about blockchain technology and the future of digital ownership.",
          avatar: `https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?150x150`,
          coverImage: `https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?400x1500`,
          isVerified: Math.random() > 0.5,
          joinDate: "January 2023",
          followers: Math.floor(Math.random() * 10000),
          following: Math.floor(Math.random() * 1000),
          isFollowing: Math.random() > 0.7,
          isOwnProfile,
          socialLinks: {
            twitter: "https://twitter.com",
            website: "https://example.com",
            instagram: "https://instagram.com",
          },
          stats: {
            totalNFTs: Math.floor(Math.random() * 100) + 1,
            totalCollections: Math.floor(Math.random() * 20) + 1,
            totalVolume: Math.floor(Math.random() * 1000) + 10,
          },
          preferredChain: {
            id: mockChains[randomChainIndex].id,
            name: mockChains[randomChainIndex].name,
            icon: mockChains[randomChainIndex].icon,
            color: mockChains[randomChainIndex].color,
          },
        };

        setProfile(mockProfile);
        setIsFollowing(mockProfile.isFollowing);
        setLoading(false);
      }, 1500);
    };

    // Chỉ fetch profile khi đã xác định được quyền sở hữu
    if (!ownershipLoading) {
      fetchProfile();
    }
  }, [userId, isOwner, ownershipLoading, currentUser]);

  const copyAddress = () => {
    if (!profile) return;

    navigator.clipboard.writeText(profile.address);
    toast.success("Address copied", {
      description: "Wallet address copied to clipboard",
    });
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);

    toast(`${isFollowing ? "Follow" : "Unfollow"}`, {
      description: isFollowing
        ? `You have unfollowed ${profile?.name}`
        : `You are now following ${profile?.name}`,
    });
  };

  const handleShare = () => {
    // In a real app, this would open a share dialog or copy the profile URL
    navigator.clipboard.writeText(window.location.href);

    toast.success("Link copied", {
      description: "Profile link copied to clipboard",
    });
  };

  if (loading || ownershipLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="relative w-full h-[200px] md:h-[300px] rounded-xl bg-muted"></div>

        <div className="flex flex-col md:flex-row gap-6 -mt-16 md:-mt-20 px-4">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-muted border-4 border-background"></div>

          <div className="flex-1 space-y-4 pt-4 md:pt-20">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-20 bg-muted rounded w-full"></div>

            <div className="flex gap-4">
              <div className="h-10 bg-muted rounded w-24"></div>
              <div className="h-10 bg-muted rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <>
      <div className="space-y-6">
        {/* Cover Image */}
        <div className="relative w-full h-[200px] md:h-[300px] rounded-xl overflow-hidden">
          <Image
            src={
              profile.coverImage ||
              "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20"
            }
            alt="Cover"
            fill
            className="object-cover"
          />

          {/* Action buttons on cover */}
          <div className="absolute top-4 right-4 flex gap-2">
            {isOwner ? (
              <Button
                variant="secondary"
                size="sm"
                className="bg-background/80 backdrop-blur-md hover:bg-background"
                onClick={() => setShowEditDialog(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                className="bg-background/80 backdrop-blur-md hover:bg-background"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col md:flex-row gap-6 -mt-16 md:-mt-20 px-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-background">
              <Image
                src={
                  profile.avatar ||
                  "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20"
                }
                alt={profile.name}
                width={160}
                height={160}
                className="object-cover"
              />
            </div>

            {profile.isVerified && (
              <div className="absolute bottom-1 right-1 bg-primary text-white rounded-full p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
            )}

            {/* Preferred chain badge */}
            <div
              className="absolute top-1 left-1 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: profile.preferredChain.color }}
            >
              <Image
                src={
                  profile.preferredChain.icon ||
                  "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20"
                }
                alt={profile.preferredChain.name || "Chain"}
                width={16}
                height={16}
              />
            </div>
          </div>

          {/* Profile details */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                  {profile.name}
                  {profile.isVerified && (
                    <span className="text-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </span>
                  )}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>@{profile.username}</span>
                  <span>•</span>
                  <span>Joined {profile.joinDate}</span>
                </div>
              </div>

              <div className="flex gap-2">
                {isOwner ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profile/settings">
                          <Wallet className="h-4 w-4 mr-2" />
                          Account Settings
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    variant={isFollowing ? "outline" : "default"}
                    size="sm"
                    onClick={handleFollow}
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus className="h-4 w-4 mr-2" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Follow
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <span>{profile.address}</span>
              <button
                onClick={copyAddress}
                className="text-muted-foreground hover:text-foreground"
              >
                <Copy className="h-4 w-4" />
              </button>
              <a
                href={`https://${profile.preferredChain.id}.com/address/${profile.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            <p className="text-muted-foreground max-w-2xl">{profile.bio}</p>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-1">
                <span className="font-bold">{profile.stats.totalNFTs}</span>
                <span className="text-muted-foreground">NFTs</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold">
                  {profile.stats.totalCollections}
                </span>
                <span className="text-muted-foreground">Collections</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold">
                  {profile.followers.toLocaleString()}
                </span>
                <span className="text-muted-foreground">Followers</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold">
                  {profile.following.toLocaleString()}
                </span>
                <span className="text-muted-foreground">Following</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold">{profile.stats.totalVolume}</span>
                <span className="text-muted-foreground">Volume</span>
              </div>
            </div>

            <div className="flex gap-3">
              {profile.socialLinks.twitter && (
                <a
                  href={profile.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {profile.socialLinks.website && (
                <a
                  href={profile.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Globe className="h-5 w-5" />
                </a>
              )}
              {profile.socialLinks.instagram && (
                <a
                  href={profile.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {showEditDialog && (
        <ProfileEditDialog
          profile={profile}
          onClose={() => setShowEditDialog(false)}
          onSave={(updatedProfile) => {
            setProfile(updatedProfile);
            setShowEditDialog(false);

            toast.success("Profile updated", {
              description: "Your profile has been updated successfully",
            });
          }}
        />
      )}
    </>
  );
}
