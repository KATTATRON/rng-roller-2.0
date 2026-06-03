const rollButton = document.getElementById('rollButton');
const resultEl = document.getElementById('result');
const rollCountButton = document.getElementById('rollCountButton');
const inventoryButton = document.getElementById('inventoryButton');
const indexButton = document.getElementById('indexButton');
const diamondCountButton = document.getElementById('diamondCountButton');
const luckCountButton = document.getElementById('luckCountButton');
const closeIndexButton = document.getElementById('closeIndexButton');
const indexMenu = document.getElementById('indexMenu');
const indexList = document.getElementById('indexList');
const closeInventoryButton = document.getElementById('closeInventoryButton');
const inventoryMenu = document.getElementById('inventoryMenu');
const inventoryList = document.getElementById('inventoryList');
const upgradeButton = document.getElementById('upgradeButton');
const upgradeMenu = document.getElementById('upgradeMenu');
const closeUpgradeButton = document.getElementById('closeUpgradeButton');
const buyAutoRollButton = document.getElementById('buyAutoRollButton');
const buyLuck1Button = document.getElementById('buyLuck1Button');
const buyLuck2Button = document.getElementById('buyLuck2Button');
const buyLuck3Button = document.getElementById('buyLuck3Button');
const buyLuck4Button = document.getElementById('buyLuck4Button');
const buyLuck5Button = document.getElementById('buyLuck5Button');
const buyLuck6Button = document.getElementById('buyLuck6Button');
const buyCoin1Button = document.getElementById('buyCoin1Button');
const buyCoin2Button = document.getElementById('buyCoin2Button');
const buyCoin3Button = document.getElementById('buyCoin3Button');
const buyRollSpeed1Button = document.getElementById('buyRollSpeed1Button');
const buyRollSpeed2Button = document.getElementById('buyRollSpeed2Button');
const buyRollSpeed3Button = document.getElementById('buyRollSpeed3Button');
const buySecretLuck1Button = document.getElementById('buySecretLuck1Button');
const buySecretLuck2Button = document.getElementById('buySecretLuck2Button');
const buySecretLuck3Button = document.getElementById('buySecretLuck3Button');
const buySecretLuck4Button = document.getElementById('buySecretLuck4Button');
const buySecretLuck5Button = document.getElementById('buySecretLuck5Button');
const buySecondRollButton = document.getElementById('buySecondRollButton');
const buyThirdRollButton = document.getElementById('buyThirdRollButton');
const adminButton = document.getElementById('adminButton');
const adminMenu = document.getElementById('adminMenu');
const closeAdminButton = document.getElementById('closeAdminButton');
const adminRngNameInput = document.getElementById('adminRngName');
const adminRngQtyInput = document.getElementById('adminRngQty');
const adminCoinAmountInput = document.getElementById('adminCoinAmount');
const adminLuckBoostInput = document.getElementById('adminLuckBoost');
const adminRebirthCountInput = document.getElementById('adminRebirthCount');
const adminLuckPotionAmountInput = document.getElementById('adminLuckPotionAmount');
const adminCoinPotionAmountInput = document.getElementById('adminCoinPotionAmount');
const adminShinyPotionAmountInput = document.getElementById('adminShinyPotionAmount');
const adminApplyButton = document.getElementById('adminApplyButton');
const adminResetButton = document.getElementById('adminResetButton');
const adminResetAccountButton = document.getElementById('adminResetAccountButton');
const useShinyPrefix = (name) => {
  return /^\s*shiny\s+/i.test(name);
};
const autoRollContainer = document.getElementById('autoRollContainer');
const indexTabNormalButton = document.getElementById('indexTabNormal');
const indexTabShinyButton = document.getElementById('indexTabShiny');
const inventoryTabNormalButton = document.getElementById('inventoryTabNormal');
const inventoryTabShinyButton = document.getElementById('inventoryTabShiny');
const inventoryTabTeamButton = document.getElementById('inventoryTabTeam');
const diamondShopButton = document.getElementById('diamondShopButton');
const diamondShopMenu = document.getElementById('diamondShopMenu');
const closeDiamondShopButton = document.getElementById('closeDiamondShopButton');
const buyTeamSlotButton = document.getElementById('buyTeamSlotButton');
const buyDiamondSecretLuck1Button = document.getElementById('buyDiamondSecretLuck1Button');
const buyDiamondSecretLuck2Button = document.getElementById('buyDiamondSecretLuck2Button');
const buyDiamondSecretLuck3Button = document.getElementById('buyDiamondSecretLuck3Button');
const diamondShopEquippedCount = document.getElementById('diamondShopEquippedCount');
const diamondShopSlotCount = document.getElementById('diamondShopSlotCount');
const gemCountButton = document.getElementById('gemCountButton');
const secretLuckCountButton = document.getElementById('secretLuckCountButton');

// Upgrades state
const upgrades = {
  autoRoll: false,
  luckTier: 0, // 0 = none, 1-6
  secretLuckTier: 0, // 0 = none, 1-5
  coinTier: 0, // 0 = none, 1-3
  rollSpeedTier: 0, // 0 = base 2.5s, 1 = 2.0s, 2 = 1.5s, 3 = 1.0s
  thirdRoll: false // third simultaneous roll
};
// allow a purchased second simultaneous roll
upgrades.secondRoll = false;
upgrades.diamondSecretLuckTier = 0;

let diamondTotal = 0;
let gemTotal = 0;
let claimedCharacters = {};
let teamEquipSlots = 1;
const TEAM_EQUIP_SLOT_COST = 50;
const MAX_TEAM_EQUIP_SLOTS = 3;
let equippedSecrets = [];
let currentInventoryTab = 'normal';

function getRollSpeedMs() {
  return rollSpeedMsByTier[upgrades.rollSpeedTier] || 2500;
}

const luckTiers = [0, 0.05, 0.10, 0.20, 0.25, 0.30, 0.35];
const luckCosts = [0, 1000, 2000, 10000, 15000, 24000, 100000];
const secretLuckTiers = [0, 0.05, 0.10, 0.20, 0.25, 0.30];
const secretLuckCosts = [0, 4000, 7000, 10000, 20000, 100000];
const diamondEquipSecretLuckCosts = [0, 50, 100, 150];
const coinBoosts = [0, 0.5, 1.0, 1.5];
// t1-t3 made 2x more expensive per user request
const coinBoostCosts = [0, 2000, 5000, 10000];
const rollSpeedMsByTier = [2500, 2000, 1500, 1000];
const rollSpeedCosts = [0, 2500, 5000, 10000];
const autoRollCost = 1000;
const secondRollCost = 10000;
const thirdRollCost = 100000;
let autoRollActive = false;
let autoRollInterval = null;
let adminLuckBoost = 0;
let currentIndexTab = 'normal';
let rebirthCount = 0;
const rebirthLimit = 10;
// extended multipliers for 0..10 (0=no rebirth)
const rebirthMultipliers = [1, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5, 2.75, 3.0, 3.25, 3.5];
function getRebirthMultiplier(count) {
  const index = Math.max(0, Math.floor(count));
  if (index < rebirthMultipliers.length) return rebirthMultipliers[index];
  return rebirthMultipliers[rebirthMultipliers.length - 1] + 0.25 * (index - (rebirthMultipliers.length - 1));
}
// Rebirth costs: start at 150k for rebirth 1 and increase by 50k each step
const rebirthCosts = [0, 150000, 200000, 250000, 300000, 350000, 400000, 450000, 500000, 550000, 600000];
const rebirthGemCosts = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
// Golden dice state
let goldenDiceCounter = 10;
let goldenRollActive = false;
let goldenPending = false;
let potionTimerIntervalId = null;
// Potions
const POTION_DURATION_MS = 5 * 60 * 1000; // 5 minutes
const SHINY_POTION_DURATION_MS = 30 * 1000; // 30 seconds
const POTION_DROP_LUCK_CHANCE = 0.01; // 1%
const POTION_DROP_COIN_CHANCE = 0.005; // 0.5%
const POTION_DROP_SHINY_CHANCE = 0.0001; // 0.01%
const potions = { luck: 0, coin: 0, shiny: 0 };
const activePotionExpiry = { luck: 0, coin: 0, shiny: 0 };

// Persistence: save/load coins and upgrades
const STORAGE_KEY = 'rng_game_state_v1';

function saveState() {
  try {
    const state = {
      coinTotal,
      diamondTotal,
      gemTotal,
      upgrades,
      rollCount,
      rolledCharacters,
      claimedCharacters,
      adminLuckBoost,
      potions,
      activePotionExpiry,
      goldenDiceCounter,
      goldenPending,
      rebirthCount,
      teamEquipSlots,
      equippedSecrets
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save state', e);
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const state = JSON.parse(raw);
    if (typeof state.coinTotal === 'number') coinTotal = state.coinTotal;
    if (typeof state.diamondTotal === 'number') diamondTotal = state.diamondTotal;
    if (typeof state.gemTotal === 'number') gemTotal = state.gemTotal;
    if (state.upgrades && typeof state.upgrades === 'object') {
      upgrades.autoRoll = !!state.upgrades.autoRoll;
      upgrades.luckTier = Number(state.upgrades.luckTier) || 0;
      upgrades.secretLuckTier = Number(state.upgrades.secretLuckTier) || 0;
      upgrades.diamondSecretLuckTier = Number(state.upgrades.diamondSecretLuckTier) || 0;
      upgrades.coinTier = Number(state.upgrades.coinTier) || 0;
      upgrades.rollSpeedTier = Number(state.upgrades.rollSpeedTier) || 0;
      upgrades.secondRoll = !!state.upgrades.secondRoll;
      upgrades.thirdRoll = !!state.upgrades.thirdRoll;
    }
    if (typeof state.rollCount === 'number') rollCount = state.rollCount;
    if (state.rolledCharacters && typeof state.rolledCharacters === 'object') {
      // shallow copy
      Object.keys(state.rolledCharacters).forEach(k => {
        rolledCharacters[k] = Number(state.rolledCharacters[k]) || 0;
      });
    }
    if (state.claimedCharacters && typeof state.claimedCharacters === 'object') {
      claimedCharacters = {};
      Object.keys(state.claimedCharacters).forEach(k => {
        if (state.claimedCharacters[k]) claimedCharacters[k] = true;
      });
    }
    if (typeof state.adminLuckBoost === 'number') {
      adminLuckBoost = state.adminLuckBoost;
      if (adminLuckBoostInput) adminLuckBoostInput.value = String(Math.round(adminLuckBoost * 100));
    }
    if (state.potions && typeof state.potions === 'object') {
      potions.luck = Number(state.potions.luck) || 0;
      potions.coin = Number(state.potions.coin) || 0;
      potions.shiny = Number(state.potions.shiny) || 0;
    }
    if (state.activePotionExpiry && typeof state.activePotionExpiry === 'object') {
      activePotionExpiry.luck = Number(state.activePotionExpiry.luck) || 0;
      activePotionExpiry.coin = Number(state.activePotionExpiry.coin) || 0;
      activePotionExpiry.shiny = Number(state.activePotionExpiry.shiny) || 0;
    }
    if (typeof state.goldenDiceCounter === 'number') goldenDiceCounter = state.goldenDiceCounter || 10;
    if (typeof state.goldenPending === 'boolean') goldenPending = state.goldenPending || false;
    if (typeof state.rebirthCount === 'number') rebirthCount = Math.max(0, Math.min(rebirthLimit, state.rebirthCount));
    if (typeof state.teamEquipSlots === 'number') {
      teamEquipSlots = Math.max(1, Math.min(MAX_TEAM_EQUIP_SLOTS, state.teamEquipSlots));
    }
    if (Array.isArray(state.equippedSecrets)) {
      equippedSecrets = state.equippedSecrets.filter(id => typeof id === 'string');
    }
    cleanupEquippedSecrets();
    // if any potion is active on load, start the UI timer
    if (isPotionActive('luck') || isPotionActive('coin')) startPotionTimer();
  } catch (e) {
    console.warn('Could not load state', e);
  }
}

const characters = [
  {
    id: 'smile',
    name: 'Smile',
    tier: 'Common',
    chance: '1-2',
    weight: 1 / 2,
    coins: 2,
    icon: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><circle cx="60" cy="60" r="52" fill="#8b8b8b" stroke="#394145" stroke-width="4"/><circle cx="42" cy="48" r="9" fill="#0f4c8c"/><circle cx="78" cy="48" r="9" fill="#0f4c8c"/><path d="M40 80 Q60 95 80 80" stroke="#7f1d1d" stroke-width="8" fill="none" stroke-linecap="round"/></svg>`
  },
  {
    id: 'talky-common-1-7',
    name: 'Talky',
    tier: 'Common',
    chance: '1-7',
    weight: 1 / 7,
    coins: 7,
    icon: `<svg viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Talky"><rect x="6" y="6" width="116" height="64" rx="12" ry="12" fill="#8b8b8b" stroke="#000" stroke-width="4"/><polygon points="34,70 26,82 38,78" fill="#8b8b8b" stroke="#000" stroke-width="4"/><g fill="#039be5" transform="translate(0,0)"><polygon points="44,26 54,26 49,36"/><polygon points="86,26 96,26 91,36"/></g><ellipse cx="70" cy="46" rx="16" ry="10" fill="#fff" stroke="#000" stroke-width="4"/><text x="84" y="50" font-size="10" fill="#000">ABACABAB</text></svg>`
  },
  {
    id: 'sad',
    name: 'Sad',
    tier: 'Common',
    chance: '1-5',
    weight: 1 / 5,
    coins: 5,
    icon: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><circle cx="60" cy="60" r="52" fill="#3b5ab5" stroke="#1e2d70" stroke-width="4"/><circle cx="42" cy="48" r="9" fill="#162a42"/><circle cx="78" cy="48" r="9" fill="#162a42"/><path d="M40 90 Q60 75 80 90" stroke="#1f2937" stroke-width="8" fill="none" stroke-linecap="round"/></svg>`
  },
  {
    id: 'pumpky-common-1-8',
    name: 'Pumpky',
    tier: 'Common',
    chance: '1-8',
    weight: 1 / 8,
    coins: 8,
    icon: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><polygon points="60,18 100,102 20,102" fill="#f97316" stroke="#7c2d12" stroke-width="4"/><polygon points="60,30 82,86 38,86" fill="#fef2f2"/><polygon points="60,34 72,62 60,58 48,62" fill="#0ea5e9"/><path d="M36 82 Q60 96 84 82" stroke="#000" stroke-width="6" fill="none" stroke-linecap="round"/></svg>`
  },
  {
    id: 'starry-eye-common-1-6',
    name: 'Starry Eye',
    tier: 'Common',
    chance: '1-6',
    weight: 1 / 6,
    coins: 6,
    icon: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><circle cx="60" cy="60" r="52" fill="#8b5cf6" stroke="#5b21b6" stroke-width="4"/><polygon points="30,48 40,34 50,48 36,42" fill="#fde047" stroke="#b45309" stroke-width="3"/><polygon points="70,48 80,34 90,48 76,42" fill="#fde047" stroke="#b45309" stroke-width="3"/><path d="M38 82 Q60 72 82 82" stroke="#dc2626" stroke-width="5" fill="none" stroke-linecap="round"/></svg>`
  },
  {
    id: 'devil',
    name: 'devil',
    tier: 'Uncommon',
    chance: '1-10',
    weight: 1 / 10,
    coins: 10,
    icon: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><circle cx="60" cy="65" r="48" fill="#b91c1c" stroke="#591314" stroke-width="4"/><polygon points="28,28 38,8 48,28" fill="#b91c1c" stroke="#591314" stroke-width="4"/><polygon points="72,28 82,8 92,28" fill="#b91c1c" stroke="#591314" stroke-width="4"/><circle cx="42" cy="60" r="8" fill="#6b0505"/><circle cx="78" cy="60" r="8" fill="#6b0505"/><path d="M40 82 Q60 98 80 82" stroke="#6b0505" stroke-width="8" fill="none" stroke-linecap="round"/></svg>`
  },
  {
    id: 'glooby',
    name: 'Glooby',
    tier: 'Uncommon',
    chance: '1-15',
    weight: 1 / 15,
    coins: 15,
    icon: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><circle cx="60" cy="64" r="48" fill="#22c55e" stroke="#166534" stroke-width="4"/><line x1="45" y1="14" x2="42" y2="38" stroke="#166534" stroke-width="6" stroke-linecap="round"/><circle cx="42" cy="12" r="6" fill="#22c55e" stroke="#166534" stroke-width="3"/><line x1="75" y1="12" x2="74" y2="38" stroke="#166534" stroke-width="6" stroke-linecap="round"/><circle cx="74" cy="10" r="6" fill="#22c55e" stroke="#166534" stroke-width="3"/><ellipse cx="45" cy="60" rx="7" ry="14" fill="#0f766e"/><ellipse cx="75" cy="60" rx="7" ry="14" fill="#0f766e"/><path d="M46 84 Q60 92 74 84" stroke="#0f523f" stroke-width="6" fill="none" stroke-linecap="round"/></svg>`
  },
  {
    id: 'w-uncommon-1-16',
    name: 'W',
    tier: 'Uncommon',
    chance: '1-16',
    weight: 1 / 16,
    coins: 16,
    icon: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="120" rx="20" ry="20" fill="#2563eb"/><text x="50%" y="62%" dominant-baseline="middle" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="72" font-weight="800" fill="#ffffff">W</text></svg>`
  },
  {
    id: 'flaty',
    name: 'Flaty',
    tier: 'Rare',
    chance: '1-32',
    weight: 1 / 32,
    coins: 32,
    icon: `<svg viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="70" cy="54" rx="64" ry="44" fill="#0ea5e9" stroke="#083f61" stroke-width="4"/><circle cx="46" cy="54" r="9" fill="#f8fafc"/><circle cx="94" cy="54" r="9" fill="#f8fafc"/><ellipse cx="70" cy="73" rx="24" ry="10" fill="#111827"/><path d="M70 73 q-8 8 0 16" stroke="#f8fafc" stroke-width="6" stroke-linecap="round"/></svg>`
  },
  {
    id: 'dumb',
    name: 'Dumb',
    tier: 'Rare',
    chance: '1-64',
    weight: 1 / 64,
    coins: 64,
    icon: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><circle cx="60" cy="60" r="50" fill="#fde047" stroke="#7c2d12" stroke-width="4"/><circle cx="42" cy="50" r="9" fill="#0f4c8c"/><circle cx="78" cy="50" r="9" fill="#0f4c8c"/><ellipse cx="60" cy="82" rx="24" ry="14" fill="#b91c1c"/><path d="M48 84 Q60 110 76 88" stroke="#f5dcb1" stroke-width="8" fill="none" stroke-linecap="round"/></svg>`
  },
  {
    id: 'high',
    name: 'High',
    tier: 'Epic',
    chance: '1-128',
    weight: 1 / 128,
    coins: 128,
    icon: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><polygon points="60,14 102,42 88,94 32,94 18,42" fill="#c4b5fd" stroke="#6d28d9" stroke-width="4"/><circle cx="44" cy="56" r="8" fill="#7f1d1d"/><circle cx="76" cy="56" r="8" fill="#7f1d1d"/><path d="M48 88 Q60 98 72 88" stroke="#7f1d1d" stroke-width="6" fill="none" stroke-linecap="round"/></svg>`
  },
  {
    id: 'starry',
    name: 'Starry',
    tier: 'Epic',
    chance: '1-256',
    weight: 1 / 256,
    coins: 256,
    icon: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><polygon points="60,14 72,52 112,52 78,76 90,114 60,90 30,114 42,76 8,52 48,52" fill="#facc15" stroke="#92400e" stroke-width="4"/><path d="M45 58 l10 12 l10 -12" stroke="#92400e" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`
  },
  {
    id: 'diablo-epic-1-333',
    name: 'Diablo',
    tier: 'Epic',
    chance: '1-333',
    weight: 1 / 333,
    coins: 333,
    icon: `<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diablo"><defs><filter id="soft"><feGaussianBlur stdDeviation="0.6"/></filter></defs><ellipse cx="100" cy="50" rx="88" ry="38" fill="#ffeb3b" stroke="#000" stroke-width="4"/><g transform="translate(0,0)"><g fill="#000" stroke="none"><polygon points="68,36 82,28 96,36 82,44"/><polygon points="132,36 146,28 160,36 146,44"/></g><circle cx="92" cy="36" r="3" fill="#ef4444"/><circle cx="108" cy="36" r="3" fill="#ef4444"/><path d="M62 70 C80 86 94 60 110 72 C128 86 142 64 150 70" stroke="#000" stroke-width="4" fill="none" stroke-linecap="round"/></g></svg>`
  },
  {
    id: 'diamond',
    name: 'Diamond',
    tier: 'Legendary',
    chance: '1-512',
    weight: 1 / 512,
    coins: 512,
    icon: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><polygon points="60,14 106,60 60,106 14,60" fill="#7dd3fc" stroke="#0369a1" stroke-width="4"/><circle cx="60" cy="50" r="6" fill="#0c4a6e"/><path d="M50 40 L70 40 M44 60 L76 60 M60 72 L60 90" stroke="#0c4a6e" stroke-width="4" stroke-linecap="round"/></svg>`
  },
  {
    id: 'friedrich-legendary-1-7777',
    name: 'Friedrich',
    tier: 'Legendary',
    chance: '1-7777',
    weight: 1 / 7777,
    coins: 7777,
    icon: `<img src="images/Gemini_Generated_Image_3hnjlw3hnjlw3hnj.png" alt="Friedrich" class="raster-icon" />`
  },
  // Added by user: Blocky (Rare)
  {
    id: 'blocky-rare-1-80',
    name: 'Blocky',
    tier: 'Rare',
    chance: '1-80',
    weight: 1 / 80,
    coins: 80,
    icon: `<svg viewBox="0 0 140 120" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="20" width="120" height="68" rx="6" ry="6" fill="#06a6f0" stroke="#021b2d" stroke-width="4"/><rect x="22" y="36" width="20" height="24" fill="#021b2d"/><rect x="98" y="36" width="20" height="24" fill="#021b2d"/><rect x="46" y="84" width="12" height="24" fill="#06a6f0" stroke="#021b2d" stroke-width="3"/><rect x="82" y="84" width="12" height="24" fill="#06a6f0" stroke="#021b2d" stroke-width="3"/></svg>`
  },
  // Added by user: The Calling Star (Legendary)
  {
    id: 'the-calling-star-legendary-1-2500',
    name: 'The Calling Star',
    tier: 'Legendary',
    chance: '1-2500',
    weight: 1 / 2500,
    coins: 2500,
    icon: `<img src="images/calling-star.png" alt="The Calling Star" class="raster-icon" />`
  },
  // Added by user: 8 Shards of Respect (Epic)
  {
    id: '8-shards-of-respect-epic-1-150',
    name: '8 Shards of Respect',
    tier: 'Epic',
    chance: '1-150',
    weight: 1 / 150,
    coins: 150,
    icon: `<svg viewBox="0 0 140 120" xmlns="http://www.w3.org/2000/svg"><g transform="translate(70,60)"><polygon points="0,-54 38,0 0,54 -38,0" fill="#34d399" stroke="#065f46" stroke-width="3"/><g transform="rotate(45)"><polygon points="0,-54 38,0 0,54 -38,0" fill="#fb7185" stroke="#7f1d1d" stroke-width="2" opacity="0.9"/></g><g transform="rotate(90)"><polygon points="0,-54 38,0 0,54 -38,0" fill="#f59e0b" stroke="#92400e" stroke-width="2" opacity="0.9"/></g><g transform="rotate(135)"><polygon points="0,-54 38,0 0,54 -38,0" fill="#60a5fa" stroke="#1e3a8a" stroke-width="2" opacity="0.9"/></g></g></svg>`
  },
  {
    id: 'cat-secrett',
    name: 'CAT-SECRETT',
    tier: 'Secret',
    chance: '1-10000',
    weight: 1 / 10000,
    coins: 100000,
    icon: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><circle cx="60" cy="68" r="44" fill="#8b5e34" stroke="#4b2911" stroke-width="4"/><polygon points="26,34 38,10 52,34" fill="#8b5e34" stroke="#4b2911" stroke-width="4"/><polygon points="94,34 82,10 68,34" fill="#8b5e34" stroke="#4b2911" stroke-width="4"/><ellipse cx="44" cy="68" rx="8" ry="12" fill="#eef2ff"/><ellipse cx="76" cy="68" rx="8" ry="12" fill="#eef2ff"/><path d="M44 88 Q60 102 76 88" stroke="#1f2937" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M34 78 C38 82 46 84 50 78" stroke="#1f2937" stroke-width="4" fill="none"/><path d="M70 78 C74 82 82 84 86 78" stroke="#1f2937" stroke-width="4" fill="none"/></svg>`
  },
  {
    id: 'riegelog-secret-1-67500',
    name: 'RiegelOG',
    tier: 'Secret',
    chance: '1-67.5k',
    weight: 1 / 67500,
    coins: 675000,
    icon: `<img src="images/riegelog.png" alt="RiegelOG" class="raster-icon" />`
  },
  {
    id: 'erena-secret-1-486287',
    name: 'Erena',
    tier: 'Secret',
    chance: '1-486287',
    weight: 1 / 486287,
    coins: 100000,
    icon: `<img src="images/erena.png" alt="Erena" class="raster-icon" />`
  },
  {
    id: 'avokado-secret-1-16666',
    name: 'Avokado',
    tier: 'Secret',
    chance: '1-16666',
    weight: 1 / 16666,
    coins: 100000,
    icon: `<img src="images/avokado_clean.png" alt="Avokado" class="raster-icon avokado-icon" />`
  },
  {
    id: 'love-rare-1-72',
    name: 'Love',
    tier: 'Rare',
    chance: '1-72',
    weight: 1 / 72,
    coins: 72,
    icon: `<svg viewBox="0 0 140 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Love"><path d="M70 106 L60 96 C30 72 10 52 28 34 C44 18 62 26 70 44 C78 26 96 18 112 34 C130 52 110 72 80 96 L70 106 Z" fill="#ef4444" stroke="#000" stroke-width="4" stroke-linejoin="round"/><g transform="translate(0,0)"><path d="M48 46 C46 42 50 38 54 38 C58 38 62 42 62 46 C62 50 58 54 54 54 C50 54 46 50 48 46 Z" fill="#1f1720" stroke="#000" stroke-width="1"/><path d="M88 46 C86 42 90 38 94 38 C98 38 102 42 102 46 C102 50 98 54 94 54 C90 54 86 50 88 46 Z" fill="#1f1720" stroke="#000" stroke-width="1"/></g><path d="M62 74 C66 82 74 82 78 74" stroke="#000" stroke-width="4" stroke-linecap="round" fill="none"/></svg>`  },
  {
    id: 'lightning-uncommon-1-24',
    name: 'Lightning',
    tier: 'Uncommon',
    chance: '1-24',
    weight: 1 / 24,
    coins: 24,
    icon: `<img src="images/lightning.png" alt="Lightning" class="raster-icon" />`
  },
  {
    id: 'up-rare-1-66',
    name: 'UP',
    tier: 'Rare',
    chance: '1-66',
    weight: 1 / 66,
    coins: 66,
    icon: `<svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="UP"><path d="M50 10 L90 70 H62 V130 H38 V70 H10 Z" fill="#38bdf8" stroke="#0369a1" stroke-width="4"/><circle cx="36" cy="92" r="6" fill="#f8fafc"/><circle cx="64" cy="92" r="6" fill="#f8fafc"/></svg>`
  },
  {
    id: 'down-rare-1-66',
    name: 'Down',
    tier: 'Rare',
    chance: '1-66',
    weight: 1 / 66,
    coins: 66,
    icon: `<svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Down"><path d="M50 130 L90 70 H62 V10 H38 V70 H10 Z" fill="#ef4444" stroke="#991b1b" stroke-width="4"/><circle cx="36" cy="48" r="6" fill="#f8fafc"/><circle cx="64" cy="48" r="6" fill="#f8fafc"/></svg>`
  },
  {
    id: 'big-t-legendary-1-1000',
    name: 'Big T',
    tier: 'Legendary',
    chance: '1-1000',
    weight: 1 / 1000,
    coins: 1000,
    icon: `<svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Big T"><rect x="10" y="10" width="100" height="30" rx="8" ry="8" fill="#000"/><rect x="44" y="40" width="32" height="90" rx="8" ry="8" fill="#000"/><ellipse cx="34" cy="30" rx="12" ry="10" fill="#38bdf8" stroke="#fff" stroke-width="3"/><ellipse cx="86" cy="30" rx="12" ry="10" fill="#38bdf8" stroke="#fff" stroke-width="3"/><ellipse cx="60" cy="110" rx="12" ry="8" fill="#fff" stroke="#000" stroke-width="3"/></svg>`  },
  {
    id: '67-legendary-1-670',
    name: '67',
    tier: 'Legendary',
    chance: '1-670',
    weight: 1 / 670,
    coins: 670,
    icon: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="120" rx="16" ry="16" fill="#0ea5e9"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="68" font-weight="800" fill="#ffffff">67</text></svg>`
  }
  ,
  // Added: SLZ (Legendary, 1-5k)
  {
    id: 'slz-legendary-1-5000',
    name: 'SLZ',
    tier: 'Legendary',
    chance: '1-5000',
    weight: 1 / 5000,
    coins: 5000,
    icon: `<svg viewBox="0 0 140 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="SLZ"><g transform="translate(10,10)"><polygon points="40,0 80,0 110,34 80,68 40,68 10,34" fill="#334155" stroke="#0f172a" stroke-width="4"/><polygon points="40,74 80,74 110,108 80,142 40,142 10,108" fill="#7f1d1d" stroke="#2b0a0a" stroke-width="4"/></g></svg>`
  },
  // Added: The Yellow Legendary (Legendary, 1-5500)
  {
    id: 'the-yellow-legendary-1-5500',
    name: 'The Yellow',
    tier: 'Legendary',
    chance: '1-5500',
    weight: 1 / 5500,
    coins: 5500,
    icon: `<svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The Yellow"><polygon points="70,10 130,110 10,110" fill="#fde047" stroke="#b45309" stroke-width="4"/><polygon points="70,20 116,108 24,108" fill="#facc15" stroke="#92400e" stroke-width="3"/><polygon points="70,30 96,84 44,84" fill="#f59e0b" stroke="#92400e" stroke-width="3"/><path d="M70 38 L82 72 L70 68 L58 72 Z" fill="#fef08a" stroke="#92400e" stroke-width="2"/><path d="M60 100 Q70 90 80 100" stroke="#92400e" stroke-width="3" fill="none"/></svg>`
  },
  // Added: Four Ways of Light (Legendary, 1-8k)
  {
    id: 'four-ways-light-legendary-1-8000',
    name: 'Four Ways of Light',
    tier: 'Legendary',
    chance: '1-8000',
    weight: 1 / 8000,
    coins: 8000,
    icon: `<svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Four Ways"><g transform="translate(10,10)"><polygon points="48,0 72,0 72,44 96,44 96,68 72,68 72,112 48,112 48,68 24,68 24,44 48,44" fill="#2563eb" stroke="#0f172a" stroke-width="3"/><polygon points="72,44 116,44 116,68 72,68" fill="#fde68a" stroke="#9a7b00" stroke-width="3"/><polygon points="24,44 0,44 0,68 24,68" fill="#fbcfe8" stroke="#7b1734" stroke-width="3"/><polygon points="48,0 72,0 60,20" fill="#10b981" stroke="#064e3b" stroke-width="3"/><polygon points="48,112 72,112 60,92" fill="#ef4444" stroke="#7f1d1d" stroke-width="3"/></g></svg>`
  },
  // Added: Great Pyramid (Epic, 1-200)
  {
    id: 'great-pyramid-epic-1-200',
    name: 'Great Pyramid',
    tier: 'Epic',
    chance: '1-200',
    weight: 1 / 200,
    coins: 200,
    icon: `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Great Pyramid"><polygon points="60,4 112,92 8,92" fill="#facc15" stroke="#a16207" stroke-width="4"/><rect x="20" y="86" width="80" height="6" fill="#f3e6a9"/></svg>`
  }
];

const shinyCharacters = characters.map(character => {
  const match = String(character.chance).match(/^(\d+)-(\d+)$/);
  const shinyChance = match ? `${match[1]}-${Number(match[2]) * 10}` : character.chance;
  // Shiny coins are 2x the normal character coin value
  const shinyCoins = (character.coins || 0) * 2;
  return {
    ...character,
    id: `${character.id}-shiny`,
    name: `Shiny ${character.name}`,
    chance: shinyChance,
    weight: (character.weight || 0) / 10,
    coins: shinyCoins,
    shiny: true,
    icon: String(character.icon).replace('<svg', '<svg class="shiny-svg"')
  };
});
const allCharacters = [...characters, ...shinyCharacters];

function getRollSpeedMs() {
  return rollSpeedMsByTier[upgrades.rollSpeedTier] || 2500;
}

let isRolling = false;

const rolledCharacters = {};
let rollCount = 0;
let coinTotal = 0;

const coinCountButton = document.getElementById('coinCountButton');
const rareRollCountButton = document.getElementById('rareRollCountButton');
const rollSpeedDisplay = document.getElementById('rollSpeedDisplay');

function updateRollSpeedUI() {
  if (!rollSpeedDisplay) return;
  const seconds = (getRollSpeedMs() / 1000).toFixed(1);
  rollSpeedDisplay.textContent = `Roll speed: ${seconds}s`;
}

function updateRareRollCount() {
  if (!rareRollCountButton) return;
  const rarest = Object.keys(rolledCharacters).reduce((best, characterId) => {
    const character = allCharacters.find(c => c.id === characterId);
    if (!character) return best;
    const weight = typeof character.weight === 'number' && character.weight > 0 ? character.weight : 1;
    if (!best || weight < best.weight) {
      return { character, weight };
    }
    return best;
  }, null);

  if (!rarest) {
    rareRollCountButton.textContent = 'Rarest rolled: none';
    return;
  }

  rareRollCountButton.textContent = `Rarest rolled: ${rarest.character.name} (${rarest.character.chance})`;
}

function updateRollCount() {
  rollCountButton.textContent = `Roll count: ${rollCount}`;
  updateRareRollCount();
  updateRollSpeedUI();
  updateLuckCount();
}

function updateCoinCount() {
  if (coinCountButton) coinCountButton.textContent = `Coins: ${coinTotal}`;
  updateDiamondCount();
  updateInventoryNotification();
  updateLuckCount();
}

function updateDiamondCount() {
  if (!diamondCountButton) return;
  diamondCountButton.textContent = `Diamonds: ${diamondTotal}`;
}

function updateGemCount() {
  if (!gemCountButton) return;
  gemCountButton.textContent = `Gems: ${gemTotal}`;
}

function getEquippedSecretLuckBonus() {
  if (!upgrades.diamondSecretLuckTier) return 0;
  return Math.min(equippedSecrets.length, upgrades.diamondSecretLuckTier) * 0.05;
}

function getSecretLuckBonus() {
  const base = secretLuckTiers[upgrades.secretLuckTier] || 0;
  return base + getEquippedSecretLuckBonus();
}

function updateSecretLuckCount() {
  if (!secretLuckCountButton) return;
  const secretLuckPercent = Math.round(getSecretLuckBonus() * 100);
  secretLuckCountButton.textContent = `Secret Luck: ${secretLuckPercent}%`;
}

function updateLuckCount() {
  if (!luckCountButton) return;
  const luckPercent = Math.round(getCurrentLuckBonus() * 100);
  luckCountButton.textContent = `Luck: ${luckPercent}%`;
  updateSecretLuckCount();
}

function getDiamondValue(character) {
  const values = {
    Common: 1,
    Uncommon: 2,
    Rare: 3,
    Epic: 5,
    Legendary: 7,
    Secret: 10
  };
  const base = values[character.tier] || 1;
  return base * (character.shiny ? 2 : 1);
}

function isSecretCharacter(character) {
  return String(character.tier || '').toLowerCase() === 'secret';
}

function cleanupEquippedSecrets() {
  equippedSecrets = equippedSecrets.filter(id => {
    const character = allCharacters.find(c => c.id === id);
    return character && isSecretCharacter(character) && (rolledCharacters[id] || 0) > 0;
  });
}

function getTeamLuckBonus() {
  return equippedSecrets.reduce((total, id) => {
    const character = allCharacters.find(c => c.id === id);
    if (!character) return total;
    return total + (character.shiny ? 0.5 : 0.25);
  }, 0);
}

function getCurrentLuckBonus() {
  const luckTierBonus = upgrades.luckTier ? luckTiers[upgrades.luckTier] || 0 : 0;
  const teamLuckBonus = getTeamLuckBonus();
  const potionLuckMultiplier = isPotionActive('luck') ? 2 : 1;
  const goldenMultiplier = goldenRollActive ? 4 : 1;
  const rebirthMultiplier = rebirthMultipliers[rebirthCount] || 1;
  return ((((luckTierBonus + teamLuckBonus) * potionLuckMultiplier) + adminLuckBoost) * goldenMultiplier) * rebirthMultiplier;
}

function toggleEquipSecret(character) {
  if (!character || !isSecretCharacter(character)) return;
  const id = character.id;
  const owned = rolledCharacters[id] || 0;
  if (!owned) {
    alert('You need to own this secret before equipping it.');
    return;
  }

  const equippedIndex = equippedSecrets.indexOf(id);
  if (equippedIndex >= 0) {
    equippedSecrets.splice(equippedIndex, 1);
    saveState();
    renderInventoryMenu();
    return;
  }

  if (equippedSecrets.length >= teamEquipSlots) {
    alert(`You can only equip ${teamEquipSlots} secret${teamEquipSlots === 1 ? '' : 's'} right now.`);
    return;
  }

  equippedSecrets.push(id);
  saveState();
  updateLuckCount();
  renderInventoryMenu();
}

function getTeamSlotLabel() {
  if (teamEquipSlots >= MAX_TEAM_EQUIP_SLOTS) return 'Team is at maximum capacity';
  return `Buy next team slot (${teamEquipSlots + 1}/${MAX_TEAM_EQUIP_SLOTS}) — ${TEAM_EQUIP_SLOT_COST} diamonds`;
}

function buyTeamSlot() {
  if (teamEquipSlots >= MAX_TEAM_EQUIP_SLOTS) {
    alert('Team is already at maximum capacity.');
    return;
  }
  if (diamondTotal < TEAM_EQUIP_SLOT_COST) {
    alert('Not enough diamonds.');
    return;
  }
  diamondTotal -= TEAM_EQUIP_SLOT_COST;
  teamEquipSlots += 1;
  saveState();
  updateDiamondCount();
  updateLuckCount();
  renderInventoryMenu();
}

function getPendingUnlockCount() {
  return Object.keys(rolledCharacters).reduce((count, id) => {
    return count + ((rolledCharacters[id] > 0 && !claimedCharacters[id]) ? 1 : 0);
  }, 0);
}

function canRebirthNow() {
  const current = rebirthCount;
  const next = Math.min(rebirthLimit, current + 1);
  const nextCost = rebirthCosts[next] || 0;
  return current < rebirthLimit && coinTotal >= nextCost;
}

function updateInventoryNotification() {
  if (!indexButton) return;
  const pendingUnlocks = getPendingUnlockCount() > 0;
  indexButton.classList.toggle('has-notification', pendingUnlocks || canRebirthNow());
}

function updateIndexTabButtons() {
  if (indexTabNormalButton) indexTabNormalButton.classList.toggle('active', currentIndexTab === 'normal');
  if (indexTabShinyButton) indexTabShinyButton.classList.toggle('active', currentIndexTab === 'shiny');
}

function updateInventoryTabButtons() {
  if (inventoryTabNormalButton) inventoryTabNormalButton.classList.toggle('active', currentInventoryTab === 'normal');
  if (inventoryTabShinyButton) inventoryTabShinyButton.classList.toggle('active', currentInventoryTab === 'shiny');
  if (inventoryTabTeamButton) inventoryTabTeamButton.classList.toggle('active', currentInventoryTab === 'team');
}

function setIndexTab(tab) {
  currentIndexTab = tab;
  updateIndexTabButtons();
  if (indexMenu && !indexMenu.classList.contains('hidden')) {
    renderIndexMenu();
  }
}

function setInventoryTab(tab) {
  currentInventoryTab = tab;
  updateInventoryTabButtons();
  if (inventoryMenu && !inventoryMenu.classList.contains('hidden')) {
    renderInventoryMenu();
  }
}

function isPermanentSecretId(id) {
  return /^(?:cat-secrett|riegelog|erena|avokado)/i.test(String(id));
}

function renderIndexMenu() {
  indexList.innerHTML = '';
  const visibleEntries = allCharacters.filter(character => currentIndexTab === 'shiny' ? !!character.shiny : !character.shiny);
  const rarityOrder = {
    Common: 0,
    Uncommon: 1,
    Rare: 2,
    Epic: 3,
    Legendary: 4,
    Secret: 5
  };

  if (!visibleEntries.length) {
    const empty = document.createElement('div');
    empty.className = 'index-empty';
    empty.textContent = 'No characters available.';
    indexList.appendChild(empty);
    return;
  }

  visibleEntries.sort((a, b) => {
    const tierA = rarityOrder[a.tier] ?? 0;
    const tierB = rarityOrder[b.tier] ?? 0;
    if (tierA !== tierB) return tierA - tierB;
    return (b.weight || 0) - (a.weight || 0);
  });

  visibleEntries.forEach(character => {
    const owned = rolledCharacters[character.id] || 0;
    const unlocked = owned > 0;
    const canClaim = unlocked && !claimedCharacters[character.id];
    const countLabel = unlocked ? `Rolled ${owned} time${owned === 1 ? '' : 's'}` : 'Not unlocked yet';

    const item = document.createElement('div');
    item.className = `index-item${character.shiny ? ' shiny' : ''}${!unlocked ? ' locked' : ''}`;

    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'item-icon';
    if (character.id === 'avokado-secret-1-16666') {
      iconWrapper.classList.add('avokado-icon-wrapper');
    }
    iconWrapper.innerHTML = character.icon;

    const info = document.createElement('div');
    info.className = 'item-info';
    info.innerHTML = `
      <div class="item-name">${character.name}</div>
      <div class="item-meta">${character.tier} • ${character.chance}</div>
      <div class="item-count">${countLabel}</div>
    `;

    const actions = document.createElement('div');
    actions.className = 'item-actions';
    const viewBtn = document.createElement('button');
    viewBtn.type = 'button';
    viewBtn.className = 'view-button';
    viewBtn.dataset.id = character.id;
    viewBtn.textContent = unlocked ? 'View' : 'Preview';
    viewBtn.addEventListener('click', () => openPreview(character));
    actions.appendChild(viewBtn);

    if (canClaim) {
      const claimBtn = document.createElement('button');
      claimBtn.type = 'button';
      claimBtn.className = 'claim-button';
      claimBtn.dataset.id = character.id;
      claimBtn.textContent = `Claim ${getDiamondValue(character)} ♦`;
      claimBtn.addEventListener('click', () => claimDiamond(character));
      actions.appendChild(claimBtn);
    }

    item.appendChild(iconWrapper);
    item.appendChild(info);
    item.appendChild(actions);
    indexList.appendChild(item);
  });
}

function claimDiamond(character) {
  if (!character || !rolledCharacters[character.id]) return;
  if (claimedCharacters[character.id]) return;
  const amount = getDiamondValue(character);
  diamondTotal += amount;
  claimedCharacters[character.id] = true;
  updateDiamondCount();
  updateInventoryNotification();
  saveState();
  showPopup(`Claimed ${amount} diamonds for unlocking ${character.name}!`, 3000);
  renderIndexMenu();
}

function renderInventoryMenu() {
  inventoryList.innerHTML = '';

  if (currentInventoryTab === 'team') {
    cleanupEquippedSecrets();
    const secretOwned = allCharacters.filter(character => isSecretCharacter(character) && rolledCharacters[character.id] > 0);

    const header = document.createElement('div');
    header.className = 'item-meta';
    header.textContent = `Equipped secrets: ${equippedSecrets.length} / ${teamEquipSlots}`;
    inventoryList.appendChild(header);

    const infoNotice = document.createElement('div');
    infoNotice.className = 'item-meta';
    infoNotice.textContent = 'Buy additional team slots and secret equip luck upgrades in the Diamond Shop.';
    inventoryList.appendChild(infoNotice);

    if (!secretOwned.length) {
      const empty = document.createElement('div');
      empty.className = 'index-empty';
      empty.textContent = 'No secret RNGs in inventory yet. Roll until you get one.';
      inventoryList.appendChild(empty);
      return;
    }

    secretOwned.sort((a, b) => (rolledCharacters[b.id] || 0) - (rolledCharacters[a.id] || 0));
    secretOwned.forEach(character => {
      const equipped = equippedSecrets.includes(character.id);
      const item = document.createElement('div');
      item.className = `index-item${character.shiny ? ' shiny' : ''}`;
      item.innerHTML = `
        <div class="item-icon">${character.icon}</div>
        <div class="item-info">
          <div class="item-name">${character.name}</div>
          <div class="item-meta">${character.tier} • ${character.chance}</div>
          <div class="item-count">Rolled ${rolledCharacters[character.id]} time${rolledCharacters[character.id] === 1 ? '' : 's'}</div>
        </div>
        <div class="item-actions">
          <button class="view-button" data-id="${character.id}">View</button>
          <button class="equip-button" data-id="${character.id}">${equipped ? 'Unequip' : 'Equip'}</button>
        </div>
      `;
      inventoryList.appendChild(item);
      const viewBtn = item.querySelector('.view-button');
      const equipBtn = item.querySelector('.equip-button');
      if (viewBtn) viewBtn.addEventListener('click', () => openPreview(character));
      if (equipBtn) {
        equipBtn.disabled = !equipped && equippedSecrets.length >= teamEquipSlots;
        equipBtn.addEventListener('click', () => toggleEquipSecret(character));
      }
    });
    return;
  }

  const ownedEntries = allCharacters.filter(character => rolledCharacters[character.id] && (currentInventoryTab === 'shiny' ? !!character.shiny : !character.shiny));

  if (!ownedEntries.length) {
    const emptyLabel = currentInventoryTab === 'shiny'
      ? 'No shiny RNGs in inventory yet. Roll until you get one.'
      : 'No RNGs in inventory yet. Roll to add them.';
    inventoryList.innerHTML = `<div class="index-empty">${emptyLabel}</div>`;
    return;
  }

  ownedEntries.sort((a, b) => (rolledCharacters[b.id] || 0) - (rolledCharacters[a.id] || 0));
  ownedEntries.forEach(character => {
    const owned = rolledCharacters[character.id] || 0;
    const item = document.createElement('div');
    item.className = `index-item${character.shiny ? ' shiny' : ''}`;
    item.innerHTML = `
      <div class="item-icon">${character.icon}</div>
      <div class="item-info">
        <div class="item-name">${character.name}</div>
        <div class="item-meta">${character.tier} • ${character.chance}</div>
        <div class="item-count">Rolled ${owned} time${owned === 1 ? '' : 's'}</div>
      </div>
      <div class="item-actions">
        <button class="view-button" data-id="${character.id}">View</button>
        ${isPermanentSecretId(character.id) ? '<button class="sell-button" disabled>Cannot sell</button>' : `<button class="sell-button" data-id="${character.id}">Sell</button>`}
      </div>
    `;

    inventoryList.appendChild(item);
    const viewBtn = item.querySelector('.view-button');
    const sellBtn = item.querySelector('.sell-button');
    if (viewBtn) viewBtn.addEventListener('click', () => openPreview(character));
    if (sellBtn && !isPermanentSecretId(character.id)) sellBtn.addEventListener('click', () => sellCharacter(character));
  });
}

function sellCharacter(character) {
  const id = character.id;
  const owned = rolledCharacters[id] || 0;
  if (!owned) {
    alert('You have none to sell.');
    return;
  }
  const qtyStr = prompt(`Enter quantity to sell (1 - ${owned}):`, String(owned));
  if (qtyStr === null) return;
  const qty = Math.max(0, Math.floor(Number(qtyStr) || 0));
  if (!qty || qty < 1 || qty > owned) {
    alert('Invalid quantity');
    return;
  }
  if (isPermanentSecretId(character.id)) {
    alert('This item cannot be sold.');
    return;
  }

  // Use base (non-shiny) coin value when selling shiny characters
  let baseCoins = character.coins || 0;
  if (character.shiny) {
    const baseId = String(character.id).replace(/-shiny$/i, '');
    const baseName = String(character.name).replace(/^shiny\s+/i, '').trim().toLowerCase();
    const base = allCharacters.find(c => !c.shiny && (String(c.id).toLowerCase() === baseId.toLowerCase() || (c.name && c.name.toLowerCase() === baseName)));
    if (base && typeof base.coins === 'number') {
      baseCoins = base.coins;
    } else {
      // fallback: try common shiny multipliers (first 10x then 5x)
      if (baseCoins >= 10 && baseCoins % 10 === 0) {
        baseCoins = baseCoins / 10;
      } else if (baseCoins >= 5 && baseCoins % 5 === 0) {
        baseCoins = baseCoins / 5;
      }
    }
  }
  const perItem = Math.floor(baseCoins * (character.shiny ? 3 : 0.5));
  const total = perItem * qty;
  const confirmMsg = `Are you sure you want to sell: ${qty}x ${character.name}?\nYou will receive ${total} coin${total === 1 ? '' : 's'}.`;
  if (!confirm(confirmMsg)) return;

  rolledCharacters[id] = Math.max(0, owned - qty);
  if (rolledCharacters[id] === 0) delete rolledCharacters[id];
  coinTotal += total;
  updateCoinCount();
  renderIndexMenu();
  saveState();
}

// Preview modal functions
function openPreview(character) {
  const modal = document.getElementById('previewModal');
  const body = document.getElementById('previewBody');
  const title = document.getElementById('previewTitle');
  if (!modal || !body || !title) return;
  title.textContent = `${character.name} • ${character.tier}`;
  const previewEarned = isPermanentSecretId(character.id)
    ? (character.coins || 0)
    : Math.floor((character.coins || 0) * (character.shiny ? 2 : 1));
  body.innerHTML = `
    <div class="preview-icon">${character.icon}</div>
    <div class="result-meta">${character.tier} • ${character.chance}</div>
    <div class="result-meta">Earned ${previewEarned} coin${previewEarned === 1 ? '' : 's'}!</div>
  `;
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

function closePreview() {
  const modal = document.getElementById('previewModal');
  const body = document.getElementById('previewBody');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  if (body) body.innerHTML = '';
}

function openUpgradeMenu() {
  if (!upgradeMenu) return;
  upgradeMenu.classList.remove('hidden');
  upgradeMenu.setAttribute('aria-hidden', 'false');
  updateUpgradeUI();
}

function closeUpgradeMenu() {
  if (!upgradeMenu) return;
  upgradeMenu.classList.add('hidden');
  upgradeMenu.setAttribute('aria-hidden', 'true');
}

function openDiamondShopMenu() {
  if (!diamondShopMenu) return;
  updateDiamondShopUI();
  diamondShopMenu.classList.remove('hidden');
  diamondShopMenu.setAttribute('aria-hidden', 'false');
}

function closeDiamondShopMenu() {
  if (!diamondShopMenu) return;
  diamondShopMenu.classList.add('hidden');
  diamondShopMenu.setAttribute('aria-hidden', 'true');
}

function updateDiamondShopUI() {
  if (diamondShopEquippedCount) diamondShopEquippedCount.textContent = String(equippedSecrets.length);
  if (diamondShopSlotCount) diamondShopSlotCount.textContent = String(teamEquipSlots);
  if (buyTeamSlotButton) {
    buyTeamSlotButton.disabled = teamEquipSlots >= MAX_TEAM_EQUIP_SLOTS || diamondTotal < TEAM_EQUIP_SLOT_COST;
    buyTeamSlotButton.textContent = teamEquipSlots >= MAX_TEAM_EQUIP_SLOTS ? 'Max slots' : `Buy ${TEAM_EQUIP_SLOT_COST}`;
  }
  if (buyDiamondSecretLuck1Button) {
    buyDiamondSecretLuck1Button.disabled = !canBuyTier(upgrades.diamondSecretLuckTier, 1) || diamondTotal < diamondEquipSecretLuckCosts[1];
    buyDiamondSecretLuck1Button.textContent = upgrades.diamondSecretLuckTier >= 1 ? 'Owned' : `Buy ${diamondEquipSecretLuckCosts[1]}`;
  }
  if (buyDiamondSecretLuck2Button) {
    buyDiamondSecretLuck2Button.disabled = !canBuyTier(upgrades.diamondSecretLuckTier, 2) || diamondTotal < diamondEquipSecretLuckCosts[2];
    buyDiamondSecretLuck2Button.textContent = upgrades.diamondSecretLuckTier >= 2 ? 'Owned' : `Buy ${diamondEquipSecretLuckCosts[2]}`;
  }
  if (buyDiamondSecretLuck3Button) {
    buyDiamondSecretLuck3Button.disabled = !canBuyTier(upgrades.diamondSecretLuckTier, 3) || diamondTotal < diamondEquipSecretLuckCosts[3];
    buyDiamondSecretLuck3Button.textContent = upgrades.diamondSecretLuckTier >= 3 ? 'Owned' : `Buy ${diamondEquipSecretLuckCosts[3]}`;
  }
}

function buyDiamondSecretLuckTier(tier) {
  if (upgrades.diamondSecretLuckTier >= tier) { alert('You already own this tier or higher'); return; }
  if (!canBuyTier(upgrades.diamondSecretLuckTier, tier)) { alert('You must purchase the previous diamond secret luck tier first.'); return; }
  const cost = diamondEquipSecretLuckCosts[tier] || 0;
  if (diamondTotal < cost) { alert('Not enough diamonds'); return; }
  diamondTotal -= cost;
  upgrades.diamondSecretLuckTier = tier;
  updateDiamondCount();
  updateDiamondShopUI();
  updateSecretLuckCount();
  saveState();
}

function findCharacterByNameOrId(name) {
  const normalized = String(name).trim().toLowerCase();
  return allCharacters.find(character => {
    const id = character.id.toLowerCase();
    const label = character.name.toLowerCase();
    return id === normalized || label === normalized || id.includes(normalized) || label.includes(normalized);
  });
}

function createAdminCharacter(name, shiny = false) {
  const label = String(name).trim();
  const hasShinyPrefix = /^\s*shiny\s+/i.test(label);
  const displayName = shiny || hasShinyPrefix ? `Shiny ${label.replace(/^\s*shiny\s+/i, '').trim()}` : label;
  const id = `admin-${displayName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const safeLabel = displayName.slice(0, 12).replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const icon = `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="120" rx="20" ry="20" fill="${shiny || hasShinyPrefix ? '#eab308' : '#2563eb'}"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="20" font-weight="700" fill="#fff">${safeLabel}</text></svg>`;
  const character = {
    id,
    name: displayName,
    tier: shiny || hasShinyPrefix ? 'Shiny' : 'Admin',
    chance: 'admin',
    weight: 1 / 1000,
    coins: 0,
    shiny: shiny || hasShinyPrefix,
    icon: shiny || hasShinyPrefix ? icon.replace('<svg', '<svg class="shiny-svg"') : icon
  };
  characters.push(character);
  allCharacters.push(character);
  return character;
}

function openAdminMenu() {
  if (!adminMenu) return;
  adminMenu.classList.remove('hidden');
  adminMenu.setAttribute('aria-hidden', 'false');
}

function closeAdminMenu() {
  if (!adminMenu) return;
  adminMenu.classList.add('hidden');
  adminMenu.setAttribute('aria-hidden', 'true');
}

function promptAdminPassword() {
  const password = prompt('Enter admin password:');
  if (password === null) return;
  if (password === 'Julian2608') {
    openAdminMenu();
  } else {
    alert('Incorrect admin password.');
  }
}

function applyAdminChanges() {
  const name = adminRngNameInput ? adminRngNameInput.value.trim() : '';
  const qty = adminRngQtyInput ? Math.max(1, Math.floor(Number(adminRngQtyInput.value) || 1)) : 1;
  const coins = adminCoinAmountInput ? Math.max(0, Math.floor(Number(adminCoinAmountInput.value) || 0)) : 0;
  const luckValue = adminLuckBoostInput && adminLuckBoostInput.value.trim() !== ''
    ? Number(adminLuckBoostInput.value)
    : NaN;
  const rebirths = adminRebirthCountInput ? Math.max(0, Math.floor(Number(adminRebirthCountInput.value) || 0)) : 0;
  const luckPotions = adminLuckPotionAmountInput ? Math.max(0, Math.floor(Number(adminLuckPotionAmountInput.value) || 0)) : 0;
  const coinPotions = adminCoinPotionAmountInput ? Math.max(0, Math.floor(Number(adminCoinPotionAmountInput.value) || 0)) : 0;
  const shinyPotions = adminShinyPotionAmountInput ? Math.max(0, Math.floor(Number(adminShinyPotionAmountInput.value) || 0)) : 0;
  const actions = [];

  if (name) {
    const isShinyRequest = /^\s*shiny\s+/i.test(name);
    const baseName = isShinyRequest ? name.replace(/^\s*shiny\s+/i, '').trim() : name;
    let character = findCharacterByNameOrId(baseName);
    if (character && isShinyRequest) {
      const shinyTarget = allCharacters.find(c => c.shiny && c.name.toLowerCase() === `shiny ${character.name.toLowerCase()}`);
      if (shinyTarget) {
        character = shinyTarget;
      } else {
          const base = character;
          character = {
            ...base,
            id: `${base.id}-shiny-admin`,
            name: `Shiny ${base.name}`,
            chance: base.chance,
            weight: (base.weight || 0) / 10,
            coins: (base.coins || 0),
            shiny: true,
            icon: String(base.icon).replace('<svg', '<svg class="shiny-svg"')
          };
        allCharacters.push(character);
      }
    }
    if (!character) {
      character = createAdminCharacter(name, isShinyRequest);
      actions.push(`Created custom RNG ${name}`);
    }
    rolledCharacters[character.id] = (rolledCharacters[character.id] || 0) + qty;
    actions.push(`Added ${qty}x ${character.name}`);
  }

  if (coins > 0) {
    coinTotal += coins;
    actions.push(`Added ${coins} coins`);
  }

  if (rebirths > 0) {
    rebirthCount += rebirths;
    actions.push(`Added ${rebirths} rebirth${rebirths === 1 ? '' : 's'}`);
  }

  if (luckPotions > 0) {
    potions.luck += luckPotions;
    actions.push(`Added ${luckPotions} luck potion${luckPotions === 1 ? '' : 's'}`);
  }

  if (coinPotions > 0) {
    potions.coin += coinPotions;
    actions.push(`Added ${coinPotions} coin potion${coinPotions === 1 ? '' : 's'}`);
  }

  if (shinyPotions > 0) {
    potions.shiny += shinyPotions;
    actions.push(`Added ${shinyPotions} shiny potion${shinyPotions === 1 ? '' : 's'}`);
  }

  if (!Number.isNaN(luckValue)) {
    adminLuckBoost = luckValue / 100;
    if (adminLuckBoostInput) adminLuckBoostInput.value = String(luckValue);
    actions.push(`Set admin luck to ${luckValue}%`);
  }

  if (!actions.length) {
    alert('Enter an RNG name or a coins/luck value to apply.');
    return;
  }

  updateCoinCount();
  renderIndexMenu();
  updateUpgradeUI();
  updatePotionUI();
  updateRebirthUI();
  saveState();
  alert('Admin applied: ' + actions.join(', '));
}

function resetAdminLuck() {
  adminLuckBoost = 0;
  if (adminLuckBoostInput) adminLuckBoostInput.value = '0';
  saveState();
  alert('Admin luck boost reset.');
}

function ensureAutoRollToggle() {
  if (!upgrades.autoRoll || !autoRollContainer) return;
  if (document.getElementById('autoRollToggle')) return;
  const btn = document.createElement('button');
  btn.id = 'autoRollToggle';
  btn.className = 'secondary-button';
  btn.textContent = 'Auto Roll: Off';
  btn.addEventListener('click', () => {
    toggleAutoRoll(btn);
  });
  autoRollContainer.appendChild(btn);
}

function isPotionActive(type) {
  return activePotionExpiry[type] && Date.now() < activePotionExpiry[type];
}

function updatePotionUI() {
  const luckBtn = document.getElementById('useLuckPotionButton');
  const coinBtn = document.getElementById('useCoinPotionButton');
  const shinyBtn = document.getElementById('useShinyPotionButton');
  if (luckBtn) {
    let txt = `Luck Potions: ${potions.luck}` + (isPotionActive('luck') ? ' (Active)' : '');
    if (isPotionActive('luck')) {
      const rem = activePotionExpiry.luck - Date.now();
      txt += ` - ${formatTimeRemaining(rem)}`;
    }
    luckBtn.textContent = txt;
  }
  if (coinBtn) {
    let txt = `Coin Potions: ${potions.coin}` + (isPotionActive('coin') ? ' (Active)' : '');
    if (isPotionActive('coin')) {
      const rem = activePotionExpiry.coin - Date.now();
      txt += ` - ${formatTimeRemaining(rem)}`;
    }
    coinBtn.textContent = txt;
  }
  if (shinyBtn) {
    let txt = `Shiny Potions: ${potions.shiny}` + (isPotionActive('shiny') ? ' (Active)' : '');
    if (isPotionActive('shiny')) {
      const rem = activePotionExpiry.shiny - Date.now();
      txt += ` - ${formatTimeRemaining(rem)}`;
    }
    shinyBtn.textContent = txt;
  }
  const goldenBtn = document.getElementById('goldenDiceButton');
  if (goldenBtn) {
    if (goldenRollActive) {
      goldenBtn.textContent = 'Golden Dice: NOW';
    } else if (goldenPending || (typeof goldenDiceCounter === 'number' && goldenDiceCounter === 0)) {
      goldenBtn.textContent = `Golden Dice: 0`;
    } else {
      goldenBtn.textContent = `Golden Dice: ${goldenDiceCounter}`;
    }
    goldenBtn.classList.toggle('golden-ready', goldenPending && !goldenRollActive);
  }
  updateLuckCount();
}

function formatTimeRemaining(ms) {
  if (!ms || ms <= 0) return '00:00';
  const total = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(total / 60).toString().padStart(2, '0');
  const seconds = (total % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function startPotionTimer() {
  if (potionTimerIntervalId) return;
  potionTimerIntervalId = setInterval(() => {
    updatePotionUI();
    // if neither potion active, stop the interval
    if (!isPotionActive('luck') && !isPotionActive('coin') && !isPotionActive('shiny')) {
      stopPotionTimer();
    }
  }, 1000);
}

function stopPotionTimer() {
  if (potionTimerIntervalId) {
    clearInterval(potionTimerIntervalId);
    potionTimerIntervalId = null;
  }
}

function playPotionDropSound(type) {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioCtx.currentTime;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type === 'luck' ? 'triangle' : 'square';
    o.frequency.setValueAtTime(type === 'luck' ? 780 : 420, now);
    g.gain.setValueAtTime(0.18, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start(now);
    o.stop(now + 0.18);
  } catch (e) { /* ignore audio errors */ }
}

// Non-blocking popup/toast used instead of alert() so UI doesn't freeze
function showPopup(message, duration = 3000) {
  try {
    const existing = document.getElementById('nonBlockingPopup');
    if (existing) {
      // replace text and restart timer
      existing.textContent = message;
      existing.classList.remove('hide');
      clearTimeout(existing._timeoutId);
      existing._timeoutId = setTimeout(() => existing.classList.add('hide'), duration);
      return;
    }
    const el = document.createElement('div');
    el.id = 'nonBlockingPopup';
    el.className = 'nonblocking-popup';
    el.textContent = message;
    document.body.appendChild(el);
    // auto-hide
    el._timeoutId = setTimeout(() => el.classList.add('hide'), duration);
    // remove after transition
    el.addEventListener('transitionend', () => {
      if (el.classList.contains('hide')) {
        try { el.remove(); } catch (e) { /* ignore */ }
      }
    });
  } catch (e) { console.warn('Popup failed', e); }
}

function playGoldenSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioCtx.currentTime;
    const o1 = audioCtx.createOscillator();
    const g1 = audioCtx.createGain();
    o1.type = 'sine';
    o1.frequency.setValueAtTime(880, now);
    g1.gain.setValueAtTime(0.22, now);
    g1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    o1.connect(g1);
    g1.connect(audioCtx.destination);
    o1.start(now);
    o1.stop(now + 0.6);
  } catch (e) { /* ignore */ }
}

function useLuckPotion() {
  if (potions.luck <= 0) { alert('No luck potions available'); return; }
  potions.luck -= 1;
  const now = Date.now();
  if (activePotionExpiry.luck && activePotionExpiry.luck > now) {
    // extend existing active duration (stacking)
    activePotionExpiry.luck += POTION_DURATION_MS;
  } else {
    activePotionExpiry.luck = now + POTION_DURATION_MS;
  }
  updatePotionUI();
  startPotionTimer();
  saveState();
  const rem = Math.max(0, activePotionExpiry.luck - now);
  showPopup(`Luck potion used: ${formatTimeRemaining(rem)} remaining`, 3000);
}

function useCoinPotion() {
  if (potions.coin <= 0) { alert('No coin potions available'); return; }
  potions.coin -= 1;
  const now = Date.now();
  if (activePotionExpiry.coin && activePotionExpiry.coin > now) {
    // extend existing active duration (stacking)
    activePotionExpiry.coin += POTION_DURATION_MS;
  } else {
    activePotionExpiry.coin = now + POTION_DURATION_MS;
  }
  updatePotionUI();
  startPotionTimer();
  saveState();
  const rem = Math.max(0, activePotionExpiry.coin - now);
  showPopup(`Coin potion used: ${formatTimeRemaining(rem)} remaining`, 3000);
}

function useShinyPotion() {
  if (potions.shiny <= 0) { alert('No shiny potions available'); return; }
  potions.shiny -= 1;
  const now = Date.now();
  if (activePotionExpiry.shiny && activePotionExpiry.shiny > now) {
    activePotionExpiry.shiny += SHINY_POTION_DURATION_MS;
  } else {
    activePotionExpiry.shiny = now + SHINY_POTION_DURATION_MS;
  }
  updatePotionUI();
  startPotionTimer();
  saveState();
  const rem = Math.max(0, activePotionExpiry.shiny - now);
  showPopup(`Shiny potion used: ${formatTimeRemaining(rem)} remaining`, 3000);
}

function toggleAutoRoll(btn) {
  if (!btn) btn = document.getElementById('autoRollToggle');
  if (!btn) return;
  if (autoRollActive) {
    clearInterval(autoRollInterval);
    autoRollInterval = null;
    autoRollActive = false;
    btn.textContent = 'Auto Roll: Off';
  } else {
    autoRollActive = true;
    btn.textContent = 'Auto Roll: On';
    autoRollInterval = setInterval(() => {
      if (!isRolling) startRolling();
    }, getRollSpeedMs());
  }
}

function updateAutoRollInterval() {
  if (!autoRollActive) return;
  if (autoRollInterval) {
    clearInterval(autoRollInterval);
  }
  autoRollInterval = setInterval(() => {
    if (!isRolling) startRolling();
  }, getRollSpeedMs());
}

function resetAdminAccount() {
  coinTotal = 0;
  rollCount = 0;
  adminLuckBoost = 0;
  upgrades.autoRoll = false;
  upgrades.luckTier = 0;
  upgrades.secretLuckTier = 0;
  upgrades.coinTier = 0;
  upgrades.rollSpeedTier = 0;
  upgrades.secondRoll = false;
  upgrades.thirdRoll = false;
  upgrades.diamondSecretLuckTier = 0;
  diamondTotal = 0;
  gemTotal = 0;
  claimedCharacters = {};
  goldenDiceCounter = 10;
  goldenPending = false;
  Object.keys(rolledCharacters).forEach(key => delete rolledCharacters[key]);
  if (autoRollInterval) {
    clearInterval(autoRollInterval);
    autoRollInterval = null;
  }
  autoRollActive = false;
  rebirthCount = 0;
  const toggleBtn = document.getElementById('autoRollToggle');
  if (toggleBtn) toggleBtn.textContent = 'Auto Roll: Off';
  if (adminLuckBoostInput) adminLuckBoostInput.value = '0';
  updateRollCount();
  updateCoinCount();
  renderIndexMenu();
  updateUpgradeUI();
  updateRebirthUI();
  saveState();
  alert('Account has been reset.');
}

function openRebirthMenu() {
  if (!rebirthMenu) return;
  updateRebirthUI();
  rebirthMenu.classList.remove('hidden');
  rebirthMenu.setAttribute('aria-hidden', 'false');
}

function closeRebirthMenu() {
  if (!rebirthMenu) return;
  rebirthMenu.classList.add('hidden');
  rebirthMenu.setAttribute('aria-hidden', 'true');
}

function getRebirthGemCost(count) {
  return rebirthGemCosts[count] || 0;
}

function updateRebirthUI() {
  if (!rebirthInfo) return;
  const current = rebirthCount;
  const curMult = getRebirthMultiplier(current);
  const next = Math.min(rebirthLimit, current + 1);
  const nextMult = getRebirthMultiplier(next);
  const nextCost = rebirthCosts[next] || 0;
  const nextGemCost = getRebirthGemCost(next);
  rebirthInfo.innerHTML = `Current rebirths: ${current} — Boost: ${curMult.toFixed(2)}x<br/>Next rebirth: ${next} — Boost ${nextMult.toFixed(2)}x — Cost ${nextCost} coins + ${nextGemCost} gems`;
  if (doRebirthButton) doRebirthButton.disabled = current >= rebirthLimit || coinTotal < nextCost || gemTotal < nextGemCost;
  updateInventoryNotification();
}

function doRebirth() {
  const current = rebirthCount;
  const next = Math.min(rebirthLimit, current + 1);
  if (next <= current) { alert('Max rebirths reached'); return; }
  const cost = rebirthCosts[next] || 0;
  const gemCost = getRebirthGemCost(next);
  if (coinTotal < cost) { alert('Not enough coins for rebirth'); return; }
  if (gemTotal < gemCost) { alert('Not enough gems for rebirth'); return; }
  if (!confirm(`Are you sure you want to rebirth for ${cost} coins and ${gemCost} gems? This will reset your account but grant the rebirth boost.`)) return;
  // charge cost then increment rebirth count
  coinTotal = 0;
  gemTotal -= gemCost;
  rebirthCount = next;
  // reset account state as requested
  rollCount = 0;
  Object.keys(rolledCharacters).forEach(k => {
    if (!isPermanentSecretId(k)) delete rolledCharacters[k];
  });
  upgrades.autoRoll = false;
  upgrades.luckTier = 0;
  upgrades.secretLuckTier = 0;
  upgrades.coinTier = 0;
  upgrades.rollSpeedTier = 0;
  upgrades.secondRoll = false;
  upgrades.thirdRoll = false;
  potions.luck = 0;
  potions.coin = 0;
  activePotionExpiry.luck = 0;
  activePotionExpiry.coin = 0;
  diamondTotal = 0;
  claimedCharacters = {};
  goldenDiceCounter = 10;
  goldenPending = false;
  updateGemCount();
  updateDiamondCount();
  updateRollCount();
  updateCoinCount();
  updateInventoryNotification();
  updateRebirthUI();
  updateDiamondShopUI();
  updateSecretLuckCount();
  if (autoRollInterval) { clearInterval(autoRollInterval); autoRollInterval = null; }
  autoRollActive = false;
  const toggleBtn = document.getElementById('autoRollToggle');
  if (toggleBtn) toggleBtn.textContent = 'Auto Roll: Off';
  updateRollCount();
  updateCoinCount();
  renderIndexMenu();
  updateUpgradeUI();
  updateRebirthUI();
  saveState();
  alert('Rebirth complete. Your account has been reset and the rebirth boost applied.');
}

function canBuyTier(currentTier, targetTier) {
  if (currentTier >= targetTier) return false;
  if (targetTier > 1 && currentTier < targetTier - 1) return false;
  return true;
}

function updateUpgradeUI() {
  if (buyAutoRollButton) {
    buyAutoRollButton.disabled = upgrades.autoRoll || coinTotal < autoRollCost;
    buyAutoRollButton.textContent = upgrades.autoRoll ? 'Owned' : `Buy ${autoRollCost}`;
  }
  if (buyLuck1Button) {
    buyLuck1Button.disabled = !canBuyTier(upgrades.luckTier, 1) || coinTotal < luckCosts[1];
    buyLuck1Button.textContent = upgrades.luckTier >= 1 ? 'Owned' : `Buy ${luckCosts[1]}`;
  }
  if (buyLuck2Button) {
    buyLuck2Button.disabled = !canBuyTier(upgrades.luckTier, 2) || coinTotal < luckCosts[2];
    buyLuck2Button.textContent = upgrades.luckTier >= 2 ? 'Owned' : `Buy ${luckCosts[2]}`;
  }
  if (buyLuck3Button) {
    buyLuck3Button.disabled = !canBuyTier(upgrades.luckTier, 3) || coinTotal < luckCosts[3];
    buyLuck3Button.textContent = upgrades.luckTier >= 3 ? 'Owned' : `Buy ${luckCosts[3]}`;
  }
  if (buyLuck4Button) {
    buyLuck4Button.disabled = !canBuyTier(upgrades.luckTier, 4) || coinTotal < luckCosts[4];
    buyLuck4Button.textContent = upgrades.luckTier >= 4 ? 'Owned' : `Buy ${luckCosts[4]}`;
  }
  if (buyLuck5Button) {
    buyLuck5Button.disabled = !canBuyTier(upgrades.luckTier, 5) || coinTotal < luckCosts[5];
    buyLuck5Button.textContent = upgrades.luckTier >= 5 ? 'Owned' : `Buy ${luckCosts[5]}`;
  }
  if (buyLuck6Button) {
    buyLuck6Button.disabled = !canBuyTier(upgrades.luckTier, 6) || coinTotal < luckCosts[6];
    buyLuck6Button.textContent = upgrades.luckTier >= 6 ? 'Owned' : `Buy ${luckCosts[6]}`;
  }
  if (buyCoin1Button) {
    buyCoin1Button.disabled = !canBuyTier(upgrades.coinTier, 1) || coinTotal < coinBoostCosts[1];
    buyCoin1Button.textContent = upgrades.coinTier >= 1 ? 'Owned' : `Buy ${coinBoostCosts[1]} (Total 50%)`;
  }
  if (buyCoin2Button) {
    buyCoin2Button.disabled = !canBuyTier(upgrades.coinTier, 2) || coinTotal < coinBoostCosts[2];
    buyCoin2Button.textContent = upgrades.coinTier >= 2 ? 'Owned' : `Buy ${coinBoostCosts[2]} (Total 100%)`;
  }
  if (buyCoin3Button) {
    buyCoin3Button.disabled = !canBuyTier(upgrades.coinTier, 3) || coinTotal < coinBoostCosts[3];
    buyCoin3Button.textContent = upgrades.coinTier >= 3 ? 'Owned' : `Buy ${coinBoostCosts[3]} (Total 150%)`;
  }
  if (buyRollSpeed1Button) {
    buyRollSpeed1Button.disabled = !canBuyTier(upgrades.rollSpeedTier, 1) || coinTotal < rollSpeedCosts[1];
    buyRollSpeed1Button.textContent = upgrades.rollSpeedTier >= 1 ? 'Owned' : `Buy ${rollSpeedCosts[1]} (2.0s)`;
  }
  if (buyRollSpeed2Button) {
    buyRollSpeed2Button.disabled = !canBuyTier(upgrades.rollSpeedTier, 2) || coinTotal < rollSpeedCosts[2];
    buyRollSpeed2Button.textContent = upgrades.rollSpeedTier >= 2 ? 'Owned' : `Buy ${rollSpeedCosts[2]} (1.5s)`;
  }
  if (buyRollSpeed3Button) {
    buyRollSpeed3Button.disabled = !canBuyTier(upgrades.rollSpeedTier, 3) || coinTotal < rollSpeedCosts[3];
    buyRollSpeed3Button.textContent = upgrades.rollSpeedTier >= 3 ? 'Owned' : `Buy ${rollSpeedCosts[3]} (1.0s)`;
  }
  
  if (buySecondRollButton) {
    buySecondRollButton.disabled = upgrades.secondRoll || coinTotal < secondRollCost;
    buySecondRollButton.textContent = upgrades.secondRoll ? 'Owned' : `Buy ${secondRollCost}`;
  }
  if (buyThirdRollButton) {
    buyThirdRollButton.disabled = upgrades.thirdRoll || coinTotal < thirdRollCost;
    buyThirdRollButton.textContent = upgrades.thirdRoll ? 'Owned' : `Buy ${thirdRollCost}`;
  }
  if (buySecretLuck1Button) {
    buySecretLuck1Button.disabled = !canBuyTier(upgrades.secretLuckTier, 1) || coinTotal < secretLuckCosts[1];
    buySecretLuck1Button.textContent = upgrades.secretLuckTier >= 1 ? 'Owned' : `Buy ${secretLuckCosts[1]}`;
  }
  if (buySecretLuck2Button) {
    buySecretLuck2Button.disabled = !canBuyTier(upgrades.secretLuckTier, 2) || coinTotal < secretLuckCosts[2];
    buySecretLuck2Button.textContent = upgrades.secretLuckTier >= 2 ? 'Owned' : `Buy ${secretLuckCosts[2]}`;
  }
  if (buySecretLuck3Button) {
    buySecretLuck3Button.disabled = !canBuyTier(upgrades.secretLuckTier, 3) || coinTotal < secretLuckCosts[3];
    buySecretLuck3Button.textContent = upgrades.secretLuckTier >= 3 ? 'Owned' : `Buy ${secretLuckCosts[3]}`;
  }
  if (buySecretLuck4Button) {
    buySecretLuck4Button.disabled = !canBuyTier(upgrades.secretLuckTier, 4) || coinTotal < secretLuckCosts[4];
    buySecretLuck4Button.textContent = upgrades.secretLuckTier >= 4 ? 'Owned' : `Buy ${secretLuckCosts[4]}`;
  }
  if (buySecretLuck5Button) {
    buySecretLuck5Button.disabled = !canBuyTier(upgrades.secretLuckTier, 5) || coinTotal < secretLuckCosts[5];
    buySecretLuck5Button.textContent = upgrades.secretLuckTier >= 5 ? 'Owned' : `Buy ${secretLuckCosts[5]}`;
  }
  // ensure toggle exists if auto-roll purchased
  if (upgrades.autoRoll) ensureAutoRollToggle();
  updatePotionUI();
}

function buyLuckTier(tier) {
  if (upgrades.luckTier >= tier) { alert('You already own this tier or higher'); return; }
  if (!canBuyTier(upgrades.luckTier, tier)) { alert('You must purchase the previous luck tier first.'); return; }
  const cost = luckCosts[tier] || 0;
  if (coinTotal < cost) { alert('Not enough coins'); return; }
  coinTotal -= cost;
  upgrades.luckTier = tier;
  updateCoinCount();
  updateUpgradeUI();
  saveState();
}

function buyCoinBoostTier(tier) {
  if (upgrades.coinTier >= tier) { alert('You already own this tier or higher'); return; }
  if (!canBuyTier(upgrades.coinTier, tier)) { alert('You must purchase the previous coins boost tier first.'); return; }
  const cost = coinBoostCosts[tier] || 0;
  if (coinTotal < cost) { alert('Not enough coins'); return; }
  coinTotal -= cost;
  upgrades.coinTier = tier;
  updateCoinCount();
  updateUpgradeUI();
  saveState();
}

function buyRollSpeedTier(tier) {
  if (upgrades.rollSpeedTier >= tier) { alert('You already own this tier or higher'); return; }
  if (!canBuyTier(upgrades.rollSpeedTier, tier)) { alert('You must purchase the previous roll speed tier first.'); return; }
  const cost = rollSpeedCosts[tier] || 0;
  if (coinTotal < cost) { alert('Not enough coins'); return; }
  coinTotal -= cost;
  upgrades.rollSpeedTier = tier;
  updateCoinCount();
  updateUpgradeUI();
  if (autoRollActive) {
    updateAutoRollInterval();
  }
  saveState();
}

function buySecretLuckTier(tier) {
  if (upgrades.secretLuckTier >= tier) { alert('You already own this tier or higher'); return; }
  if (!canBuyTier(upgrades.secretLuckTier, tier)) { alert('You must purchase the previous secret luck tier first.'); return; }
  const cost = secretLuckCosts[tier] || 0;
  if (coinTotal < cost) { alert('Not enough coins'); return; }
  coinTotal -= cost;
  upgrades.secretLuckTier = tier;
  updateCoinCount();
  updateUpgradeUI();
  saveState();
}

function buySecondRoll() {
  if (upgrades.secondRoll) { alert('Second roll already purchased'); return; }
  if (coinTotal < secondRollCost) { alert('Not enough coins'); return; }
  coinTotal -= secondRollCost;
  upgrades.secondRoll = true;
  updateCoinCount();
  updateUpgradeUI();
  saveState();
}

function buyThirdRoll() {
  if (upgrades.thirdRoll) { alert('Third roll already purchased'); return; }
  if (coinTotal < thirdRollCost) { alert('Not enough coins'); return; }
  coinTotal -= thirdRollCost;
  upgrades.thirdRoll = true;
  updateCoinCount();
  updateUpgradeUI();
  saveState();
}

function buyAutoRoll() {
  if (upgrades.autoRoll) { alert('Auto Roll already purchased'); return; }
  if (coinTotal < autoRollCost) { alert('Not enough coins'); return; }
  coinTotal -= autoRollCost;
  upgrades.autoRoll = true;
  updateCoinCount();
  updateUpgradeUI();
  ensureAutoRollToggle();
  saveState();
}

function weightedRandom(items, opts = {}) {
  // Apply luck boost to rarer tiers by increasing their weights proportionally
  const luckTierBonus = upgrades.luckTier ? luckTiers[upgrades.luckTier] || 0 : 0;
  const secretLuckTierBonus = upgrades.secretLuckTier ? secretLuckTiers[upgrades.secretLuckTier] || 0 : 0;
  const teamLuckBonus = getTeamLuckBonus();
  const potionLuckMultiplier = isPotionActive('luck') ? 2 : 1;
  const goldenMultiplier = typeof opts.goldenMultiplier === 'number' ? opts.goldenMultiplier : (goldenRollActive ? 4 : 1);
  const rebirthMultiplier = rebirthMultipliers[rebirthCount] || 1;
  const luckBonus = ((((luckTierBonus + teamLuckBonus) * potionLuckMultiplier) + adminLuckBoost) * goldenMultiplier) * rebirthMultiplier;
  const tierMultiplier = {
    common: 0,
    uncommon: 0.25,
    rare: 0.6,
    epic: 1.2,
    legendary: 2.4,
    secret: 0
  };

  const adjusted = items.map(item => {
    const base = item.weight;
    const tierKey = (item.tier || '').toLowerCase();
    const factor = tierMultiplier[tierKey] || 0;
    let adj = base * (1 + luckBonus * factor);
    // Apply secret-luck only to the specific secret pet (ids starting with 'cat-secrett')
    if (String(item.id || '').toLowerCase().startsWith('cat-secrett') && secretLuckTierBonus > 0) {
      const effectiveSecretBonus = secretLuckTierBonus * (isPotionActive('luck') ? 2 : 1) * goldenMultiplier * rebirthMultiplier;
      adj = base * (1 + effectiveSecretBonus);
    }
    return { item, adj };
  });

  const totalWeight = adjusted.reduce((s, x) => s + x.adj, 0);
  let random = Math.random() * totalWeight;
  for (const entry of adjusted) {
    random -= entry.adj;
    if (random <= 0) return entry.item;
  }
  return adjusted[adjusted.length - 1].item;
}

function playRollSound() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const now = audioCtx.currentTime;

  const noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.18, audioCtx.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseData.length; i += 1) {
    noiseData[i] = (Math.random() * 2 - 1) * (1 - i / noiseData.length) * 0.65;
  }

  const noiseSource = audioCtx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  const noiseFilter = audioCtx.createBiquadFilter();
  noiseFilter.type = 'highpass';
  noiseFilter.frequency.setValueAtTime(900, now);
  const noiseGain = audioCtx.createGain();
  noiseGain.gain.setValueAtTime(0.35, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.005, now + 0.18);

  noiseSource.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(audioCtx.destination);
  noiseSource.start(now);
  noiseSource.stop(now + 0.18);

  const click = audioCtx.createOscillator();
  const clickGain = audioCtx.createGain();
  click.type = 'triangle';
  click.frequency.setValueAtTime(450, now);
  clickGain.gain.setValueAtTime(0.28, now);
  clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
  click.connect(clickGain);
  clickGain.connect(audioCtx.destination);
  click.start(now);
  click.stop(now + 0.06);

  const tone = audioCtx.createOscillator();
  const toneGain = audioCtx.createGain();
  tone.type = 'sine';
  tone.frequency.setValueAtTime(320, now);
  tone.frequency.exponentialRampToValueAtTime(220, now + 0.18);
  toneGain.gain.setValueAtTime(0.2, now);
  toneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
  tone.connect(toneGain);
  toneGain.connect(audioCtx.destination);
  tone.start(now);
  tone.stop(now + 0.18);
}

// Short reveal sound; stronger for higher tiers
function playRevealSound(tier = '') {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioCtx.currentTime;

    // base bell-like tone
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';

    // adjust frequency and envelope by tier
    let freq = 440; // A4
    let dur = 0.45;
    let gainLevel = 0.22;
    if (/legendary/i.test(tier)) {
      freq = 880;
      dur = 0.85;
      gainLevel = 0.5;
    } else if (/secret/i.test(tier)) {
      freq = 1100;
      dur = 1.0;
      gainLevel = 0.65;
    } else if (/epic/i.test(tier)) {
      freq = 660;
      dur = 0.6;
      gainLevel = 0.32;
    }

    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(gainLevel, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    // optional subtle harmonic for legendary/secret
    if (/legendary|secret/i.test(tier)) {
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 1.5, now);
      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.exponentialRampToValueAtTime(gainLevel * 0.6, now + 0.02);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + dur);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(now);
      osc2.stop(now + dur + 0.02);
    }

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + dur + 0.02);
  } catch (e) {
    // ignore audio errors in older browsers
    console.warn('Audio error', e);
  }
}

function getRollMessage(character) {
  return `You rolled ${character.name}!`;
}

function showCharacterResult(character, earned) {
  const displayEarned = typeof earned === 'number' ? earned : Math.floor((character.coins || 0) * (character.shiny ? 2 : 1));
  resultEl.innerHTML = `
    <div class="result-icon">${character.icon}</div>
    <div class="result-title">${character.name}</div>
    <div class="result-meta">${character.tier} • Chance ${character.chance}</div>
    <div class="result-meta">Earned ${displayEarned} coin${displayEarned === 1 ? '' : 's'}!</div>
  `;
  // brief reveal pulse when the final icon appears
  setTimeout(() => {
    const icon = resultEl.querySelector('.result-icon');
    if (icon) {
      // add tier-specific class for styling
      const tierClass = character.tier ? character.tier.toLowerCase() : '';
      if (tierClass) icon.classList.add(tierClass);
      if (character.shiny) icon.classList.add('shiny');
      icon.classList.add('reveal');
      setTimeout(() => {
        icon.classList.remove('reveal');
        if (tierClass) icon.classList.remove(tierClass);
        if (character.shiny) icon.classList.remove('shiny');
      }, 900);
    }
  }, 60);
}

function showTwoResults(c1, c2, e1, e2) {
  const displayed1 = typeof e1 === 'number' ? e1 : Math.floor((c1.coins || 0) * (c1.shiny ? 2 : 1));
  const displayed2 = typeof e2 === 'number' ? e2 : Math.floor((c2.coins || 0) * (c2.shiny ? 2 : 1));
  resultEl.innerHTML = `
    <div class="two-results">
      <div class="result-block">
        <div class="result-icon">${c1.icon}</div>
        <div class="result-title">${c1.name}</div>
        <div class="result-meta">${c1.tier} • Chance ${c1.chance}</div>
        <div class="result-meta">Earned ${displayed1} coin${displayed1 === 1 ? '' : 's'}!</div>
      </div>
      <div class="result-block">
        <div class="result-icon">${c2.icon}</div>
        <div class="result-title">${c2.name}</div>
        <div class="result-meta">${c2.tier} • Chance ${c2.chance}</div>
        <div class="result-meta">Earned ${displayed2} coin${displayed2 === 1 ? '' : 's'}!</div>
      </div>
    </div>
  `;
  // reveal animation for both
  setTimeout(() => {
    const icons = resultEl.querySelectorAll('.result-icon');
    icons.forEach(icon => {
      const tierClass = '';
      icon.classList.add('reveal');
      setTimeout(() => icon.classList.remove('reveal'), 900);
    });
  }, 60);
}

function showThreeResults(c1, c2, c3, e1, e2, e3) {
  const displayed1 = typeof e1 === 'number' ? e1 : Math.floor((c1.coins || 0) * (c1.shiny ? 2 : 1));
  const displayed2 = typeof e2 === 'number' ? e2 : Math.floor((c2.coins || 0) * (c2.shiny ? 2 : 1));
  const displayed3 = typeof e3 === 'number' ? e3 : Math.floor((c3.coins || 0) * (c3.shiny ? 2 : 1));
  resultEl.innerHTML = `
    <div class="three-results">
      <div class="result-block">
        <div class="result-icon">${c1.icon}</div>
        <div class="result-title">${c1.name}</div>
        <div class="result-meta">${c1.tier} • Chance ${c1.chance}</div>
        <div class="result-meta">Earned ${displayed1} coin${displayed1 === 1 ? '' : 's'}!</div>
      </div>
      <div class="result-block">
        <div class="result-icon">${c2.icon}</div>
        <div class="result-title">${c2.name}</div>
        <div class="result-meta">${c2.tier} • Chance ${c2.chance}</div>
        <div class="result-meta">Earned ${displayed2} coin${displayed2 === 1 ? '' : 's'}!</div>
      </div>
      <div class="result-block">
        <div class="result-icon">${c3.icon}</div>
        <div class="result-title">${c3.name}</div>
        <div class="result-meta">${c3.tier} • Chance ${c3.chance}</div>
        <div class="result-meta">Earned ${displayed3} coin${displayed3 === 1 ? '' : 's'}!</div>
      </div>
    </div>
  `;
  // reveal animation for all three
  setTimeout(() => {
    const icons = resultEl.querySelectorAll('.result-icon');
    icons.forEach(icon => {
      icon.classList.add('reveal');
      setTimeout(() => icon.classList.remove('reveal'), 900);
    });
  }, 60);
}

// Flashing single-icon animation helper
function startFlashingIcon(container, intervalMs = 60) {
  let running = true;
  const flashEl = document.createElement('div');
  flashEl.className = 'flash-icon';
  container.appendChild(flashEl);

  const iv = setInterval(() => {
    const idx = Math.floor(Math.random() * allCharacters.length);
    flashEl.innerHTML = allCharacters[idx].icon;
  }, intervalMs);

  return {
    stop(finalCharacter) {
      clearInterval(iv);
      running = false;
      // show final icon in flashEl
      if (finalCharacter) flashEl.innerHTML = finalCharacter.icon;
      return flashEl;
    }
  };
}

function startRolling() {
  if (isRolling) return;

  isRolling = true;
  playRollSound();
  rollButton.disabled = true;
  // show animated flashing icon inside result area
  resultEl.innerHTML = '';
  const rollingWrapper = document.createElement('div');
  rollingWrapper.className = 'result-rolling-wrapper';

  const createRollingBlock = (label) => {
    const block = document.createElement('div');
    block.className = 'result-block rolling-block';
    const title = document.createElement('div');
    title.className = 'result-title';
    title.textContent = label;
    const meta = document.createElement('div');
    meta.className = 'result-meta';
    const speedSeconds = getRollSpeedMs() / 1000;
    meta.textContent = `Please wait ${speedSeconds} second${speedSeconds === 1 ? '' : 's'}.`;
    block.appendChild(title);
    block.appendChild(meta);
    return block;
  };

  const firstBlock = createRollingBlock('Rolling...');
  rollingWrapper.appendChild(firstBlock);
  let secondBlock = null;
  let thirdBlock = null;
  if (upgrades.secondRoll) {
    secondBlock = createRollingBlock('Second roll...');
    rollingWrapper.appendChild(secondBlock);
  }
  if (upgrades.thirdRoll) {
    thirdBlock = createRollingBlock('Third roll...');
    rollingWrapper.appendChild(thirdBlock);
  }
  resultEl.appendChild(rollingWrapper);

  // start flashing fast random icons
  const flasher1 = startFlashingIcon(firstBlock, 50);
  const flasher2 = secondBlock ? startFlashingIcon(secondBlock, 50) : null;
  const flasher3 = thirdBlock ? startFlashingIcon(thirdBlock, 50) : null;
  resultEl.classList.add('rolling');

  setTimeout(() => {
    // determine golden roll behavior
    goldenRollActive = false;
    if (goldenPending) {
      // golden was queued and will be applied to this roll
      goldenRollActive = true;
      goldenPending = false;
      goldenDiceCounter = 10; // reset counter as the golden roll is now being used
      // play a sound to mark golden activation
      playGoldenSound();
    } else {
      // decrement the counter only while waiting for the golden roll to become available
      goldenDiceCounter = (typeof goldenDiceCounter === 'number' ? goldenDiceCounter : 10);
      if (goldenDiceCounter > 0) {
        goldenDiceCounter -= 1;
        if (goldenDiceCounter === 0) {
          // counter reached zero -> golden becomes available for the next manual roll
          goldenPending = true;
        }
      }
    }
    updatePotionUI();
    const rollPool = isPotionActive('shiny') ? shinyCharacters : allCharacters;
    const character = weightedRandom(rollPool);
    rollCount += 1;
    // Base coin multiplier is 1x; each coin upgrade tier adds +50% per tier.
    let coinMultiplier = 1 + (coinBoosts[upgrades.coinTier] || 0);
    if (isPotionActive('coin')) coinMultiplier *= 2;
    const rebirthMultiplier = rebirthMultipliers[rebirthCount] || 1;
    let earnedCoins;
    if (/^cat-secrett/i.test(character.id)) {
      earnedCoins = 100000;
    } else {
      // Base coins use the character's coins value. Shiny characters get a 2x multiplier.
      const baseValue = (character.coins || 0) * (character.shiny ? 2 : 1);
      earnedCoins = Math.floor(baseValue * coinMultiplier * rebirthMultiplier);
    }
    coinTotal += earnedCoins;
    rolledCharacters[character.id] = (rolledCharacters[character.id] || 0) + 1;
    // potion drops
    if (Math.random() < POTION_DROP_LUCK_CHANCE) {
      potions.luck = (potions.luck || 0) + 1;
      updatePotionUI();
      playPotionDropSound('luck');
      showPopup('You found a Luck Potion!', 3000);
    }
    if (Math.random() < POTION_DROP_COIN_CHANCE) {
      potions.coin = (potions.coin || 0) + 1;
      updatePotionUI();
      playPotionDropSound('coin');
      showPopup('You found a Coin Potion!', 3000);
    }
    if (Math.random() < POTION_DROP_SHINY_CHANCE) {
      potions.shiny = (potions.shiny || 0) + 1;
      updatePotionUI();
      playPotionDropSound('luck');
      showPopup('You found a Shiny Potion!', 3000);
    }
    updateRollCount();
    updateCoinCount();
    saveState();
    renderIndexMenu();
    // perform second roll if active, before final display
    let character2 = null;
    if (upgrades.secondRoll) {
      character2 = weightedRandom(rollPool, { goldenMultiplier: 1 });
      const baseValue2 = (character2.coins || 0) * (character2.shiny ? 2 : 1);
      const earnedCoins2 = Math.floor(baseValue2 * coinMultiplier * rebirthMultiplier);
      coinTotal += earnedCoins2;
      rolledCharacters[character2.id] = (rolledCharacters[character2.id] || 0) + 1;
    }
    let character3 = null;
    let earnedCoins3;
    if (upgrades.thirdRoll) {
      character3 = weightedRandom(rollPool, { goldenMultiplier: 1 });
      const baseValue3 = (character3.coins || 0) * (character3.shiny ? 2 : 1);
      earnedCoins3 = Math.floor(baseValue3 * coinMultiplier * rebirthMultiplier);
      coinTotal += earnedCoins3;
      rolledCharacters[character3.id] = (rolledCharacters[character3.id] || 0) + 1;
    }
    // stop flashing and show final
    if (flasher1 && typeof flasher1.stop === 'function') flasher1.stop(character);
    if (flasher2 && typeof flasher2.stop === 'function') flasher2.stop(character2);
    if (flasher3 && typeof flasher3.stop === 'function') flasher3.stop(character3);
    resultEl.classList.remove('rolling');
    // play reveal sound and then show result with stronger visual for high tiers
    playRevealSound(character.tier);
    if (upgrades.thirdRoll && character2 && character3) {
      showThreeResults(character, character2, character3, earnedCoins, (typeof earnedCoins2 !== 'undefined' ? earnedCoins2 : 0), (typeof earnedCoins3 !== 'undefined' ? earnedCoins3 : 0));
    } else if (upgrades.secondRoll && character2) {
      showTwoResults(character, character2, earnedCoins, (typeof earnedCoins2 !== 'undefined' ? earnedCoins2 : 0));
    } else {
      showCharacterResult(character, earnedCoins);
    }

    setTimeout(() => {
      isRolling = false;
      rollButton.disabled = false;
      // if a golden roll was active for this reveal, reset the golden counter now
      if (goldenRollActive) {
        goldenDiceCounter = 10;
      }
      goldenRollActive = false;
    }, 100);
  }, getRollSpeedMs());
}

function openIndexMenu() {
  if (!indexMenu) return;
  currentIndexTab = 'normal';
  indexMenu.classList.remove('hidden');
  indexMenu.setAttribute('aria-hidden', 'false');
  updateIndexTabButtons();
  renderIndexMenu();
}

function closeIndexMenu() {
  if (!indexMenu) return;
  indexMenu.classList.add('hidden');
  indexMenu.setAttribute('aria-hidden', 'true');
}

function openInventoryMenu() {
  if (!inventoryMenu) return;
  currentInventoryTab = 'normal';
  inventoryMenu.classList.remove('hidden');
  inventoryMenu.setAttribute('aria-hidden', 'false');
  updateInventoryTabButtons();
  renderInventoryMenu();
}

function closeInventoryMenu() {
  if (!inventoryMenu) return;
  inventoryMenu.classList.add('hidden');
  inventoryMenu.setAttribute('aria-hidden', 'true');
}

rollButton.addEventListener('click', startRolling);
if (inventoryButton) inventoryButton.addEventListener('click', openInventoryMenu);
if (indexButton) indexButton.addEventListener('click', openIndexMenu);
if (closeIndexButton) closeIndexButton.addEventListener('click', closeIndexMenu);
if (closeInventoryButton) closeInventoryButton.addEventListener('click', closeInventoryMenu);
if (indexMenu) indexMenu.querySelector('.index-overlay').addEventListener('click', closeIndexMenu);
if (inventoryMenu) inventoryMenu.querySelector('.index-overlay').addEventListener('click', closeInventoryMenu);
if (upgradeButton) upgradeButton.addEventListener('click', openUpgradeMenu);
if (closeUpgradeButton) closeUpgradeButton.addEventListener('click', closeUpgradeMenu);
if (upgradeMenu) upgradeMenu.querySelector('.index-overlay').addEventListener('click', closeUpgradeMenu);
if (buyRollSpeed1Button) buyRollSpeed1Button.addEventListener('click', () => buyRollSpeedTier(1));
if (buyRollSpeed2Button) buyRollSpeed2Button.addEventListener('click', () => buyRollSpeedTier(2));
if (buyRollSpeed3Button) buyRollSpeed3Button.addEventListener('click', () => buyRollSpeedTier(3));
if (buyAutoRollButton) buyAutoRollButton.addEventListener('click', buyAutoRoll);
if (buyLuck1Button) buyLuck1Button.addEventListener('click', () => buyLuckTier(1));
if (buyLuck2Button) buyLuck2Button.addEventListener('click', () => buyLuckTier(2));
if (buyLuck3Button) buyLuck3Button.addEventListener('click', () => buyLuckTier(3));
if (buyLuck4Button) buyLuck4Button.addEventListener('click', () => buyLuckTier(4));
if (buyLuck5Button) buyLuck5Button.addEventListener('click', () => buyLuckTier(5));
if (buySecretLuck1Button) buySecretLuck1Button.addEventListener('click', () => buySecretLuckTier(1));
if (buySecretLuck2Button) buySecretLuck2Button.addEventListener('click', () => buySecretLuckTier(2));
if (buySecretLuck3Button) buySecretLuck3Button.addEventListener('click', () => buySecretLuckTier(3));
if (buySecretLuck4Button) buySecretLuck4Button.addEventListener('click', () => buySecretLuckTier(4));
if (buySecretLuck5Button) buySecretLuck5Button.addEventListener('click', () => buySecretLuckTier(5));
if (buyCoin1Button) buyCoin1Button.addEventListener('click', () => buyCoinBoostTier(1));
if (buyCoin2Button) buyCoin2Button.addEventListener('click', () => buyCoinBoostTier(2));
if (buyCoin3Button) buyCoin3Button.addEventListener('click', () => buyCoinBoostTier(3));
if (buySecondRollButton) buySecondRollButton.addEventListener('click', buySecondRoll);
if (buyThirdRollButton) buyThirdRollButton.addEventListener('click', buyThirdRoll);
if (diamondShopButton) diamondShopButton.addEventListener('click', openDiamondShopMenu);
if (closeDiamondShopButton) closeDiamondShopButton.addEventListener('click', closeDiamondShopMenu);
if (buyTeamSlotButton) buyTeamSlotButton.addEventListener('click', () => { buyTeamSlot(); updateDiamondShopUI(); });
if (buyDiamondSecretLuck1Button) buyDiamondSecretLuck1Button.addEventListener('click', () => buyDiamondSecretLuckTier(1));
if (buyDiamondSecretLuck2Button) buyDiamondSecretLuck2Button.addEventListener('click', () => buyDiamondSecretLuckTier(2));
if (buyDiamondSecretLuck3Button) buyDiamondSecretLuck3Button.addEventListener('click', () => buyDiamondSecretLuckTier(3));
if (indexTabNormalButton) indexTabNormalButton.addEventListener('click', () => setIndexTab('normal'));
if (indexTabShinyButton) indexTabShinyButton.addEventListener('click', () => setIndexTab('shiny'));
if (inventoryTabNormalButton) inventoryTabNormalButton.addEventListener('click', () => setInventoryTab('normal'));
if (inventoryTabShinyButton) inventoryTabShinyButton.addEventListener('click', () => setInventoryTab('shiny'));
if (inventoryTabTeamButton) inventoryTabTeamButton.addEventListener('click', () => setInventoryTab('team'));
if (adminButton) adminButton.addEventListener('click', promptAdminPassword);
const rebirthButton = document.getElementById('rebirthButton');
const rebirthMenu = document.getElementById('rebirthMenu');
const closeRebirthButton = document.getElementById('closeRebirthButton');
const doRebirthButton = document.getElementById('doRebirthButton');
const rebirthInfo = document.getElementById('rebirthInfo');
if (rebirthButton) rebirthButton.addEventListener('click', openRebirthMenu);
if (closeRebirthButton) closeRebirthButton.addEventListener('click', closeRebirthMenu);
if (rebirthMenu) rebirthMenu.querySelector('.index-overlay').addEventListener('click', closeRebirthMenu);
if (doRebirthButton) doRebirthButton.addEventListener('click', doRebirth);
if (document.getElementById('useLuckPotionButton')) document.getElementById('useLuckPotionButton').addEventListener('click', useLuckPotion);
if (document.getElementById('useCoinPotionButton')) document.getElementById('useCoinPotionButton').addEventListener('click', useCoinPotion);
if (document.getElementById('useShinyPotionButton')) document.getElementById('useShinyPotionButton').addEventListener('click', useShinyPotion);
if (closeAdminButton) closeAdminButton.addEventListener('click', closeAdminMenu);
if (adminMenu) adminMenu.querySelector('.index-overlay').addEventListener('click', closeAdminMenu);
if (adminApplyButton) adminApplyButton.addEventListener('click', applyAdminChanges);
if (adminResetButton) adminResetButton.addEventListener('click', resetAdminLuck);
if (adminResetAccountButton) adminResetAccountButton.addEventListener('click', resetAdminAccount);
// preview modal handlers
const previewModalEl = document.getElementById('previewModal');
const closePreviewButtonEl = document.getElementById('closePreviewButton');
if (closePreviewButtonEl) closePreviewButtonEl.addEventListener('click', closePreview);
if (previewModalEl) previewModalEl.querySelector('.index-overlay').addEventListener('click', closePreview);
// load persisted state, then render
loadState();
updateRollCount();
updateCoinCount();
updateDiamondCount();
updateGemCount();
updateSecretLuckCount();
updateInventoryNotification();
renderIndexMenu();
updateUpgradeUI();
ensureAutoRollToggle();
updateRebirthUI();
