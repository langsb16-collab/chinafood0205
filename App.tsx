
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Navigation, Globe, Headphones, Search, MapPin, 
  Star as StarIcon, MessageSquare, X, ShoppingBag, 
  Briefcase, Send, Phone, Video, ChevronLeft, 
  Plus, Camera, Heart, ChevronDown, Home, 
  Car, Bus, Footprints, Bot, Sparkles, User,
  Building, DollarSign, Layers
} from 'lucide-react';
import { 
  Language, Category, Shop, TradeItem, 
  ChatSession, Message, UserProfile, RealEstateItem, JobProfile 
} from './types';
import { 
  TRANSLATIONS, MOCK_SHOPS, MOCK_TRADE_ITEMS, 
  MOCK_REAL_ESTATE, MOCK_JOB_PROFILES, CATEGORY_PREVIEW_MAP 
} from './constants';
import { generateAssistantResponse } from './services/geminiService';

const CATEGORY_CONFIG: Record<string, { dotColor: string }> = {
  FOOD: { dotColor: 'bg-red-500' },
  BEAUTY: { dotColor: 'bg-pink-400' },
  EDU_SERVICE: { dotColor: 'bg-blue-600' },
  CHINA_MART: { dotColor: 'bg-green-500' },
  LOGISTICS: { dotColor: 'bg-orange-400' },
  FINANCE_EXCHANGE: { dotColor: 'bg-amber-400' },
  MOBILE: { dotColor: 'bg-sky-400' },
  ADMIN_SERVICE: { dotColor: 'bg-indigo-500' },
  ENT: { dotColor: 'bg-purple-500' },
  SVC: { dotColor: 'bg-teal-500' }
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ko');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<'EXPLORE' | 'TRADE' | 'JOBS' | 'REAL_ESTATE'>('EXPLORE');
  const [activeCategory, setActiveCategory] = useState<Category | 'ALL'>('ALL');
  
  const [shops, setShops] = useState<Shop[]>(MOCK_SHOPS);
  const [tradeItems, setTradeItems] = useState<TradeItem[]>(MOCK_TRADE_ITEMS);
  const [realEstateItems, setRealEstateItems] = useState<RealEstateItem[]>(MOCK_REAL_ESTATE);
  const [jobProfiles, setJobProfiles] = useState<JobProfile[]>(MOCK_JOB_PROFILES);
  
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postType, setPostType] = useState<'TRADE' | 'JOB' | 'REAL_ESTATE' | 'SHOP'>('TRADE');
  const [reType, setReType] = useState<'MONTHLY_RENT' | 'JEONSE'>('MONTHLY_RENT');

  const [isChatCenterOpen, setIsChatCenterOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<ChatSession | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<string, Message[]>>({});
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const [me] = useState<UserProfile>({
    id: 'me-777',
    name: '홍길동',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80',
    noShowCount: 0,
    penaltyLevel: 'NONE'
  });

  const t = (key: string) => TRANSLATIONS[key]?.[lang] || key;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sidebarItems = [
    { icon: <Navigation size={22} />, label: lang === 'ko' ? "내 주변" : (lang === 'zh' ? "我的周围" : "Nearby"), tab: 'EXPLORE' },
    { icon: <Heart size={22} />, label: lang === 'ko' ? "즐겨찾기" : (lang === 'zh' ? "收藏" : "Favorites"), tab: 'EXPLORE' },
    { icon: <ShoppingBag size={22} />, label: lang === 'ko' ? "중고마켓" : (lang === 'zh' ? "二手交易" : "Trade"), tab: 'TRADE' },
    { icon: <Briefcase size={22} />, label: lang === 'ko' ? "구인구직" : (lang === 'zh' ? "求职招聘" : "Jobs"), tab: 'JOBS' },
    { icon: <Headphones size={22} />, label: lang === 'ko' ? "고객센터" : (lang === 'zh' ? "Support" : "Support"), tab: 'EXPLORE' }
  ];

  const filteredShops = useMemo(() => {
    if (activeCategory === 'ALL') return shops;
    return shops.filter((shop) => shop.category === activeCategory);
  }, [activeCategory, shops]);

  const startChat = (targetId: string, targetName: string, type: ChatSession['type'], relatedId?: string) => {
    const existingSession = chatSessions.find((s) => 
      s.participants.includes(targetId) && 
      s.type === type && 
      (relatedId ? s.relatedId === relatedId : true)
    );
    
    if (existingSession) {
      setActiveChat(existingSession);
    } else {
      const newSession: ChatSession = {
        id: `chat-${Date.now()}`,
        participants: [me.id, targetId],
        targetName: targetName,
        lastMessage: '',
        type: type,
        relatedId: relatedId
      };
      setChatSessions((prev) => [newSession, ...prev]);
      setActiveChat(newSession);
    }
    setIsChatCenterOpen(true);
  };

  const startAiChat = () => {
    startChat('ai-bot', lang === 'ko' ? 'AI 채팅봇' : (lang === 'zh' ? 'AI 聊天机器人' : 'AI Chatbot'), 'AI');
  };

  const handleSendMessage = async (chatId: string, text: string) => {
    if (!text.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: me.id,
      text: text,
      timestamp: new Date().toISOString()
    };

    setChatMessages((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMsg]
    }));

    setChatSessions((prev) => prev.map((s) => s.id === chatId ? { ...s, lastMessage: text } : s));

    if (activeChat?.type === 'AI') {
      setIsAiLoading(true);
      const aiResponse = await generateAssistantResponse(text, lang);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        senderId: 'ai-bot',
        text: aiResponse,
        timestamp: new Date().toISOString()
      };
      setChatMessages((prev) => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), botMsg]
      }));
      setChatSessions((prev) => prev.map((s) => s.id === chatId ? { ...s, lastMessage: aiResponse } : s));
      setIsAiLoading(false);
    }
  };

  const openDirections = (name: string, lat: number, lng: number, mode: 'walk' | 'car' | 'transit' = 'walk') => {
    const isMobile = /Android|iPhone/i.test(navigator.userAgent);
    if (isMobile) {
      const mobileUrl = mode === 'walk' 
        ? `nmap://route/walk?dlat=${lat}&dlng=${lng}&dname=${encodeURIComponent(name)}` 
        : (mode === 'transit'
        ? `nmap://route/public?dlat=${lat}&dlng=${lng}&dname=${encodeURIComponent(name)}`
        : `nmap://route/car?dlat=${lat}&dlng=${lng}&dname=${encodeURIComponent(name)}`);
      
      window.location.href = mobileUrl;
    } else {
      window.open(`https://map.naver.com/v5/directions/-/${lng},${lat}?menu=route&routeType=${mode}`, "_blank");
    }
  };

  const handlePostSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const desc = formData.get('description') as string;
    const newId = "post-" + Date.now();

    if (postType === 'SHOP') {
      const shopName = title;
      const category = formData.get('category') as Category;
      const phone = formData.get('phone') as string;
      const address = formData.get('address') as string;
      
      const newShop: Shop = {
        id: newId,
        name_ko: shopName,
        name_zh: shopName,
        name_en: shopName,
        category: category,
        address_ko: address,
        address_zh: address,
        phone: phone,
        lat: 37.5,
        lng: 127.0,
        rating: 5.0,
        reviewCount: 0,
        isVerified: false,
        supports_alipay: true,
        supports_wechatpay: true,
        images: [CATEGORY_PREVIEW_MAP[category] || "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80"],
        description_ko: desc,
        description_zh: desc,
        description_en: desc,
        commissionRate: 0.1,
        trustMetrics: { rating: 5, refundRate: 0, cancelRate: 0, responseScore: 100, score: 100 },
        surgeScore: 0,
        currentPriceMultiplier: 1,
        likeCount: 0,
        dislikeCount: 0,
        openTime: '09:00',
        closeTime: '22:00',
        slotInterval: 30,
        depositRequired: false,
        depositAmount: 0
      };
      setShops((prev) => [newShop, ...prev]);
    } else if (postType === 'TRADE') {
      const price = Number(formData.get('price'));
      const newItem: TradeItem = {
        id: newId,
        sellerId: me.id,
        sellerName: me.name,
        title_ko: title,
        title_zh: title,
        title_en: title,
        description_ko: desc,
        description_zh: desc,
        description_en: desc,
        price: price,
        image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&q=80",
        category: 'ETC',
        status: 'AVAILABLE',
        createdAt: new Date().toISOString(),
        views: 0,
        likes: 0
      };
      setTradeItems((prev) => [newItem, ...prev]);
    } else if (postType === 'JOB') {
      const position = formData.get('position') as string;
      const salary = formData.get('salary') as string;
      const newItem: JobProfile = {
        id: newId,
        userId: me.id,
        name: me.name,
        avatar: me.avatar,
        position_ko: position,
        position_zh: position,
        position_en: position,
        experience_ko: '신입/경력',
        experience_zh: '新手/有经验',
        experience_en: 'New/Exp',
        skills: ['서비스'],
        description_ko: desc,
        description_zh: desc,
        description_en: desc,
        salary: salary,
        status: 'OPEN',
        views: 0,
        likes: 0
      };
      setJobProfiles((prev) => [newItem, ...prev]);
    } else if (postType === 'REAL_ESTATE') {
      const deposit = Number(formData.get('deposit'));
      const rent = Number(formData.get('monthlyRent'));
      const area = formData.get('areaSize') as string;
      const newItem: RealEstateItem = {
        id: newId,
        userId: me.id,
        type: reType,
        title_ko: title,
        title_zh: title,
        title_en: title,
        description_ko: desc,
        description_zh: desc,
        description_en: desc,
        deposit: deposit,
        monthlyRent: rent,
        areaSize: area,
        address: '서울시내 주요 지역',
        media: [{ url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80", type: 'IMAGE' }],
        views: 0,
        likes: 0,
        createdAt: new Date().toISOString()
      };
      setRealEstateItems((prev) => [newItem, ...prev]);
    }
    setIsPostModalOpen(false);
  };

  const getPreviewImage = (item: any, type: string) => {
    if (type === 'SHOP' && item.images && item.images.length > 0) {
      return item.images[0];
    }
    if (type === 'TRADE' && item.image) {
      return item.image;
    }
    if (type === 'REAL_ESTATE' && item.media && item.media.length > 0) {
      return item.media[0].url;
    }
    if (type === 'JOB' && item.avatar) {
      return item.avatar;
    }
    return CATEGORY_PREVIEW_MAP[item.category] || CATEGORY_PREVIEW_MAP[type] || CATEGORY_PREVIEW_MAP.FOOD;
  };

  const getLangProp = (obj: any, base: string) => {
    return obj[base + "_" + lang] || obj[base + "_ko"];
  };

  return (
    <div className="flex h-screen bg-[#F8F9FD] font-sans">
      <aside className="w-[100px] bg-white border-r border-gray-100 flex flex-col items-center py-6 shrink-0 z-50 shadow-sm">
        <div onClick={() => setActiveTab('EXPLORE')} className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl mb-12 shadow-lg cursor-pointer">C</div>
        <nav className="flex flex-col gap-8 w-full">
          {sidebarItems.map((item, idx) => (
            <button key={idx} 
              onClick={() => setActiveTab(item.tab as any)}
              className={"flex flex-col items-center gap-1.5 group " + (activeTab === item.tab ? 'text-red-600' : 'text-gray-400')}>
              <div className={"transition-colors " + (activeTab === item.tab ? 'text-red-600' : 'group-hover:text-red-600')}>{item.icon}</div>
              <span className={"text-[10px] font-bold transition-colors " + (activeTab === item.tab ? 'text-gray-900' : 'group-hover:text-gray-900')}>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-gray-50 flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="flex gap-8">
            {['EXPLORE', 'TRADE', 'JOBS', 'REAL_ESTATE'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab as any)} className={"text-sm font-black transition-all " + (activeTab === tab ? 'text-red-600 border-b-2 border-red-600 pb-1' : 'text-gray-400 hover:text-gray-900')}>
                {t("nav_" + tab.toLowerCase())}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
             <div className="relative" ref={dropdownRef}>
               <button onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-2xl text-xs font-black text-gray-600">
                  <Globe size={16}/> {lang.toUpperCase()} <ChevronDown size={14}/>
               </button>
               {isLangDropdownOpen && (
                 <div className="absolute top-full right-0 mt-2 w-40 bg-white border rounded-2xl shadow-xl p-2 z-[60]">
                   {['ko', 'zh', 'en'].map((c) => (
                     <button key={c} onClick={() => { setLang(c as Language); setIsLangDropdownOpen(false); }} className="w-full text-left p-3 text-xs font-bold hover:bg-gray-50 rounded-xl">
                       {c.toUpperCase()}
                     </button>
                   ))}
                 </div>
               )}
             </div>
             <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder={t('search_placeholder')} className="bg-gray-100/50 border-none rounded-2xl pl-12 pr-6 py-2.5 text-xs font-bold w-64 outline-none" />
             </div>
             <button className="bg-white border border-gray-100 px-6 py-2.5 rounded-2xl text-xs font-black hover:bg-gray-50 transition-colors">
               스마트 상권 BI
             </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 scrollbar-hide">
          <div className="max-w-[1400px] mx-auto space-y-8">
            
            {activeTab === 'EXPLORE' && (
              <div className="space-y-8">
                {/* Category Filter Bar */}
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => setActiveCategory('ALL')}
                    className={"px-8 py-3.5 rounded-2xl text-sm font-black transition-all shadow-sm " + (activeCategory === 'ALL' ? 'bg-red-600 text-white' : 'bg-white border text-gray-400 hover:bg-gray-100')}
                  >
                    {t('cat_all')}
                  </button>
                  {Object.values(Category).map((cat) => (
                    <button 
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={"px-6 py-3.5 rounded-2xl text-sm font-black transition-all border shadow-sm flex items-center gap-2.5 " + 
                        (activeCategory === cat ? 'bg-red-600 text-white border-transparent' : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50')}
                    >
                      <div className={"w-2.5 h-2.5 rounded-full " + (activeCategory === cat ? 'bg-white' : CATEGORY_CONFIG[cat].dotColor)} />
                      {t('cat_' + cat)}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between items-end border-b border-gray-100 pb-6">
                   <div>
                      <h2 className="text-4xl font-black text-gray-900 tracking-tight">C-코리아 커넥트</h2>
                      <p className="text-gray-400 font-bold mt-2">실시간 수요 감지 및 신용도 기반 매칭 결과</p>
                   </div>
                   <button 
                      onClick={() => { setPostType('SHOP'); setIsPostModalOpen(true); }}
                      className="bg-gray-900 text-white px-8 py-4 rounded-3xl font-black text-sm flex items-center gap-3 shadow-xl hover:scale-105 transition-all whitespace-nowrap"
                    >
                      <Plus size={20} /> 상점 등록
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredShops.map((shop) => (
                    <div key={shop.id} className="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm group hover:shadow-xl transition-all flex flex-col">
                      <div className="relative overflow-hidden h-64">
                         <img src={getPreviewImage(shop, 'SHOP')} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                         <div className="absolute top-4 left-4">
                            <span className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black shadow-sm uppercase">{t('cat_' + shop.category)}</span>
                         </div>
                      </div>
                      <div className="p-8 flex-1 flex flex-col space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-xl font-black text-gray-900 truncate pr-2">{getLangProp(shop, "name")}</h3>
                          <div className="flex items-center gap-1 text-yellow-400 font-black text-sm shrink-0">
                            <StarIcon size={16} fill="currentColor" /> {shop.rating}
                          </div>
                        </div>
                        <p className="text-sm font-bold text-gray-400 flex items-center gap-1"><MapPin size={14}/> {getLangProp(shop, "address")}</p>
                        
                        <div className="flex gap-1 py-1">
                           <div className="px-3 py-1.5 bg-gray-50 rounded-lg text-[10px] font-black flex items-center gap-1 text-gray-500"><Footprints size={12}/> 도보</div>
                           <div className="px-3 py-1.5 bg-gray-50 rounded-lg text-[10px] font-black flex items-center gap-1 text-gray-500"><Bus size={12}/> 대중교통</div>
                           <div className="px-3 py-1.5 bg-gray-50 rounded-lg text-[10px] font-black flex items-center gap-1 text-gray-500"><Car size={12}/> 자동차</div>
                        </div>

                        <button 
                          onClick={() => openDirections(shop.name_ko, shop.lat, shop.lng, 'walk')}
                          className="w-full py-4 bg-red-600 text-white rounded-2xl text-sm font-black shadow-lg shadow-red-100 hover:bg-red-700 transition-colors mt-auto"
                        >
                          상점 방문하기
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'TRADE' && (
              <div className="space-y-10">
                <div className="flex justify-between items-end">
                  <h2 className="text-4xl font-black tracking-tight">{t('nav_trade')}</h2>
                  <button onClick={() => { setPostType('TRADE'); setIsPostModalOpen(true); }} className="bg-red-600 text-white px-8 py-4 rounded-3xl font-black text-sm flex items-center gap-2 shadow-xl hover:scale-105 transition-all">
                    <Plus size={20} /> 물건 팔기
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {tradeItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-[40px] border p-8 flex gap-6 items-center shadow-sm hover:shadow-md transition-shadow">
                      <img src={getPreviewImage(item, 'TRADE')} className="w-32 h-32 rounded-3xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-black truncate">{getLangProp(item, "title")}</h4>
                        <p className="text-2xl font-black text-red-600">₩{item.price.toLocaleString()}</p>
                        <button onClick={() => startChat(item.sellerId, item.sellerName, 'TRADE', item.id)} className="mt-3 w-full py-2.5 bg-gray-900 text-white rounded-xl text-xs font-black">채팅 문의</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'JOBS' && (
              <div className="space-y-10">
                <div className="flex justify-between items-end border-b pb-6">
                  <div>
                    <h2 className="text-4xl font-black tracking-tight">{t('nav_jobs')}</h2>
                    <p className="text-gray-400 font-bold mt-2">빠르고 안전한 인력 매칭 및 구직</p>
                  </div>
                  <button onClick={() => { setPostType('JOB'); setIsPostModalOpen(true); }} className="bg-indigo-600 text-white px-8 py-4 rounded-3xl font-black text-sm flex items-center gap-2 shadow-xl hover:scale-105 transition-all">
                    <Plus size={20} /> 구인/구직 등록
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {jobProfiles.map((job) => (
                    <div key={job.id} className="bg-white rounded-[40px] border p-8 shadow-sm hover:shadow-md transition-all space-y-4">
                      <div className="flex items-center gap-4">
                        <img src={job.avatar} className="w-16 h-16 rounded-full object-cover" />
                        <div>
                          <h4 className="text-xl font-black">{job.name}</h4>
                          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{getLangProp(job, "position")}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-bold text-gray-500 line-clamp-2">{getLangProp(job, "description")}</p>
                        <div className="flex justify-between items-center pt-2">
                          <p className="text-lg font-black text-gray-900">월 {job.salary}만원</p>
                          <span className="text-xs font-bold text-gray-400">경력: {getLangProp(job, "experience")}</span>
                        </div>
                      </div>
                      <button onClick={() => startChat(job.userId, job.name, 'JOB', job.id)} className="w-full py-4 bg-gray-900 text-white rounded-2xl text-xs font-black">연락하기</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'REAL_ESTATE' && (
              <div className="space-y-10">
                <div className="flex justify-between items-end border-b pb-6">
                  <div>
                    <h2 className="text-4xl font-black tracking-tight">{t('nav_real_estate')}</h2>
                    <p className="text-gray-400 font-bold mt-2">전국 주요 지역 부동산 매물 정보</p>
                  </div>
                  <button onClick={() => { setPostType('REAL_ESTATE'); setIsPostModalOpen(true); }} className="bg-emerald-600 text-white px-8 py-4 rounded-3xl font-black text-sm flex items-center gap-2 shadow-xl hover:scale-105 transition-all">
                    <Plus size={20} /> 매물 등록하기
                  </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {realEstateItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-[40px] border p-8 flex gap-8 shadow-sm hover:shadow-md transition-all">
                      <img src={getPreviewImage(item, 'REAL_ESTATE')} className="w-48 h-48 rounded-[40px] object-cover" />
                      <div className="flex-1 space-y-3 flex flex-col">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className={"px-3 py-1 rounded-full text-[10px] font-black uppercase " + (item.type === 'JEONSE' ? 'bg-indigo-100 text-indigo-600' : 'bg-orange-100 text-orange-600')}>
                              {item.type === 'JEONSE' ? '전세' : '월세'}
                            </span>
                            <h4 className="text-2xl font-black mt-2">{getLangProp(item, "title")}</h4>
                          </div>
                        </div>
                        <p className="text-3xl font-black text-red-600">
                          {item.type === 'JEONSE' ? `${(item.deposit / 10000).toLocaleString()}억` : `${(item.deposit / 10000).toLocaleString()}만 / ${item.monthlyRent.toLocaleString()}`}
                        </p>
                        <p className="text-sm font-bold text-gray-500 flex items-center gap-1"><MapPin size={14}/> {item.address} | {item.areaSize}</p>
                        <div className="flex gap-2 pt-2 mt-auto">
                           <button onClick={() => startChat(item.userId, '집주인', 'REAL_ESTATE', item.id)} className="flex-1 py-4 bg-gray-900 text-white rounded-2xl text-xs font-black">채팅 문의</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {isPostModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsPostModalOpen(false)} />
          <form onSubmit={handlePostSubmit} className="relative bg-white w-full max-w-xl rounded-[60px] p-12 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto scrollbar-hide">
            <h3 className="text-3xl font-black">
              {postType === 'SHOP' ? '새 상점 등록' : 
               postType === 'JOB' ? '구인/구직 등록' :
               postType === 'REAL_ESTATE' ? '부동산 매물 등록' : '게시물 등록'}
            </h3>
            
            {postType === 'REAL_ESTATE' && (
              <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl">
                <button type="button" onClick={() => setReType('MONTHLY_RENT')} className={"flex-1 py-3 rounded-xl text-sm font-black transition-all " + (reType === 'MONTHLY_RENT' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-400')}>월세 (Monthly)</button>
                <button type="button" onClick={() => setReType('JEONSE')} className={"flex-1 py-3 rounded-xl text-sm font-black transition-all " + (reType === 'JEONSE' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400')}>전세 (Jeonse)</button>
              </div>
            )}

            {postType === 'JOB' && (
               <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 ml-1">희망 직종 / 포지션</label>
                    <input name="position" required placeholder="예: 홀서빙, 주방보조, 조리사 등" className="w-full bg-gray-50 rounded-2xl p-5 text-sm font-bold outline-none border border-transparent focus:border-indigo-100" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 ml-1">희망 급여 (만원)</label>
                    <input name="salary" required type="number" placeholder="예: 300" className="w-full bg-gray-50 rounded-2xl p-5 text-sm font-bold outline-none border border-transparent focus:border-indigo-100" />
                  </div>
               </div>
            )}

            <div className="grid grid-cols-2 gap-4">
               <div className="p-6 bg-gray-50 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-gray-400 hover:border-red-200 transition-colors cursor-pointer group">
                  <Camera size={24} className="group-hover:text-red-400"/> 
                  <span className="text-[10px] font-black mt-1">사진 (0 / {postType === 'REAL_ESTATE' ? '3' : '5'})</span>
               </div>
               <div className="p-6 bg-indigo-50 rounded-3xl flex flex-col items-center justify-center text-indigo-400 hover:bg-indigo-100 transition-colors cursor-pointer group">
                  <Video size={24} className="group-hover:text-indigo-600"/> 
                  <span className="text-[10px] font-black mt-1">영상 (0 / {postType === 'REAL_ESTATE' ? '2' : '3'})</span>
               </div>
            </div>
            
            <input name="title" required placeholder={postType === 'SHOP' ? "상호명" : "제목"} className="w-full bg-gray-50 rounded-2xl p-5 text-sm font-bold outline-none border border-transparent focus:border-red-100" />
            <textarea name="description" required rows={4} placeholder="상세 설명을 입력해주세요..." className="w-full bg-gray-50 rounded-2xl p-5 text-sm font-bold outline-none resize-none border border-transparent focus:border-red-100" />
            
            {postType === 'REAL_ESTATE' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 ml-1">보증금 (만원)</label>
                  <input name="deposit" required type="number" placeholder="보증금" className="w-full bg-gray-50 rounded-2xl p-4 text-sm font-bold outline-none" />
                </div>
                {reType === 'MONTHLY_RENT' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 ml-1">월세 (만원)</label>
                    <input name="monthlyRent" type="number" placeholder="월세" className="w-full bg-gray-50 rounded-2xl p-4 text-sm font-bold outline-none" />
                  </div>
                )}
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-black text-gray-400 ml-1">면적 (m²)</label>
                  <input name="areaSize" required placeholder="예: 24m²" className="w-full bg-gray-50 rounded-2xl p-4 text-sm font-bold outline-none" />
                </div>
              </div>
            )}

            {postType === 'TRADE' && (
              <input name="price" required type="number" placeholder="가격 (₩)" className="w-full bg-gray-50 rounded-2xl p-5 text-sm font-bold outline-none" />
            )}

            <div className="flex gap-4 pt-4">
              <button type="button" onClick={() => setIsPostModalOpen(false)} className="flex-1 py-4 bg-gray-100 rounded-3xl text-sm font-black">취소</button>
              <button type="submit" className="flex-2 py-4 bg-red-600 text-white rounded-3xl text-sm font-black">등록 완료</button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Buttons */}
      <div className="fixed bottom-10 left-10 flex flex-col gap-4 z-[150]">
        <button onClick={() => setIsChatCenterOpen(!isChatCenterOpen)} className="w-20 h-20 bg-red-600 text-white rounded-[35px] shadow-2xl flex items-center justify-center transition-all hover:scale-110 shadow-red-200">
          <MessageSquare size={32} />
        </button>
      </div>

      <button onClick={startAiChat} className="fixed bottom-10 right-10 w-20 h-20 bg-emerald-500 text-white rounded-[35px] shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-[150] shadow-emerald-200">
        <Bot size={32} />
      </button>

      {/* Chat Center Window */}
      {isChatCenterOpen && (
        <div className={"fixed bottom-32 w-96 bg-white rounded-[40px] shadow-2xl z-[200] border border-gray-100 flex flex-col overflow-hidden h-[600px] transition-all " + (activeChat?.type === 'AI' ? 'right-10' : 'left-10')}>
          <div className={"p-6 text-white flex justify-between items-center shrink-0 " + (activeChat?.type === 'AI' ? 'bg-emerald-500' : 'bg-red-600')}>
            <div className="flex items-center gap-3">
              {activeChat?.type === 'AI' && <Sparkles size={18} className="text-yellow-300" />}
              <div>
                <h3 className="font-black text-lg">{activeChat ? activeChat.targetName : '채팅 목록'}</h3>
                {activeChat && <p className="text-[10px] opacity-80 uppercase font-black">{activeChat.type}</p>}
              </div>
            </div>
            <div className="flex gap-2">
              {activeChat && <button onClick={() => setActiveChat(null)} className="p-2 hover:bg-white/20 rounded-full transition-colors"><ChevronLeft size={20}/></button>}
              <button onClick={() => setIsChatCenterOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors"><X size={20}/></button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide bg-gray-50/30">
            {!activeChat ? (
              <div className="space-y-3">
                <button onClick={startAiChat} className="w-full p-6 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center gap-4 hover:bg-emerald-100 transition-colors border border-emerald-100 group">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Bot size={24} className="group-hover:rotate-12 transition-transform" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-black text-sm">AI 채팅봇</h4>
                    <p className="text-[10px] font-bold opacity-70">3개 국어(KO/ZH/EN) 완벽 지원</p>
                  </div>
                </button>

                {chatSessions.length > 0 && chatSessions.filter(s => s.type !== 'AI').map((session) => (
                    <div key={session.id} onClick={() => setActiveChat(session)} className="flex items-center gap-4 p-4 hover:bg-white rounded-2xl cursor-pointer border border-transparent hover:border-gray-100 transition-all group bg-white/50">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-black text-gray-400 group-hover:bg-red-50 group-hover:text-red-500 transition-colors">
                        {session.targetName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                          <h4 className="font-black text-sm text-gray-900">{session.targetName}</h4>
                          <span className="text-[8px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 font-black uppercase">{session.type}</span>
                        </div>
                        <p className="text-xs text-gray-400 truncate font-bold">{session.lastMessage || '대화를 시작해보세요'}</p>
                      </div>
                    </div>
                  ))
                }
                
                {chatSessions.filter(s => s.type !== 'AI').length === 0 && (
                   <div className="py-10 text-center text-gray-300 font-bold text-xs">최근 대화 내역이 없습니다.</div>
                )}
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="flex-1 space-y-4 overflow-y-auto pr-2 scrollbar-hide pb-4">
                  {(chatMessages[activeChat.id] || []).map((msg) => (
                    <div key={msg.id} className={"flex " + (msg.senderId === me.id ? 'justify-end' : 'justify-start')}>
                      <div className={"max-w-[80%] p-4 rounded-3xl text-xs font-bold shadow-sm " + 
                        (msg.senderId === me.id ? 
                          (activeChat.type === 'AI' ? 'bg-emerald-500 text-white rounded-tr-none' : 'bg-red-600 text-white rounded-tr-none') : 
                          'bg-white text-gray-800 rounded-tl-none border border-gray-100') +
                        (msg.senderId === 'ai-bot' ? ' border-2 border-emerald-100 !text-gray-900' : '')}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isAiLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border p-4 rounded-3xl rounded-tl-none flex gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      </div>
                    </div>
                  )}
                </div>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!activeChat) return;
                  const form = e.currentTarget;
                  const input = form.elements.namedItem('message') as HTMLInputElement;
                  handleSendMessage(activeChat.id, input.value);
                  input.value = '';
                }} className="mt-auto pt-4 flex gap-2 shrink-0">
                  <input name="message" autoComplete="off" placeholder="메시지 입력..." className="flex-1 bg-white border border-gray-200 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 ring-emerald-100 transition-all" />
                  <button type="submit" disabled={isAiLoading} className={"w-12 h-12 text-white rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50 " + (activeChat.type === 'AI' ? 'bg-emerald-500 shadow-emerald-100' : 'bg-red-600 shadow-red-100')}>
                    <Send size={18} />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
