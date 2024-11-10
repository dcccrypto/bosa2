'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  ArrowRight,
  Rocket,
  BarChart3,
  Users,
  MessageCircle,
  Send,
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
import { PieChart } from 'react-minimal-pie-chart'

const socialLinks = {
  telegram: "https://t.me/SolBastardSOBA",
  tiktok: "https://www.tiktok.com/@cryptobastard",
  twitter: "https://x.com/cryptobastardTX",
  dexscreener: "https://dexscreener.com/solana/an4avu6vdi7askenb2hpadltzrxdeggb8odqpa7shkg3",
  dextools: "https://www.dextools.io/app/en/solana/pair-explorer/An4aVu6Vdi7AskENb2HpadLTZRXDeGgB8odQPa7ShkG3?t=1731231419418",
  buy: "https://jup.ag/swap/SOL-26wx2UwenfvTS8vTrpysPdtDLyCfu47uJ44CpEpD1AQG"
};

// Update the pie chart colors and styles
const pieChartStyle = {
  lineWidth: 60,
  animate: true,
  animationDuration: 1000,
  animationEasing: "ease-out",
  radius: 50,
  labelPosition: 75,
  labelStyle: {
    fontSize: "8px",
    fontWeight: "bold",
    fill: "#fff",
  }
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
    <div className="fixed bottom-16 right-4 max-w-sm backdrop-blur-lg bg-black/30 rounded-lg p-4 shadow-xl border border-white/10 z-50">
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

export default function Component() {
  const [activeSection, setActiveSection] = useState('tokenomics')
  const [copied, setCopied] = useState(false)
  const [stats, setStats] = useState<{
    price: number;
    totalSupply: number;
    founderBalance: number;
    holders: number;
    lastUpdated: string;
    cached?: boolean;
    cacheAge?: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [circulatingPercentage, setCirculatingPercentage] = useState(0);
  const [founderPercentage, setFounderPercentage] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDevPopup, setShowDevPopup] = useState(true);

  const controls = useAnimation()
  const orbitControls = useAnimation()
  const socialControls = useAnimation();

  const contractAddress = '26wx2UwenfvTS8vTrpysPdtDLyCfu47uJ44CpEpD1AQG'

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await fetchTokenStats()
        setStats(data)
        
        if (data?.totalSupply && data?.founderBalance) {
          const circulating = ((data.totalSupply - data.founderBalance) / data.totalSupply) * 100
          const founder = (data.founderBalance / data.totalSupply) * 100
          setCirculatingPercentage(circulating)
          setFounderPercentage(founder)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch token stats')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    controls.start({
      scale: [1, 1.2, 1],
      rotate: [0, 360],
      borderRadius: ["50%", "25%", "50%"],
      transition: { duration: 10, repeat: Infinity, ease: "linear" }
    })

    orbitControls.start({
      rotate: 360,
      transition: { duration: 20, repeat: Infinity, ease: "linear" }
    })

    const animate = async () => {
      await socialControls.start({
        x: "-100%",
        transition: {
          duration: 20,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
        },
      });
    };
    
    animate();
  }, [socialControls]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-pink-500 via-purple-500 to-blue-500">
        <div className="text-white text-center">
          <p className="text-lg mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 animate-gradient-y">
      {/* Navigation */}
      <nav className="fixed top-0 w-full backdrop-blur-lg bg-white/10 z-50">
        <div className="container mx-auto px-6 py-4">
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
                <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/telegramlogo.png" alt="Telegram" width={36} height={36} className="relative z-10" />
                <span className="absolute inset-0 bg-white/0 group-hover:bg-white/20 rounded-full backdrop-blur-sm transition-all duration-200" />
              </a>
              <a href="#" className="relative group p-2">
                <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/xlogo.png" alt="X (Twitter)" width={32} height={32} className="relative z-10" />
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
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/telegramlogo.png" 
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
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/xlogo.png" 
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

      {/* Hero Image Section - Moved to top, right after nav */}
      <div className="relative w-full flex justify-center items-center py-12 mt-8">
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
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="relative"
            >
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-S3j8xrPUmlkpDVENpM943XrwtlnxYN.png"
                alt="Bosa Hero"
                width={200}
                height={200}
                className="rounded-full transform hover:scale-105 transition-transform duration-300"
              />
            </motion.div>
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
                  onClick={() => window.open('https://dexscreener.com', '_blank')}
                >
                  <Image src="/assets/dexscreenerlogo.png" alt="DexScreener" width={24} height={24} className="mr-2" />
                  DexScreener
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 w-full"
                  onClick={() => window.open('https://dextools.io', '_blank')}
                >
                  <Image src="/assets/dextoolslogo.png" alt="DexTools" width={24} height={24} className="mr-2" />
                  DexTools
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 w-full"
                  onClick={() => window.open('https://coingecko.com', '_blank')}
                >
                  <Image src="/assets/coingeckologo.png" alt="CoinGecko" width={24} height={24} className="mr-2" />
                  CoinGecko
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 w-full"
                  onClick={() => window.open('https://coinmarketcap.com', '_blank')}
                >
                  <Image src="/assets/coinmarketcaplogo.png" alt="CoinMarketCap" width={24} height={24} className="mr-2" />
                  CMC
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
                    <CardTitle className="text-white">Tokenomics & Analytics</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 px-4 md:px-0">
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
                    
                    {/* Distribution Pie Chart */}
                    <div className="bg-white/5 rounded-lg p-6 hover:bg-white/10 transition-colors duration-200">
                      <h3 className="text-white text-lg font-semibold mb-4">Token Distribution</h3>
                      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-4 md:p-6">
                        <div className="w-full md:w-2/5 max-w-[300px] relative group">
                          <div className="transform transition-transform duration-300 group-hover:scale-105">
                            <PieChart
                              data={[
                                {
                                  title: 'Circulating',
                                  value: circulatingPercentage,
                                  color: '#4F46E5'
                                },
                                {
                                  title: 'Founder',
                                  value: founderPercentage,
                                  color: '#3B82F6'
                                }
                              ]}
                              {...pieChartStyle}
                              label={({ dataEntry }) => `${Math.round(dataEntry.value)}%`}
                              style={{
                                textAnchor: "middle"
                              }}
                            />
                          </div>
                          {/* Add hover effect with detailed info */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white text-sm">
                              <p>Total Supply: {stats ? new Intl.NumberFormat().format(stats.totalSupply) : '0'}</p>
                              <p>Circulating: {stats ? new Intl.NumberFormat().format(stats.totalSupply - stats.founderBalance) : '0'}</p>
                              <p>Founder: {stats ? new Intl.NumberFormat().format(stats.founderBalance) : '0'}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-4 w-full md:w-3/5">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full bg-[#10b981]"></div>
                            <div>
                              <p className="text-white font-semibold">Circulating Supply</p>
                              <p className="text-white/70 text-sm">
                                {new Intl.NumberFormat().format(stats?.totalSupply ? stats.totalSupply - stats.founderBalance : 0)} tokens ({circulatingPercentage.toFixed(2)}%)
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full bg-[#3b82f6]"></div>
                            <div>
                              <p className="text-white font-semibold">Founder Holdings</p>
                              <p className="text-white/70 text-sm">
                                {new Intl.NumberFormat().format(stats?.founderBalance || 0)} tokens ({founderPercentage.toFixed(2)}%)
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="how-to-buy" id="how-to-buy">
                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">How to Buy Bosa</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-white">
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center">1</div>
                      <div>
                        <h3 className="font-bold">Set Up a Solana Wallet</h3>
                        <p className="text-white/70">Download and set up a Solana-compatible wallet like Phantom or Solflare.</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">2</div>
                      <div>
                        <h3 className="font-bold">Get SOL</h3>
                        <p className="text-white/70">Purchase SOL from a centralized exchange and transfer it to your Solana wallet.</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">3</div>
                      <div>
                        <h3 className="font-bold">Connect to a DEX</h3>
                        <p className="text-white/70">Visit a Solana DEX like Raydium or Orca and connect your wallet.</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">4</div>
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
                    <CardTitle className="text-white">Roadmap</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-white">
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center">1</div>
                      <div>
                        <h3 className="font-bold">Phase 1: Launch</h3>
                        <p className="text-white/70">Token launch, community building, and initial marketing push</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">2</div>
                      <div>
                        <h3 className="font-bold">Phase 2: Growth</h3>
                        <p className="text-white/70">Exchange listings, partnerships, and ecosystem expansion</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">3</div>
                      <div>
                        <h3 className="font-bold">Phase 3: Utility</h3>
                        <p className="text-white/70">NFT integration, governance implementation, and DeFi features</p>
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
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/telegramlogo.png" 
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
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/xlogo.png" 
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
                  <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/telegramlogo.png" alt="Telegram" width={24} height={24} />
                  Telegram
                </a>
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors flex items-center gap-2">
                  <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/xlogo.png" alt="X (Twitter)" width={20} height={20} />
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

      {/* After the footer and before the scrolling bottom bar */}
      <div className="fixed bottom-16 right-4 max-w-sm backdrop-blur-lg bg-black/30 rounded-lg p-4 shadow-xl border border-white/10">
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
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/telegramlogo.png" 
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
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/xlogo.png" 
                alt="X (Twitter)" 
                width={14} 
                height={14} 
              />
              <span>Follow on X</span>
            </a>
          </div>
        </div>
      </div>

      {/* Enhanced Scrolling Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 overflow-hidden h-10">
        <div className="flex items-center" style={{ width: "max-content" }}>
          <motion.div 
            animate={socialControls}
            className="flex items-center gap-6 py-1.5 px-2"
            style={{ 
              display: "flex",
              whiteSpace: "nowrap",
            }}
          >
            {[
              { icon: "/assets/telegramlogo.png", text: "Telegram", link: socialLinks.telegram, size: 26 },
              { icon: "/assets/tiktoklogo.png", text: "TikTok", link: socialLinks.tiktok, size: 22 },
              { icon: "/assets/dexscreenerlogo.png", text: "DexScreener", link: socialLinks.dexscreener, size: 22 },
              { icon: "/assets/dextoolslogo.png", text: "DexTools", link: socialLinks.dextools, size: 22 },
              { 
                icon: "/assets/coingeckologo.png", 
                text: "Soon", 
                link: "#",
                disabled: true,
                comingSoon: true,
                size: 22
              },
              { 
                icon: "/assets/coinmarketcaplogo.png", 
                text: "Soon", 
                link: "#",
                disabled: true,
                comingSoon: true,
                size: 22
              }
            ].map((item, index) => (
              <a 
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={item.disabled ? (e) => e.preventDefault() : undefined}
                className={`flex items-center gap-1.5 ${
                  item.disabled 
                    ? 'cursor-not-allowed opacity-50' 
                    : 'hover:text-pink-300 hover:opacity-80'
                } transition-all text-white relative group`}
              >
                <div className="relative">
                  <Image 
                    src={item.icon} 
                    alt={item.text} 
                    width={item.size} 
                    height={item.size} 
                    className={`${item.disabled ? 'grayscale' : ''}`}
                  />
                  {item.comingSoon && (
                    <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-[7px] px-1 py-0.5 rounded-full">
                      Soon
                    </div>
                  )}
                </div>
                <span className="text-[11px] font-medium hidden sm:inline whitespace-nowrap">
                  {item.text}
                </span>
              </a>
            ))}
            {/* Duplicate items for seamless loop */}
            {[
              { icon: "/assets/telegramlogo.png", text: "Telegram", link: socialLinks.telegram, size: 26 },
              { icon: "/assets/tiktoklogo.png", text: "TikTok", link: socialLinks.tiktok, size: 22 },
              { icon: "/assets/dexscreenerlogo.png", text: "DexScreener", link: socialLinks.dexscreener, size: 22 },
              { icon: "/assets/dextoolslogo.png", text: "DexTools", link: socialLinks.dextools, size: 22 },
              { 
                icon: "/assets/coingeckologo.png", 
                text: "Soon", 
                link: "#",
                disabled: true,
                comingSoon: true,
                size: 22
              },
              { 
                icon: "/assets/coinmarketcaplogo.png", 
                text: "Soon", 
                link: "#",
                disabled: true,
                comingSoon: true,
                size: 22
              }
            ].map((item, index) => (
              <a 
                key={`duplicate-${index}`}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={item.disabled ? (e) => e.preventDefault() : undefined}
                className={`flex items-center gap-1.5 ${
                  item.disabled 
                    ? 'cursor-not-allowed opacity-50' 
                    : 'hover:text-pink-300 hover:opacity-80'
                } transition-all text-white relative group`}
              >
                <div className="relative">
                  <Image 
                    src={item.icon} 
                    alt={item.text} 
                    width={item.size} 
                    height={item.size} 
                    className={`${item.disabled ? 'grayscale' : ''}`}
                  />
                  {item.comingSoon && (
                    <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-[7px] px-1 py-0.5 rounded-full">
                      Soon
                    </div>
                  )}
                </div>
                <span className="text-[11px] font-medium hidden sm:inline whitespace-nowrap">
                  {item.text}
                </span>
              </a>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="relative w-full flex justify-center items-center py-12">
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
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="relative"
            >
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vercel.png"
                alt="Vercel"
                width={200}
                height={200}
                className="rounded-full transform hover:scale-105 transition-transform duration-300"
              />
            </motion.div>
          </motion.div>
        </Sparkles>
      </div>

      {/* Static developer section */}
      <div className="w-full bg-black/30 backdrop-blur-lg py-8 border-t border-white/10">
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
    </div>
  )
}