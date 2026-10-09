export interface CryptoInfoDetail {
  symbol: string;
  name: string;
  rank: number;
  marketCap: string;
  fdv: string;
  circulatingSupply: string;
  totalSupply: string;
  maxSupply: string;
  allTimeHigh: string;
  allTimeLow: string;
  consensus: string;
  issueDate: string;
  description: string;
  website: string;
  whitepaper: string;
  explorer: string;
  longShortRatio: {
    longPercent: number;
    shortPercent: number;
    ratio: number;
  };
  takerVolume: {
    buyPercent: number;
    sellPercent: number;
    totalVol: string;
  };
  openInterest: {
    amount: string;
    change24h: number;
  };
  liquidations24h: {
    total: string;
    longs: string;
    shorts: string;
  };
}

export const CRYPTO_INFO_DATABASE: Record<string, CryptoInfoDetail> = {
  BTC: {
    symbol: 'BTC',
    name: 'Bitcoin',
    rank: 1,
    marketCap: '$1,705.42 Billion',
    fdv: '$1,811.25 Billion',
    circulatingSupply: '19,782,450 BTC (94.2%)',
    totalSupply: '19,782,450 BTC',
    maxSupply: '21,000,000 BTC',
    allTimeHigh: '$108,920.00 (-20.8%)',
    allTimeLow: '$0.04865 (+177,248,120%)',
    consensus: 'Proof of Work (SHA-256)',
    issueDate: 'January 3, 2009',
    description:
      'Bitcoin is the world\'s first decentralized digital currency created by the pseudonymous Satoshi Nakamoto. It operates on a peer-to-peer cryptographic network without the need for central banks or intermediaries, providing borderless, trustless store of value and settlement.',
    website: 'https://bitcoin.org',
    whitepaper: 'https://bitcoin.org/bitcoin.pdf',
    explorer: 'https://mempool.space',
    longShortRatio: {
      longPercent: 57.8,
      shortPercent: 42.2,
      ratio: 1.37,
    },
    takerVolume: {
      buyPercent: 53.4,
      sellPercent: 46.6,
      totalVol: '$3.15 Billion',
    },
    openInterest: {
      amount: '$18.42 Billion',
      change24h: 3.84,
    },
    liquidations24h: {
      total: '$52.40 Million',
      longs: '$19.20 Million',
      shorts: '$33.20 Million',
    },
  },
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    rank: 2,
    marketCap: '$326.80 Billion',
    fdv: '$326.80 Billion',
    circulatingSupply: '120,442,100 ETH',
    totalSupply: '120,442,100 ETH',
    maxSupply: 'Infinite (Deflationary EIP-1559)',
    allTimeHigh: '$4,891.70 (-44.7%)',
    allTimeLow: '$0.4209 (+642,150%)',
    consensus: 'Proof of Stake (Casper/Beacon)',
    issueDate: 'July 30, 2015',
    description:
      'Ethereum is a global, decentralized software platform powered by smart contracts and the Ethereum Virtual Machine (EVM). It serves as the foundational infrastructure for decentralized finance (DeFi), NFTs, layer 2 rollups, and web3 decentralized applications.',
    website: 'https://ethereum.org',
    whitepaper: 'https://ethereum.org/en/whitepaper/',
    explorer: 'https://etherscan.io',
    longShortRatio: {
      longPercent: 54.2,
      shortPercent: 45.8,
      ratio: 1.18,
    },
    takerVolume: {
      buyPercent: 51.2,
      sellPercent: 48.8,
      totalVol: '$1.48 Billion',
    },
    openInterest: {
      amount: '$8.95 Billion',
      change24h: 2.15,
    },
    liquidations24h: {
      total: '$28.90 Million',
      longs: '$12.40 Million',
      shorts: '$16.50 Million',
    },
  },
  SOL: {
    symbol: 'SOL',
    name: 'Solana',
    rank: 3,
    marketCap: '$88.45 Billion',
    fdv: '$108.20 Billion',
    circulatingSupply: '471,280,000 SOL',
    totalSupply: '588,500,000 SOL',
    maxSupply: 'Inflation-adjusted schedule',
    allTimeHigh: '$260.06 (-29.0%)',
    allTimeLow: '$0.5052 (+36,450%)',
    consensus: 'Proof of History (PoH) + Proof of Stake',
    issueDate: 'March 16, 2020',
    description:
      'Solana is a high-performance blockchain built for widespread mainstream adoption, offering sub-second finality, 65,000+ theoretical TPS, and fractions-of-a-cent fees through its novel Proof of History timestamping mechanism.',
    website: 'https://solana.com',
    whitepaper: 'https://solana.com/solana-whitepaper.pdf',
    explorer: 'https://solscan.io',
    longShortRatio: {
      longPercent: 61.4,
      shortPercent: 38.6,
      ratio: 1.59,
    },
    takerVolume: {
      buyPercent: 56.8,
      sellPercent: 43.2,
      totalVol: '$980.40 Million',
    },
    openInterest: {
      amount: '$3.42 Billion',
      change24h: 6.72,
    },
    liquidations24h: {
      total: '$19.80 Million',
      longs: '$6.20 Million',
      shorts: '$13.60 Million',
    },
  },
  BNB: {
    symbol: 'BNB',
    name: 'BNB Chain',
    rank: 4,
    marketCap: '$92.10 Billion',
    fdv: '$92.10 Billion',
    circulatingSupply: '145,880,000 BNB',
    totalSupply: '145,880,000 BNB',
    maxSupply: '100,000,000 BNB (Target after Auto-Burn)',
    allTimeHigh: '$720.67 (-12.3%)',
    allTimeLow: '$0.0961 (+657,600%)',
    consensus: 'Proof of Staked Authority (PoSA)',
    issueDate: 'July 8, 2017',
    description:
      'BNB powers the BNB Chain ecosystem, offering ultra-low transaction fees, dual EVM/Fast Finality architecture, and continuous quarterly programmatic token burns.',
    website: 'https://bnbchain.org',
    whitepaper: 'https://bnbchain.org/en/whitepaper',
    explorer: 'https://bscscan.com',
    longShortRatio: {
      longPercent: 52.0,
      shortPercent: 48.0,
      ratio: 1.08,
    },
    takerVolume: {
      buyPercent: 50.8,
      sellPercent: 49.2,
      totalVol: '$410.20 Million',
    },
    openInterest: {
      amount: '$1.12 Billion',
      change24h: 1.05,
    },
    liquidations24h: {
      total: '$4.10 Million',
      longs: '$1.80 Million',
      shorts: '$2.30 Million',
    },
  },
  XRP: {
    symbol: 'XRP',
    name: 'Ripple',
    rank: 5,
    marketCap: '$104.50 Billion',
    fdv: '$184.20 Billion',
    circulatingSupply: '56,840,000,000 XRP',
    totalSupply: '99,987,000,000 XRP',
    maxSupply: '100,000,000,000 XRP',
    allTimeHigh: '$3.84 (-52.1%)',
    allTimeLow: '$0.0028 (+65,600%)',
    consensus: 'XRP Ledger Consensus Protocol (Federated)',
    issueDate: 'June 2, 2012',
    description:
      'XRP is the native token of the decentralized XRP Ledger (XRPL), engineered for instantaneous, low-cost cross-border institutional remittances and sovereign digital asset liquidity.',
    website: 'https://ripple.com/xrp',
    whitepaper: 'https://xrpl.org/resources.html',
    explorer: 'https://xrpscan.com',
    longShortRatio: {
      longPercent: 50.5,
      shortPercent: 49.5,
      ratio: 1.02,
    },
    takerVolume: {
      buyPercent: 49.1,
      sellPercent: 50.9,
      totalVol: '$820.50 Million',
    },
    openInterest: {
      amount: '$1.89 Billion',
      change24h: -1.45,
    },
    liquidations24h: {
      total: '$11.20 Million',
      longs: '$6.80 Million',
      shorts: '$4.40 Million',
    },
  },
  DOGE: {
    symbol: 'DOGE',
    name: 'Dogecoin',
    rank: 7,
    marketCap: '$38.20 Billion',
    fdv: '$38.20 Billion',
    circulatingSupply: '146,800,000,000 DOGE',
    totalSupply: '146,800,000,000 DOGE',
    maxSupply: 'Infinite (+5B DOGE / year)',
    allTimeHigh: '$0.7376 (-64.7%)',
    allTimeLow: '$0.00008547 (+304,100%)',
    consensus: 'AuxPoW Scrypt (Merge-mined with LTC)',
    issueDate: 'December 6, 2013',
    description:
      'Dogecoin is an open-source peer-to-peer cryptocurrency featuring the iconic Shiba Inu meme, created by Billy Markus and Jackson Palmer, now widely accepted for micro-tipping and internet commerce.',
    website: 'https://dogecoin.com',
    whitepaper: 'https://dogecoin.com/dogepedia/faq/',
    explorer: 'https://dogechain.info',
    longShortRatio: {
      longPercent: 55.4,
      shortPercent: 44.6,
      ratio: 1.24,
    },
    takerVolume: {
      buyPercent: 54.0,
      sellPercent: 46.0,
      totalVol: '$640.10 Million',
    },
    openInterest: {
      amount: '$1.25 Billion',
      change24h: 5.20,
    },
    liquidations24h: {
      total: '$8.90 Million',
      longs: '$3.40 Million',
      shorts: '$5.50 Million',
    },
  },
  AVAX: {
    symbol: 'AVAX',
    name: 'Avalanche',
    rank: 11,
    marketCap: '$14.20 Billion',
    fdv: '$24.80 Billion',
    circulatingSupply: '408,000,000 AVAX',
    totalSupply: '445,000,000 AVAX',
    maxSupply: '720,000,000 AVAX',
    allTimeHigh: '$146.22 (-76.1%)',
    allTimeLow: '$2.79 (+1,150%)',
    consensus: 'Avalanche Snowball Consensus',
    issueDate: 'September 21, 2020',
    description:
      'Avalanche is a smart contracts platform featuring sub-second finality and custom multi-subnet application-specific blockchain deployments.',
    website: 'https://avax.network',
    whitepaper: 'https://avax.network/whitepapers',
    explorer: 'https://snowtrace.io',
    longShortRatio: {
      longPercent: 53.1,
      shortPercent: 46.9,
      ratio: 1.13,
    },
    takerVolume: {
      buyPercent: 52.4,
      sellPercent: 47.6,
      totalVol: '$310.50 Million',
    },
    openInterest: {
      amount: '$480.00 Million',
      change24h: 3.40,
    },
    liquidations24h: {
      total: '$3.10 Million',
      longs: '$1.20 Million',
      shorts: '$1.90 Million',
    },
  },
  NEAR: {
    symbol: 'NEAR',
    name: 'NEAR Protocol',
    rank: 18,
    marketCap: '$7.40 Billion',
    fdv: '$7.90 Billion',
    circulatingSupply: '1,210,000,000 NEAR',
    totalSupply: '1,240,000,000 NEAR',
    maxSupply: 'Dynamic 5% annual inflation',
    allTimeHigh: '$20.42 (-69.6%)',
    allTimeLow: '$0.526 (+1,080%)',
    consensus: 'Nightshade Sharding PoS',
    issueDate: 'October 13, 2020',
    description:
      'NEAR Protocol is a layer-1 blockchain engineered with Nightshade dynamic sharding and Chain Abstraction to deliver web2-like usability with human-readable account names.',
    website: 'https://near.org',
    whitepaper: 'https://near.org/papers/the-official-near-white-paper/',
    explorer: 'https://nearblocks.io',
    longShortRatio: {
      longPercent: 56.2,
      shortPercent: 43.8,
      ratio: 1.28,
    },
    takerVolume: {
      buyPercent: 54.8,
      sellPercent: 45.2,
      totalVol: '$290.40 Million',
    },
    openInterest: {
      amount: '$320.00 Million',
      change24h: 4.80,
    },
    liquidations24h: {
      total: '$2.40 Million',
      longs: '$0.80 Million',
      shorts: '$1.60 Million',
    },
  },
};

export function getCryptoInfo(symbol: string): CryptoInfoDetail {
  const clean = symbol.replace('USDT', '').toUpperCase();
  if (CRYPTO_INFO_DATABASE[clean]) {
    return CRYPTO_INFO_DATABASE[clean];
  }
  // Generic fallback with realistic numbers
  return {
    symbol: clean,
    name: clean,
    rank: 25,
    marketCap: '$3.85 Billion',
    fdv: '$4.20 Billion',
    circulatingSupply: `850,000,000 ${clean}`,
    totalSupply: `1,000,000,000 ${clean}`,
    maxSupply: `1,000,000,000 ${clean}`,
    allTimeHigh: '$42.50 (-45.2%)',
    allTimeLow: '$0.12 (+1,850%)',
    consensus: 'Proof of Stake (PoS)',
    issueDate: '2021-04-12',
    description: `${clean} is an established digital cryptocurrency protocol providing secure cryptographic verification and decentralized liquidity across global markets.`,
    website: 'https://coinmarketcap.com',
    whitepaper: 'https://coinmarketcap.com',
    explorer: 'https://blockchair.com',
    longShortRatio: {
      longPercent: 51.5,
      shortPercent: 48.5,
      ratio: 1.06,
    },
    takerVolume: {
      buyPercent: 51.0,
      sellPercent: 49.0,
      totalVol: '$145.20 Million',
    },
    openInterest: {
      amount: '$185.00 Million',
      change24h: 1.85,
    },
    liquidations24h: {
      total: '$1.60 Million',
      longs: '$0.70 Million',
      shorts: '$0.90 Million',
    },
  };
}
