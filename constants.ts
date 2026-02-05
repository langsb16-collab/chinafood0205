import { Shop, Category, Translation, Notice, TradeItem, JobProfile, CallRecord, RealEstateItem } from './types';

export const TRANSLATIONS: Translation = {
  header_title: { ko: "C-코리아 커넥트", zh: "C-韩国连接", en: "C-Korea Connect" },
  search_placeholder: { ko: "지역이나 상점을 검색하세요", zh: "搜索区域 or 商家", en: "Search area or shops" },
  merchant_console: { ko: "스마트 상권 BI", zh: "智能商圈 BI", en: "Smart BI Console" },
  nav_explore: { ko: "상점 탐색", zh: "探索商铺", en: "Explore" },
  nav_trade: { ko: "중고마켓", zh: "二手交易", en: "Trade" },
  nav_jobs: { ko: "구인구직", zh: "求职招聘", en: "Jobs" },
  nav_real_estate: { ko: "부동산", zh: "房地产", en: "Real Estate" },
  nav_notices: { ko: "공지사항", zh: "公告事项", en: "Notices" },
  nav_calls: { ko: "통화 기록", zh: "通话记录", en: "Call Logs" },
  
  btn_visit: { ko: "상점 방문하기", zh: "前往商店", en: "Visit Store" },
  btn_call: { ko: "전화하기", zh: "拨打电话", en: "Call Store" },
  btn_checkin: { ko: "방문 체크인", zh: "到店签到", en: "Check-in" },
  btn_reserve: { ko: "예약하기", zh: "预约", en: "Book" },
  btn_secure_pay: { ko: "안전결제", zh: "安全支付", en: "Secure Pay" },
  btn_video_call: { ko: "영상 면접", zh: "视频面试", en: "Video Interview" },
  btn_block: { ko: "차단하기", zh: "屏蔽", en: "Block" },
  
  real_estate_monthly: { ko: "월세", zh: "월租", en: "Monthly" },
  real_estate_jeonse: { ko: "전세", zh: "传贳", en: "Jeonse" },
  real_estate_deposit: { ko: "보증금", zh: "保证金", en: "Deposit" },
  real_estate_rent: { ko: "임대료", zh: "租金", en: "Rent" },
  real_estate_area: { ko: "면적", zh: "面积", en: "Area" },
  
  cat_all: { ko: "전체", zh: "全部", en: "All" },
  cat_FOOD: { ko: "餐饮·음식점", zh: "餐饮", en: "Food" },
  cat_BEAUTY: { ko: "美容·뷰티", zh: "美容", en: "Beauty" },
  cat_EDU_SERVICE: { ko: "教育·교육", zh: "教育", en: "Education" },
  cat_CHINA_MART: { ko: "超市·중국식품마트", zh: "超市", en: "Mart" },
  cat_LOGISTICS: { ko: "物流·국제택배", zh: "物流", en: "Logistics" },
  cat_FINANCE_EXCHANGE: { ko: "换钱·환전/송금", zh: "金融", en: "Finance" },
  cat_MOBILE: { ko: "手机·휴대폰", zh: "手机", en: "Mobile" },
  cat_ADMIN_SERVICE: { ko: "行政·행정대행", zh: "行政", en: "Admin" },
  cat_ENT: { ko: "娱乐·오락", zh: "娱乐", en: "Fun" },
  cat_SVC: { ko: "便민·생활편의", zh: "便民", en: "Service" },
  explore_subtitle: { ko: "실시간 수요 감지 및 신용도 기반 매칭 결과", zh: "基于实时需求感知和信用的匹配结果", en: "Real-time demand sensing & trust matching" },
  
  directions_walk: { ko: "도보", zh: "步行", en: "Walk" },
  directions_transit: { ko: "대중교통", zh: "公交", en: "Transit" },
  directions_car: { ko: "자동차", zh: "驾车", en: "Drive" }
};

export const CATEGORY_PREVIEW_MAP: Record<string, string> = {
  FOOD: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
  BEAUTY: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800&q=80",
  EDU_SERVICE: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
  CHINA_MART: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
  LOGISTICS: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
  REAL_ESTATE: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
  JOB: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80",
  TRADE: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&q=80"
};

export const CHATBOT_DATA: Record<string, { q: string, a: string }[]> = {
  ko: [
    { q: "이 플랫폼은 어떤 서비스인가요?", a: "지역 상점, 예약, 중고거래, 구인구직, 부동산까지 가능한 다국어 생활 플랫폼입니다." },
    { q: "부동산 매물 등록 제한이 있나요?", a: "사진은 최대 5장, 영상은 최대 3개까지 업로드 가능합니다." },
    { q: "상점 방문은 어떻게 하나요?", a: "상점 상세의 방문하기 버튼을 누르면 네이버 지도로 연결됩니다." }
  ],
  zh: [
    { q: "这个平台是什么服务？", a: "这是一个支持多语言的本地生活综合平台，提供商店信息、预约、中古交易、招聘求职和房地产功能。" },
    { q: "发布房源有限制吗？", a: "照片最多5张，视频最多3个。" }
  ],
  en: [
    { q: "What is this platform?", a: "It is a multilingual super app for local stores, trading, jobs, and real estate." }
  ]
};

export const MOCK_CALL_LOGS: CallRecord[] = [
  { id: 'c1', type: 'VIDEO', targetName: '장미', duration: '12:05', timestamp: '2025-05-20 14:20', status: 'COMPLETED' }
];

export const MOCK_TRADE_ITEMS: TradeItem[] = [
  {
    id: 't1',
    sellerId: 'u1',
    sellerName: '왕웨이',
    title_ko: '아이폰 15 프로 256GB',
    title_zh: 'iPhone 15 Pro 256GB',
    title_en: 'iPhone 15 Pro 256GB',
    price: 950000,
    description_ko: '상태 좋습니다.',
    description_zh: '状态良好。',
    description_en: 'Good condition.',
    image: '',
    category: 'ELECTRONICS',
    status: 'AVAILABLE',
    createdAt: '2025-05-15',
    views: 120,
    likes: 15
  }
];

export const MOCK_REAL_ESTATE: RealEstateItem[] = [
  {
    id: 're1',
    userId: 'u1',
    type: 'MONTHLY_RENT',
    title_ko: '역세권 풀옵션 원룸',
    title_zh: '地铁站附近全配套单间',
    title_en: 'Full option studio near station',
    description_ko: '깔끔합니다.',
    description_zh: '很整洁。',
    description_en: 'Very clean.',
    deposit: 5000000,
    monthlyRent: 550000,
    areaSize: '24m²',
    address: '서울특별시 마포구 합정동',
    media: [],
    views: 240,
    likes: 35,
    createdAt: '2025-05-10'
  }
];

export const MOCK_JOB_PROFILES: JobProfile[] = [
  {
    id: 'j1',
    userId: 'uj1',
    name: '장미',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    position_ko: '주방 조리사',
    position_zh: '厨师',
    position_en: 'Cook',
    experience_ko: '5년',
    experience_zh: '5年',
    experience_en: '5y',
    skills: ['중식'],
    description_ko: '경력 많습니다.',
    description_zh: '经验丰富。',
    description_en: 'Experienced.',
    salary: '350',
    status: 'OPEN',
    views: 85,
    likes: 10
  }
];

export const MOCK_SHOPS: Shop[] = [
  {
    id: 's1',
    name_ko: '맛있는 양꼬치',
    name_zh: '好吃羊肉串',
    name_en: 'Delicious Lamb Skewers',
    category: Category.FOOD,
    address_ko: '서울시 영등포구 대림동 123',
    address_zh: '首尔市永등浦区大林洞 123',
    phone: '02-1234-5678',
    lat: 37.493,
    lng: 126.896,
    rating: 4.8,
    reviewCount: 450,
    isVerified: true,
    supports_alipay: true,
    supports_wechatpay: true,
    images: [],
    description_ko: '대림동 최고의 맛집',
    description_zh: '大林洞最好吃的',
    description_en: 'Best in Daelim',
    commissionRate: 0.1,
    trustMetrics: {
      rating: 4.8,
      refundRate: 0.01,
      cancelRate: 0,
      responseScore: 100,
      score: 95
    },
    surgeScore: 0.5,
    currentPriceMultiplier: 1,
    likeCount: 200,
    dislikeCount: 2,
    openTime: '11:00',
    closeTime: '23:00',
    slotInterval: 30,
    depositRequired: false,
    depositAmount: 0
  },
  {
    id: 's2',
    name_ko: 'K-뷰티 살롱',
    name_zh: 'K-美容沙龙',
    name_en: 'K-Beauty Salon',
    category: Category.BEAUTY,
    address_ko: '서울시 강남구 신사동 456',
    address_zh: '首尔市江南区新沙洞 456',
    phone: '02-9876-5432',
    lat: 37.524,
    lng: 127.022,
    rating: 4.9,
    reviewCount: 890,
    isVerified: true,
    supports_alipay: true,
    supports_wechatpay: true,
    images: [],
    description_ko: '최신 트렌드 헤어&메이크업',
    description_zh: '最新流行发型和化妆',
    description_en: 'Latest trend Hair & Makeup',
    commissionRate: 0.15,
    trustMetrics: {
      rating: 4.9,
      refundRate: 0,
      cancelRate: 0.01,
      responseScore: 95,
      score: 98
    },
    surgeScore: 0.8,
    currentPriceMultiplier: 1.2,
    likeCount: 500,
    dislikeCount: 1,
    openTime: '10:00',
    closeTime: '20:00',
    slotInterval: 60,
    depositRequired: true,
    depositAmount: 20000
  }
];

export const MOCK_NOTICES: Notice[] = [
  {
    id: 'n1',
    title_ko: '런칭',
    title_zh: '上线',
    title_en: 'Launch',
    content_ko: '...',
    content_zh: '...',
    content_en: '...',
    createdAt: '2025-05-01'
  }
];