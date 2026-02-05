
export type Language = 'ko' | 'zh' | 'en';

export enum Category {
  FOOD = 'FOOD',
  BEAUTY = 'BEAUTY',
  EDU_SERVICE = 'EDU_SERVICE',
  CHINA_MART = 'CHINA_MART',
  LOGISTICS = 'LOGISTICS',
  FINANCE_EXCHANGE = 'FINANCE_EXCHANGE',
  MOBILE = 'MOBILE',
  ADMIN_SERVICE = 'ADMIN_SERVICE',
  ENT = 'ENT',
  SVC = 'SVC'
}

export interface TradeItem {
  id: string;
  sellerId: string;
  sellerName: string;
  title_ko: string;
  title_zh: string;
  title_en: string;
  price: number;
  description_ko: string;
  description_zh: string;
  description_en: string;
  image: string;
  category: string;
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD';
  createdAt: string;
  views: number;
  likes: number;
  isLiked?: boolean;
  lat?: number;
  lng?: number;
  media?: { url: string; type: 'IMAGE' | 'VIDEO' }[];
}

export interface JobProfile {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  position_ko: string;
  position_zh: string;
  position_en: string;
  experience_ko: string;
  experience_zh: string;
  experience_en: string;
  skills: string[];
  description_ko: string;
  description_zh: string;
  description_en: string;
  salary: string;
  status: 'OPEN' | 'HIRED';
  views: number;
  likes: number;
  isLiked?: boolean;
  media?: { url: string; type: 'IMAGE' | 'VIDEO' }[];
}

export interface RealEstateItem {
  id: string;
  userId: string;
  type: 'MONTHLY_RENT' | 'JEONSE';
  title_ko: string;
  title_zh: string;
  title_en: string;
  description_ko: string;
  description_zh: string;
  description_en: string;
  deposit: number;
  monthlyRent: number;
  areaSize: string;
  address: string;
  media: { url: string; type: 'IMAGE' | 'VIDEO' }[];
  views: number;
  likes: number;
  isLiked?: boolean;
  createdAt: string;
}

export interface TradeMeeting {
  id: string;
  postId: string;
  buyerId: string;
  sellerId: string;
  date: string;
  time: string;
  location: string;
  status: 'REQUESTED' | 'CONFIRMED' | 'CANCELLED';
}

export interface CallRecord {
  id: string;
  type: 'AUDIO' | 'VIDEO';
  targetName: string;
  duration: string;
  timestamp: string;
  status: 'COMPLETED' | 'MISSED';
  transcriptUrl?: string;
}

export interface ChatSession {
  id: string;
  participants: string[];
  targetName: string;
  targetAvatar?: string;
  lastMessage: string;
  type: 'TRADE' | 'JOB' | 'AI' | 'SUPPORT' | 'REAL_ESTATE';
  relatedId?: string;
  isBlocked?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  translatedText?: string;
  timestamp: string;
  isSystem?: boolean;
  actionType?: 'PAYMENT_REQUEST' | 'PAYMENT_COMPLETE' | 'INTERVIEW_REQUEST' | 'CALL_START' | 'CALL_END';
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  noShowCount: number;
  penaltyLevel: 'NONE' | 'WARNING' | 'DEPOSIT_REQUIRED' | 'BLOCKED';
}

export interface Shop {
  id: string;
  name_ko: string;
  name_zh: string;
  name_en: string;
  category: Category;
  address_ko: string;
  address_zh: string;
  phone: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  supports_alipay: boolean;
  supports_wechatpay: boolean;
  images: string[];
  description_ko: string;
  description_zh: string;
  description_en: string;
  commissionRate: number;
  trustMetrics: TrustMetrics;
  surgeScore: number;
  currentPriceMultiplier: number;
  likeCount: number;
  dislikeCount: number;
  openTime: string;
  closeTime: string;
  slotInterval: number;
  depositRequired: boolean;
  depositAmount: number;
}

export interface TrustMetrics {
  rating: number;
  refundRate: number;
  cancelRate: number;
  responseScore: number;
  score: number;
}

export interface Translation {
  [key: string]: {
    ko: string;
    zh: string;
    en: string;
  };
}

export interface Notice {
  id: string;
  title_ko: string;
  title_zh: string;
  title_en: string;
  content_ko: string;
  content_zh: string;
  content_en: string;
  createdAt: string;
}
