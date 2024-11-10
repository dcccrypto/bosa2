'use client'

import { useState, useEffect } from 'react'
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

  const controls = useAnimation()
  const orbitControls = useAnimation()
  const socialControls = useAnimation()

  const contractAddress = '26wx2UwenfvTS8vTrpysPdtDLyCfu47uJ44CpEpD1AQG'

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
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

    socialControls.start({
      x: ["100%", "-100%"],
      transition: {
        x: {
          repeat: Infinity,
          duration: 20,
          ease: "linear",
        },
      },
    })
  }, [controls, orbitControls, socialControls])

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

  if (isLoading && !stats) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-pink-500 via-purple-500 to-blue-500">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading token stats...</p>
        </div>
      </div>
    );
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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-pink-500 via-purple-500 to-blue-500 animate-gradient-y">
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
              <a href="#" className="relative group p-2">
                <Image src="/assets/telegramlogo.png" alt="Telegram" width={32} height={32} className="relative z-10" />
                <span className="absolute inset-0 bg-white/0 group-hover:bg-white/20 rounded-full backdrop-blur-sm transition-all duration-200" />
              </a>
              <a href="#" className="relative group p-2">
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
                                  title: 'Founder', 
                                  value: founderPercentage, 
                                  color: '#ec4899',
                                  description: `${new Intl.NumberFormat('en-US').format(stats?.founderBalance || 0)} tokens`
                                },
                                { 
                                  title: 'Circulating', 
                                  value: circulatingPercentage, 
                                  color: '#8b5cf6',
                                  description: `${new Intl.NumberFormat('en-US').format((stats?.totalSupply || 0) - (stats?.founderBalance || 0))} tokens`
                                }
                              ]}
                              lineWidth={25}
                              paddingAngle={2}
                              rounded
                              animate
                              animationDuration={800}
                              label={({ dataEntry }) => `${Math.round(dataEntry.percentage)}%`}
                              labelStyle={{
                                fontSize: '5px',
                                fill: '#fff',
                                fontWeight: 'bold',
                              }}
                              labelPosition={75}
                              segmentsStyle={{ transition: 'stroke-width 0.2s' }}
                              segmentsShift={1}
                              onMouseOver={(_, index) => {
                                console.log(`Segment ${index} hovered`);
                              }}
                            />
                          </div>
                        </div>
                        <div className="w-full md:w-3/5 space-y-4">
                          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200">
                            <div className="flex items-center">
                              <div className="w-4 h-4 rounded-full bg-pink-500 mr-3"></div>
                              <div>
                                <div className="text-white font-medium">Founder Holdings</div>
                                <div className="text-white/70 text-sm">
                                  {new Intl.NumberFormat('en-US').format(stats?.founderBalance || 0)} tokens
                                </div>
                              </div>
                            </div>
                            <div className="text-white font-bold">{founderPercentage.toFixed(2)}%</div>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200">
                            <div className="flex items-center">
                              <div className="w-4 h-4 rounded-full bg-purple-500 mr-3"></div>
                              <div>
                                <div className="text-white font-medium">Circulating Supply</div>
                                <div className="text-white/70 text-sm">
                                  {new Intl.NumberFormat('en-US').format((stats?.totalSupply || 0) - (stats?.founderBalance || 0))} tokens
                                </div>
                              </div>
                            </div>
                            <div className="text-white font-bold">{circulatingPercentage.toFixed(2)}%</div>
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
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-3 gap-4">
                    <Button
                      variant="outline"
                      className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                    >
                      <MessageCircle className="mr-2" />
                      Discord
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                    >
                      <X className="mr-2" />
                      X (Twitter)
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                    >
                      <Send className="mr-2" />
                      Telegram
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </main>

      {/* Enhanced Footer */}
      <footer className="mt-24 bg-black/20 backdrop-blur-lg">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#tokenomics" className="text-white/70 hover:text-white transition-colors">
                    Tokenomics
                  </a>
                </li>
                <li>
                  <a href="#how-to-buy" className="text-white/70 hover:text-white transition-colors">
                    How to Buy
                  </a>
                </li>
                <li>
                  <a href="#roadmap" className="text-white/70 hover:text-white transition-colors">
                    Roadmap
                  </a>
                </li>
                <li>
                  <a href="#community" className="text-white/70 hover:text-white transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Community</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href={socialLinks.telegram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-white transition-colors flex items-center"
                  >
                    <Image src="/assets/telegramlogo.png" alt="Telegram" width={20} height={20} className="mr-2" />
                    Telegram
                  </a>
                </li>
                <li>
                  <a 
                    href={socialLinks.twitter}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-white transition-colors flex items-center"
                  >
                    <Image src="/assets/xlogo.png" alt="Twitter" width={20} height={20} className="mr-2" />
                    Twitter
                  </a>
                </li>
                <li>
                  <a 
                    href={socialLinks.tiktok}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-white transition-colors flex items-center"
                  >
                    <Image src="/assets/tiktoklogo.png" alt="TikTok" width={20} height={20} className="mr-2" />
                    TikTok
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-4">FAQ</h3>
              <div>
                <Accordion type="single" collapsible className="w-full space-y-2">
                  <AccordionItem value="item-1" className="border-b border-white/10">
                    <AccordionTrigger className="text-white hover:text-pink-300">What is Bosa?</AccordionTrigger>
                    <AccordionContent className="text-white/70">
                      Bosa is a vibrant memecoin on the Solana blockchain, designed to bring fun and value to the crypto community. It combines the excitement of memes with the potential of decentralized finance.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2" className="border-b border-white/10">
                    <AccordionTrigger className="text-white hover:text-pink-300">How can I buy Bosa?</AccordionTrigger>
                    <AccordionContent className="text-white/70">
                      You can buy Bosa on Solana DEXes like Raydium or Orca. Set up a Solana wallet, purchase SOL, connect to a DEX, and swap SOL for Bosa. Check our &quot;How to Buy&quot; section for step-by-step instructions.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3" className="border-b border-white/10">
                    <AccordionTrigger className="text-white hover:text-pink-300">
                      Is there a tax on Bosa transactions?
                    </AccordionTrigger>
                    <AccordionContent className="text-white/70">
                      No, Bosa has 0% tax on all transactions. This means you keep more of your tokens when buying, selling, or transferring Bosa.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger className="text-white hover:text-pink-300">
                      What makes Bosa unique?
                    </AccordionTrigger>
                    <AccordionContent className="text-white/70">
                      Bosa stands out with its vibrant community, zero transaction tax, and plans for future utility development. It&apos;s not just a memecoin, but a project aiming to bring real value to the Solana ecosystem.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white font-medium text-lg">© Bosa. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <Image src="/assets/dexscreenerlogo.png" alt="DexScreener" width={24} height={24} className="opacity-70 hover:opacity-100 transition-opacity" />
                <Image src="/assets/dextoolslogo.png" alt="DexTools" width={24} height={24} className="opacity-70 hover:opacity-100 transition-opacity" />
                <Image src="/assets/coingeckologo.png" alt="CoinGecko" width={24} height={24} className="opacity-70 hover:opacity-100 transition-opacity" />
                <Image src="/assets/coinmarketcaplogo.png" alt="CoinMarketCap" width={24} height={24} className="opacity-70 hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Enhanced Scrolling Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 overflow-hidden h-16 md:h-20">
        <motion.div className="flex items-center gap-6 md:gap-12 py-4 px-4 md:px-6">
          <div className="flex items-center gap-6 md:gap-12 min-w-max">
            {/* Social and DEX links with consistent 32x32 sizing */}
            {[
              { icon: "@/assets/telegramlogo.png", text: "Join Telegram", link: socialLinks.telegram },
              { icon: "@/assets/xlogo.png", text: "Follow on X", link: socialLinks.twitter },
              { icon: "@/assets/tiktoklogo.png", text: "Follow on TikTok", link: socialLinks.tiktok },
              { icon: "@/assets/dexscreenerlogo.png", text: "DexScreener", link: socialLinks.dexscreener },
              { icon: "@/assets/dextoolslogo.png", text: "DexTools", link: socialLinks.dextools },
              { 
                icon: "@/assets/coingeckologo.png", 
                text: "CoinGecko (Coming Soon)", 
                link: "#",
                disabled: true,
                comingSoon: true 
              },
              { 
                icon: "@/assets/coinmarketcaplogo.png", 
                text: "CoinMarketCap (Coming Soon)", 
                link: "#",
                disabled: true,
                comingSoon: true 
              },
            ].map((item, index) => (
              <a 
                key={index}
                href={item.link}
                onClick={item.disabled ? (e) => e.preventDefault() : undefined}
                className={`flex items-center gap-2 md:gap-3 ${
                  item.disabled 
                    ? 'cursor-not-allowed opacity-50' 
                    : 'hover:text-pink-300'
                } transition-colors text-white relative group`}
              >
                <div className="relative">
                  <Image 
                    src={item.icon} 
                    alt={item.text} 
                    width={24} 
                    height={24} 
                    className={`md:w-8 md:h-8 ${item.disabled ? 'grayscale' : ''}`}
                  />
                  {item.comingSoon && (
                    <div className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] px-1 rounded-full">
                      Soon
                    </div>
                  )}
                </div>
                <span className="text-xs md:text-sm font-medium hidden sm:inline">
                  {item.text}
                </span>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}