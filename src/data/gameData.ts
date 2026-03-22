// ── Data Center Clicker: Game Data Types & Definitions ──

export interface Building {
  id: string;
  name: string;
  emoji: string;
  description: string;
  baseCost: number;
  baseDps: number; // DP per second
  costMultiplier: number; // compound per owned (1.15 = 15%)
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: UpgradeEffect;
  unlockCondition?: UnlockCondition;
}

export interface UpgradeEffect {
  type: 'clickMultiplier' | 'dpsMultiplier' | 'buildingMultiplier' | 'flatClick' | 'flatDps';
  value: number;
  targetBuildingId?: string; // for buildingMultiplier
}

export interface UnlockCondition {
  type: 'totalDp' | 'buildingCount' | 'totalClicks';
  buildingId?: string;
  threshold: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockCondition: UnlockCondition;
}

export interface Incident {
  id: string;
  name: string;
  description: string;
  type: 'positive' | 'negative';
  duration: number; // seconds
  effect: IncidentEffect;
}

export interface IncidentEffect {
  type: 'dpsMultiplier' | 'clickMultiplier' | 'dpsFlatBonus' | 'dpsHalt';
  value: number;
}

// ── Building Definitions ──

export const BUILDINGS: Building[] = [
  {
    id: 'raspberry_pi',
    name: 'Raspberry Pi',
    emoji: '\ud83e\uddf2',
    description: 'A tiny single-board computer crunching numbers.',
    baseCost: 15,
    baseDps: 0.1,
    costMultiplier: 1.15,
  },
  {
    id: 'old_laptop',
    name: 'Old Laptop',
    emoji: '\ud83d\udcbb',
    description: 'Repurposed laptop running 24/7 under your desk.',
    baseCost: 100,
    baseDps: 1,
    costMultiplier: 1.15,
  },
  {
    id: 'desktop_rig',
    name: 'Desktop Rig',
    emoji: '\ud83d\udda5\ufe0f',
    description: 'A custom-built tower with serious processing power.',
    baseCost: 1100,
    baseDps: 8,
    costMultiplier: 1.15,
  },
  {
    id: 'gpu_miner',
    name: 'GPU Miner',
    emoji: '\ud83c\udfae',
    description: 'Stacks of GPUs humming with parallel compute.',
    baseCost: 12000,
    baseDps: 47,
    costMultiplier: 1.15,
  },
  {
    id: 'server_rack',
    name: 'Server Rack',
    emoji: '\ud83d\uddc4\ufe0f',
    description: 'A full 42U rack in a proper colocation facility.',
    baseCost: 130000,
    baseDps: 260,
    costMultiplier: 1.15,
  },
  {
    id: 'server_room',
    name: 'Server Room',
    emoji: '\ud83c\udfe2',
    description: 'An entire climate-controlled room of servers.',
    baseCost: 1400000,
    baseDps: 1400,
    costMultiplier: 1.15,
  },
  {
    id: 'data_center',
    name: 'Data Center',
    emoji: '\ud83c\udfed',
    description: 'A dedicated facility with redundant power and cooling.',
    baseCost: 20000000,
    baseDps: 7800,
    costMultiplier: 1.15,
  },
  {
    id: 'cloud_region',
    name: 'Cloud Region',
    emoji: '\u2601\ufe0f',
    description: 'An entire cloud availability zone at your command.',
    baseCost: 330000000,
    baseDps: 44000,
    costMultiplier: 1.15,
  },
  {
    id: 'quantum_lab',
    name: 'Quantum Lab',
    emoji: '\u269b\ufe0f',
    description: 'Experimental quantum processors solving the impossible.',
    baseCost: 5100000000,
    baseDps: 260000,
    costMultiplier: 1.15,
  },
  {
    id: 'orbital_array',
    name: 'Orbital Array',
    emoji: '\ud83d\udef0\ufe0f',
    description: 'Satellite-based compute nodes orbiting the Earth.',
    baseCost: 75000000000,
    baseDps: 1600000,
    costMultiplier: 1.15,
  },
  {
    id: 'dyson_sphere',
    name: 'Dyson Sphere',
    emoji: '\u2600\ufe0f',
    description: 'Harnessing a star for unlimited computational energy.',
    baseCost: 1000000000000,
    baseDps: 10000000,
    costMultiplier: 1.15,
  },
];

// ── Upgrade Definitions ──

export const UPGRADES: Upgrade[] = [
  {
    id: 'double_click',
    name: 'Mechanical Keyboard',
    description: 'Double your click power.',
    cost: 100,
    effect: { type: 'clickMultiplier', value: 2 },
    unlockCondition: { type: 'totalClicks', threshold: 50 },
  },
  {
    id: 'overclock_pi',
    name: 'Overclock Pi',
    description: 'Raspberry Pis produce 2x DP/s.',
    cost: 500,
    effect: { type: 'buildingMultiplier', value: 2, targetBuildingId: 'raspberry_pi' },
    unlockCondition: { type: 'buildingCount', buildingId: 'raspberry_pi', threshold: 10 },
  },
  {
    id: 'ssd_upgrade',
    name: 'SSD Upgrade',
    description: 'Old Laptops produce 2x DP/s.',
    cost: 5000,
    effect: { type: 'buildingMultiplier', value: 2, targetBuildingId: 'old_laptop' },
    unlockCondition: { type: 'buildingCount', buildingId: 'old_laptop', threshold: 10 },
  },
  {
    id: 'liquid_cooling',
    name: 'Liquid Cooling',
    description: 'Desktop Rigs produce 2x DP/s.',
    cost: 50000,
    effect: { type: 'buildingMultiplier', value: 2, targetBuildingId: 'desktop_rig' },
    unlockCondition: { type: 'buildingCount', buildingId: 'desktop_rig', threshold: 10 },
  },
  {
    id: 'tensor_cores',
    name: 'Tensor Cores',
    description: 'GPU Miners produce 2x DP/s.',
    cost: 500000,
    effect: { type: 'buildingMultiplier', value: 2, targetBuildingId: 'gpu_miner' },
    unlockCondition: { type: 'buildingCount', buildingId: 'gpu_miner', threshold: 10 },
  },
  {
    id: 'fiber_uplink',
    name: 'Fiber Uplink',
    description: 'All buildings produce 10% more DP/s.',
    cost: 2000000,
    effect: { type: 'dpsMultiplier', value: 1.1 },
    unlockCondition: { type: 'totalDp', threshold: 1000000 },
  },
  {
    id: 'ai_optimizer',
    name: 'AI Optimizer',
    description: 'Clicks earn +10 flat DP.',
    cost: 10000000,
    effect: { type: 'flatClick', value: 10 },
    unlockCondition: { type: 'totalClicks', threshold: 5000 },
  },
  {
    id: 'neural_net',
    name: 'Neural Network',
    description: 'All buildings produce 25% more DP/s.',
    cost: 100000000,
    effect: { type: 'dpsMultiplier', value: 1.25 },
    unlockCondition: { type: 'totalDp', threshold: 50000000 },
  },
  {
    id: 'quantum_entangle',
    name: 'Quantum Entanglement',
    description: 'Triple click power.',
    cost: 1000000000,
    effect: { type: 'clickMultiplier', value: 3 },
    unlockCondition: { type: 'totalDp', threshold: 500000000 },
  },
  {
    id: 'singularity',
    name: 'The Singularity',
    description: 'All DP/s doubled.',
    cost: 100000000000,
    effect: { type: 'dpsMultiplier', value: 2 },
    unlockCondition: { type: 'totalDp', threshold: 50000000000 },
  },
];

// ── Achievement Definitions ──

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_click', name: 'Hello World', description: 'Click for the first time.', icon: '\ud83d\udc4b', unlockCondition: { type: 'totalClicks', threshold: 1 } },
  { id: 'click_100', name: 'Carpal Tunnel', description: 'Click 100 times.', icon: '\ud83e\ude7c', unlockCondition: { type: 'totalClicks', threshold: 100 } },
  { id: 'click_1000', name: 'Click Machine', description: 'Click 1,000 times.', icon: '\u2699\ufe0f', unlockCondition: { type: 'totalClicks', threshold: 1000 } },
  { id: 'click_10000', name: 'Human Botnet', description: 'Click 10,000 times.', icon: '\ud83e\udd16', unlockCondition: { type: 'totalClicks', threshold: 10000 } },
  { id: 'dp_1000', name: 'Kilobyte', description: 'Earn 1,000 total DP.', icon: '\ud83d\udcc0', unlockCondition: { type: 'totalDp', threshold: 1000 } },
  { id: 'dp_1m', name: 'Megabyte', description: 'Earn 1 million total DP.', icon: '\ud83d\udcbd', unlockCondition: { type: 'totalDp', threshold: 1000000 } },
  { id: 'dp_1b', name: 'Gigabyte', description: 'Earn 1 billion total DP.', icon: '\ud83d\udce1', unlockCondition: { type: 'totalDp', threshold: 1000000000 } },
  { id: 'dp_1t', name: 'Terabyte', description: 'Earn 1 trillion total DP.', icon: '\ud83c\udf0c', unlockCondition: { type: 'totalDp', threshold: 1000000000000 } },
  { id: 'buildings_10', name: 'Small Cluster', description: 'Own 10 buildings total.', icon: '\ud83c\udfe0', unlockCondition: { type: 'buildingCount', threshold: 10 } },
  { id: 'buildings_50', name: 'Server Farm', description: 'Own 50 buildings total.', icon: '\ud83c\udf3e', unlockCondition: { type: 'buildingCount', threshold: 50 } },
  { id: 'buildings_100', name: 'Data Empire', description: 'Own 100 buildings total.', icon: '\ud83d\udc51', unlockCondition: { type: 'buildingCount', threshold: 100 } },
];

// ── Incident Definitions ──

export const INCIDENTS: Incident[] = [
  {
    id: 'traffic_spike',
    name: 'Traffic Spike!',
    description: 'A viral post sends traffic through the roof! DP/s x3',
    type: 'positive',
    duration: 15,
    effect: { type: 'dpsMultiplier', value: 3 },
  },
  {
    id: 'power_outage',
    name: 'Power Outage',
    description: 'The grid is down! All passive DP generation halted.',
    type: 'negative',
    duration: 10,
    effect: { type: 'dpsHalt', value: 0 },
  },
  {
    id: 'ddos',
    name: 'DDoS Attack',
    description: 'Attackers flood your network. DP/s reduced to 25%.',
    type: 'negative',
    duration: 12,
    effect: { type: 'dpsMultiplier', value: 0.25 },
  },
  {
    id: 'bitcoin_boom',
    name: 'Crypto Boom',
    description: 'Crypto prices surge! Click value x5 temporarily.',
    type: 'positive',
    duration: 20,
    effect: { type: 'clickMultiplier', value: 5 },
  },
  {
    id: 'cooling_failure',
    name: 'Cooling Failure',
    description: 'AC is down! DP/s reduced to 50%.',
    type: 'negative',
    duration: 15,
    effect: { type: 'dpsMultiplier', value: 0.5 },
  },
  {
    id: 'government_grant',
    name: 'Government Grant',
    description: 'Research funding! +500 flat DP/s bonus.',
    type: 'positive',
    duration: 30,
    effect: { type: 'dpsFlatBonus', value: 500 },
  },
];

// ── Helper: format large numbers ──

export function formatNumber(n: number): string {
  if (n < 0) return '-' + formatNumber(-n);
  if (n < 1000) return n < 10 ? n.toFixed(1) : Math.floor(n).toString();
  const tiers = [
    { threshold: 1e15, suffix: 'Q' },
    { threshold: 1e12, suffix: 'T' },
    { threshold: 1e9, suffix: 'B' },
    { threshold: 1e6, suffix: 'M' },
    { threshold: 1e3, suffix: 'K' },
  ];
  for (const tier of tiers) {
    if (n >= tier.threshold) {
      const val = n / tier.threshold;
      return (val < 10 ? val.toFixed(2) : val < 100 ? val.toFixed(1) : Math.floor(val).toString()) + tier.suffix;
    }
  }
  return Math.floor(n).toString();
}

// ── Helper: calculate building cost ──

export function getBuildingCost(building: Building, owned: number): number {
  return Math.ceil(building.baseCost * Math.pow(building.costMultiplier, owned));
}
