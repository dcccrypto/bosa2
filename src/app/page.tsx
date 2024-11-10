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
  Wallet,
  X,
  Copy,
  CheckCircle2,
  Lock,
} from 'lucide-react'
import Image from 'next/image'
import { logAllTokenStats } from '@/lib/api'
import { PieChart } from 'react-minimal-pie-chart'

export default function Component() {
  const [activeSection, setActiveSection] = useState('tokenomics')
  const [copied, setCopied] = useState(false)
  const controls = useAnimation()
  const orbitControls = useAnimation()
  const socialControls = useAnimation()

  const contractAddress = '26wx2UwenfvTS8vTrpysPdtDLyCfu47uJ44CpEpD1AQG'

  const [tokenPrice, setTokenPrice] = useState<number | null>(null)
  const [totalSupply, setTotalSupply] = useState<number | null>(null)
  const [holders, setHolders] = useState<number | null>(null)
  const [founderBalance, setFounderBalance] = useState<number | null>(null)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
          repeatType: "loop",
          duration: 20,
          ease: "linear",
        },
      },
    })
  }, [controls, orbitControls, socialControls])

  useEffect(() => {
    async function updateStats() {
      try {
        const stats = await logAllTokenStats();
        if (stats.price?.price) setTokenPrice(stats.price.price);
        if (stats.supply) setTotalSupply(stats.supply);
        if (stats.holders) setHolders(stats.holders);
        if (stats.founderBalance) setFounderBalance(stats.founderBalance);
      } catch (error) {
        console.error('Error updating stats:', error);
      }
    }

    updateStats();
    const interval = setInterval(updateStats, 120000);
    return () => clearInterval(interval);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  const founderPercentage = founderBalance && totalSupply ? (founderBalance / totalSupply) * 100 : 0;
  const circulatingPercentage = 100 - founderPercentage;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-pink-500 via-purple-500 to-blue-500">
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
                className="w-14 h-14 rounded-full hover:scale-110 transition-transform duration-200"
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
            <div className="flex items-center gap-6">
              {/* Social Icons - Consistent 32x32 size */}
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
                    <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-4 text-white">
                      <div className="text-center p-4 rounded-lg bg-white/5">
                        <Wallet className="w-8 h-8 mx-auto mb-2" />
                        <div className="text-2xl font-bold">0%</div>
                        <div className="text-white/70">Tax</div>
                        <div className="text-sm text-white/50 mt-1">$BOSA</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-white/5">
                        <BarChart3 className="w-8 h-8 mx-auto mb-2" />
                        <div className="text-2xl font-bold">
                          {totalSupply ? (
                            new Intl.NumberFormat('en-US', {
                              maximumFractionDigits: 0
                            }).format(totalSupply)
                          ) : (
                            <span className="animate-pulse">Loading...</span>
                          )}
                        </div>
                        <div className="text-white/70">Total Supply</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-white/5">
                        <BarChart3 className="w-8 h-8 mx-auto mb-2" />
                        <div className="text-2xl font-bold">
                          {tokenPrice ? (
                            `$${tokenPrice.toFixed(8)}`
                          ) : (
                            <span className="animate-pulse">Loading...</span>
                          )}
                        </div>
                        <div className="text-white/70">Current Price</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-white/5">
                        <BarChart3 className="w-8 h-8 mx-auto mb-2" />
                        <div className="text-2xl font-bold">100%</div>
                        <div className="text-white/70">All Supply in Circulation</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-white/5">
                        <Users className="w-8 h-8 mx-auto mb-2" />
                        <div className="text-2xl font-bold">
                          {holders ? (
                            new Intl.NumberFormat('en-US').format(holders)
                          ) : (
                            <span className="animate-pulse">Loading...</span>
                          )}
                        </div>
                        <div className="text-white/70">Token Holders</div>
                        <div className="text-sm text-white/50 mt-1">Growing Daily</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-white/5">
                        <Lock className="w-8 h-8 mx-auto mb-2" />
                        <div className="text-2xl font-bold">
                          {founderBalance ? (
                            new Intl.NumberFormat('en-US', {
                              maximumFractionDigits: 0
                            }).format(founderBalance)
                          ) : (
                            <span className="animate-pulse">Loading...</span>
                          )}
                        </div>
                        <div className="text-white/70">Founder Holdings</div>
                        <div className="text-sm text-white/50 mt-1">
                          {founderPercentage.toFixed(2)}% of Supply
                        </div>
                      </div>
                    </div>
                    
                    {/* Distribution Pie Chart */}
                    <div className="bg-white/5 rounded-lg p-6">
                      <h3 className="text-white text-lg font-semibold mb-4">Token Distribution</h3>
                      <div className="flex items-center justify-between">
                        <div className="w-1/2">
                          <PieChart
                            data={[
                              { title: 'Founder', value: founderPercentage, color: '#ec4899' },
                              { title: 'Circulating', value: circulatingPercentage, color: '#8b5cf6' }
                            ]}
                            lineWidth={20}
                            paddingAngle={2}
                            rounded
                            animate
                            label={({ dataEntry }) => `${Math.round(dataEntry.percentage)}%`}
                            labelStyle={{
                              fontSize: '6px',
                              fill: '#fff',
                            }}
                            labelPosition={70}
                          />
                        </div>
                        <div className="w-1/2 pl-8">
                          <div className="space-y-4">
                            <div className="flex items-center">
                              <div className="w-4 h-4 rounded-full bg-pink-500 mr-2"></div>
                              <span className="text-white">Founder Holdings ({founderPercentage.toFixed(2)}%)</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
                              <span className="text-white">Circulating Supply ({circulatingPercentage.toFixed(2)}%)</span>
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
                    <Button className="w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white">
                      Buy Bosa Now
                      <ArrowRight className="ml-2" />
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
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
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
                  <a href="#" className="text-white/70 hover:text-white transition-colors flex items-center">
                    <Image src="/assets/telegramlogo.png" alt="Telegram" width={20} height={20} className="mr-2" />
                    Telegram
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors flex items-center">
                    <Image src="/assets/xlogo.png" alt="Twitter" width={20} height={20} className="mr-2" />
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors flex items-center">
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
      <div className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 overflow-hidden h-16">
        <motion.div 
          className="flex items-center gap-12 py-4 px-6"
          animate={{
            x: ["100%", "-100%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          <div className="flex items-center gap-12 min-w-max">
            {/* Social and DEX links with consistent 32x32 sizing */}
            {[
              { icon: "/assets/telegramlogo.png", text: "Join Telegram", link: "#" },
              { icon: "/assets/xlogo.png", text: "Follow on X", link: "#" },
              { icon: "/assets/tiktoklogo.png", text: "Follow on TikTok", link: "#" },
              { icon: "/assets/dexscreenerlogo.png", text: "DexScreener", link: "#" },
              { icon: "/assets/dextoolslogo.png", text: "DexTools", link: "#" },
              { icon: "/assets/coingeckologo.png", text: "CoinGecko", link: "#" },
              { icon: "/assets/coinmarketcaplogo.png", text: "CoinMarketCap", link: "#" },
            ].map((item, index) => (
              <a 
                key={index}
                href={item.link}
                className="flex items-center gap-3 text-white hover:text-pink-300 transition-colors"
              >
                <Image src={item.icon} alt={item.text} width={32} height={32} />
                <span className="text-sm font-medium">{item.text}</span>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}