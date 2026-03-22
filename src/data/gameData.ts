// ============================================================================
// Data Center Clicker — Game Data
// Build your data center empire from a garage Raspberry Pi to a Dyson Sphere.
// ============================================================================

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface Building {
  id: string;
  name: string;
  description: string;
  flavor: string;
  baseCost: number;
  baseDps: number; // DP per second
  costMultiplier: number; // price increase per owned (1.15 = 15%)
  icon: string;
  tier: number;
  unlockAt: number; // total DP earned before this shows up in the shop
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  flavor: string;
  cost: number;
  type: "click_multiplier" | "click_flat" | "click_speed" | "temporary_boost" | "global_dps_multiplier" | "building_dps_multiplier";
  value: number; // multiplier or flat amount
  duration?: number; // seconds, only for temporary boosts
  targetBuildingId?: string; // only for building_dps_multiplier
  icon: string;
  requires?: string; // id of upgrade that must be bought first
  tier: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  flavor: string;
  icon: string;
  condition: AchievementCondition;
  reward?: AchievementReward;
  hidden: boolean;
}

export type AchievementCondition =
  | { type: "total_clicks"; value: number }
  | { type: "total_dp_earned"; value: number }
  | { type: "dp_per_second"; value: number }
  | { type: "dp_per_click"; value: number }
  | { type: "building_owned"; buildingId: string; count: number }
  | { type: "total_buildings"; value: number }
  | { type: "time_played_seconds"; value: number }
  | { type: "own_all_building_types" }
  | { type: "incident_during_dps"; incidentType: "any"; minDps: number }
  | { type: "upgrade_purchased"; upgradeId: string }
  | { type: "buildings_of_type"; buildingId: string; count: number };

export interface AchievementReward {
  type: "click_multiplier" | "dps_multiplier" | "cost_reduction";
  value: number;
}

export interface Incident {
  id: string;
  name: string;
  description: string;
  flavor: string;
  icon: string;
  effect: IncidentEffect;
  duration: number; // seconds
  weight: number; // relative probability
  minDps: number; // only triggers if player has at least this DP/s
  requiresBuildingId?: string; // only triggers if player owns this building
  isPositive: boolean;
}

export type IncidentEffect =
  | { type: "dps_multiplier"; value: number }
  | { type: "click_multiplier"; value: number }
  | { type: "no_auto_generation" }
  | { type: "lose_dp_percent"; value: number }
  | { type: "gain_dp_percent"; value: number }
  | { type: "disable_building"; buildingId: string }
  | { type: "combined"; effects: IncidentEffect[] };

export interface GameStats {
  totalDpEarned: number;
  totalClicks: number;
  dpPerSecond: number;
  dpPerClick: number;
  timePlayedSeconds: number;
  totalBuildingsOwned: number;
  highestDps: number;
  totalIncidents: number;
  totalUpgradesPurchased: number;
}

export interface GameConfig {
  incidentIntervalMin: number; // seconds
  incidentIntervalMax: number; // seconds
  saveIntervalSeconds: number;
  ticksPerSecond: number;
  baseClickValue: number;
  offlineEarningsPercent: number; // 0-1, how much DP/s you earn while away
}

// ---------------------------------------------------------------------------
// Game Configuration
// ---------------------------------------------------------------------------

export const GAME_CONFIG: GameConfig = {
  incidentIntervalMin: 30,
  incidentIntervalMax: 120,
  saveIntervalSeconds: 15,
  ticksPerSecond: 20,
  baseClickValue: 1,
  offlineEarningsPercent: 0.25,
};

// ---------------------------------------------------------------------------
// Buildings
// ---------------------------------------------------------------------------

export const BUILDINGS: Building[] = [
  {
    id: "raspberry_pi",
    name: "Raspberry Pi",
    description: "A tiny $35 computer that somehow runs your whole stack.",
    flavor: "A humble beginning. Draws less power than a nightlight.",
    baseCost: 15,
    baseDps: 0.1,
    costMultiplier: 1.15,
    icon: "🥧",
    tier: 1,
    unlockAt: 0,
  },
  {
    id: "old_desktop",
    name: "Old Desktop",
    description: "A beige tower from 2003. Still boots if you smack it just right.",
    flavor: "Found it in the dumpster behind CompUSA... wait, CompUSA closed?",
    baseCost: 100,
    baseDps: 1,
    costMultiplier: 1.15,
    icon: "🖥️",
    tier: 2,
    unlockAt: 50,
  },
  {
    id: "gaming_pc",
    name: "Gaming PC",
    description: "Liquid-cooled, RGB everything. Totally for 'work' purposes.",
    flavor: "RGB increases performance by 200%. That's just science.",
    baseCost: 1_000,
    baseDps: 8,
    costMultiplier: 1.15,
    icon: "🎮",
    tier: 3,
    unlockAt: 500,
  },
  {
    id: "server_rack",
    name: "Server Rack",
    description: "42U of pure enterprise-grade humming and blinking.",
    flavor: "Now we're talking enterprise. Your electricity bill? Don't ask.",
    baseCost: 10_000,
    baseDps: 47,
    costMultiplier: 1.15,
    icon: "🗄️",
    tier: 4,
    unlockAt: 5_000,
  },
  {
    id: "mini_data_center",
    name: "Mini Data Center",
    description: "A repurposed shipping container full of servers. Very startup chic.",
    flavor: "A closet full of blinking lights and broken dreams.",
    baseCost: 100_000,
    baseDps: 260,
    costMultiplier: 1.15,
    icon: "📦",
    tier: 5,
    unlockAt: 50_000,
  },
  {
    id: "server_farm",
    name: "Server Farm",
    description: "Rows upon rows of racks in a converted warehouse. HOT in here.",
    flavor: "Neighbors complain about the humming. You complain about the cooling bill.",
    baseCost: 1_000_000,
    baseDps: 1_400,
    costMultiplier: 1.15,
    icon: "🏭",
    tier: 6,
    unlockAt: 500_000,
  },
  {
    id: "cloud_region",
    name: "Cloud Region",
    description: "Your own availability zone. Three nines of uptime... on a good day.",
    flavor: "us-east-1 is always on fire. Yours is us-east-2. Also on fire.",
    baseCost: 10_000_000,
    baseDps: 7_800,
    costMultiplier: 1.15,
    icon: "☁️",
    tier: 7,
    unlockAt: 5_000_000,
  },
  {
    id: "hyperscaler",
    name: "Hyperscaler",
    description: "Continent-spanning infrastructure. You ARE the cloud now.",
    flavor: "Big tech calls YOU for capacity. How the turntables...",
    baseCost: 100_000_000,
    baseDps: 44_000,
    costMultiplier: 1.15,
    icon: "🌐",
    tier: 8,
    unlockAt: 50_000_000,
  },
  {
    id: "quantum_cluster",
    name: "Quantum Cluster",
    description: "Qubits entangled in a cryogenic chamber at 15 millikelvin.",
    flavor: "Simultaneously processing and not processing. Schrödinger approves.",
    baseCost: 1_000_000_000,
    baseDps: 260_000,
    costMultiplier: 1.15,
    icon: "⚛️",
    tier: 9,
    unlockAt: 500_000_000,
  },
  {
    id: "dyson_sphere",
    name: "Dyson Sphere Computer",
    description: "A megastructure harvesting the entire energy output of a star.",
    flavor: "Harnessing the entire sun for compute. Still can't run Crysis at max settings.",
    baseCost: 10_000_000_000,
    baseDps: 1_600_000,
    costMultiplier: 1.15,
    icon: "☀️",
    tier: 10,
    unlockAt: 5_000_000_000,
  },
  {
    id: "galactic_neural_net",
    name: "Galactic Neural Net",
    description: "Every star in the galaxy is a neuron. The Milky Way thinks.",
    flavor: "The universe itself becomes your CPU. Latency is measured in light-years.",
    baseCost: 100_000_000_000,
    baseDps: 10_000_000,
    costMultiplier: 1.15,
    icon: "🌌",
    tier: 11,
    unlockAt: 50_000_000_000,
  },
  {
    id: "interdimensional_core",
    name: "Interdimensional Core",
    description: "A rift in spacetime that computes across infinite parallel realities.",
    flavor: "Computing across infinite realities. In one of them, this game plays you.",
    baseCost: 1_000_000_000_000,
    baseDps: 65_000_000,
    costMultiplier: 1.15,
    icon: "🕳️",
    tier: 12,
    unlockAt: 500_000_000_000,
  },
];

// ---------------------------------------------------------------------------
// Upgrades
// ---------------------------------------------------------------------------

export const UPGRADES: Upgrade[] = [
  // --- Click multiplier (CPU upgrades) ---
  {
    id: "cpu_dual_core",
    name: "Dual-Core CPU",
    description: "Two cores means twice the clicking power. Probably.",
    flavor: "Welcome to 2005.",
    cost: 100,
    type: "click_multiplier",
    value: 2,
    icon: "🔲",
    tier: 1,
  },
  {
    id: "cpu_quad_core",
    name: "Quad-Core CPU",
    description: "Four cores. Now you can Chrome AND click at the same time.",
    flavor: "Task Manager shows 25% usage on each core. As is tradition.",
    cost: 1_000,
    type: "click_multiplier",
    value: 2,
    icon: "🔲",
    requires: "cpu_dual_core",
    tier: 2,
  },
  {
    id: "cpu_octa_core",
    name: "Octa-Core CPU",
    description: "Eight cores of raw processing power. Most are idle.",
    flavor: "Enterprise-grade. Mostly used for Slack.",
    cost: 10_000,
    type: "click_multiplier",
    value: 2,
    icon: "🔲",
    requires: "cpu_quad_core",
    tier: 3,
  },
  {
    id: "cpu_threadripper",
    name: "Threadripper 9000",
    description: "64 cores. Your motherboard weeps under the weight.",
    flavor: "Rips threads AND budgets.",
    cost: 100_000,
    type: "click_multiplier",
    value: 2,
    icon: "🔥",
    requires: "cpu_octa_core",
    tier: 4,
  },
  {
    id: "cpu_neuromorphic",
    name: "Neuromorphic Chip",
    description: "Modeled after the human brain. Occasionally has existential crises.",
    flavor: "It thinks, therefore it computes.",
    cost: 10_000_000,
    type: "click_multiplier",
    value: 3,
    icon: "🧠",
    requires: "cpu_threadripper",
    tier: 6,
  },
  {
    id: "cpu_quantum_processor",
    name: "Quantum Click Processor",
    description: "Each click exists in a superposition of values. Observe to collect.",
    flavor: "Your click is both 1 DP and 1 million DP until measured.",
    cost: 1_000_000_000,
    type: "click_multiplier",
    value: 5,
    icon: "⚛️",
    requires: "cpu_neuromorphic",
    tier: 9,
  },

  // --- Flat DP per click (RAM upgrades) ---
  {
    id: "ram_4gb",
    name: "4GB RAM Stick",
    description: "Finally enough to open two Chrome tabs.",
    flavor: "DDR3. Found it in a drawer.",
    cost: 50,
    type: "click_flat",
    value: 1,
    icon: "💾",
    tier: 1,
  },
  {
    id: "ram_16gb",
    name: "16GB RAM Kit",
    description: "Dual channel. Your requests buffer so much faster.",
    flavor: "Now you can run Docker AND VS Code. Barely.",
    cost: 500,
    type: "click_flat",
    value: 5,
    icon: "💾",
    requires: "ram_4gb",
    tier: 2,
  },
  {
    id: "ram_64gb",
    name: "64GB ECC RAM",
    description: "Error-correcting memory. No more silent data corruption.",
    flavor: "Enterprise RAM with a consumer budget. The bank hates you.",
    cost: 5_000,
    type: "click_flat",
    value: 25,
    icon: "💾",
    requires: "ram_16gb",
    tier: 3,
  },
  {
    id: "ram_256gb",
    name: "256GB Server RAM",
    description: "Who even NEEDS this much? You do. You absolutely do.",
    flavor: "Your RAM alone costs more than most cars.",
    cost: 50_000,
    type: "click_flat",
    value: 100,
    icon: "💾",
    requires: "ram_64gb",
    tier: 4,
  },
  {
    id: "ram_1tb",
    name: "1TB RAM Array",
    description: "Just load the entire internet into memory.",
    flavor: "In-memory database? Try in-memory EVERYTHING.",
    cost: 5_000_000,
    type: "click_flat",
    value: 500,
    icon: "💾",
    requires: "ram_256gb",
    tier: 6,
  },
  {
    id: "ram_holographic",
    name: "Holographic Memory Crystal",
    description: "Stores data in crystalline lattice structures. Looks cool on your desk.",
    flavor: "Some say the crystal whispers at night. Those people need sleep.",
    cost: 500_000_000,
    type: "click_flat",
    value: 10_000,
    icon: "💎",
    requires: "ram_1tb",
    tier: 8,
  },

  // --- Click speed bonus (SSD upgrades) ---
  {
    id: "ssd_basic",
    name: "SATA SSD",
    description: "No more spinning rust. Requests load in milliseconds.",
    flavor: "The HDD is in a better place now (the trash).",
    cost: 200,
    type: "click_speed",
    value: 1.5,
    icon: "💽",
    tier: 1,
  },
  {
    id: "ssd_nvme",
    name: "NVMe Drive",
    description: "PCIe Gen4 speeds. Data moves at 7GB/s. Your brain doesn't.",
    flavor: "So fast the bottleneck is now your clicking finger.",
    cost: 2_000,
    type: "click_speed",
    value: 1.5,
    icon: "💽",
    requires: "ssd_basic",
    tier: 2,
  },
  {
    id: "ssd_optane",
    name: "Intel Optane Array",
    description: "3D XPoint technology. Persistent memory at DRAM speeds.",
    flavor: "Intel may be gone but Optane lives on in our hearts (and our servers).",
    cost: 20_000,
    type: "click_speed",
    value: 1.5,
    icon: "💽",
    requires: "ssd_nvme",
    tier: 3,
  },
  {
    id: "ssd_photonic",
    name: "Photonic Storage Array",
    description: "Data stored as light pulses. Speed of light, speed of clicks.",
    flavor: "Not even the fastest SSD. Just the fastest ANYTHING.",
    cost: 2_000_000,
    type: "click_speed",
    value: 2.0,
    icon: "✨",
    requires: "ssd_optane",
    tier: 5,
  },

  // --- Temporary boosts (Overclocking) ---
  {
    id: "overclock_basic",
    name: "Basic Overclock",
    description: "Push the CPU beyond spec. Void the warranty. Worth it.",
    flavor: "The fans sound like a jet engine. GOOD.",
    cost: 500,
    type: "temporary_boost",
    value: 3,
    duration: 30,
    icon: "⚡",
    tier: 1,
  },
  {
    id: "overclock_extreme",
    name: "Extreme Overclock",
    description: "Liquid nitrogen cooling. 6GHz. The silicon screams.",
    flavor: "Warranty? Where we're going, we don't need warranties.",
    cost: 25_000,
    type: "temporary_boost",
    value: 5,
    duration: 30,
    icon: "⚡",
    requires: "overclock_basic",
    tier: 4,
  },
  {
    id: "overclock_quantum",
    name: "Quantum Overclock",
    description: "Overclock across multiple timelines. Stack the boost with yourself.",
    flavor: "In 37% of timelines this melts your CPU. Worth the risk.",
    cost: 50_000_000,
    type: "temporary_boost",
    value: 10,
    duration: 45,
    icon: "⚡",
    requires: "overclock_extreme",
    tier: 7,
  },

  // --- Global DPS multipliers (Infrastructure upgrades) ---
  {
    id: "cooling_basic",
    name: "Proper Air Conditioning",
    description: "Stop using a desk fan to cool your servers.",
    flavor: "The server room drops from 'sauna' to 'merely uncomfortable'.",
    cost: 5_000,
    type: "global_dps_multiplier",
    value: 1.25,
    icon: "❄️",
    tier: 3,
  },
  {
    id: "cooling_liquid",
    name: "Liquid Cooling System",
    description: "Water blocks on everything. Even the PSU. Especially the PSU.",
    flavor: "Combining water and electricity — what could go wrong?",
    cost: 75_000,
    type: "global_dps_multiplier",
    value: 1.5,
    icon: "💧",
    requires: "cooling_basic",
    tier: 5,
  },
  {
    id: "cooling_immersion",
    name: "Immersion Cooling Tank",
    description: "Dunk your entire server in mineral oil. It's fine. Totally fine.",
    flavor: "Looks like a sci-fi movie prop. Works like a dream.",
    cost: 2_500_000,
    type: "global_dps_multiplier",
    value: 1.75,
    icon: "🛢️",
    requires: "cooling_liquid",
    tier: 6,
  },
  {
    id: "network_fiber",
    name: "Fiber Optic Backbone",
    description: "10Gbps connectivity. Your ISP is jealous.",
    flavor: "No more 'buffering...' in your life. Ever.",
    cost: 50_000,
    type: "global_dps_multiplier",
    value: 1.3,
    icon: "🔌",
    tier: 4,
  },
  {
    id: "network_satellite",
    name: "Satellite Uplink Array",
    description: "Direct orbital connectivity. Latency is... acceptable.",
    flavor: "Elon tweets about your uplink. Somehow this costs you money.",
    cost: 15_000_000,
    type: "global_dps_multiplier",
    value: 1.5,
    icon: "📡",
    requires: "network_fiber",
    tier: 7,
  },
  {
    id: "power_solar",
    name: "Solar Farm",
    description: "Free energy from the sun. Your CFO weeps with joy.",
    flavor: "Green energy saves money AND the planet. Mostly the money part.",
    cost: 500_000,
    type: "global_dps_multiplier",
    value: 1.2,
    icon: "🔆",
    tier: 5,
  },
  {
    id: "power_fusion",
    name: "Fusion Reactor",
    description: "Unlimited clean energy. Only took 50 years longer than predicted.",
    flavor: "Always 20 years away — except now it's here.",
    cost: 100_000_000,
    type: "global_dps_multiplier",
    value: 2.0,
    icon: "☢️",
    requires: "power_solar",
    tier: 8,
  },
  {
    id: "power_zero_point",
    name: "Zero-Point Energy Tap",
    description: "Harvest energy from quantum vacuum fluctuations. Physics weeps.",
    flavor: "Infinite energy. Your power bill is now negative.",
    cost: 50_000_000_000,
    type: "global_dps_multiplier",
    value: 3.0,
    icon: "🌀",
    requires: "power_fusion",
    tier: 10,
  },
  {
    id: "ai_load_balancer",
    name: "AI Load Balancer",
    description: "ML-optimized traffic routing. It knows where the request goes before you do.",
    flavor: "Trained on 10 million 503 errors. It has seen things.",
    cost: 1_000_000,
    type: "global_dps_multiplier",
    value: 1.4,
    icon: "🤖",
    tier: 6,
  },
  {
    id: "ai_self_healing",
    name: "Self-Healing Infrastructure",
    description: "AI detects and fixes outages before they happen. DevOps in shambles.",
    flavor: "The machines maintain themselves now. We are merely guests.",
    cost: 50_000_000,
    type: "global_dps_multiplier",
    value: 1.75,
    icon: "🤖",
    requires: "ai_load_balancer",
    tier: 7,
  },
  {
    id: "kubernetes",
    name: "Kubernetes Cluster",
    description: "Container orchestration. Nobody fully understands it, but it works.",
    flavor: "kubectl apply -f prayer.yaml",
    cost: 250_000,
    type: "global_dps_multiplier",
    value: 1.35,
    icon: "☸️",
    tier: 5,
  },
  {
    id: "edge_computing",
    name: "Edge Computing Network",
    description: "Servers at the edge of the network. Closer to users. Faster responses.",
    flavor: "The edge is just someone else's closet. But a FAST closet.",
    cost: 10_000_000,
    type: "global_dps_multiplier",
    value: 1.6,
    icon: "📍",
    requires: "kubernetes",
    tier: 7,
  },

  // --- Building-specific DPS multipliers ---
  {
    id: "pi_cluster_hat",
    name: "Cluster HAT",
    description: "Stack 4 Raspberry Pis into one mega-Pi. Maximum cute.",
    flavor: "4x the Pi. 4x the fun. 0.25x the desk space.",
    cost: 300,
    type: "building_dps_multiplier",
    value: 3,
    targetBuildingId: "raspberry_pi",
    icon: "🥧",
    tier: 1,
  },
  {
    id: "gaming_rgb_max",
    name: "Maximum RGB Protocol",
    description: "Every LED cycles through 16.7 million colors. Scientifically faster.",
    flavor: "Studies show RGB adds 420% more FPS. Source: trust me bro.",
    cost: 15_000,
    type: "building_dps_multiplier",
    value: 3,
    targetBuildingId: "gaming_pc",
    icon: "🌈",
    tier: 3,
  },
  {
    id: "rack_redundancy",
    name: "N+1 Redundancy",
    description: "Every component has a backup. And the backup has a backup.",
    flavor: "The backups have backups. It's backups all the way down.",
    cost: 150_000,
    type: "building_dps_multiplier",
    value: 3,
    targetBuildingId: "server_rack",
    icon: "🔄",
    tier: 5,
  },
  {
    id: "farm_autoscaling",
    name: "Auto-Scaling Groups",
    description: "Servers spin up and down with demand. Your budget fluctuates wildly.",
    flavor: "Scale to zero! ...wait, not THAT zero. BRING IT BACK.",
    cost: 10_000_000,
    type: "building_dps_multiplier",
    value: 3,
    targetBuildingId: "server_farm",
    icon: "📈",
    tier: 7,
  },
  {
    id: "cloud_multiregion",
    name: "Multi-Region Deployment",
    description: "Replicate across all regions. Latency? Never heard of her.",
    flavor: "us-east-1 is STILL on fire, but now you've got backups worldwide.",
    cost: 100_000_000,
    type: "building_dps_multiplier",
    value: 3,
    targetBuildingId: "cloud_region",
    icon: "🌍",
    tier: 8,
  },
  {
    id: "quantum_error_correction",
    name: "Quantum Error Correction",
    description: "Logical qubits from thousands of physical qubits. Finally, stable quantum.",
    flavor: "99.999% coherence. The remaining 0.001% is vibes.",
    cost: 10_000_000_000,
    type: "building_dps_multiplier",
    value: 3,
    targetBuildingId: "quantum_cluster",
    icon: "🔬",
    tier: 10,
  },
  {
    id: "dyson_matrioshka",
    name: "Matrioshka Brain Upgrade",
    description: "Nest multiple Dyson spheres for layered computation. Stars within stars.",
    flavor: "A computer so large it has its own gravitational field.",
    cost: 100_000_000_000,
    type: "building_dps_multiplier",
    value: 3,
    targetBuildingId: "dyson_sphere",
    icon: "🪆",
    tier: 11,
  },
  {
    id: "galactic_hivemind",
    name: "Galactic Hivemind Protocol",
    description: "Unified consciousness across all nodes. Resistance is futile.",
    flavor: "We are the Neural Net. You will be assimilated. Your compute will be added to our own.",
    cost: 1_000_000_000_000,
    type: "building_dps_multiplier",
    value: 3,
    targetBuildingId: "galactic_neural_net",
    icon: "👁️",
    tier: 12,
  },
  {
    id: "interdimensional_collapse",
    name: "Reality Collapse Engine",
    description: "Merge parallel dimensions to consolidate compute. Questionable ethics.",
    flavor: "Other-you sends a thumbs up before ceasing to exist. Worth it.",
    cost: 10_000_000_000_000,
    type: "building_dps_multiplier",
    value: 5,
    targetBuildingId: "interdimensional_core",
    icon: "💥",
    tier: 12,
  },
];

// ---------------------------------------------------------------------------
// Achievements
// ---------------------------------------------------------------------------

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "hello_world",
    name: "Hello World",
    description: "Process your first request.",
    flavor: "console.log('Hello World'); — Every journey starts here.",
    icon: "👋",
    condition: { type: "total_clicks", value: 1 },
    hidden: false,
  },
  {
    id: "stack_overflow",
    name: "Stack Overflow",
    description: "Click 100 times.",
    flavor: "Not the website. The actual stack. It overflowed.",
    icon: "📚",
    condition: { type: "total_clicks", value: 100 },
    reward: { type: "click_multiplier", value: 1.1 },
    hidden: false,
  },
  {
    id: "carpal_tunnel",
    name: "Carpal Tunnel Incoming",
    description: "Click 1,000 times.",
    flavor: "Your doctor wants a word. Your wrist wants a break.",
    icon: "🤕",
    condition: { type: "total_clicks", value: 1_000 },
    reward: { type: "click_multiplier", value: 1.15 },
    hidden: false,
  },
  {
    id: "click_bot",
    name: "Definitely Not a Bot",
    description: "Click 10,000 times.",
    flavor: "CAPTCHA would like to have a word with you.",
    icon: "🤖",
    condition: { type: "total_clicks", value: 10_000 },
    reward: { type: "click_multiplier", value: 1.25 },
    hidden: false,
  },
  {
    id: "feature_not_bug",
    name: "It's Not a Bug, It's a Feature",
    description: "Earn 10,000 DP total.",
    flavor: "You've processed enough requests to file a JIRA ticket about it.",
    icon: "🐛",
    condition: { type: "total_dp_earned", value: 10_000 },
    hidden: false,
  },
  {
    id: "series_a",
    name: "Series A Funding",
    description: "Earn 1,000,000 DP total.",
    flavor: "Investors love your 'disruptive cloud synergy paradigm shift.'",
    icon: "💰",
    condition: { type: "total_dp_earned", value: 1_000_000 },
    reward: { type: "dps_multiplier", value: 1.05 },
    hidden: false,
  },
  {
    id: "unicorn",
    name: "Unicorn Status",
    description: "Earn 1,000,000,000 DP total.",
    flavor: "Valued at $1B. Revenue? We don't talk about revenue.",
    icon: "🦄",
    condition: { type: "total_dp_earned", value: 1_000_000_000 },
    reward: { type: "dps_multiplier", value: 1.1 },
    hidden: false,
  },
  {
    id: "galaxy_brain",
    name: "Galaxy Brain",
    description: "Earn 1 trillion DP total.",
    flavor: "Your data center has its own ZIP code. And gravitational field.",
    icon: "🌌",
    condition: { type: "total_dp_earned", value: 1_000_000_000_000 },
    reward: { type: "dps_multiplier", value: 1.2 },
    hidden: false,
  },
  {
    id: "paperclip_maximizer",
    name: "Paperclip Maximizer",
    description: "Earn 1 quadrillion DP total.",
    flavor: "You've converted all available matter into data points. The universe is mostly DP now.",
    icon: "📎",
    condition: { type: "total_dp_earned", value: 1_000_000_000_000_000 },
    reward: { type: "dps_multiplier", value: 1.5 },
    hidden: false,
  },
  {
    id: "sudo_rm_rf",
    name: "sudo rm -rf /",
    description: "Buy your first server rack.",
    flavor: "With great power comes great responsibility. You have neither.",
    icon: "💀",
    condition: { type: "building_owned", buildingId: "server_rack", count: 1 },
    hidden: false,
  },
  {
    id: "the_cloud",
    name: "The Cloud Is Just Someone Else's Computer",
    description: "Build a cloud region.",
    flavor: "Except now YOU'RE the 'someone else.' Congratulations?",
    icon: "☁️",
    condition: { type: "building_owned", buildingId: "cloud_region", count: 1 },
    hidden: false,
  },
  {
    id: "singularity",
    name: "Singularity",
    description: "Buy a Quantum Cluster.",
    flavor: "The machines are now smarter than us. They just haven't told us yet.",
    icon: "🔮",
    condition: { type: "building_owned", buildingId: "quantum_cluster", count: 1 },
    hidden: false,
  },
  {
    id: "sleep_not_found",
    name: "404 Sleep Not Found",
    description: "Play for 1 hour.",
    flavor: "GET /sleep HTTP/1.1 → 404 Not Found. Have you tried restarting yourself?",
    icon: "😴",
    condition: { type: "time_played_seconds", value: 3600 },
    hidden: false,
  },
  {
    id: "all_nighter",
    name: "All-Nighter",
    description: "Play for 8 hours.",
    flavor: "The janitor is giving you weird looks. It's 4 AM.",
    icon: "🌙",
    condition: { type: "time_played_seconds", value: 28800 },
    reward: { type: "dps_multiplier", value: 1.05 },
    hidden: false,
  },
  {
    id: "hundred_buildings",
    name: "Have You Tried Turning It Off and On Again?",
    description: "Own 100 buildings total.",
    flavor: "100 machines and not a single one that doesn't need a reboot.",
    icon: "🔁",
    condition: { type: "total_buildings", value: 100 },
    reward: { type: "cost_reduction", value: 0.95 },
    hidden: false,
  },
  {
    id: "this_is_fine",
    name: "This Is Fine",
    description: "Have an incident while earning 1M DP/s.",
    flavor: "Everything is on fire. Production is down. This is fine.",
    icon: "🔥",
    condition: { type: "incident_during_dps", incidentType: "any", minDps: 1_000_000 },
    hidden: true,
  },
  {
    id: "we_are_the_cloud",
    name: "We Are the Cloud",
    description: "Own at least one of every building type.",
    flavor: "From Raspberry Pi to Interdimensional Core. What a journey.",
    icon: "👑",
    condition: { type: "own_all_building_types" },
    reward: { type: "dps_multiplier", value: 1.25 },
    hidden: false,
  },
  {
    id: "pi_hoarder",
    name: "Pi Hoarder",
    description: "Own 100 Raspberry Pis.",
    flavor: "You've cornered the global Pi supply. Hobbyists hate you.",
    icon: "🥧",
    condition: { type: "buildings_of_type", buildingId: "raspberry_pi", count: 100 },
    reward: { type: "cost_reduction", value: 0.9 },
    hidden: true,
  },
  {
    id: "rack_city",
    name: "Rack City",
    description: "Own 50 server racks.",
    flavor: "Rack rack city... ten ten ten twenties on your racks.",
    icon: "🏙️",
    condition: { type: "buildings_of_type", buildingId: "server_rack", count: 50 },
    hidden: true,
  },
  {
    id: "speed_demon",
    name: "Speed Demon",
    description: "Reach 1,000,000 DP per second.",
    flavor: "A million data points per second. Your ISP sent a strongly-worded letter.",
    icon: "⚡",
    condition: { type: "dp_per_second", value: 1_000_000 },
    hidden: false,
  },
  {
    id: "googol_ambitions",
    name: "Googol Ambitions",
    description: "Reach 100 DP per click.",
    flavor: "Each click of your mouse echoes through the server halls like thunder.",
    icon: "🖱️",
    condition: { type: "dp_per_click", value: 100 },
    hidden: false,
  },
  {
    id: "overclocked_life",
    name: "Living on the Edge",
    description: "Purchase the Extreme Overclock upgrade.",
    flavor: "Your CPU runs hotter than the surface of Venus. Send help.",
    icon: "🌡️",
    condition: { type: "upgrade_purchased", upgradeId: "overclock_extreme" },
    hidden: true,
  },
  {
    id: "kubernetes_certified",
    name: "Kubernetes Certified",
    description: "Purchase the Kubernetes Cluster upgrade.",
    flavor: "You can now add 'K8s Expert' to your LinkedIn. Nobody will verify.",
    icon: "☸️",
    condition: { type: "upgrade_purchased", upgradeId: "kubernetes" },
    hidden: true,
  },
  {
    id: "desktop_army",
    name: "Desktop Army",
    description: "Own 50 Old Desktops.",
    flavor: "An army of beige towers. The year 2003 called — they want their PCs back. You said no.",
    icon: "🖥️",
    condition: { type: "buildings_of_type", buildingId: "old_desktop", count: 50 },
    hidden: true,
  },
  {
    id: "multiverse_mind",
    name: "Multiverse of Madness",
    description: "Own 10 Interdimensional Cores.",
    flavor: "Reality is a suggestion. Physics filed a restraining order.",
    icon: "🕳️",
    condition: { type: "buildings_of_type", buildingId: "interdimensional_core", count: 10 },
    reward: { type: "dps_multiplier", value: 1.5 },
    hidden: true,
  },
];

// ---------------------------------------------------------------------------
// Incidents
// ---------------------------------------------------------------------------

export const INCIDENTS: Incident[] = [
  // --- Negative incidents ---
  {
    id: "dns_outage",
    name: "DNS Outage",
    description: "It's always DNS. Production halved while engineers panic.",
    flavor: "It's not DNS. There's no way it's DNS. It was DNS.",
    icon: "🌐",
    effect: { type: "dps_multiplier", value: 0.5 },
    duration: 10,
    weight: 15,
    minDps: 0,
    isPositive: false,
  },
  {
    id: "ddos_attack",
    name: "DDoS Attack",
    description: "A botnet is hammering your servers. All auto-generation stops.",
    flavor: "10 million requests per second from IP 127.0.0.1. Wait...",
    icon: "🎯",
    effect: { type: "no_auto_generation" },
    duration: 5,
    weight: 12,
    minDps: 1,
    isPositive: false,
  },
  {
    id: "aws_us_east_1",
    name: "AWS us-east-1 Down",
    description: "The cloud region that half the internet depends on is down. Again.",
    flavor: "Half the internet is down and it's somehow YOUR fault.",
    icon: "🔥",
    effect: { type: "dps_multiplier", value: 0.5 },
    duration: 15,
    weight: 8,
    minDps: 7_800,
    requiresBuildingId: "cloud_region",
    isPositive: false,
  },
  {
    id: "crypto_miners",
    name: "Crypto Miners Found",
    description: "Someone installed a crypto miner on your servers. Lose 10% DP.",
    flavor: "Your GPU fans: 'VROOOOOOM.' Your wallet: *cries*.",
    icon: "⛏️",
    effect: { type: "lose_dp_percent", value: 0.1 },
    duration: 0,
    weight: 10,
    minDps: 10,
    isPositive: false,
  },
  {
    id: "intern_pushed_prod",
    name: "Intern Pushed to Production",
    description: "A random building goes offline while we rollback.",
    flavor: "git push --force origin main. Oh no. OH NO.",
    icon: "👶",
    effect: { type: "disable_building", buildingId: "__random__" },
    duration: 20,
    weight: 10,
    minDps: 50,
    isPositive: false,
  },
  {
    id: "server_room_flood",
    name: "Server Room Flood",
    description: "The pipes burst. Water + servers = bad. Production halved.",
    flavor: "Who put the server room under the bathroom? WHO?!",
    icon: "🌊",
    effect: { type: "dps_multiplier", value: 0.5 },
    duration: 30,
    weight: 6,
    minDps: 100,
    isPositive: false,
  },
  {
    id: "certificate_expired",
    name: "SSL Certificate Expired",
    description: "Your cert expired. Browsers show scary warnings. Traffic drops.",
    flavor: "NET::ERR_CERT_DATE_INVALID — the scariest error in existence.",
    icon: "🔒",
    effect: { type: "dps_multiplier", value: 0.3 },
    duration: 12,
    weight: 8,
    minDps: 50,
    isPositive: false,
  },
  {
    id: "config_drift",
    name: "Configuration Drift",
    description: "Prod doesn't match staging anymore. Nothing works as expected.",
    flavor: "It works on my machine! Ship your machine then.",
    icon: "📋",
    effect: { type: "dps_multiplier", value: 0.7 },
    duration: 15,
    weight: 7,
    minDps: 200,
    isPositive: false,
  },
  {
    id: "memory_leak",
    name: "Memory Leak",
    description: "Something is eating all the RAM. OOM killer is on a rampage.",
    flavor: "Top shows node.js at 98% memory. As is tradition.",
    icon: "🧠",
    effect: { type: "dps_multiplier", value: 0.6 },
    duration: 20,
    weight: 9,
    minDps: 50,
    isPositive: false,
  },
  {
    id: "ransomware",
    name: "Ransomware Attack",
    description: "Your files are encrypted. Pay 15% of your DP or lose everything.",
    flavor: "YOUR FILES HAVE BEEN ENCRYPTED. Send 500 Bitcoin to... oh wait, you can't.",
    icon: "🔐",
    effect: { type: "lose_dp_percent", value: 0.15 },
    duration: 0,
    weight: 4,
    minDps: 1_000,
    isPositive: false,
  },
  {
    id: "solar_flare",
    name: "Solar Flare",
    description: "A coronal mass ejection fries unshielded electronics.",
    flavor: "The sun just EMP'd your data center. Should've built that Faraday cage.",
    icon: "☀️",
    effect: { type: "combined", effects: [{ type: "dps_multiplier", value: 0.25 }, { type: "lose_dp_percent", value: 0.05 }] },
    duration: 8,
    weight: 3,
    minDps: 10_000,
    isPositive: false,
  },

  // --- Positive incidents ---
  {
    id: "successful_deploy",
    name: "Successful Deployment",
    description: "Everything deployed flawlessly. No bugs. Team is suspicious.",
    flavor: "CI/CD pipeline: all green. Is this... is this what happiness feels like?",
    icon: "🚀",
    effect: { type: "dps_multiplier", value: 2.0 },
    duration: 15,
    weight: 12,
    minDps: 0,
    isPositive: true,
  },
  {
    id: "viral_tweet",
    name: "Viral Tweet",
    description: "Your status page screenshot went viral. Click value x5!",
    flavor: "10M impressions on a screenshot of 'All Systems Operational.' Internet is weird.",
    icon: "🐦",
    effect: { type: "click_multiplier", value: 5.0 },
    duration: 10,
    weight: 8,
    minDps: 0,
    isPositive: true,
  },
  {
    id: "government_contract",
    name: "Government Contract",
    description: "A three-letter agency needs your compute. Instant bonus!",
    flavor: "We can neither confirm nor deny this contract exists.",
    icon: "🏛️",
    effect: { type: "gain_dp_percent", value: 0.1 },
    duration: 0,
    weight: 7,
    minDps: 100,
    isPositive: true,
  },
  {
    id: "tech_conference",
    name: "Keynote at Tech Conference",
    description: "You just announced 'Cloud 2.0' on stage. The crowd goes wild.",
    flavor: "It's just cloud with a new logo. Standing ovation anyway.",
    icon: "🎤",
    effect: { type: "dps_multiplier", value: 3.0 },
    duration: 10,
    weight: 6,
    minDps: 500,
    isPositive: true,
  },
  {
    id: "cache_hit_streak",
    name: "Perfect Cache Hit Streak",
    description: "100% cache hit rate for 20 seconds. Everything loads instantly.",
    flavor: "This is the most beautiful thing the team has ever seen.",
    icon: "🎯",
    effect: { type: "dps_multiplier", value: 2.5 },
    duration: 20,
    weight: 9,
    minDps: 50,
    isPositive: true,
  },
  {
    id: "black_friday",
    name: "Black Friday Traffic Surge",
    description: "Traffic is 10x normal. Your servers hold. Revenue pours in.",
    flavor: "Load balancers: 'Is this all you've got?' Narrator: it was not.",
    icon: "🛒",
    effect: { type: "combined", effects: [{ type: "dps_multiplier", value: 2.0 }, { type: "click_multiplier", value: 3.0 }] },
    duration: 12,
    weight: 5,
    minDps: 1_000,
    isPositive: true,
  },
  {
    id: "acquisition_offer",
    name: "Acquisition Offer",
    description: "A FAANG company offers to buy you. You decline. Instant DP bonus.",
    flavor: "They offered $10B. You said 'lol no.' Power move.",
    icon: "🤝",
    effect: { type: "gain_dp_percent", value: 0.2 },
    duration: 0,
    weight: 4,
    minDps: 10_000,
    isPositive: true,
  },
  {
    id: "open_source_contribution",
    name: "Open Source Goes Viral",
    description: "Your open-source project hits #1 on GitHub. Free marketing!",
    flavor: "50k stars overnight. Your README had a typo the whole time.",
    icon: "⭐",
    effect: { type: "dps_multiplier", value: 1.75 },
    duration: 25,
    weight: 7,
    minDps: 200,
    isPositive: true,
  },
];

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

/**
 * Calculate the cost of the next building purchase.
 * Each owned building of the same type increases cost by the building's costMultiplier.
 *
 * Formula: baseCost * (costMultiplier ^ owned)
 */
export function calculateBuildingCost(building: Building, owned: number): number {
  return Math.floor(building.baseCost * Math.pow(building.costMultiplier, owned));
}

/**
 * Calculate the cost to buy N buildings at once (bulk buy).
 * Returns the total cost for buying `count` buildings starting from `owned`.
 */
export function calculateBulkBuildingCost(
  building: Building,
  owned: number,
  count: number
): number {
  let total = 0;
  for (let i = 0; i < count; i++) {
    total += calculateBuildingCost(building, owned + i);
  }
  return Math.floor(total);
}

/**
 * Calculate total DPS from a specific building type given how many you own.
 */
export function calculateBuildingDps(building: Building, owned: number): number {
  return building.baseDps * owned;
}

/**
 * Calculate total DPS across all buildings.
 * `ownedMap` is a Record<buildingId, count>.
 */
export function calculateTotalDps(ownedMap: Record<string, number>): number {
  let total = 0;
  for (const building of BUILDINGS) {
    const count = ownedMap[building.id] ?? 0;
    total += calculateBuildingDps(building, count);
  }
  return total;
}

/**
 * Format a large number into a human-readable string with suffixes.
 */
export function formatNumber(n: number): string {
  if (n < 0) return "-" + formatNumber(-n);

  const suffixes: [number, string][] = [
    [1e18, "Qi"], // Quintillion
    [1e15, "Qa"], // Quadrillion
    [1e12, "T"],  // Trillion
    [1e9, "B"],   // Billion
    [1e6, "M"],   // Million
    [1e3, "K"],   // Thousand
  ];

  for (const [threshold, suffix] of suffixes) {
    if (n >= threshold) {
      const value = n / threshold;
      return value >= 100
        ? Math.floor(value).toLocaleString() + suffix
        : value.toFixed(value >= 10 ? 1 : 2) + suffix;
    }
  }

  if (n >= 1) return Math.floor(n).toLocaleString();
  if (n > 0) return n.toFixed(1);
  return "0";
}

/**
 * Format seconds into a human-readable duration string.
 */
export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

/**
 * Pick a random incident based on weights, player DPS, and owned buildings.
 */
export function pickRandomIncident(
  currentDps: number,
  ownedMap: Record<string, number>
): Incident | null {
  const eligible = INCIDENTS.filter((incident) => {
    if (currentDps < incident.minDps) return false;
    if (
      incident.requiresBuildingId &&
      (ownedMap[incident.requiresBuildingId] ?? 0) === 0
    ) {
      return false;
    }
    return true;
  });

  if (eligible.length === 0) return null;

  const totalWeight = eligible.reduce((sum, i) => sum + i.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const incident of eligible) {
    roll -= incident.weight;
    if (roll <= 0) return incident;
  }

  return eligible[eligible.length - 1];
}

/**
 * Generate a random interval (in seconds) until the next incident.
 */
export function nextIncidentDelay(): number {
  const { incidentIntervalMin, incidentIntervalMax } = GAME_CONFIG;
  return (
    incidentIntervalMin +
    Math.random() * (incidentIntervalMax - incidentIntervalMin)
  );
}

/**
 * Get the maximum number of buildings a player can buy given their current DP.
 */
export function maxAffordableCount(
  building: Building,
  owned: number,
  currentDp: number
): number {
  let count = 0;
  let totalCost = 0;
  while (true) {
    const nextCost = calculateBuildingCost(building, owned + count);
    if (totalCost + nextCost > currentDp) break;
    totalCost += nextCost;
    count++;
    if (count > 10_000) break; // safety valve
  }
  return count;
}

/**
 * Create a fresh initial game stats object.
 */
export function createInitialStats(): GameStats {
  return {
    totalDpEarned: 0,
    totalClicks: 0,
    dpPerSecond: 0,
    dpPerClick: GAME_CONFIG.baseClickValue,
    timePlayedSeconds: 0,
    totalBuildingsOwned: 0,
    highestDps: 0,
    totalIncidents: 0,
    totalUpgradesPurchased: 0,
  };
}

/**
 * Create an initial owned-buildings map (all zeros).
 */
export function createInitialBuildingsOwned(): Record<string, number> {
  const map: Record<string, number> = {};
  for (const building of BUILDINGS) {
    map[building.id] = 0;
  }
  return map;
}

/**
 * Get a building by its ID.
 */
export function getBuildingById(id: string): Building | undefined {
  return BUILDINGS.find((b) => b.id === id);
}

/**
 * Get an upgrade by its ID.
 */
export function getUpgradeById(id: string): Upgrade | undefined {
  return UPGRADES.find((u) => u.id === id);
}

/**
 * Check if a building is unlocked based on total DP earned.
 */
export function isBuildingUnlocked(building: Building, totalDpEarned: number): boolean {
  return totalDpEarned >= building.unlockAt;
}

/**
 * Check if an upgrade is available (prerequisite purchased, not yet bought).
 */
export function isUpgradeAvailable(
  upgrade: Upgrade,
  purchasedUpgradeIds: Set<string>
): boolean {
  if (purchasedUpgradeIds.has(upgrade.id)) return false;
  if (upgrade.requires && !purchasedUpgradeIds.has(upgrade.requires)) return false;
  return true;
}

// Legacy alias for backward compatibility
export const getBuildingCost = calculateBuildingCost;
