'use client'

import { useState, useEffect, useCallback, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  ArrowRight,
  Rocket,
  BarChart3,
  Users,
  ShoppingCart,
  Copy,
  CheckCircle2,
  Lock,
  DollarSign,
  Menu,
  X,
} from 'lucide-react'
import Image from 'next/image'
import { fetchTokenStats } from '@/lib/api'
import { StatsContext, StatsContextType } from '@/contexts/StatsContext'

const socialLinks = {
  telegram: "@bosabastard",
  tiktok: "https://www.tiktok.com/@buck3835",
  twitter: "https://x.com/OfBosa55539",
  dexscreener: "https://dexscreener.com/solana/26wx2UwenfvTS8vTrpysPdtDLyCfu47uJ44CpEpD1AQG",
  dextools: "https://www.dextools.io/app/en/solana/pair-explorer/26wx2UwenfvTS8vTrpysPdtDLyCfu47uJ44CpEpD1AQG",
  buy: "https://jup.ag/swap/SOL-26wx2UwenfvTS8vTrpysPdtDLyCfu47uJ44CpEpD1AQG",
  soba: "https://solbastard.com"
};

// Update the pie chart colors and styles
const pieChartStyle = {
  lineWidth: 3, // Thinner for more modern look
  animate: true,
  animationDuration: 1000,
  animationEasing: "cubic-bezier(0.4, 0, 0.2, 1)",
  radius: 35,
  labelPosition: 0,
  labelStyle: {
    fontSize: "0px",
    fill: "transparent"
  },
  colors: ["#10b981", "#3b82f6"],
  backgroundColor: "transparent",
  segmentsStyle: { transition: 'stroke-width 0.3s ease' }
};

function Sparkles({ children }: { children: React.ReactNode }) {
  const generateSparkle = useCallback(() => ({
    id: Math.random(),
    createdAt: Date.now(),
    color: 'white',
    size: Math.random() * 10 + 5,
    style: {
      top: Math.random() * 100 + '%',
      left: Math.random() * 100 + '%',
      zIndex: 2
    }
  }), [])

  const [sparkles, setSparkles] = useState(() => {
    return Array.from({ length: 20 }, () => generateSparkle())
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setSparkles(sparkles => {
        const now = Date.now()
        const newSparkles = sparkles
          .filter(sparkle => now - sparkle.createdAt < 750)
          .concat(generateSparkle())
        return newSparkles
      })
    }, 50)

    return () => clearInterval(interval)
  }, [generateSparkle])

  return (
    <div className="relative inline-block">
      {sparkles.map(sparkle => (
        <motion.span
          key={sparkle.id}
          className="absolute inline-block rounded-full bg-white pointer-events-none"
          style={{
            ...sparkle.style,
            width: sparkle.size,
            height: sparkle.size
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 1, opacity: 0 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.75 }}
        />
      ))}
      {children}
    </div>
  )
}

function DeveloperPopup({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed bottom-16 right-4 max-w-sm backdrop-blur-lg bg-black/30 rounded-lg p-4 shadow-xl border border-white/10 z-[60]">
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 text-white/60 hover:text-white"
      >
        <X size={16} />
      </button>
      <div className="flex flex-col gap-3">
        <div className="text-white">
          <p className="text-sm font-medium">Looking for a stunning website for your memecoin?</p>
          <p className="text-xs text-white/70">This website was crafted by me! Reach out for professional web development services.</p>
        </div>
        <div className="flex gap-2">
          <a 
            href="https://t.me/plug2k" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-blue-600/80 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md transition-colors text-xs"
          >
            <Image 
              src="/assets/telegramlogo.png" 
              alt="Telegram" 
              width={16} 
              height={16} 
            />
            <span>Contact on Telegram</span>
          </a>
          <a 
            href="https://x.com/dcc_crypto" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-black hover:bg-black/80 text-white px-3 py-1.5 rounded-md transition-colors text-xs"
          >
            <Image 
              src="/assets/xlogo.png" 
              alt="X (Twitter)" 
              width={14} 
              height={14} 
            />
            <span>Follow on X</span>
          </a>
        </div>
      </div>
    </div>
  );
}

interface ScrollingTickerProps {
  className?: string;
}

function ScrollingTicker({ className }: ScrollingTickerProps) {
  const tickerItems = [
    { logo: '/assets/dexscreenerlogo.png', alt: 'DexScreener', link: socialLinks.dexscreener },
    { logo: '/assets/dextoolslogo.png', alt: 'DexTools', link: socialLinks.dextools },
    { logo: '/assets/telegramlogo.png', alt: 'Telegram', link: socialLinks.telegram },
    { logo: '/assets/xlogo.png', alt: 'X (Twitter)', link: socialLinks.twitter },
    { logo: '/assets/tiktoklogo.png', alt: 'TikTok', link: socialLinks.tiktok },
    { logo: '/assets/coingeckologo.png', alt: 'CoinGecko', link: '#', soon: true },
    { logo: '/assets/coinmarketcaplogo.png', alt: 'CoinMarketCap', link: '#', soon: true },
  ];

  const allItems = [...tickerItems, ...tickerItems];

  return (
    <div className={`fixed bottom-0 left-0 w-full bg-gradient-to-r from-blue-600/80 via-indigo-600/80 to-purple-600/80 backdrop-blur-md border-t border-white/10 safe-bottom z-50 ${className}`}>
      <div className="relative flex overflow-hidden h-16">
        <div className="animate-ticker flex gap-12 items-center whitespace-nowrap py-3 px-4">
          {allItems.map((item, index) => (
            <a
              key={`${item.alt}-${index}`}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-white/10 ${
                item.soon ? 'cursor-not-allowed opacity-50' : 'hover:scale-110'
              }`}
            >
              <div className="relative w-7 h-7">
                <Image
                  src={item.logo}
                  alt={item.alt}
                  fill
                  className={`object-contain ${item.soon ? 'grayscale' : ''}`}
                  priority
                />
                {item.soon && (
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[7px] px-1 py-0.5 rounded-full">
                    Soon
                  </span>
                )}
              </div>
              <span className="text-white text-sm font-medium">{item.alt}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [stats, setStats] = useState<StatsContextType['stats']>(null);
  const [founderPercentage, setFounderPercentage] = useState(0);
  const [showDevPopup, setShowDevPopup] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState('tokenomics');

  const statsContextValue = {
    stats,
    founderPercentage
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await fetchTokenStats();
        setStats(data);
        
        if (data?.totalSupply && data?.founderBalance) {
          const founder = (data.founderBalance / data.totalSupply) * 100;
          setFounderPercentage(founder);
        }
      } catch (err) {
        console.error('Failed to fetch token stats:', err);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(contractAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <StatsContext.Provider value={statsContextValue}>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 animate-gradient-y">
        {/* Navigation */}
        <nav className="fixed top-0 w-full backdrop-blur-lg bg-white/10 z-50">
          <div className="container mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-S3j8xrPUmlkpDVENpM943XrwtlnxYN.png"
                  alt="Bosa Logo"
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full hover:scale-110 transition-transform duration-200 animate-float"
                  priority
                />
                <div className="hidden md:flex items-center gap-8">
                  <Button
                    variant="ghost"
                    className="relative text-white group px-4 py-2 transition-all duration-200"
                    onClick={() => document.getElementById('tokenomics')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Tokenomics
                    </span>
                    <span className="absolute inset-0 bg-white/0 group-hover:bg-white/20 rounded-lg backdrop-blur-sm transition-all duration-200" />
                  </Button>
                  <Button
                    variant="ghost"
                    className="relative text-white group px-4 py-2 transition-all duration-200"
                    onClick={() => document.getElementById('how-to-buy')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      How to Buy
                    </span>
                    <span className="absolute inset-0 bg-white/0 group-hover:bg-white/20 rounded-lg backdrop-blur-sm transition-all duration-200" />
                  </Button>
                  <Button
                    variant="ghost"
                    className="relative text-white group px-4 py-2 transition-all duration-200"
                    onClick={() => document.getElementById('roadmap')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Rocket className="w-4 h-4" />
                      Roadmap
                    </span>
                    <span className="absolute inset-0 bg-white/0 group-hover:bg-white/20 rounded-lg backdrop-blur-sm transition-all duration-200" />
                  </Button>
                  <Button
                    variant="ghost"
                    className="relative text-white group px-4 py-2 transition-all duration-200"
                    onClick={() => document.getElementById('community')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Community
                    </span>
                    <span className="absolute inset-0 bg-white/0 group-hover:bg-white/20 rounded-lg backdrop-blur-sm transition-all duration-200" />
                  </Button>
                </div>
              </div>
              
              {/* Mobile Menu Button */}
              <button 
                className="md:hidden p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Desktop Social Icons */}
              <div className="hidden md:flex items-center gap-6">
                <a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer" className="relative group p-2">
                  <Image src="/assets/telegramlogo.png" alt="Telegram" width={36} height={36} className="relative z-10" />
                  <span className="absolute inset-0 bg-white/0 group-hover:bg-white/20 rounded-full backdrop-blur-sm transition-all duration-200" />
                </a>
                <a href={socialLinks.twitter} className="relative group p-2">
                  <Image src="/assets/xlogo.png" alt="X (Twitter)" width={32} height={32} className="relative z-10" />
                  <span className="absolute inset-0 bg-white/0 group-hover:bg-white/20 rounded-full backdrop-blur-sm transition-all duration-200" />
                </a>
                <a href="#" className="relative group p-2">
                  <Image src="/assets/tiktoklogo.png" alt="TikTok" width={32} height={32} className="relative z-10" />
                  <span className="absolute inset-0 bg-white/0 group-hover:bg-white/20 rounded-full backdrop-blur-sm transition-all duration-200" />
                </a>
              </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="md:hidden mt-4 space-y-2"
                >
                  <Button
                    variant="ghost"
                    className="w-full text-white hover:bg-white/20"
                    onClick={() => {
                      document.getElementById('tokenomics')?.scrollIntoView({ behavior: 'smooth' });
                      setMobileMenuOpen(false);
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Tokenomics
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-white hover:bg-white/20"
                    onClick={() => {
                      document.getElementById('how-to-buy')?.scrollIntoView({ behavior: 'smooth' });
                      setMobileMenuOpen(false);
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      How to Buy
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-white hover:bg-white/20"
                    onClick={() => {
                      document.getElementById('roadmap')?.scrollIntoView({ behavior: 'smooth' });
                      setMobileMenuOpen(false);
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <Rocket className="w-4 h-4" />
                      Roadmap
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-white hover:bg-white/20"
                    onClick={() => {
                      document.getElementById('community')?.scrollIntoView({ behavior: 'smooth' });
                      setMobileMenuOpen(false);
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Community
                    </span>
                  </Button>
                  <div className="flex justify-center gap-4 pt-4 border-t border-white/10">
                    <a href="#" className="flex items-center gap-2 md:gap-3 text-white hover:text-pink-300 transition-colors">
                      <Image 
                        src="/assets/telegramlogo.png" 
                        alt="Telegram" 
                        width={24} 
                        height={24} 
                        className="md:w-8 md:h-8" 
                      />
                      <span className="text-xs md:text-sm font-medium hidden sm:inline">
                        Join Telegram
                      </span>
                    </a>
                    <a href="#" className="flex items-center gap-2 md:gap-3 text-white hover:text-pink-300 transition-colors">
                      <Image 
                        src="/assets/xlogo.png" 
                        alt="Twitter" 
                        width={24} 
                        height={24} 
                        className="md:w-8 md:h-8" 
                      />
                      <span className="text-xs md:text-sm font-medium hidden sm:inline">
                        Follow on X
                      </span>
                    </a>
                    <a href="#" className="flex items-center gap-2 md:gap-3 text-white hover:text-pink-300 transition-colors">
                      <Image 
                        src="/assets/tiktoklogo.png" 
                        alt="TikTok" 
                        width={24} 
                        height={24} 
                        className="md:w-8 md:h-8" 
                      />
                      <span className="text-xs md:text-sm font-medium hidden sm:inline">
                        Follow on TikTok
                      </span>
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative w-full flex justify-center items-center pt-32 pb-16">
          <Sparkles>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20
              }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-1000"></div>
              <div className="relative">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-S3j8xrPUmlkpDVENpM943XrwtlnxYN.png"
                  alt="Bosa Hero"
                  width={240}
                  height={240}
                  className="rounded-full transform hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>
            </motion.div>
          </Sparkles>
        </div>

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-6 pt-28">
          {/* Contract Address Section */}
          <div className="flex flex-col items-center gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 w-full max-w-2xl">
              <div className="flex flex-col items-center gap-4">
                <h2 className="text-2xl font-bold text-white">Contract Address</h2>
                <div className="relative w-full">
                  <div className="flex items-center gap-2 bg-white/5 rounded-lg p-4 border border-white/10">
                    <code className="text-white font-mono text-sm flex-1 overflow-x-auto">
                      {contractAddress}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative group"
                      onClick={copyToClipboard}
                    >
                      {copied ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : (
                        <Copy className="w-5 h-5 text-white group-hover:text-pink-300" />
                      )}
                    </Button>
                  </div>
                </div>
                {/* DEX Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-4">
                  <Button
                    variant="outline"
                    className="bg-white/10 hover:bg-white/20 text-white border-white/20 w-full"
                    onClick={() => window.open(socialLinks.dexscreener, '_blank')}
                  >
                    <Image src="/assets/dexscreenerlogo.png" alt="DexScreener" width={24} height={24} className="mr-2" />
                    DexScreener
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-white/10 hover:bg-white/20 text-white border-white/20 w-full"
                    onClick={() => window.open(socialLinks.dextools, '_blank')}
                  >
                    <Image src="/assets/dextoolslogo.png" alt="DexTools" width={24} height={24} className="mr-2" />
                    DexTools
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-white/10 hover:bg-white/20 text-white border-white/20 w-full opacity-50 cursor-not-allowed"
                    disabled
                  >
                    <Image src="/assets/coingeckologo.png" alt="CoinGecko" width={24} height={24} className="mr-2" />
                    <Lock className="w-4 h-4 mr-1" />
                    Soon
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-white/10 hover:bg-white/20 text-white border-white/20 w-full opacity-50 cursor-not-allowed"
                    disabled
                  >
                    <Image src="/assets/coinmarketcaplogo.png" alt="CoinMarketCap" width={24} height={24} className="mr-2" />
                    <Lock className="w-4 h-4 mr-1" />
                    Soon
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Live Chart Section */}
          <motion.section
            className="py-6"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Live Chart</CardTitle>
                <CardDescription className="text-white/70">
                  Real-time market data from DexScreener
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white/5 p-4 rounded-lg overflow-hidden">
                  <style>{`
                    #dexscreener-embed{position:relative;width:100%;padding-bottom:75%;}
                    @media(min-width:1400px){#dexscreener-embed{padding-bottom:40%;}}
                    #dexscreener-embed iframe{position:absolute;width:100%;height:100%;top:0;left:0;border:0;}
                  `}</style>
                  <div id="dexscreener-embed">
                    <iframe src="https://dexscreener.com/solana/26wx2UwenfvTS8vTrpysPdtDLyCfu47uJ44CpEpD1AQG?embed=1&theme=dark" style={{maxHeight: '400px'}}></iframe>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Main Content Tabs */}
          <Tabs
            defaultValue="tokenomics"
            className="py-12"
            onValueChange={setActiveSection}
          >
            <TabsList className="bg-white/10 border-white/20">
              <TabsTrigger value="tokenomics" className="text-white">
                <BarChart3 className="w-4 h-4 mr-2" />
                Tokenomics
              </TabsTrigger>
              <TabsTrigger value="how-to-buy" className="text-white">
                <ShoppingCart className="w-4 h-4 mr-2" />
                How to Buy
              </TabsTrigger>
              <TabsTrigger value="roadmap" className="text-white">
                <Rocket className="w-4 h-4 mr-2" />
                Roadmap
              </TabsTrigger>
              <TabsTrigger value="community" className="text-white">
                <Users className="w-4 h-4 mr-2" />
                Community
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                exit="exit"
                className="py-8"
              >
                <TabsContent value="tokenomics" id="tokenomics">
                  <Card className="bg-white/10 border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white">Tokenomics & Distribution</CardTitle>
                      <CardDescription className="text-white/70">
                        BOSA features Meteora LP rewards and a scheduled 260M token burn
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      <BurnCountdown />
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200">
                          <BarChart3 className="w-8 h-8 mx-auto mb-2 text-white" />
                          <div className="text-2xl font-bold text-white">
                            {stats ? (
                              new Intl.NumberFormat('en-US').format(stats.totalSupply)
                            ) : (
                              <div className="h-8 bg-white/20 rounded animate-pulse"></div>
                            )}
                          </div>
                          <div className="text-white/70">Total Supply</div>
                        </div>
                        
                        <div className="text-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200">
                          <DollarSign className="w-8 h-8 mx-auto mb-2 text-white" />
                          <div className="text-2xl font-bold text-white">
                            {stats ? (
                              `$${stats.price.toFixed(8)}`
                            ) : (
                              <div className="h-8 bg-white/20 rounded animate-pulse"></div>
                            )}
                          </div>
                          <div className="text-white/70">Current Price</div>
                        </div>
                        
                        <div className="text-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200">
                          <Users className="w-8 h-8 mx-auto mb-2 text-white" />
                          <div className="text-2xl font-bold text-white">
                            {stats ? (
                              new Intl.NumberFormat('en-US').format(stats.holders)
                            ) : (
                              <div className="h-8 bg-white/20 rounded animate-pulse"></div>
                            )}
                          </div>
                          <div className="text-white/70">Token Holders</div>
                          <div className="text-sm text-white/50 mt-1">Growing Daily</div>
                        </div>
                        
                        <div className="text-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200">
                          <Lock className="w-8 h-8 mx-auto mb-2 text-white" />
                          <div className="text-2xl font-bold text-white">
                            {stats ? (
                              new Intl.NumberFormat('en-US', {
                                maximumFractionDigits: 0
                              }).format(stats.founderBalance)
                            ) : (
                              <div className="h-8 bg-white/20 rounded animate-pulse"></div>
                            )}
                          </div>
                          <div className="text-white/70">Founder Holdings</div>
                          <div className="text-sm text-white/50 mt-1">
                            {founderPercentage.toFixed(2)}% of Supply
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4 text-white">
                        <h3 className="text-xl font-semibold">Key Features</h3>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-500 mt-1" />
                            <span>Meteora LP rewards for early investors</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-pink-500 mt-1" />
                            <span>
                              {stats ? (
                                `Massive ${founderPercentage.toFixed(2)}% burn event (${new Intl.NumberFormat('en-US').format(stats.founderBalance)} tokens) scheduled for December 16th, 2024`
                              ) : (
                                'Loading burn details...'
                              )}
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-500 mt-1" />
                            <span>Originally issued to SOBA holders with 3M+ tokens</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="how-to-buy" id="how-to-buy">
                  <Card className="bg-white/10 border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white">How to Get BOSA</CardTitle>
                      <CardDescription className="text-white/70">
                        BOSA is available through SOBA rewards or direct purchase
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-white">
                      <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center">1</div>
                        <div>
                          <h3 className="font-bold">SOBA Holder Benefits</h3>
                          <p className="text-white/70">Hold 3M+ SOBA tokens to be eligible for BOSA rewards</p>
                        </div>
                      </div>
                      <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">2</div>
                        <div>
                          <h3 className="font-bold">Direct Purchase</h3>
                          <p className="text-white/70">Buy BOSA directly through Meteora and earn LP rewards</p>
                        </div>
                      </div>
                      <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">3</div>
                        <div>
                          <h3 className="font-bold">Set Up a Solana Wallet</h3>
                          <p className="text-white/70">Download and set up a Solana-compatible wallet like Phantom or Solflare.</p>
                        </div>
                      </div>
                      <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">4</div>
                        <div>
                          <h3 className="font-bold">Get SOL</h3>
                          <p className="text-white/70">Purchase SOL from a centralized exchange and transfer it to your Solana wallet.</p>
                        </div>
                      </div>
                      <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-yellow-600 flex items-center justify-center">5</div>
                        <div>
                          <h3 className="font-bold">Connect to a DEX</h3>
                          <p className="text-white/70">Visit a Solana DEX like Raydium or Orca and connect your wallet.</p>
                        </div>
                      </div>
                      <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center">6</div>
                        <div>
                          <h3 className="font-bold">Swap SOL for Bosa</h3>
                          <p className="text-white/70">Use the DEX to swap your SOL for Bosa tokens.</p>
                        </div>
                      </div>
                      <Button 
                        className="bg-pink-600 hover:bg-pink-700 text-white"
                        onClick={() => window.open(socialLinks.buy, '_blank')}
                      >
                        Buy Bosa Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="roadmap">
                  <Card className="bg-white/10 border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white">Key Events & Milestones</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-white">
                      <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center">1</div>
                        <div>
                          <h3 className="font-bold">SOBA Origins</h3>
                          <p className="text-white/70">Created as a reward token for loyal SOBA holders with 3M+ tokens</p>
                        </div>
                      </div>
                      <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">2</div>
                        <div>
                          <h3 className="font-bold">Meteora Integration</h3>
                          <p className="text-white/70">Launched on Meteora with LP rewards to incentivize holding</p>
                        </div>
                      </div>
                      <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">3</div>
                        <div>
                          <h3 className="font-bold">Token Burn Event</h3>
                          <p className="text-white/70">Scheduled 26% burn (260M tokens) on November 13th</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="community">
                  <Card className="bg-white/10 border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white">Join Our Community</CardTitle>
                      <CardDescription className="text-white/70">
                        Connect with fellow Bosa holders and stay updated
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-3 gap-4">
                      <Button
                        variant="outline"
                        className="bg-white/10 hover:bg-white/20 text-white border-white/20 h-14"
                        onClick={() => window.open(socialLinks.telegram, '_blank')}
                      >
                        <Image 
                          src="/assets/telegramlogo.png" 
                          alt="Telegram" 
                          width={28} 
                          height={28} 
                          className="mr-2" 
                        />
                        Telegram
                      </Button>
                      <Button
                        variant="outline"
                        className="bg-white/10 hover:bg-white/20 text-white border-white/20 h-14"
                        onClick={() => window.open(socialLinks.twitter, '_blank')}
                      >
                        <Image 
                          src="/assets/xlogo.png" 
                          alt="X (Twitter)" 
                          width={24} 
                          height={24} 
                          className="mr-2" 
                        />
                        Twitter
                      </Button>
                      <Button
                        variant="outline"
                        className="bg-white/10 hover:bg-white/20 text-white border-white/20 h-14"
                        onClick={() => window.open(socialLinks.tiktok, '_blank')}
                      >
                        <Image 
                          src="/assets/tiktoklogo.png" 
                          alt="TikTok" 
                          width={24} 
                          height={24} 
                          className="mr-2" 
                        />
                        TikTok
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </main>

        {/* Enhanced Footer */}
        <footer className="bg-black/20 backdrop-blur-lg mt-20 py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-white text-xl font-bold mb-4">Quick Links</h3>
                <div className="flex flex-col gap-2">
                  <a href="#tokenomics" className="text-white/70 hover:text-white transition-colors">Tokenomics</a>
                  <a href="#roadmap" className="text-white/70 hover:text-white transition-colors">Roadmap</a>
                  <a href="#community" className="text-white/70 hover:text-white transition-colors">Community</a>
                  <a href="#faq" className="text-white/70 hover:text-white transition-colors">FAQ</a>
                </div>
              </div>
              <div>
                <h3 className="text-white text-xl font-bold mb-4">Community</h3>
                <div className="flex flex-col gap-2">
                  <a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors flex items-center gap-2">
                    <Image src="/assets/telegramlogo.png" alt="Telegram" width={24} height={24} />
                    Telegram
                  </a>
                  <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors flex items-center gap-2">
                    <Image src="/assets/xlogo.png" alt="X (Twitter)" width={20} height={20} />
                    Twitter
                  </a>
                  <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors flex items-center gap-2">
                    <Image src="/assets/tiktoklogo.png" alt="TikTok" width={20} height={20} />
                    TikTok
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-white text-xl font-bold mb-4">Trading</h3>
                <div className="flex flex-col gap-2">
                  <a href={socialLinks.buy} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">Buy BOSA</a>
                  <a href={socialLinks.dexscreener} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">DexScreener</a>
                  <a href={socialLinks.dextools} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">DexTools</a>
                </div>
              </div>
            </div>

            {/* Update the bottom bar with consistent logo sizes */}
            <div className="border-t border-white/10 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-white font-medium">© 2024 Bosa. All rights reserved.</p>
                <div className="flex items-center gap-6">
                  <a href={socialLinks.dexscreener} target="_blank" rel="noopener noreferrer">
                    <Image 
                      src="/assets/dexscreenerlogo.png" 
                      alt="DexScreener" 
                      width={28} 
                      height={28} 
                      className="opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </a>
                  <a href={socialLinks.dextools} target="_blank" rel="noopener noreferrer">
                    <Image 
                      src="/assets/dextoolslogo.png" 
                      alt="DexTools" 
                      width={28} 
                      height={28} 
                      className="opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </a>
                  <div className="opacity-50 cursor-not-allowed relative group">
                    <Image 
                      src="/assets/coingeckologo.png" 
                      alt="CoinGecko" 
                      width={28} 
                      height={28} 
                      className="opacity-70 grayscale"
                    />
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[7px] px-1 py-0.5 rounded-full">Soon</span>
                  </div>
                  <div className="opacity-50 cursor-not-allowed relative group">
                    <Image 
                      src="/assets/coinmarketcaplogo.png" 
                      alt="CoinMarketCap" 
                      width={28} 
                      height={28} 
                      className="opacity-70 grayscale"
                    />
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[7px] px-1 py-0.5 rounded-full">Soon</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>

        {/* Static developer section */}
        <div className="w-full bg-black/30 backdrop-blur-lg py-8 border-t border-white/10 mt-auto mb-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-white text-center md:text-left">
                <p className="text-lg font-medium">Looking for a stunning website for your memecoin?</p>
                <p className="text-white/70">This website was crafted by me! Reach out for professional web development services.</p>
              </div>
              <div className="flex flex-wrap gap-4 justify-center md:justify-end">
                <a 
                  href="https://t.me/plug2k" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-blue-600/80 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Image 
                    src="/assets/telegramlogo.png" 
                    alt="Telegram" 
                    width={20} 
                    height={20} 
                  />
                  <span>Contact on Telegram</span>
                </a>
                <a 
                  href="https://x.com/dcc_crypto" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-black hover:bg-black/80 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Image 
                    src="/assets/xlogo.png" 
                    alt="X (Twitter)" 
                    width={18} 
                    height={18} 
                  />
                  <span>Follow on X</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Popup component */}
        {showDevPopup && <DeveloperPopup onClose={() => setShowDevPopup(false)} />}

        <ScrollingTicker className="mb-8" />
      </div>
    </StatsContext.Provider>
  )
}

function BurnCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const { stats, founderPercentage } = useContext(StatsContext);

  useEffect(() => {
    const burnDate = new Date('2024-12-16T15:00:00.000Z'); // 10 AM Central Time
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = burnDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 rounded-lg p-4 border border-white/10">
      <h3 className="text-lg font-bold text-white mb-2">🔥 Massive Token Burn Countdown</h3>
      <p className="text-white/70 mb-4">
        {stats ? (
          `Founder's balance (${founderPercentage.toFixed(2)}% of supply) will be burned on November 13th, 2024 at 10 AM CT`
        ) : (
          'Loading burn details...'
        )}
      </p>
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-black/30 rounded-lg p-2 text-center">
          <div className="text-2xl font-bold text-white">{timeLeft.days}</div>
          <div className="text-xs text-white/70">Days</div>
        </div>
        <div className="bg-black/30 rounded-lg p-2 text-center">
          <div className="text-2xl font-bold text-white">{timeLeft.hours}</div>
          <div className="text-xs text-white/70">Hours</div>
        </div>
        <div className="bg-black/30 rounded-lg p-2 text-center">
          <div className="text-2xl font-bold text-white">{timeLeft.minutes}</div>
          <div className="text-xs text-white/70">Minutes</div>
        </div>
        <div className="bg-black/30 rounded-lg p-2 text-center">
          <div className="text-2xl font-bold text-white">{timeLeft.seconds}</div>
          <div className="text-xs text-white/70">Seconds</div>
        </div>
      </div>
    </div>
  );
}

const contractAddress = "26wx2UwenfvTS8vTrpysPdtDLyCfu47uJ44CpEpD1AQG";

const fadeInUp = {
  initial: {
    y: 20,
    opacity: 0
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  exit: {
    y: 20,
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};