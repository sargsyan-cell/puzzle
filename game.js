/**
 * Mini Jigsaw Puzzle - Vanilla JS game
 * Royal Match-inspired UI, level-based puzzles, Card Album Collection.
 */

(function () {
  "use strict";

  const SNAP_THRESHOLD = 35;
  const SAVE_KEY = "puzzleGame_save_v2";
  const STORAGE_KEYS = {
    currentLevel: "puzzle_currentLevel",
    coins: "puzzle_coins",
    musicOn: "puzzle_musicOn",
    sfxOn: "puzzle_sfxOn",
    devCheatsEnabled: "puzzle_devCheatsEnabled",
  };
  const DEFAULT_COINS = 50;
  const DEFAULT_PUZZLE_ENERGY = 20;
  const COINS_TAP_WINDOW_MS = 2000;
  const COINS_TAP_COUNT = 5;
  const LONG_PRESS_MS = 1500;
  const LEVEL_2_INDEX = 1;
  const LEVEL_3_INDEX = 2;
  const LEVEL_4_INDEX = 3;
  const LEVEL_6_INDEX = 5;
  const LEVEL_8_INDEX = 7;
  const RACE_TARGET_POINTS = 50;
  const RACE_BOT_INTERVALS_MS = [12000, 15000, 18000, 22000];
  const RACE_BOT_NAMES = ["Orange Lime", "Orange Lime", "Orange Lime", "Orange Lime"];
  const RACE_EVENT_DURATION_MS = 10 * 24 * 60 * 60 * 1000;
  const RACE_LANE_CAR_SRCS = [
    "https://www.figma.com/api/mcp/asset/c4d902f4-3391-4c00-a764-74855c071d2b",
    "https://www.figma.com/api/mcp/asset/237c68c9-e7c8-4477-b5dc-94f29c1d4f20",
    "https://www.figma.com/api/mcp/asset/936a3a05-8563-4d7a-91e1-d804ea98accd",
    "https://www.figma.com/api/mcp/asset/4f6b9fc2-4de2-4c37-a6a1-c15f054f7cae",
    "https://www.figma.com/api/mcp/asset/412b9eb5-852c-42f8-98b9-ba2f246152f1",
  ];
  const PROFILE_ICON_ADS_SRC = "https://www.figma.com/api/mcp/asset/16a01535-a730-4ad0-9f6b-3e00e77e156a";
  const PROFILE_ICON_GEM_SRC = "https://www.figma.com/api/mcp/asset/56ae3d16-19e0-4617-b81c-8a74914f2997";
  const BP_GEM_ICON_SRC = "https://www.figma.com/api/mcp/asset/a0a4ff75-7918-4c31-aec2-8293de3ed8d4";
  const BP_CHEST_ICON_SRC = "https://www.figma.com/api/mcp/asset/3963bbf8-0846-49af-bbb1-918d04dc750d";
  const LEADERBOARD_BG_SRC = "https://www.figma.com/api/mcp/asset/15be4824-a30a-48f1-a5f5-009d86f4da60";
  const LEADERBOARD_BANNER_SRC = "https://www.figma.com/api/mcp/asset/2e431d04-8cc9-457c-8137-d1faebf495e2";
  const LEADERBOARD_NAV_BACK_SRC = "https://www.figma.com/api/mcp/asset/e4d08226-c9b2-4ee0-bf02-a51bb9b38b78";
  const LEADERBOARD_NAV_INFO_SRC = "https://www.figma.com/api/mcp/asset/27dbf6f8-c200-40e1-85f7-76638f04c380";
  const LEADERBOARD_TOP_WREATH_GOLD_SRC = "https://www.figma.com/api/mcp/asset/7f2a78df-aa97-4f3b-9e60-c69e393cd73d";
  const LEADERBOARD_TOP_WREATH_SILVER_SRC = "https://www.figma.com/api/mcp/asset/04060ce3-b519-4d6a-b550-c716785ef83e";
  const LEADERBOARD_TOP_WREATH_BRONZE_SRC = "https://www.figma.com/api/mcp/asset/75626547-756f-4536-8548-6ef95f15cf65";
  const LEADERBOARD_REWARD_GOLD_SRC = "https://www.figma.com/api/mcp/asset/c125d8e9-2b1f-480c-b73b-7a8f9241806e";
  const LEADERBOARD_REWARD_SILVER_SRC = "https://www.figma.com/api/mcp/asset/247bfb7a-0c6c-49da-a8f9-43514a7f2bb1";
  const LEADERBOARD_REWARD_BRONZE_SRC = "https://www.figma.com/api/mcp/asset/170f228f-d243-428a-adc2-a4c4fa9d765d";
  const LEADERBOARD_BOT_AVATAR_SRC = "https://www.figma.com/api/mcp/asset/19f75488-c193-4a14-9314-0d6729052844";
  const ALBUM_BG_SRC = "https://www.figma.com/api/mcp/asset/84afe2d8-1ff4-477b-9680-739aa648d61c";
  const ALBUM_ICON_CARD_SRC = "https://www.figma.com/api/mcp/asset/7fdb2bba-f0ab-4ec0-aca8-ef019d3ddc22";
  const ALBUM_ICON_CHEST_SRC = "https://www.figma.com/api/mcp/asset/e1f42bd0-a9af-4287-a86a-e80cc38455d6";
  const ALBUM_ICON_INFO_SRC = "https://www.figma.com/api/mcp/asset/c0296964-9880-4e32-98cf-876913353eca";
  const ALBUM_ICON_COIN_SRC = "https://www.figma.com/api/mcp/asset/dc3dcad6-307d-4ce3-be5f-bc6404e1cc9b";
  const ALBUM_ICON_GEM_SRC = "https://www.figma.com/api/mcp/asset/026579c0-3798-4877-8fb2-d9b4300e48f9";
  const ALBUM_ICON_SORT_SRC = "https://www.figma.com/api/mcp/asset/a526d657-e4e8-47de-912e-186906fe4e03";
  const ALBUM_ICON_ARROW_LEFT_SRC = "https://www.figma.com/api/mcp/asset/e4264505-f865-4c9d-a831-3b90b5b637bc";
  const ALBUM_ICON_ARROW_RIGHT_SRC = "https://www.figma.com/api/mcp/asset/7ae51612-ac18-4f8f-9d2c-7470bebc8b0e";
  const ALBUM_CARD_STAR_SRC = "https://www.figma.com/api/mcp/asset/87463e49-ca29-4aaf-9bcf-774e410672d6";
  const ALBUM_QUESTION_TILE_SRC = "https://www.figma.com/api/mcp/asset/92f62589-2b94-483d-9980-f075e362c4b7";
  const ALBUM_BOTTOM_BANNER_SRC = "https://www.figma.com/api/mcp/asset/2e431d04-8cc9-457c-8137-d1faebf495e2";
  const ALBUM_EXCHANGE_CLOSE_SRC = "https://www.figma.com/api/mcp/asset/0cdd32d2-f712-4dfd-8be4-b9660f147249";
  const ALBUM_EXCHANGE_CHEST_WOOD_SRC = "https://www.figma.com/api/mcp/asset/b2e1fde9-830c-45c0-9d3c-9545fe919d23";
  const ALBUM_EXCHANGE_CHEST_SILVER_SRC = "https://www.figma.com/api/mcp/asset/00c500a7-e411-4c32-b0b9-0e859d2d32b0";
  const ALBUM_EXCHANGE_CHEST_GOLD_SRC = "https://www.figma.com/api/mcp/asset/1caf35f4-4818-4a6f-8f91-8bf404e8d89c";
  const ALBUM_EXCHANGE_COIN_SRC = "https://www.figma.com/api/mcp/asset/3ebc2fd3-3079-40e8-9686-99b4964feab2";
  const ALBUM_EXCHANGE_ENERGY_SRC = "https://www.figma.com/api/mcp/asset/cad4e6b3-cac1-41f2-94b9-62e61df32e45";
  const ALBUM_EXCHANGE_GEM_SRC = "https://www.figma.com/api/mcp/asset/66522874-ab1e-4b32-9b41-2f0ae0524afa";
  const ALBUM_EXCHANGE_BP_STAR_SRC = "https://www.figma.com/api/mcp/asset/d40a259d-e54a-488e-8e4e-82ed8fcaf048";
  const ALBUM_FEATURES_INFO_PACK_SRC = "https://www.figma.com/api/mcp/asset/1562f3d9-b0cd-4425-9815-4c1c7f6fbe6c";
  const ALBUM_FEATURES_INFO_STAR_SRC = "https://www.figma.com/api/mcp/asset/44c9eef2-f8b9-4800-b8a9-fde938e376a4";
  const ALBUM_FEATURES_INFO_CHEST_SRC = "https://www.figma.com/api/mcp/asset/70af29b5-fa34-486b-80ea-58f67edb6e4f";
  const ALBUM_FEATURES_INFO_TAP_SRC = "https://www.figma.com/api/mcp/asset/6a0f4487-017d-47c2-a7f0-8b28a0b067b5";
  const BP_STARS_PER_CARD = 10;
  const BP_XP_PER_TIER = 100;
  const WHEEL_FREE_COOLDOWN_MS = 6 * 60 * 60 * 1000;
  const WHEEL_SEGMENTS = 6;
  const WHEEL_SPIN_DURATION_MS = 3000;
  const ALBUM_FRESH_CARD_COUNT = 8;
  const PIGGY_CAP_DEFAULT = 500;
  const PIGGY_EARN_PER_PIECE = 1;
  const EVENT_DURATION_MS = 10 * 24 * 60 * 60 * 1000;
  const CARD_IMAGE_BASE = "assets/cards/";
  const PACK_REFERENCE_IMAGE = "assets/ui/pack_reference.png";
  const LOST_TEMPLE_STAGES = [
    { id: 1, boardSize: 4, chestGoal: 4, gemGoal: 2, tier: "adventurer", loot: { chest: 4, gem: 2, relic: 2, bonusHammer: 2, coins: 2 } },
    { id: 2, boardSize: 4, chestGoal: 4, gemGoal: 2, tier: "archaeologist", loot: { chest: 4, gem: 2, relic: 3, bonusHammer: 2, coins: 3 } },
    { id: 3, boardSize: 4, chestGoal: 2, gemGoal: 2, tier: "mystery", loot: { chest: 2, gem: 2, relic: 4, bonusHammer: 3, coins: 3 } },
  ];
  // Registry for uploaded HTML playables (Level 1, Level 2, etc.).
  // Add new files to this array to plug additional external levels.
  const EXTERNAL_PLAYABLE_LEVELS = [
    {
      id: "city2_unity_level_1",
      title: "City 2",
      type: "html-playable",
      src: "levels/events/APW_Lvl_4_applovin_Full_1.html",
    },
    {
      id: "city_level_3_unity_level_2",
      title: "City Level 3",
      type: "html-playable",
      src: "levels/PuzzleCity_Level_3_unity_Full.html",
    },
  ];
  const GALLERY_LEVEL_DEFS = [
    { id: "gallery_level_1", label: "Tutorial", featureIcon: "feature-bp", playableLevelIndex: 0 },
    { id: "gallery_level_2", label: "Tutorial", featureIcon: "feature-leaderboard", playableLevelIndex: 1 },
    { id: "gallery_level_3", label: "Tutorial", featureIcon: "feature-wheel" },
    { id: "gallery_level_4", label: "Tutorial", featureIcon: "feature-race" },
    { id: "gallery_level_5", label: "Tutorial", featureIcon: "feature-temple" },
    { id: "gallery_level_6", label: "Tutorial", featureIcon: "feature-piggy" },
    { id: "gallery_level_7", label: "Tutorial", featureIcon: "feature-ads" },
    { id: "gallery_level_8", label: "Tutorial", featureIcon: "feature-cards" },
  ];
  const DAILY_TASK_DEFS = [
    { id: "complete_level_1", title: "Complete Level 1", target: 1, points: 5, progressKey: "level1Complete", rewardText: "30C", rewardCoins: 30 },
    { id: "place_100_pieces", title: "Place 100 puzzle pieces", target: 100, points: 5, progressKey: "piecesPlaced", rewardText: "60C", rewardCoins: 60 },
    { id: "spin_wheel_5", title: "Spin Wheel of Fortune 5 times", target: 5, points: 5, progressKey: "wheelSpins", rewardText: "5G", rewardGems: 5 },
    { id: "race_action", title: "Complete a Race action", target: 1, points: 10, progressKey: "raceActions", rewardText: "80C", rewardCoins: 80 },
    { id: "piggy_claim", title: "Claim Piggy Bank reward", target: 1, points: 10, progressKey: "piggyClaims", rewardText: "10G", rewardGems: 10 },
  ];

  function ensureEvent(save, key, startNowIfMissing) {
    const ev = save[key];
    if (ev && typeof ev.startAt === "number" && typeof ev.endAt === "number") return ev;
    if (!startNowIfMissing) return null;
    const now = Date.now();
    const event = { startAt: now, endAt: now + EVENT_DURATION_MS };
    save[key] = event;
    return event;
  }

  function isEventActive(save, key) {
    const ev = save[key];
    return !!(ev && typeof ev.endAt === "number" && Date.now() < ev.endAt);
  }

  function getRemainingMs(save, key) {
    const ev = save[key];
    if (!ev || typeof ev.endAt !== "number") return 0;
    return Math.max(0, ev.endAt - Date.now());
  }

  function formatRemaining(ms) {
    if (ms <= 0) return "Event ended";
    const d = Math.floor(ms / 86400000);
    const h = Math.floor((ms % 86400000) / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    return d + "d " + h + "h " + m + "m";
  }

  function randomShuffle(arr) {
    const out = arr.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = out[i];
      out[i] = out[j];
      out[j] = tmp;
    }
    return out;
  }

  function buildLostTempleStageState(stageIndex) {
    const safeIndex = Math.max(0, Math.min(LOST_TEMPLE_STAGES.length - 1, stageIndex || 0));
    const def = LOST_TEMPLE_STAGES[safeIndex];
    const tileCount = def.boardSize * def.boardSize;
    const lootPool = [];
    Object.keys(def.loot).forEach((k) => {
      const n = Math.max(0, parseInt(def.loot[k], 10) || 0);
      for (let i = 0; i < n; i++) lootPool.push(k);
    });
    while (lootPool.length < tileCount) lootPool.push("none");
    const shuffled = randomShuffle(lootPool).slice(0, tileCount);
    const tiles = shuffled.map((lootType) => ({ broken: false, lootType }));
    return {
      stageIndex: safeIndex,
      boardSize: def.boardSize,
      chestProgress: 0,
      chestGoal: def.chestGoal,
      gemProgress: 0,
      gemGoal: Math.max(1, parseInt(def.gemGoal, 10) || 2),
      chestTier: def.tier,
      chestClaimable: false,
      chestClaimed: false,
      boardCompleted: false,
      tiles,
    };
  }

  function getDefaultSave() {
    return {
      currentLevel: 0,
      coins: DEFAULT_COINS,
      collectionUnlocked: true,
      collectionTutorialCompleted: true,
      lastAnimatedInboxSignature: "",
      albums: {},
      cards: { collected: {}, newInbox: [], duplicates: {} },
      albumStars: 0,
      eventHammers: 0,
      rewards: { trophies: 0, unlockedRewards: [], trophiesGoldCup: false },
      allCardsRewardClaimed: false,
      battlePassUnlocked: true,
      bpStarsTotal: 0,
      battlePassPremiumActive: false,
      xpTotal: 0,
      bpClaims: { freeClaimedTiers: [], premiumClaimedTiers: [] },
      bpPremiumPackMeta: {},
      albumEvent: null,
      battlePassEvent: null,
      wheelUnlocked: true,
      wheelNextFreeAt: 0,
      wheelTutorialSeen: true,
      piecesCollectedTotal: 0,
      leaderboardWeekId: null,
      weeklyPiecesCollected: 0,
      bpTutorCompleted: true,
      bpTutorStep: 0,
      leaderboardUnlocked: true,
      leaderboardTutorCompleted: true,
      bonusLevelUnlocked: true,
      bonusLevelCompleted: false,
      bonusLevelTimesPlayed: 0,
      gemsTotal: 0,
      piggyGemsStored: 0,
      piggyCap: PIGGY_CAP_DEFAULT,
      piggyBroken: false,
      piggyEarnPerPiece: PIGGY_EARN_PER_PIECE,
      musicOn: "true",
      sfxOn: "true",
      raceUnlocked: true,
      raceTutorialCompleted: true,
      lostTempleUnlocked: true,
      lostTempleTutorialCompleted: true,
      lostTempleEvent: null,
      lostTempleCurrentStage: 0,
      lostTempleState: null,
      leaderboardHammerRewardWeekId: null,
      raceState: {
        active: false,
        startTime: 0,
        playerPoints: 0,
        botPoints: [0, 0, 0, 0],
        winner: null,
        claimed: false,
      },
      playerProfile: null,
      profileSetupCompleted: true,
      rubyCaveCompleted: 0,
      rubyCaveEnergy: 5,
      rubyCaveNextEnergyAt: null,
      rubyCaveEventEnd: null,
      rubyCaveTutorialDone: false,
      rubyCaveRewardClaimed: false,
      puzzleEnergy: DEFAULT_PUZZLE_ENERGY,
      dailyTasksDateKey: "",
      dailyTasksClaims: {},
      dailyTasksProgress: {
        level1Complete: 0,
        piecesPlaced: 0,
        wheelSpins: 0,
        raceActions: 0,
        piggyClaims: 0,
      },
      dailyTasksMainRewardClaimed: false,
      dailyTasksDayIndex: 1,
    };
  }

  function getLeaderboardWeekId() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return d.getFullYear() + "-W" + String(weekNo).padStart(2, "0");
  }

  const RANDOM_PROFILE_NAMES = [
    "Continuum", "NovaPanda", "SunnyRanger", "PixelFox", "CaptainKiwi", "LuckyMantis",
    "StarJumper", "PuzzlePro", "QuickFit", "TrayMaster", "SlotHero", "PieceWizard",
  ];

  function generateRandomName() {
    const idx = Math.floor(Math.random() * RANDOM_PROFILE_NAMES.length);
    return RANDOM_PROFILE_NAMES[idx] || "PuzzleFan";
  }

  function generateDefaultUserName() {
    const n = Math.floor(1000000 + Math.random() * 9000000);
    return "User" + String(n);
  }

  function generatePlayerId() {
    const hex = () => Math.floor(Math.random() * 16).toString(16);
    return "p_" + Date.now().toString(36) + "_" + Array.from({ length: 8 }, hex).join("");
  }

  const PROFILE_ID_KEY = "puzzle_player_id";
  function getStablePlayerId() {
    try {
      let id = localStorage.getItem(PROFILE_ID_KEY);
      if (id && /^p_[a-z0-9_]+$/i.test(id)) return id;
      id = generatePlayerId();
      localStorage.setItem(PROFILE_ID_KEY, id);
      return id;
    } catch (_) {
      return generatePlayerId();
    }
  }

  const AVATAR_COUNT = 12;
  function getAvatarSvg(avatarId) {
    const id = Math.max(0, Math.min(AVATAR_COUNT - 1, parseInt(avatarId, 10) || 0));
    const svgs = [
      '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#ffd93d" stroke="#f6b93b" stroke-width="2"/><circle cx="26" cy="26" r="4" fill="#333"/><circle cx="38" cy="26" r="4" fill="#333"/><path d="M22 40 Q32 48 42 40" stroke="#333" stroke-width="2" fill="none"/></svg>',
      '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#a8e6cf" stroke="#7dd3a8" stroke-width="2"/><circle cx="26" cy="28" r="4" fill="#333"/><circle cx="38" cy="28" r="4" fill="#333"/><ellipse cx="32" cy="42" rx="10" ry="6" fill="#333"/><path d="M20 24 L24 20 L28 24" stroke="#333" stroke-width="1.5" fill="none"/></svg>',
      '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#ff9a8b" stroke="#ff7b6b" stroke-width="2"/><circle cx="28" cy="26" r="4" fill="#333"/><circle cx="36" cy="26" r="4" fill="#333"/><path d="M24 40 Q32 46 40 40" stroke="#333" stroke-width="2" fill="none"/><circle cx="32" cy="18" r="6" fill="#333"/></svg>',
      '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#dda0dd" stroke="#ba7eba" stroke-width="2"/><circle cx="26" cy="27" r="4" fill="#333"/><circle cx="38" cy="27" r="4" fill="#333"/><path d="M22 42 Q32 50 42 42" stroke="#333" stroke-width="2" fill="none"/><path d="M32 14 L36 22 L32 20 L28 22 Z" fill="#ffd700"/></svg>',
      '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#87ceeb" stroke="#5eb8e6" stroke-width="2"/><circle cx="27" cy="28" r="4" fill="#333"/><circle cx="37" cy="28" r="4" fill="#333"/><path d="M24 40 Q32 46 40 40" stroke="#333" stroke-width="2" fill="none"/><ellipse cx="32" cy="16" rx="8" ry="5" fill="#333"/></svg>',
      '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#ffcc80" stroke="#ffb74d" stroke-width="2"/><circle cx="26" cy="26" r="4" fill="#333"/><circle cx="38" cy="26" r="4" fill="#333"/><path d="M20 38 Q32 48 44 38" stroke="#333" stroke-width="2" fill="none"/><path d="M32 12 L34 20 L32 18 L30 20 Z" fill="#e65100"/></svg>',
      '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#b5e48c" stroke="#99d98c" stroke-width="2"/><circle cx="26" cy="27" r="4" fill="#333"/><circle cx="38" cy="27" r="4" fill="#333"/><path d="M22 42 Q32 50 42 42" stroke="#333" stroke-width="2" fill="none"/><path d="M28 16 L32 12 L36 16 L32 20 Z" fill="#2d6a4f"/></svg>',
      '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#e9c46a" stroke="#d4a373" stroke-width="2"/><circle cx="27" cy="26" r="4" fill="#333"/><circle cx="37" cy="26" r="4" fill="#333"/><path d="M24 40 Q32 48 40 40" stroke="#333" stroke-width="2" fill="none"/><ellipse cx="32" cy="14" rx="6" ry="4" fill="#333"/></svg>',
      '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#cdb4db" stroke="#9f86c0" stroke-width="2"/><circle cx="26" cy="28" r="4" fill="#333"/><circle cx="38" cy="28" r="4" fill="#333"/><path d="M22 42 Q32 50 42 42" stroke="#333" stroke-width="2" fill="none"/><path d="M20 18 Q32 8 44 18" stroke="#333" stroke-width="2" fill="none"/></svg>',
      '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#ffafcc" stroke="#ff8fab" stroke-width="2"/><circle cx="26" cy="27" r="4" fill="#333"/><circle cx="38" cy="27" r="4" fill="#333"/><path d="M22 40 Q32 48 42 40" stroke="#333" stroke-width="2" fill="none"/><circle cx="32" cy="16" r="5" fill="#333"/><path d="M24 22 Q32 28 40 22" stroke="#333" stroke-width="1.5" fill="none"/></svg>',
      '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#a2d2ff" stroke="#7eb8e6" stroke-width="2"/><circle cx="27" cy="27" r="4" fill="#333"/><circle cx="37" cy="27" r="4" fill="#333"/><path d="M24 42 Q32 50 40 42" stroke="#333" stroke-width="2" fill="none"/><rect x="26" y="12" width="12" height="6" rx="2" fill="#333"/></svg>',
      '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#d4a373" stroke="#bc6c25" stroke-width="2"/><circle cx="26" cy="27" r="4" fill="#333"/><circle cx="38" cy="27" r="4" fill="#333"/><path d="M22 42 Q32 50 42 42" stroke="#333" stroke-width="2" fill="none"/><path d="M32 10 L36 18 L32 16 L28 18 Z" fill="#606c38"/></svg>',
    ];
    return svgs[id] || svgs[0];
  }

  const ACCESSORY_DEFS = [
    { id: "none", displayName: "None", iconSvg: "", overlaySvg: "" },
    { id: "glasses_round", displayName: "Round Glasses", iconSvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><ellipse cx="24" cy="32" rx="10" ry="8" fill="none" stroke="#333" stroke-width="2"/><ellipse cx="40" cy="32" rx="10" ry="8" fill="none" stroke="#333" stroke-width="2"/><path d="M34 30 L30 28" stroke="#333" stroke-width="2"/></svg>', overlaySvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><ellipse cx="26" cy="26" rx="10" ry="8" fill="none" stroke="#333" stroke-width="1.8"/><ellipse cx="38" cy="26" rx="10" ry="8" fill="none" stroke="#333" stroke-width="1.8"/><path d="M36 25 L28 25" stroke="#333" stroke-width="1.5"/></svg>' },
    { id: "glasses_sunglasses", displayName: "Sunglasses", iconSvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect x="14" y="26" width="14" height="10" rx="2" fill="#1a1a2e"/><rect x="36" y="26" width="14" height="10" rx="2" fill="#1a1a2e"/><path d="M28 28 L36 28" stroke="#16213e" stroke-width="3"/></svg>', overlaySvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect x="18" y="22" width="14" height="12" rx="2" fill="#1a1a2e"/><rect x="32" y="22" width="14" height="12" rx="2" fill="#1a1a2e"/><path d="M32 25 L32 25" stroke="#0f0f23" stroke-width="4"/></svg>' },
    { id: "mask_medical", displayName: "Medical Mask", iconSvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect x="16" y="28" width="32" height="18" rx="4" fill="#fff" stroke="#ccc" stroke-width="1"/><path d="M32 28 v18 M20 36 h24" stroke="#e0e0e0" stroke-width="1"/></svg>', overlaySvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M14 34 Q32 28 50 34 L50 52 Q32 48 14 52 Z" fill="#fff" stroke="#ddd" stroke-width="1"/><path d="M32 34 v18 M18 42 h28" stroke="#e8e8e8" stroke-width="1"/></svg>' },
    { id: "moustache", displayName: "Moustache", iconSvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M20 36 Q32 42 44 36" stroke="#333" stroke-width="3" fill="none"/></svg>', overlaySvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M22 38 Q28 42 32 40 Q36 42 42 38" stroke="#2d2d2d" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>' },
    { id: "hat_cap", displayName: "Cap", iconSvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M8 28 L32 8 L56 28 L56 36 L8 36 Z" fill="#1a237e"/><ellipse cx="32" cy="28" rx="24" ry="6" fill="#283593"/></svg>', overlaySvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M10 24 L32 4 L54 24 L54 30 L10 30 Z" fill="#1a237e"/><ellipse cx="32" cy="24" rx="22" ry="5" fill="#283593"/></svg>' },
    { id: "hat_cowboy", displayName: "Cowboy Hat", iconSvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><ellipse cx="32" cy="32" rx="28" ry="4" fill="#5d4037"/><path d="M32 8 Q12 20 16 28 Q20 24 32 22 Q44 24 48 28 Q52 20 32 8 Z" fill="#6d4c41"/></svg>', overlaySvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><ellipse cx="32" cy="26" rx="26" ry="4" fill="#5d4037"/><path d="M32 2 Q8 18 14 26 Q20 22 32 20 Q44 22 50 26 Q56 18 32 2 Z" fill="#6d4c41"/></svg>' },
    { id: "crown", displayName: "Crown", iconSvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M8 40 L16 28 L32 36 L48 28 L56 40 Z" fill="#ffd700" stroke="#b8860b" stroke-width="1"/><circle cx="32" cy="20" r="4" fill="#ffd700"/></svg>', overlaySvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M12 38 L20 26 L32 32 L44 26 L52 38 Z" fill="#ffd700" stroke="#b8860b" stroke-width="1"/><circle cx="32" cy="22" r="3" fill="#ffd700"/></svg>' },
    { id: "headband", displayName: "Headband", iconSvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M8 22 Q32 14 56 22" stroke="#e91e63" stroke-width="5" fill="none" stroke-linecap="round"/></svg>', overlaySvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M6 18 Q32 10 58 18" stroke="#e91e63" stroke-width="4" fill="none" stroke-linecap="round"/></svg>' },
    { id: "bow", displayName: "Bow", iconSvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><ellipse cx="28" cy="32" rx="8" ry="6" fill="#e91e63"/><ellipse cx="36" cy="32" rx="8" ry="6" fill="#e91e63"/><circle cx="32" cy="32" r="3" fill="#c2185b"/></svg>', overlaySvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><ellipse cx="26" cy="16" rx="10" ry="6" fill="#e91e63"/><ellipse cx="38" cy="16" rx="10" ry="6" fill="#e91e63"/><circle cx="32" cy="16" r="3" fill="#c2185b"/></svg>' },
    { id: "flower", displayName: "Flower", iconSvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="8" fill="#ffeb3b"/><circle cx="32" cy="20" r="6" fill="#f44336"/><circle cx="40" cy="28" r="6" fill="#f44336"/><circle cx="40" cy="36" r="6" fill="#f44336"/><circle cx="32" cy="44" r="6" fill="#f44336"/><circle cx="24" cy="36" r="6" fill="#f44336"/><circle cx="24" cy="28" r="6" fill="#f44336"/></svg>', overlaySvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="14" r="5" fill="#ffeb3b"/><circle cx="32" cy="8" r="4" fill="#f44336"/><circle cx="38" cy="12" r="4" fill="#f44336"/><circle cx="38" cy="18" r="4" fill="#f44336"/><circle cx="32" cy="22" r="4" fill="#f44336"/><circle cx="26" cy="18" r="4" fill="#f44336"/><circle cx="26" cy="12" r="4" fill="#f44336"/></svg>' },
    { id: "star", displayName: "Star", iconSvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M32 4 L36 24 L56 24 L40 36 L44 56 L32 44 L20 56 L24 36 L8 24 L28 24 Z" fill="#ffd700"/></svg>', overlaySvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M32 2 L34 18 L50 18 L38 28 L42 44 L32 36 L22 44 L26 28 L14 18 L30 18 Z" fill="#ffd700" stroke="#b8860b" stroke-width="0.5"/></svg>' },
  ];

  function getAccessoryById(id) {
    if (!id || id === "none") return ACCESSORY_DEFS[0];
    const def = ACCESSORY_DEFS.find((a) => a.id === id);
    return def || ACCESSORY_DEFS[0];
  }

  function getAccessoryOverlaySvg(accessoryId) {
    const def = getAccessoryById(accessoryId);
    return def.overlaySvg || "";
  }

  function renderPlayerAvatar(opts) {
    const avatarId = Math.max(0, Math.min(AVATAR_COUNT - 1, parseInt(opts.avatarId, 10) || 0));
    const accessoryId = opts.accessoryId === undefined || opts.accessoryId === null ? "none" : String(opts.accessoryId);
    const size = opts.size || "medium";
    const baseSvg = getAvatarSvg(avatarId);
    const overlaySvg = getAccessoryOverlaySvg(accessoryId);
    const sizeClass = "player-avatar-combo--" + (["small", "medium", "large"].indexOf(size) >= 0 ? size : "medium");
    let html = "<div class=\"player-avatar-combo " + sizeClass + "\">";
    html += "<span class=\"player-avatar-combo__base\">" + baseSvg + "</span>";
    if (overlaySvg) {
      html += "<span class=\"player-avatar-combo__accessory\">" + overlaySvg + "</span>";
    }
    html += "</div>";
    return html;
  }

  const BOT_NAMES = [
    "PuzzleMaster", "JigsawJane", "PieceHunter", "GridWalker", "SlotFiller",
    "TrayTamer", "QuickFit", "CalmPuzzler", "StarCollector", "LevelRush",
    "SmoothPlacer", "NoMistakes", "LuckyDrop", "TrophySeeker", "CupRunner",
    "PaceSetter", "ZenPuzzle", "FlashFit", "BreezeMode", "ChillBuilder",
    "ProPlacer", "AceSolver", "SwiftHand", "CleanSlate", "GoldenPieces",
    "SilverSlots", "BronzeTray", "MysterySolver", "PatternPro", "EdgeFirst",
  ];

  class LeaderboardManager {
    constructor(saveRef, persistFn) {
      this._save = saveRef;
      this._persist = persistFn || (() => {});
    }

    getPlayerScore() {
      return Math.max(0, parseInt(this._save.piecesCollectedTotal, 10) || 0);
    }

    incrementOnPiecePlaced() {
      const prev = this.getPlayerScore();
      this._save.piecesCollectedTotal = prev + 1;
      const weekId = getLeaderboardWeekId();
      if (this._save.leaderboardWeekId !== weekId) {
        this._save.leaderboardWeekId = weekId;
        this._save.weeklyPiecesCollected = 1;
      } else {
        this._save.weeklyPiecesCollected = (this._save.weeklyPiecesCollected || 0) + 1;
      }
      this._persist();
    }

    generateBotLeaderboard(playerScore) {
      const count = 9;
      const minScore = Math.max(0, playerScore - 80);
      const maxScore = Math.max(playerScore + 120, 100);
      const entries = [];
      for (let i = 0; i < count; i++) {
        const baseName = BOT_NAMES[i % BOT_NAMES.length];
        const name = i < BOT_NAMES.length ? baseName : baseName + " " + (Math.floor(i / BOT_NAMES.length) + 1);
        const base = minScore + Math.floor((maxScore - minScore) * (i / (count + 1)));
        const score = Math.max(0, base + Math.floor((Math.random() - 0.5) * 40));
        entries.push({
          id: "bot_" + i,
          name,
          score,
          isPlayer: false,
          initials: baseName.slice(0, 2).toUpperCase(),
        });
      }
      return entries;
    }

    getLeaderboardEntries() {
      const playerScore = this.getPlayerScore();
      const bots = this.generateBotLeaderboard(playerScore);
      const profile = this._save.playerProfile;
      const playerName = (profile && profile.name && String(profile.name).trim()) ? String(profile.name).trim() : "You";
      const avatarId = (profile && typeof profile.avatarId === "number") ? Math.max(0, Math.min(AVATAR_COUNT - 1, profile.avatarId)) : 0;
      const accessoryId = (profile && profile.accessoryId) ? String(profile.accessoryId) : "none";
      const playerEntry = {
        id: "player",
        name: playerName,
        score: playerScore,
        isPlayer: true,
        initials: playerName.slice(0, 2).toUpperCase() || "YO",
        avatarId,
        accessoryId,
      };
      const combined = bots.concat([playerEntry]);
      combined.sort((a, b) => (b.score - a.score));
      let final = combined.slice(0, 10);
      if (final.length === 10 && !final.some((e) => e.isPlayer)) {
        final = final.slice(0, 9).concat([playerEntry]);
        final.sort((a, b) => (b.score - a.score));
      }
      return final.map((e, i) => ({ ...e, rank: i + 1 }));
    }

    grantWeeklyHammerRewardIfEligible(entries) {
      const weekId = getLeaderboardWeekId();
      if (this._save.leaderboardHammerRewardWeekId === weekId) return 0;
      const player = (entries || []).find((e) => e.isPlayer);
      if (!player || player.rank > 3) return 0;
      const amount = player.rank === 1 ? 8 : (player.rank === 2 ? 5 : 3);
      this._save.eventHammers = (this._save.eventHammers || 0) + amount;
      this._save.leaderboardHammerRewardWeekId = weekId;
      this._persist();
      return amount;
    }

    renderChest(type) {
      const labels = { gold: "Gold Chest", silver: "Silver Chest", bronze: "Bronze Chest" };
      const wrap = document.createElement("div");
      wrap.className = "leaderboard-chest-wrap leaderboard-chest-wrap--" + type;
      const chest = document.createElement("div");
      chest.className = "leaderboard-chest leaderboard-chest--" + type;
      chest.setAttribute("aria-hidden", "true");
      const label = document.createElement("span");
      label.className = "leaderboard-chest-label";
      label.textContent = labels[type] || type;
      wrap.appendChild(chest);
      wrap.appendChild(label);
      return wrap;
    }

    getWeeklyRemainingMs() {
      const now = new Date();
      const end = new Date(now);
      const day = end.getDay();
      const daysUntilMonday = day === 0 ? 1 : 8 - day;
      end.setDate(end.getDate() + daysUntilMonday);
      end.setHours(0, 0, 0, 0);
      return Math.max(0, end.getTime() - now.getTime());
    }

    _renderLeaderboardAvatar(entry, size) {
      const wrap = document.createElement("div");
      wrap.className = size === "podium" ? "leaderboard-podium-avatar" : "leaderboard-row-avatar";
      const usePlayerAvatar = entry.isPlayer && (typeof entry.avatarId === "number" || typeof entry.avatarId === "string");
      if (usePlayerAvatar) {
        wrap.classList.add("leaderboard-avatar--svg");
        wrap.innerHTML = renderPlayerAvatar({ avatarId: entry.avatarId, accessoryId: entry.accessoryId || "none", size: "small" });
      } else {
        const img = document.createElement("img");
        img.className = "leaderboard-avatar-img";
        img.src = LEADERBOARD_BOT_AVATAR_SRC;
        img.alt = "";
        wrap.appendChild(img);
      }
      return wrap;
    }

    openLeaderboardModal() {
      const modal = document.getElementById("leaderboard-modal");
      if (!modal) return;
      const entries = this.getLeaderboardEntries();
      const hammersGranted = this.grantWeeklyHammerRewardIfEligible(entries);
      const top3 = [entries[0], entries[1], entries[2]].map((entry) => entry || { rank: 0, name: "—", score: 0, isPlayer: false });
      const rest = entries.slice(3);
      const podiumOrder = [top3[2], top3[0], top3[1]];
      const podiumMeta = [
        { rankClass: "rank-3", wreath: LEADERBOARD_TOP_WREATH_BRONZE_SRC, reward: LEADERBOARD_REWARD_BRONZE_SRC, cardClass: "leaderboard-podium-card--third" },
        { rankClass: "rank-1", wreath: LEADERBOARD_TOP_WREATH_GOLD_SRC, reward: LEADERBOARD_REWARD_GOLD_SRC, cardClass: "leaderboard-podium-card--first" },
        { rankClass: "rank-2", wreath: LEADERBOARD_TOP_WREATH_SILVER_SRC, reward: LEADERBOARD_REWARD_SILVER_SRC, cardClass: "leaderboard-podium-card--second" }
      ];

      const titleEl = document.getElementById("leaderboard-title");
      if (titleEl) titleEl.textContent = "Weekly Leaders";
      const subtitleEl = document.getElementById("leaderboard-subtitle");
      if (subtitleEl) subtitleEl.textContent = hammersGranted > 0 ? ("Puzzle Pieces Collected • +" + hammersGranted + " hammers") : "Puzzle Pieces Collected";
      const timerEl = document.getElementById("leaderboard-timer");
      if (timerEl) {
        const ms = this.getWeeklyRemainingMs();
        timerEl.textContent = "Ends in: " + formatRemaining(ms);
      }

      const bgEl = modal.querySelector(".leaderboard-screen-bg");
      if (bgEl) bgEl.style.backgroundImage = "url('" + LEADERBOARD_BG_SRC + "')";
      const bannerEl = modal.querySelector(".leaderboard-bottom-banner");
      if (bannerEl) bannerEl.style.backgroundImage = "url('" + LEADERBOARD_BANNER_SRC + "')";
      const backBtn = document.getElementById("leaderboard-close");
      if (backBtn) backBtn.style.backgroundImage = "url('" + LEADERBOARD_NAV_BACK_SRC + "')";
      const infoBtnEl = document.getElementById("btn-leaderboard-info");
      if (infoBtnEl) infoBtnEl.style.backgroundImage = "url('" + LEADERBOARD_NAV_INFO_SRC + "')";

      const top3El = document.getElementById("leaderboard-top3");
      if (top3El) {
        top3El.innerHTML = "";
        podiumOrder.forEach((e, i) => {
          const meta = podiumMeta[i];
          const card = document.createElement("div");
          card.className = "leaderboard-podium-card " + meta.cardClass + (e.isPlayer ? " leaderboard-entry--you" : "");

          const topBadge = document.createElement("div");
          topBadge.className = "leaderboard-podium-badge " + meta.rankClass;
          topBadge.style.backgroundImage = "url('" + meta.wreath + "')";
          const avatar = this._renderLeaderboardAvatar(e, "podium");
          topBadge.appendChild(avatar);

          const nameEl = document.createElement("div");
          nameEl.className = "leaderboard-podium-name";
          nameEl.textContent = e.name;

          const scoreEl = document.createElement("div");
          scoreEl.className = "leaderboard-podium-score";
          scoreEl.innerHTML = "<span>Points:</span><span>" + e.score + "</span>";

          const reward = document.createElement("div");
          reward.className = "leaderboard-podium-reward";
          reward.style.backgroundImage = "url('" + meta.reward + "')";

          card.appendChild(topBadge);
          card.appendChild(nameEl);
          card.appendChild(scoreEl);
          card.appendChild(reward);
          top3El.appendChild(card);
        });
      }

      const listEl = document.getElementById("leaderboard-list");
      if (listEl) {
        listEl.innerHTML = "";
        rest.forEach((e) => {
          const row = document.createElement("div");
          row.className = "leaderboard-row" + (e.isPlayer ? " leaderboard-entry--you" : "");

          const rankEl = document.createElement("span");
          rankEl.className = "leaderboard-row-rank";
          rankEl.textContent = String(e.rank);

          const nameEl = document.createElement("span");
          nameEl.className = "leaderboard-row-name";
          nameEl.textContent = e.name;

          const scoreWrap = document.createElement("span");
          scoreWrap.className = "leaderboard-row-score";
          scoreWrap.innerHTML = "<span class=\"leaderboard-row-score-label\">Points:</span> <span>" + e.score + "</span>";

          const avatarEl = this._renderLeaderboardAvatar(e, "row");

          row.appendChild(rankEl);
          row.appendChild(nameEl);
          row.appendChild(scoreWrap);
          row.appendChild(avatarEl);
          listEl.appendChild(row);
        });
      }

      modal.classList.remove("hidden");
      document.documentElement.classList.add("leaderboard-screen-active");
      document.body.classList.add("leaderboard-screen-active");
      const close = () => this.closeLeaderboardModal();
      document.getElementById("leaderboard-close").onclick = close;
      const infoOverlay = document.getElementById("leaderboard-info-overlay");
      const btnLeaderboardInfo = document.getElementById("btn-leaderboard-info");
      const closeInfo = () => {
        if (infoOverlay) infoOverlay.classList.add("hidden");
      };
      if (btnLeaderboardInfo) {
        btnLeaderboardInfo.onclick = () => {
          if (infoOverlay) infoOverlay.classList.remove("hidden");
        };
      }
      if (infoOverlay) {
        infoOverlay.onclick = (e) => { if (e.target === infoOverlay) closeInfo(); };
        const infoContinue = document.getElementById("leaderboard-info-continue");
        if (infoContinue) infoContinue.onclick = closeInfo;
      }
      if (this._leaderboardEscapeHandler) {
        window.removeEventListener("keydown", this._leaderboardEscapeHandler);
      }
      this._leaderboardEscapeHandler = (e) => {
        if (e.key !== "Escape") return;
        const info = document.getElementById("leaderboard-info-overlay");
        if (info && !info.classList.contains("hidden")) {
          closeInfo();
          e.preventDefault();
          return;
        }
        e.preventDefault();
        close();
      };
      window.addEventListener("keydown", this._leaderboardEscapeHandler);
    }

    closeLeaderboardModal() {
      const modal = document.getElementById("leaderboard-modal");
      if (modal) modal.classList.add("hidden");
      document.documentElement.classList.remove("leaderboard-screen-active");
      document.body.classList.remove("leaderboard-screen-active");
      document.getElementById("leaderboard-close").onclick = null;
      const infoOverlay = document.getElementById("leaderboard-info-overlay");
      if (infoOverlay) {
        infoOverlay.classList.add("hidden");
        infoOverlay.onclick = null;
      }
      const infoContinue = document.getElementById("leaderboard-info-continue");
      if (infoContinue) infoContinue.onclick = null;
      const btnLeaderboardInfo = document.getElementById("btn-leaderboard-info");
      if (btnLeaderboardInfo) btnLeaderboardInfo.onclick = null;
      if (this._leaderboardEscapeHandler) {
        window.removeEventListener("keydown", this._leaderboardEscapeHandler);
        this._leaderboardEscapeHandler = null;
      }
    }
  }

  function loadSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        const merged = { ...getDefaultSave(), ...data };
        if (merged.rewards && typeof merged.rewards.trophiesGoldCup === "undefined") {
          merged.rewards.trophiesGoldCup = false;
        }
        if (typeof merged.allCardsRewardClaimed === "undefined") {
          merged.allCardsRewardClaimed = false;
        }
        if (typeof merged.bpStarsTotal !== "number") {
          merged.bpStarsTotal = typeof merged.starTokens === "number" ? merged.starTokens : 0;
        }
        if (typeof merged.wheelNextFreeAt !== "number") merged.wheelNextFreeAt = 0;
        if (typeof merged.battlePassPremiumActive !== "boolean") merged.battlePassPremiumActive = false;
        if (typeof merged.xpTotal !== "number") merged.xpTotal = 0;
        if (!merged.bpClaims || !Array.isArray(merged.bpClaims.freeClaimedTiers)) {
          merged.bpClaims = { freeClaimedTiers: [], premiumClaimedTiers: [] };
        }
        if (!Array.isArray(merged.bpClaims.premiumClaimedTiers)) merged.bpClaims.premiumClaimedTiers = [];
        if (typeof merged.piecesCollectedTotal !== "number") merged.piecesCollectedTotal = 0;
        if (merged.leaderboardWeekId === undefined) merged.leaderboardWeekId = null;
        if (typeof merged.weeklyPiecesCollected !== "number") merged.weeklyPiecesCollected = 0;
        if (typeof merged.bpTutorStep !== "number") merged.bpTutorStep = 0;
        if (typeof merged.bonusLevelCompleted !== "boolean") merged.bonusLevelCompleted = false;
        if (typeof merged.bonusLevelTimesPlayed !== "number") merged.bonusLevelTimesPlayed = 0;
        if (typeof merged.gemsTotal !== "number") merged.gemsTotal = 0;
        if (typeof merged.albumStars !== "number") merged.albumStars = 0;
        if (typeof merged.eventHammers !== "number") merged.eventHammers = 0;
        if (typeof merged.piggyGemsStored !== "number") merged.piggyGemsStored = 0;
        if (typeof merged.piggyCap !== "number") merged.piggyCap = PIGGY_CAP_DEFAULT;
        if (typeof merged.piggyBroken !== "boolean") merged.piggyBroken = false;
        if (typeof merged.piggyEarnPerPiece !== "number") merged.piggyEarnPerPiece = PIGGY_EARN_PER_PIECE;
        if (typeof migrateLegacyCardIdsInSave === "function") migrateLegacyCardIdsInSave(merged);
        if (!merged.bpPremiumPackMeta || typeof merged.bpPremiumPackMeta !== "object") merged.bpPremiumPackMeta = {};
        if (typeof merged.lostTempleCurrentStage !== "number") merged.lostTempleCurrentStage = 0;
        if (!merged.lostTempleState || typeof merged.lostTempleState !== "object") merged.lostTempleState = null;
        if (typeof merged.leaderboardHammerRewardWeekId === "undefined") merged.leaderboardHammerRewardWeekId = null;
        if (!merged.raceState || typeof merged.raceState !== "object") {
          merged.raceState = { active: false, startTime: 0, playerPoints: 0, botPoints: [0, 0, 0, 0], winner: null, claimed: false };
        }
        if (typeof merged.puzzleEnergy !== "number") merged.puzzleEnergy = DEFAULT_PUZZLE_ENERGY;
        if (typeof merged.rubyCaveTutorialDone !== "boolean") merged.rubyCaveTutorialDone = false;
        if (typeof merged.rubyCaveRewardClaimed !== "boolean") merged.rubyCaveRewardClaimed = false;
        if (typeof merged.dailyTasksDateKey !== "string") merged.dailyTasksDateKey = "";
        if (!merged.dailyTasksClaims || typeof merged.dailyTasksClaims !== "object") merged.dailyTasksClaims = {};
        if (!merged.dailyTasksProgress || typeof merged.dailyTasksProgress !== "object") {
          merged.dailyTasksProgress = { level1Complete: 0, piecesPlaced: 0, wheelSpins: 0, raceActions: 0, piggyClaims: 0 };
        }
        if (typeof merged.dailyTasksProgress.level1Complete !== "number") merged.dailyTasksProgress.level1Complete = 0;
        if (typeof merged.dailyTasksProgress.piecesPlaced !== "number") merged.dailyTasksProgress.piecesPlaced = 0;
        if (typeof merged.dailyTasksProgress.wheelSpins !== "number") merged.dailyTasksProgress.wheelSpins = 0;
        if (typeof merged.dailyTasksProgress.raceActions !== "number") merged.dailyTasksProgress.raceActions = 0;
        if (typeof merged.dailyTasksProgress.piggyClaims !== "number") merged.dailyTasksProgress.piggyClaims = 0;
        if (typeof merged.dailyTasksMainRewardClaimed !== "boolean") merged.dailyTasksMainRewardClaimed = false;
        if (typeof merged.dailyTasksDayIndex !== "number") merged.dailyTasksDayIndex = 1;
        merged.collectionUnlocked = true;
        merged.collectionTutorialCompleted = true;
        merged.battlePassUnlocked = true;
        merged.bpTutorCompleted = true;
        merged.wheelUnlocked = true;
        merged.wheelTutorialSeen = true;
        merged.leaderboardUnlocked = true;
        merged.leaderboardTutorCompleted = true;
        merged.bonusLevelUnlocked = true;
        merged.raceUnlocked = true;
        merged.raceTutorialCompleted = true;
        merged.lostTempleUnlocked = true;
        merged.lostTempleTutorialCompleted = true;
        merged.profileSetupCompleted = true;
        if (!merged.albumEvent) {
          merged.albumEvent = { startAt: Date.now(), endAt: Date.now() + EVENT_DURATION_MS };
        }
        if (!merged.battlePassEvent) {
          merged.battlePassEvent = { startAt: Date.now(), endAt: Date.now() + EVENT_DURATION_MS };
        }
        if (!merged.lostTempleEvent) {
          merged.lostTempleEvent = { startAt: Date.now(), endAt: Date.now() + EVENT_DURATION_MS };
        }
        if (!merged.playerProfile || typeof merged.playerProfile !== "object") {
          const stableId = getStablePlayerId();
          merged.playerProfile = {
            id: stableId,
            name: generateDefaultUserName(),
            avatarId: 0,
            createdAt: Date.now(),
          };
        }
        if (!merged.playerProfile.id) merged.playerProfile.id = getStablePlayerId();
        if (typeof merged.playerProfile.avatarId !== "number") merged.playerProfile.avatarId = 0;
        merged.playerProfile.avatarId = Math.max(0, Math.min(AVATAR_COUNT - 1, merged.playerProfile.avatarId));
        if (merged.playerProfile.accessoryId === undefined || merged.playerProfile.accessoryId === null) merged.playerProfile.accessoryId = "none";
        if (typeof merged.playerProfile.accessoryId !== "string") merged.playerProfile.accessoryId = "none";
        if (!merged.playerProfile.createdAt) merged.playerProfile.createdAt = Date.now();
        return merged;
      }
      const legacy = getDefaultSave();
      const level = localStorage.getItem(STORAGE_KEYS.currentLevel);
      if (level !== null) legacy.currentLevel = Math.max(0, parseInt(level, 10));
      const coins = localStorage.getItem(STORAGE_KEYS.coins);
      if (coins !== null) legacy.coins = parseInt(coins, 10);
      const music = localStorage.getItem(STORAGE_KEYS.musicOn);
      if (music !== null) legacy.musicOn = music;
      const sfx = localStorage.getItem(STORAGE_KEYS.sfxOn);
      if (sfx !== null) legacy.sfxOn = sfx;
      return legacy;
    } catch (_) {
      return getDefaultSave();
    }
  }

  function saveSave(data) {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (_) {}
  }

  function getRaceState(save) {
    const rs = save.raceState || {};
    return {
      active: !!rs.active,
      startTime: typeof rs.startTime === "number" ? rs.startTime : 0,
      playerPoints: Math.min(RACE_TARGET_POINTS, Math.max(0, parseInt(rs.playerPoints, 10) || 0)),
      botPoints: Array.isArray(rs.botPoints) ? rs.botPoints.slice(0, 4).map((n) => Math.min(RACE_TARGET_POINTS, Math.max(0, parseInt(n, 10) || 0))) : [0, 0, 0, 0],
      winner: rs.winner || null,
      claimed: !!rs.claimed,
    };
  }

  function getRaceBotPointsAtTime(save, now) {
    const rs = getRaceState(save);
    if (!rs.active || rs.winner) return rs.botPoints.slice();
    const start = rs.startTime;
    if (!start) return [0, 0, 0, 0];
    const elapsed = Math.max(0, (now - start) / 1000);
    return RACE_BOT_INTERVALS_MS.map((intervalMs, i) => {
      const intervalSec = intervalMs / 1000;
      return Math.min(RACE_TARGET_POINTS, Math.floor(elapsed / intervalSec));
    });
  }

  function syncRaceBotPoints(save) {
    const rs = save.raceState || {};
    if (!rs.active || rs.winner) return;
    const now = Date.now();
    const botPoints = getRaceBotPointsAtTime(save, now);
    if (!save.raceState.botPoints) save.raceState.botPoints = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) save.raceState.botPoints[i] = botPoints[i];
  }

  function raceOnPuzzleCompleted(save) {
    const rs = getRaceState(save);
    if (!rs.active || rs.winner) return false;
    if (!save.raceState) save.raceState = { active: true, startTime: rs.startTime, playerPoints: 0, botPoints: [0, 0, 0, 0], winner: null, claimed: false };
    save.raceState.playerPoints = Math.min(RACE_TARGET_POINTS, (save.raceState.playerPoints || 0) + 1);
    if (save.raceState.playerPoints >= RACE_TARGET_POINTS) {
      save.raceState.winner = "player";
      return true;
    }
    syncRaceBotPoints(save);
    for (let i = 0; i < 4; i++) {
      if (save.raceState.botPoints[i] >= RACE_TARGET_POINTS) {
        save.raceState.winner = "bot" + (i + 1);
        return true;
      }
    }
    return false;
  }

  function startRace(save) {
    if (!save.raceState) save.raceState = { active: false, startTime: 0, playerPoints: 0, botPoints: [0, 0, 0, 0], winner: null, claimed: false };
    save.raceState.active = true;
    save.raceState.startTime = Date.now();
    save.raceState.playerPoints = 0;
    save.raceState.botPoints = [0, 0, 0, 0];
    save.raceState.winner = null;
    save.raceState.claimed = false;
  }

  function isRaceActive(save) {
    const rs = getRaceState(save);
    return rs.active && !rs.winner;
  }

  function isRaceFinished(save) {
    return !!(save.raceState && save.raceState.winner);
  }

  function getRaceWinner(save) {
    return (save.raceState && save.raceState.winner) || null;
  }

  function isRaceClaimable(save) {
    return getRaceWinner(save) === "player" && !(save.raceState && save.raceState.claimed);
  }

  function formatRaceRemaining(ms) {
    const remaining = Math.max(0, Math.floor(ms / 1000));
    const days = Math.floor(remaining / 86400);
    const hours = Math.floor((remaining % 86400) / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    return days > 0 ? `${days}d ${hours}h ${minutes}m` : `${hours}h ${minutes}m`;
  }

  const SHAPE_TYPES = ["triangle", "square", "pentagon", "hexagon", "star", "circle", "heart"];
  const PIECE_SIZE = 80;

  class ShapeRenderer {
    static drawShapePath(ctx, shapeType, rotationDeg = 0) {
      const cx = 0.5;
      const cy = 0.5;
      const r = 0.45;
      const rot = (rotationDeg * Math.PI) / 180;
      const cos = Math.cos;
      const sin = Math.sin;
      const at = (i, n, radius) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2 + rot;
        return { x: cx + cos(a) * radius, y: cy + sin(a) * radius };
      };
      ctx.beginPath();
      switch (shapeType) {
        case "triangle": {
          for (let i = 0; i < 3; i++) {
            const p = at(i, 3, r);
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          }
          ctx.closePath();
          break;
        }
        case "square": {
          for (let i = 0; i < 4; i++) {
            const p = at(i, 4, r);
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          }
          ctx.closePath();
          break;
        }
        case "pentagon": {
          for (let i = 0; i < 5; i++) {
            const p = at(i, 5, r);
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          }
          ctx.closePath();
          break;
        }
        case "hexagon": {
          for (let i = 0; i < 6; i++) {
            const p = at(i, 6, r);
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          }
          ctx.closePath();
          break;
        }
        case "star": {
          const n = 5;
          for (let i = 0; i < n * 2; i++) {
            const p = at(i, n * 2, i % 2 === 0 ? r : r * 0.4);
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          }
          ctx.closePath();
          break;
        }
        case "circle":
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          break;
        case "heart": {
          const t = 0.5;
          const w = 0.45;
          ctx.moveTo(t, cy - r * 0.3);
          ctx.bezierCurveTo(t + w * 0.5, cy - r * 0.9, t + w, cy - r * 0.2, t + w * 0.5, cy + r * 0.2);
          ctx.bezierCurveTo(t, cy + r * 0.5, t, cy + r * 0.9, t, cy + r * 0.9);
          ctx.bezierCurveTo(t, cy + r * 0.9, t - w * 0.5, cy + r * 0.2, t - w * 0.5, cy + r * 0.2);
          ctx.bezierCurveTo(t - w, cy - r * 0.2, t - w * 0.5, cy - r * 0.9, t, cy - r * 0.3);
          ctx.closePath();
          break;
        }
        default:
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
      }
    }

    static render(width, height, shapeType, seed, rotationDeg = 0) {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, width, height);

      const hue = (seed * 137) % 360;
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, `hsl(${hue}, 75%, 72%)`);
      grad.addColorStop(0.5, `hsl(${(hue + 35) % 360}, 80%, 78%)`);
      grad.addColorStop(1, `hsl(${(hue + 70) % 360}, 75%, 68%)`);

      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(Math.min(width, height) * 0.9, Math.min(width, height) * 0.9);
      ctx.translate(-0.5, -0.5);
      this.drawShapePath(ctx, shapeType, rotationDeg);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.45)";
      ctx.lineWidth = 0.08;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.restore();

      if (seed % 3 === 1) {
        ctx.save();
        ctx.globalAlpha = 0.15;
        ctx.translate(width / 2, height / 2);
        ctx.scale(Math.min(width, height) * 0.7, Math.min(width, height) * 0.7);
        ctx.translate(-0.5, -0.5);
        this.drawShapePath(ctx, shapeType, rotationDeg);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.restore();
      }
      return canvas;
    }
  }

  const shapePiecesCache = {};

  function generateShapePieces(level) {
    const key = level.id != null ? "l" + level.id : level.shapeType + "-" + level.shapeSeed + "-" + level.cols + "x" + level.rows;
    if (shapePiecesCache[key]) return shapePiecesCache[key];

    const { cols, rows, shapeType, shapeSeed, rotation = 0 } = level;
    const fullWidth = cols * PIECE_SIZE;
    const fullHeight = rows * PIECE_SIZE;
    const canvas = ShapeRenderer.render(fullWidth, fullHeight, shapeType, shapeSeed, rotation);

    const urls = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = PIECE_SIZE;
        sliceCanvas.height = PIECE_SIZE;
        const sctx = sliceCanvas.getContext("2d");
        sctx.drawImage(
          canvas,
          col * PIECE_SIZE,
          row * PIECE_SIZE,
          PIECE_SIZE,
          PIECE_SIZE,
          0,
          0,
          PIECE_SIZE,
          PIECE_SIZE
        );
        urls.push(sliceCanvas.toDataURL("image/png"));
      }
    }
    const result = urls;
    shapePiecesCache[key] = result;
    return result;
  }

  const shapeGhostCache = {};
  function getShapeGhostDataUrl(level) {
    const key = level.id != null ? "g" + level.id : level.shapeType + "-" + level.shapeSeed + "-" + level.cols + "x" + level.rows;
    if (shapeGhostCache[key]) return shapeGhostCache[key];
    const { cols, rows, shapeType, shapeSeed, rotation = 0 } = level;
    const fullWidth = cols * PIECE_SIZE;
    const fullHeight = rows * PIECE_SIZE;
    const canvas = ShapeRenderer.render(fullWidth, fullHeight, shapeType, shapeSeed, rotation);
    const url = canvas.toDataURL("image/png");
    shapeGhostCache[key] = url;
    return url;
  }

  function generateCardArt(artSeed, size) {
    size = size || 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const hue = (artSeed * 67) % 360;
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, `hsl(${hue}, 75%, 85%)`);
    grad.addColorStop(1, `hsl(${hue}, 70%, 55%)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = `hsl(${(hue + 80) % 360}, 60%, 40%)`;
    ctx.beginPath();
    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.32 * (0.8 + (artSeed % 3) * 0.1);
    for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.lineWidth = 2;
    ctx.stroke();
    return canvas.toDataURL("image/png");
  }

  function generateRewardCharacterArt(artSeed, size) {
    size = size || 200;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const cx = size / 2;
    const cy = size / 2;
    const hue = (artSeed * 67) % 360;
    for (let i = 8; i >= 0; i--) {
      const r = 60 + i * 8;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r + 20);
      g.addColorStop(0, `hsla(${hue}, 70%, 75%, ${0.15 - i * 0.012})`);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r + 20, 0, Math.PI * 2);
      ctx.fill();
    }
    const bodyGrad = ctx.createRadialGradient(cx, cy - 10, 0, cx, cy, 55);
    bodyGrad.addColorStop(0, `hsl(${hue}, 75%, 78%)`);
    bodyGrad.addColorStop(1, `hsl(${hue}, 70%, 50%)`);
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 42, 48, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.25)";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = "#2d3436";
    ctx.beginPath();
    ctx.ellipse(cx - 12, cy - 8, 6, 8, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + 12, cy - 8, 6, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    return canvas.toDataURL("image/png");
  }

  const CARDS_PER_ALBUM = 9;
  const ALBUM_DEFS = [
    { id: "africa", name: "Africa", cardIds: ["africa_0", "africa_1", "africa_2", "africa_3", "africa_4", "africa_5", "africa_6", "africa_7", "africa_8"] },
    { id: "fantasy", name: "Fantasy", cardIds: ["fantasy_0", "fantasy_1", "fantasy_2", "fantasy_3", "fantasy_4", "fantasy_5", "fantasy_6", "fantasy_7", "fantasy_8"] },
    { id: "pixar", name: "Pixar-like Cartoon", cardIds: ["pixar_0", "pixar_1", "pixar_2", "pixar_3", "pixar_4", "pixar_5", "pixar_6", "pixar_7", "pixar_8"] },
    { id: "holiday", name: "Holiday & New Year", cardIds: ["holiday_0", "holiday_1", "holiday_2", "holiday_3", "holiday_4", "holiday_5", "holiday_6", "holiday_7", "holiday_8"] },
    { id: "space", name: "Space Opera", cardIds: ["space_0", "space_1", "space_2", "space_3", "space_4", "space_5", "space_6", "space_7", "space_8"] },
    { id: "postapoc", name: "Post-Apocalypse", cardIds: ["postapoc_0", "postapoc_1", "postapoc_2", "postapoc_3", "postapoc_4", "postapoc_5", "postapoc_6", "postapoc_7", "postapoc_8"] },
    { id: "paris", name: "Paris", cardIds: ["paris_0", "paris_1", "paris_2", "paris_3", "paris_4", "paris_5", "paris_6", "paris_7", "paris_8"] },
    { id: "victorian", name: "Victorian Era", cardIds: ["victorian_0", "victorian_1", "victorian_2", "victorian_3", "victorian_4", "victorian_5", "victorian_6", "victorian_7", "victorian_8"] },
  ];

  const LEGACY_CARD_ID_MAP = {};
  for (let i = 0; i < CARDS_PER_ALBUM; i++) {
    LEGACY_CARD_ID_MAP["fresh_" + i] = "africa_" + i;
    LEGACY_CARD_ID_MAP["safari_" + i] = "fantasy_" + i;
  }

  function migrateLegacyCardIdsInSave(save) {
    const cards = save && save.cards;
    if (!cards) return;
    for (const [legacyId, newId] of Object.entries(LEGACY_CARD_ID_MAP)) {
      if (cards.collected && cards.collected[legacyId]) {
        cards.collected[newId] = true;
        delete cards.collected[legacyId];
      }
      if (cards.duplicates && cards.duplicates[legacyId]) {
        cards.duplicates[newId] = (cards.duplicates[newId] || 0) + (cards.duplicates[legacyId] || 0);
        delete cards.duplicates[legacyId];
      }
    }
    if (cards.newInbox && cards.newInbox.length) {
      cards.newInbox = cards.newInbox.map((id) => LEGACY_CARD_ID_MAP[id] || id);
    }
    save.albums = save.albums || {};
    ALBUM_DEFS.forEach((def) => {
      if (!save.albums[def.id]) save.albums[def.id] = { collectedCount: 0 };
      const count = (def.cardIds || []).filter((id) => cards.collected && cards.collected[id]).length;
      save.albums[def.id].collectedCount = count;
    });
  }

  const CARD_NAMES_BY_ALBUM = {
    africa: ["Elephant", "Giraffes", "Lion", "Zebra", "Waterfall", "Savanna Sunset", "Acacia Tree", "Oasis", "Village Drums"],
    fantasy: ["Dragon", "Castle", "Enchanted Forest", "Magic Staff", "Unicorn", "Wizard Hat", "Treasure Chest", "Fairy", "Knight Shield"],
    pixar: ["Robot Helper", "Kid with Backpack", "Raccoon with Cookie", "Toy Airplane", "Family Dinner", "Submarine in Bathtub", "Magical Library", "Treehouse at Sunset", "Monster in Pajamas"],
    holiday: ["Snowy Cabin", "Christmas Tree", "Gingerbread House", "Santa Silhouette", "Fireworks", "Hot Cocoa", "Reindeer with Scarf", "Snowman", "Gift Boxes"],
    space: ["Hero at Ringed Planet", "Starship in Nebula", "Alien Marketplace", "Energy Blade", "Space Station", "Droid Companion", "Desert Outpost", "Galactic Hologram", "Space Battle"],
    postapoc: ["Robot Watering Plants", "Overgrown Street", "Solar Camper", "Drone with Seeds", "Welcome Sign", "Rooftop Garden", "Robot Dog", "Subway Mushrooms", "Sunrise Valley"],
    paris: ["Eiffel Tower", "Paris Café", "Seine Boat", "Accordion Player", "Arc de Triomphe", "Montmartre Stairs", "Croissant & Coffee", "Metro Entrance", "Rainy Umbrellas"],
    victorian: ["Steam Carriage", "Parlor Chandelier", "Pocket Watch", "Feathered Hat", "Gas Lamp Library", "Train Station", "Tea Set", "Street Lanterns", "Ornate Key"],
  };
  const CARD_DEFS = {};
  ALBUM_DEFS.forEach((album, aIdx) => {
    const names = CARD_NAMES_BY_ALBUM[album.id] || [];
    for (let i = 0; i < CARDS_PER_ALBUM; i++) {
      const id = album.cardIds[i];
      const num = String(i + 1).padStart(2, "0");
      const rarity = i < 6 ? 1 : i < 8 ? 2 : 3;
      CARD_DEFS[id] = {
        id,
        name: names[i] || album.name + " " + (i + 1),
        rarity,
        rarityStars: rarity,
        albumId: album.id,
        artSeed: aIdx * 20 + i,
        imageSrc: CARD_IMAGE_BASE + album.id + "/card_" + num + ".png",
      };
    }
  });

  const PACK_RARITY_WEIGHTS = {
    1: [85, 13, 2],
    2: [65, 28, 7],
    3: [45, 40, 15],
  };
  const PACK_MIN_CARDS = 2;
  const PACK_MAX_CARDS = 5;
  const COINS_PER_DUPLICATE = { 1: 50, 2: 150, 3: 500 };
  const STAR_CHEST_COSTS = { wood: 100, silver: 250, gold: 500 };
  const CARDS_BY_RARITY = { 1: [], 2: [], 3: [] };
  Object.keys(CARD_DEFS).forEach((id) => {
    const r = CARD_DEFS[id].rarity;
    if (CARDS_BY_RARITY[r]) CARDS_BY_RARITY[r].push(id);
  });

  function getDuplicateStarRewardByCard(cardId, fallbackRarity) {
    const def = CARD_DEFS[cardId] || null;
    const stars = def && typeof def.rarityStars === "number" ? def.rarityStars : (typeof fallbackRarity === "number" ? fallbackRarity : 1);
    return Math.max(1, Math.min(5, stars));
  }

  function getPackStarsForTier(tier) {
    if (tier <= 3) return 1;
    if (tier <= 7) return 2;
    return 3;
  }

  function ensurePackMeta(save, tier) {
    save.bpPremiumPackMeta = save.bpPremiumPackMeta || {};
    if (!save.bpPremiumPackMeta[tier]) {
      save.bpPremiumPackMeta[tier] = {
        cardCount: PACK_MIN_CARDS + Math.floor(Math.random() * (PACK_MAX_CARDS - PACK_MIN_CARDS + 1)),
        packStars: getPackStarsForTier(tier),
      };
    }
    return save.bpPremiumPackMeta[tier];
  }

  function renderPackIcon(opts) {
    const { cardCount = 2, locked = false, dimmed = false, size = "small", claimable = false } = opts || {};
    const wrap = document.createElement("div");
    wrap.className = "bp-pack-icon bp-pack-icon--" + size + (locked ? " bp-pack-icon--locked" : "") + (dimmed ? " bp-pack-icon--dim" : "") + (claimable ? " bp-pack-icon--claimable" : "");
    wrap.setAttribute("aria-hidden", "true");
    const img = document.createElement("img");
    img.className = "bp-pack-icon__img";
    img.src = PACK_REFERENCE_IMAGE;
    img.alt = "";
    wrap.appendChild(img);
    const countWrap = document.createElement("div");
    countWrap.className = "bp-pack-icon__count";
    countWrap.innerHTML = "<span class=\"bp-pack-icon__count-cards\"><span class=\"bp-pack-icon__count-card bp-pack-icon__count-card--back\"></span><span class=\"bp-pack-icon__count-card bp-pack-icon__count-card--front\"><span class=\"bp-pack-icon__count-num\">" + cardCount + "</span></span></span>";
    wrap.appendChild(countWrap);
    if (locked) {
      const lock = document.createElement("div");
      lock.className = "bp-pack-icon__lock";
      lock.innerHTML = "<svg viewBox=\"0 0 24 24\" class=\"bp-pack-icon__lock-svg\"><path fill=\"currentColor\" d=\"M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z\"/></svg>";
      wrap.appendChild(lock);
    }
    return wrap;
  }

  function rollRarity(packStars) {
    const weights = PACK_RARITY_WEIGHTS[packStars] || PACK_RARITY_WEIGHTS[1];
    const roll = Math.random() * 100;
    if (roll < weights[0]) return 1;
    if (roll < weights[0] + weights[1]) return 2;
    return 3;
  }

  function rollPack(packStars, saveRef, fixedCount) {
    const cards = saveRef.cards || {};
    const collected = cards.collected || {};
    const inbox = cards.newInbox || [];
    const owned = (id) => !!collected[id] || inbox.indexOf(id) >= 0;
    const count = typeof fixedCount === "number" && fixedCount >= PACK_MIN_CARDS && fixedCount <= PACK_MAX_CARDS ? fixedCount : PACK_MIN_CARDS + Math.floor(Math.random() * (PACK_MAX_CARDS - PACK_MIN_CARDS + 1));
    const results = [];
    const pickedInPack = [];
    for (let i = 0; i < count; i++) {
      const rarity = rollRarity(packStars);
      const pool = CARDS_BY_RARITY[rarity] && CARDS_BY_RARITY[rarity].length ? CARDS_BY_RARITY[rarity] : Object.keys(CARD_DEFS);
      let cardId;
      let attempts = 0;
      do {
        cardId = pool[Math.floor(Math.random() * pool.length)];
        attempts++;
        if (attempts > 50) break;
      } while (pickedInPack.indexOf(cardId) >= 0);
      pickedInPack.push(cardId);
      const isDuplicate = owned(cardId);
      const coinsAwarded = isDuplicate ? (COINS_PER_DUPLICATE[rarity] || 50) : 0;
      const starsAwarded = isDuplicate ? getDuplicateStarRewardByCard(cardId, rarity) : 0;
      results.push({ cardId, rarity, isDuplicate, coinsAwarded, starsAwarded });
    }
    const totalCoins = results.reduce((s, r) => s + r.coinsAwarded, 0);
    const totalStars = results.reduce((s, r) => s + (r.starsAwarded || 0), 0);
    return { results, totalCoins, totalStars };
  }

  function applyPackResults(save, packResult) {
    const cards = save.cards || {};
    if (!cards.newInbox) cards.newInbox = [];
    if (!cards.collected) cards.collected = {};
    let totalCoins = 0;
    packResult.results.forEach((r) => {
      if (r.isDuplicate && r.coinsAwarded) {
        save.coins = (save.coins || 0) + r.coinsAwarded;
        totalCoins += r.coinsAwarded;
        save.albumStars = (save.albumStars || 0) + (r.starsAwarded || 0);
      } else if (!r.isDuplicate) {
        cards.newInbox.push(r.cardId);
      }
    });
    return totalCoins;
  }

  const REWARD_DEFS = {};
  ALBUM_DEFS.forEach((a) => {
    REWARD_DEFS[a.id] = { name: a.name, rarity: "Common", artSeed: 10 };
  });

  function getTotalCardsAvailable() {
    return ALBUM_DEFS.reduce((sum, a) => sum + (a.cardIds ? a.cardIds.length : 0), 0);
  }

  class CollectionManager {
    constructor(saveRef, persistFn) {
      this._save = saveRef;
      this._persist = persistFn || (() => saveSave(this._save));
    }

    getState() {
      return this._save;
    }

    _persist() {
      saveSave(this._save);
    }

    isUnlockTriggered() {
      return this._save.collectionUnlocked === true;
    }

    isAvailable() {
      return this._save.collectionTutorialCompleted === true;
    }

    getLastAnimatedInboxSignature() {
      return this._save.lastAnimatedInboxSignature || "";
    }

    setLastAnimatedInboxSignature(sig) {
      this._save.lastAnimatedInboxSignature = sig;
      this._persist();
    }

    hasUncollectedNew() {
      return (this._save.cards.newInbox || []).length > 0;
    }

    getAlbumStars() {
      return Math.max(0, this._save.albumStars || 0);
    }

    addAlbumStars(amount) {
      const add = Math.max(0, Math.floor(amount || 0));
      if (!add) return this.getAlbumStars();
      this._save.albumStars = this.getAlbumStars() + add;
      this._persist();
      return this.getAlbumStars();
    }

    canAffordStarChest(cost) {
      return this.getAlbumStars() >= Math.max(0, Math.floor(cost || 0));
    }

    spendAlbumStars(amount) {
      const spend = Math.max(0, Math.floor(amount || 0));
      if (!this.canAffordStarChest(spend)) return false;
      this._save.albumStars = this.getAlbumStars() - spend;
      this._persist();
      return true;
    }

    openStarChest(type) {
      const key = type === "gold" ? "gold" : (type === "silver" ? "silver" : "wood");
      const cost = STAR_CHEST_COSTS[key];
      if (!this.spendAlbumStars(cost)) return null;
      const rewardsByType = {
        wood: { coins: 150, packStars: 1, cardCount: 2, label: "Wooden Chest" },
        silver: { coins: 450, packStars: 2, cardCount: 3, label: "Silver Chest" },
        gold: { coins: 1100, packStars: 3, cardCount: 5, label: "Premium Gold Chest" },
      };
      const reward = rewardsByType[key];
      this._save.coins = (this._save.coins || 0) + reward.coins;
      this._persist();
      return {
        type: key,
        cost,
        label: reward.label,
        coins: reward.coins,
        packStars: reward.packStars,
        cardCount: reward.cardCount,
      };
    }

    _ensureCardsStructure() {
      const cards = this._save.cards;
      if (!cards.collected) cards.collected = {};
      if (!cards.newInbox) cards.newInbox = [];
      if (!cards.duplicates) cards.duplicates = {};
      this._save.albums = this._save.albums || {};
      ALBUM_DEFS.forEach((def) => {
        if (!this._save.albums[def.id]) this._save.albums[def.id] = { collectedCount: 0 };
      });
      this._migrateLegacyCardIds();
    }

    _migrateLegacyCardIds() {
      const cards = this._save.cards;
      let changed = false;
      for (const [legacyId, newId] of Object.entries(LEGACY_CARD_ID_MAP)) {
        if (cards.collected[legacyId]) {
          cards.collected[newId] = true;
          delete cards.collected[legacyId];
          changed = true;
        }
        if (cards.duplicates[legacyId]) {
          cards.duplicates[newId] = (cards.duplicates[newId] || 0) + (cards.duplicates[legacyId] || 0);
          delete cards.duplicates[legacyId];
          changed = true;
        }
      }
      if (cards.newInbox && cards.newInbox.length) {
        const migrated = cards.newInbox.map((id) => LEGACY_CARD_ID_MAP[id] || id);
        if (migrated.some((id, i) => id !== cards.newInbox[i])) {
          cards.newInbox = migrated;
          changed = true;
        }
      }
      if (changed) this._persist();
    }

    grantGiftCards() {
      this._ensureCardsStructure();
      const firstAlbum = ALBUM_DEFS[0];
      const giftIds = firstAlbum && firstAlbum.cardIds ? firstAlbum.cardIds.slice(0, 2) : [];
      const cards = this._save.cards;
      const added = [];
      for (const cardId of giftIds) {
        if (cards.collected[cardId]) continue;
        if ((cards.newInbox || []).indexOf(cardId) >= 0) continue;
        cards.newInbox.push(cardId);
        added.push(cardId);
      }
      this._persist();
      return added;
    }

    grantLevelDrop(levelIndex) {
      if (!this.isAvailable()) return null;
      this._ensureCardsStructure();
      const allCardIds = ALBUM_DEFS.reduce((acc, a) => acc.concat(a.cardIds || []), []);
      const cards = this._save.cards;
      const inbox = cards.newInbox || [];
      const uncollected = allCardIds.filter((id) => !cards.collected[id] && inbox.indexOf(id) < 0);
      let cardId;
      if (uncollected.length > 0) {
        cardId = uncollected[0];
        cards.newInbox.push(cardId);
      } else {
        cardId = allCardIds[levelIndex % allCardIds.length];
        cards.duplicates[cardId] = (cards.duplicates[cardId] || 0) + 1;
        this._save.albumStars = (this._save.albumStars || 0) + getDuplicateStarRewardByCard(cardId, (CARD_DEFS[cardId] && CARD_DEFS[cardId].rarity) || 1);
      }
      this._persist();
      return cardId;
    }

    onLevelCompleted(levelIndex, opts) {
      opts = opts || {};
      this._persist();
      return { unlockedNow: false, droppedCardIds: [] };
    }

    awardCardFromBattlePass() {
      this._ensureCardsStructure();
      const allCardIds = ALBUM_DEFS.reduce((acc, a) => acc.concat(a.cardIds || []), []);
      const cards = this._save.cards;
      const inbox = cards.newInbox || [];
      const uncollected = allCardIds.filter((id) => !cards.collected[id] && inbox.indexOf(id) < 0);
      if (uncollected.length > 0) {
        const cardId = uncollected[0];
        cards.newInbox.push(cardId);
        this._persist();
        return { cardId };
      }
      const coinReward = 10;
      this._save.coins = (this._save.coins || 0) + coinReward;
      this._persist();
      return { cardId: null, coins: coinReward };
    }

    getWheelSegmentPool() {
      this._ensureCardsStructure();
      const allCardIds = ALBUM_DEFS.reduce((acc, a) => acc.concat(a.cardIds || []), []);
      const cards = this._save.cards;
      const inbox = cards.newInbox || [];
      const uncollected = allCardIds.filter((id) => !cards.collected[id] && inbox.indexOf(id) < 0);
      const collected = allCardIds.filter((id) => cards.collected[id]);
      const cardPool = [];
      const cardSegmentCount = 4;
      for (let i = 0; i < cardSegmentCount; i++) {
        if (i < uncollected.length) {
          cardPool.push(uncollected[i]);
        } else if (collected.length > 0) {
          cardPool.push(collected[(i - uncollected.length) % collected.length]);
        } else {
          cardPool.push(allCardIds[i % allCardIds.length]);
        }
      }
      return [
        { type: "card", cardId: cardPool[0] },
        { type: "card", cardId: cardPool[1] },
        { type: "card", cardId: cardPool[2] },
        { type: "card", cardId: cardPool[3] },
        { type: "hammers", amount: 3 },
        { type: "pack", packStars: 2, cardCount: 3 },
      ];
    }

    awardCardFromWheel(cardId) {
      this._ensureCardsStructure();
      const cards = this._save.cards;
      const alreadyCollected = !!cards.collected[cardId];
      cards.newInbox.push(cardId);
      if (alreadyCollected) {
        cards.duplicates[cardId] = (cards.duplicates[cardId] || 0) + 1;
        this._save.albumStars = (this._save.albumStars || 0) + getDuplicateStarRewardByCard(cardId, (CARD_DEFS[cardId] && CARD_DEFS[cardId].rarity) || 1);
      }
      this._persist();
      return { cardId };
    }

    markTutorialCompleted() {
      this._save.collectionTutorialCompleted = true;
      this._persist();
    }

    resetCollectionState() {
      this._ensureCardsStructure();
      this._save.cards.collected = {};
      this._save.cards.newInbox = [];
      this._save.cards.duplicates = {};
      ALBUM_DEFS.forEach((def) => {
        const album = this._save.albums[def.id];
        if (album) album.collectedCount = 0;
      });
      this._persist();
    }

    collectCard(cardId) {
      this._ensureCardsStructure();
      const cards = this._save.cards;
      const idx = (cards.newInbox || []).indexOf(cardId);
      if (idx < 0) return null;
      cards.newInbox.splice(idx, 1);
      cards.collected[cardId] = true;
      const albumId = CARD_DEFS[cardId] && CARD_DEFS[cardId].albumId;
      if (albumId) {
        const album = this._save.albums[albumId];
        if (album) album.collectedCount = (album.collectedCount || 0) + 1;
      }
      this._persist();
      let result = null;
      const albumId2 = CARD_DEFS[cardId] && CARD_DEFS[cardId].albumId;
      if (albumId2) {
        const albumDef = ALBUM_DEFS.find((a) => a.id === albumId2);
        const total = albumDef ? albumDef.cardIds.length : CARDS_PER_ALBUM;
        const collected = (this._save.albums[albumId2] && this._save.albums[albumId2].collectedCount) || 0;
        if (collected >= total) {
          this._save.rewards = this._save.rewards || { trophies: 0, unlockedRewards: [], trophiesGoldCup: false };
          this._save.rewards.trophies = (this._save.rewards.trophies || 0) + 1;
          this._save.rewards.unlockedRewards = this._save.rewards.unlockedRewards || [];
          if (this._save.rewards.unlockedRewards.indexOf(albumId2) < 0) {
            this._save.rewards.unlockedRewards.push(albumId2);
          }
          this._save.coins = (this._save.coins || 0) + 20;
          this._persist();
          const reward = REWARD_DEFS[albumId2] || { name: "Truffle", rarity: "Common", artSeed: 10 };
          result = { albumComplete: true, reward };
        }
      }
      const collectedTotal = this.getCollectedTotal();
      const totalAvailable = getTotalCardsAvailable();
      if (collectedTotal === totalAvailable && totalAvailable > 0 && !this._save.allCardsRewardClaimed) {
        this._save.allCardsRewardClaimed = true;
        this._save.rewards = this._save.rewards || { trophies: 0, unlockedRewards: [], trophiesGoldCup: false };
        this._save.rewards.trophiesGoldCup = true;
        this._save.rewards.unlockedRewards = this._save.rewards.unlockedRewards || [];
        if (this._save.rewards.unlockedRewards.indexOf("goldCup") < 0) {
          this._save.rewards.unlockedRewards.push("goldCup");
        }
        this._save.coins = (this._save.coins || 0) + 50;
        this._persist();
        if (!result) result = {};
        result.allCardsComplete = true;
      }
      return result;
    }

    getCollectedTotal(includeInbox) {
      const cards = this._save.cards;
      const c = cards && cards.collected ? cards.collected : {};
      let n = Object.keys(c).filter((id) => c[id]).length;
      if (includeInbox && cards && cards.newInbox && cards.newInbox.length) {
        const inInbox = cards.newInbox.filter((id) => !c[id]);
        n += inInbox.length;
      }
      return n;
    }

    getAlbumProgress(albumId, includeInbox) {
      const def = ALBUM_DEFS.find((a) => a.id === albumId);
      const total = def ? def.cardIds.length : CARDS_PER_ALBUM;
      let collected = (this._save.albums[albumId] && this._save.albums[albumId].collectedCount) || 0;
      if (includeInbox && def && this._save.cards && this._save.cards.newInbox) {
        const coll = this._save.cards.collected || {};
        const inInbox = this._save.cards.newInbox.filter((id) => def.cardIds.indexOf(id) >= 0 && !coll[id]);
        collected += inInbox.length;
      }
      return { collected, total };
    }

    getCardsForAlbum(albumId) {
      const def = ALBUM_DEFS.find((a) => a.id === albumId);
      if (!def) return [];
      return def.cardIds.map((id) => {
        const c = CARD_DEFS[id];
        const collected = this._save.cards.collected[id];
        const inNew = (this._save.cards.newInbox || []).indexOf(id) >= 0;
        const dup = (this._save.cards.duplicates[id] || 0);
        return {
          id,
          name: c ? c.name : "?",
          rarityStars: c ? c.rarityStars : 1,
          artSeed: c ? c.artSeed : 0,
          imageSrc: c ? c.imageSrc : "",
          collected,
          isNew: inNew,
          duplicates: dup,
        };
      });
    }
  }

  class CollectionUI {
    constructor(collectionManager, gameApp) {
      this.cm = collectionManager;
      this.app = gameApp;
      this.packAnimator = new CollectionPackAnimator();
      this.unlockModal = document.getElementById("collection-unlock-modal");
      this.tutorialOverlay = document.getElementById("collection-tutorial-overlay");
      this.albumScreen = document.getElementById("album-screen");
      this.rewardModal = document.getElementById("reward-modal");
      this.toast = document.getElementById("toast-card-found");
      this._selectedAlbumId = ALBUM_DEFS[0] ? ALBUM_DEFS[0].id : "pixar";
      this._collectionView = "hub";
      this._albumDetailPage = 1;
      this._albumDetailPageSize = 6;
      this._albumEscapeHandler = null;
    }

    getAlbumProgress(albumId) {
      return this.cm.getAlbumProgress(albumId, true);
    }

    albumHasNewCards(albumId) {
      const inbox = (this.cm.getState().cards && this.cm.getState().cards.newInbox) || [];
      return inbox.some((cardId) => CARD_DEFS[cardId] && CARD_DEFS[cardId].albumId === albumId);
    }

    _shouldAnimateNewPack() {
      if (!this.cm.isAvailable()) return false;
      const inbox = (this.cm.getState().cards.newInbox || []).slice();
      if (inbox.length === 0) return false;
      const sig = inbox.sort().join(",");
      return sig !== this.cm.getLastAnimatedInboxSignature();
    }

    _getInboxSignature() {
      const inbox = (this.cm.getState().cards.newInbox || []).slice();
      return inbox.sort().join(",");
    }

    showUnlockFlow(onDone) {
      this.cm.grantGiftCards();
      this._onUnlockDone = onDone;
      this.unlockModal.classList.remove("hidden");
      const preview = document.getElementById("collection-unlock-preview");
      preview.innerHTML = "";
      const firstAlbum = ALBUM_DEFS[0];
      const previewCardIds = firstAlbum && firstAlbum.cardIds ? firstAlbum.cardIds.slice(0, 2) : [];
      for (let i = 0; i < 2; i++) {
        const cardId = previewCardIds[i] || ("pixar_" + i);
        const def = CARD_DEFS[cardId];
        const div = document.createElement("div");
        div.className = "card-preview-mini";
        if (def && def.imageSrc) {
          const img = document.createElement("img");
          img.src = def.imageSrc;
          img.alt = "";
          img.loading = "eager";
          img.className = "card-preview-mini-img";
          img.onerror = () => { div.classList.add("card-preview-placeholder"); };
          div.appendChild(img);
        } else {
          div.classList.add("card-preview-placeholder");
        }
        preview.appendChild(div);
      }
      const placeholders = document.getElementById("collection-unlock-placeholders");
      placeholders.innerHTML = "";
      for (let i = 0; i < 2; i++) {
        const d = document.createElement("div");
        d.className = "placeholder-dot";
        d.textContent = "?";
        placeholders.appendChild(d);
      }
      const skip = () => {
        this.unlockModal.classList.add("hidden");
        this._runTutorialThenAlbum(() => {
          if (onDone) onDone();
        });
      };
      document.getElementById("btn-collection-lets-go").onclick = skip;
      document.getElementById("collection-unlock-skip").onclick = skip;
      this.unlockModal.onclick = (e) => { if (e.target === this.unlockModal) skip(); };
    }

    _runTutorialThenAlbum(onDone) {
      const steps = [
        "These are your cards! Complete levels to find new Blockies.",
        "Tap NEW cards in your album to collect them.",
      ];
      let stepIndex = 0;
      const bubble = document.getElementById("collection-tutorial-text");
      const overlay = this.tutorialOverlay;
      const advance = () => {
        stepIndex++;
        if (stepIndex >= steps.length) {
          overlay.classList.add("hidden");
          this.cm.markTutorialCompleted();
          this.app.collectionUI.updateCollectionButtons();
          this.showAlbum(onDone);
        } else {
          bubble.textContent = steps[stepIndex];
        }
      };
      bubble.textContent = steps[0];
      overlay.classList.remove("hidden");
      document.getElementById("collection-tutorial-skip").onclick = advance;
      overlay.onclick = (e) => { if (e.target === overlay) advance(); };
    }

    showAlbum(onBackCallback) {
      this._onAlbumBackCallback = onBackCallback;
      this.app.ui.showScreen("album-screen");
      this._applyAlbumFigmaAssets();
      document.documentElement.classList.add("album-screen-active");
      document.body.classList.add("album-screen-active");
      if (this._albumEscapeHandler) window.removeEventListener("keydown", this._albumEscapeHandler);
      this._albumEscapeHandler = (e) => {
        if (e.key !== "Escape") return;
        const featuresInfo = document.getElementById("albumFeaturesInfoOverlay");
        if (featuresInfo && !featuresInfo.classList.contains("hidden")) {
          this.closeAlbumFeaturesInfoOverlay();
          e.preventDefault();
          return;
        }
        const info = document.getElementById("albumInfoOverlay");
        if (info && !info.classList.contains("hidden")) {
          this.closeAlbumInfoOverlay();
          e.preventDefault();
          return;
        }
        if (this._collectionView === "albumDetail") {
          this._onAlbumBackToHub();
        } else {
          this._onAlbumClose();
        }
        e.preventDefault();
      };
      window.addEventListener("keydown", this._albumEscapeHandler);
      this.updateGlobalCardsProgress();
      this.updateAlbumStarsUI();
      this._collectionView = "hub";
      this._showHubView();
      this._startAlbumEventTimer();
      this._bindAlbumInfoButton();
      this._bindAlbumStarButton();
    }

    openAlbumInfoOverlay() {
      this.openAlbumFeaturesInfoOverlay();
    }

    openAlbumExchangeOverlay() {
      const overlay = document.getElementById("albumInfoOverlay");
      if (!overlay) return;
      this._applyAlbumExchangeAssets();
      this.updateAlbumStarsUI();
      overlay.classList.remove("hidden");
      const self = this;
      overlay.onclick = (e) => {
        if (e.target === overlay) self.closeAlbumInfoOverlay();
      };
      const closeBtn = document.getElementById("btn-album-info-close");
      if (closeBtn) closeBtn.onclick = () => self.closeAlbumInfoOverlay();
      const woodBtn = document.getElementById("btn-album-info-open-wood");
      const silverBtn = document.getElementById("btn-album-info-open-silver");
      const goldBtn = document.getElementById("btn-album-info-open-gold");
      if (woodBtn) woodBtn.onclick = () => self._openStarChest("wood");
      if (silverBtn) silverBtn.onclick = () => self._openStarChest("silver");
      if (goldBtn) goldBtn.onclick = () => self._openStarChest("gold");
    }

    openAlbumFeaturesInfoOverlay() {
      const overlay = document.getElementById("albumFeaturesInfoOverlay");
      if (!overlay) return;
      this._applyAlbumFeaturesInfoAssets();
      overlay.classList.remove("hidden");
      const self = this;
      const close = () => self.closeAlbumFeaturesInfoOverlay();
      overlay.onclick = (e) => {
        if (e.target === overlay) close();
      };
      const closeBtn = document.getElementById("btn-album-features-info-close");
      if (closeBtn) closeBtn.onclick = close;
    }

    closeAlbumInfoOverlay() {
      const overlay = document.getElementById("albumInfoOverlay");
      if (overlay) {
        overlay.classList.add("hidden");
        overlay.onclick = null;
      }
      const closeBtn = document.getElementById("btn-album-info-close");
      if (closeBtn) closeBtn.onclick = null;
      const woodBtn = document.getElementById("btn-album-info-open-wood");
      const silverBtn = document.getElementById("btn-album-info-open-silver");
      const goldBtn = document.getElementById("btn-album-info-open-gold");
      if (woodBtn) woodBtn.onclick = null;
      if (silverBtn) silverBtn.onclick = null;
      if (goldBtn) goldBtn.onclick = null;
    }

    closeAlbumFeaturesInfoOverlay() {
      const overlay = document.getElementById("albumFeaturesInfoOverlay");
      if (overlay) {
        overlay.classList.add("hidden");
        overlay.onclick = null;
      }
      const closeBtn = document.getElementById("btn-album-features-info-close");
      if (closeBtn) closeBtn.onclick = null;
    }

    _bindAlbumInfoButton() {
      const btn = document.getElementById("btn-album-info");
      if (btn) btn.onclick = () => this.openAlbumInfoOverlay();
    }

    _bindAlbumStarButton() {
      const btn = document.getElementById("btn-album-stars");
      if (btn) btn.onclick = () => this.openAlbumExchangeOverlay();
      this.updateAlbumStarsUI();
    }

    updateAlbumStarsUI() {
      const stars = this.cm.getAlbumStars();
      const compact = stars > 9999 ? "9999+" : String(stars);
      const albumCountEl = document.getElementById("album-stars-count");
      if (albumCountEl) albumCountEl.textContent = compact;
      const exchangeCountEl = document.getElementById("album-exchange-stars-count");
      if (exchangeCountEl) exchangeCountEl.textContent = compact;
      const modalCountEl = document.getElementById("star-chests-balance-count");
      if (modalCountEl) modalCountEl.textContent = compact;

      const woodBtn = document.getElementById("btn-star-chest-wood");
      const silverBtn = document.getElementById("btn-star-chest-silver");
      const goldBtn = document.getElementById("btn-star-chest-gold");
      const infoWoodBtn = document.getElementById("btn-album-info-open-wood");
      const infoSilverBtn = document.getElementById("btn-album-info-open-silver");
      const infoGoldBtn = document.getElementById("btn-album-info-open-gold");
      if (woodBtn) woodBtn.disabled = !this.cm.canAffordStarChest(STAR_CHEST_COSTS.wood);
      if (silverBtn) silverBtn.disabled = !this.cm.canAffordStarChest(STAR_CHEST_COSTS.silver);
      if (goldBtn) goldBtn.disabled = !this.cm.canAffordStarChest(STAR_CHEST_COSTS.gold);
      if (infoWoodBtn) infoWoodBtn.disabled = !this.cm.canAffordStarChest(STAR_CHEST_COSTS.wood);
      if (infoSilverBtn) infoSilverBtn.disabled = !this.cm.canAffordStarChest(STAR_CHEST_COSTS.silver);
      if (infoGoldBtn) infoGoldBtn.disabled = !this.cm.canAffordStarChest(STAR_CHEST_COSTS.gold);
    }

    openStarChestsModal() {
      const overlay = document.getElementById("star-chests-modal");
      if (!overlay) return;
      this.updateAlbumStarsUI();
      overlay.classList.remove("hidden");
      const self = this;
      const close = () => self.closeStarChestsModal();
      const closeBtn = document.getElementById("star-chests-close");
      if (closeBtn) closeBtn.onclick = close;
      overlay.onclick = (e) => { if (e.target === overlay) close(); };
      const woodBtn = document.getElementById("btn-star-chest-wood");
      const silverBtn = document.getElementById("btn-star-chest-silver");
      const goldBtn = document.getElementById("btn-star-chest-gold");
      if (woodBtn) woodBtn.onclick = () => self._openStarChest("wood");
      if (silverBtn) silverBtn.onclick = () => self._openStarChest("silver");
      if (goldBtn) goldBtn.onclick = () => self._openStarChest("gold");
    }

    closeStarChestsModal() {
      const overlay = document.getElementById("star-chests-modal");
      if (overlay) {
        overlay.classList.add("hidden");
        overlay.onclick = null;
      }
      const closeBtn = document.getElementById("star-chests-close");
      if (closeBtn) closeBtn.onclick = null;
      const woodBtn = document.getElementById("btn-star-chest-wood");
      const silverBtn = document.getElementById("btn-star-chest-silver");
      const goldBtn = document.getElementById("btn-star-chest-gold");
      if (woodBtn) woodBtn.onclick = null;
      if (silverBtn) silverBtn.onclick = null;
      if (goldBtn) goldBtn.onclick = null;
    }

    _openStarChest(type) {
      const reward = this.cm.openStarChest(type);
      if (!reward) {
        this.updateAlbumStarsUI();
        return;
      }
      this.app.ui.setCoins(this.cm.getState().coins);
      this.updateAlbumStarsUI();

      const afterPack = () => {
        this.updateAlbumStarsUI();
        this.updateGlobalCardsProgress();
        this.updateCollectionButtons();
      };
      const afterPopup = () => {
        this.app._openPackOpeningFlowGeneric(reward.packStars, reward.cardCount, afterPack);
      };
      const text = reward.label + "\n+" + reward.coins + " coins\n+" + reward.cardCount + " cards pack";
      this._showStarChestReward(text, afterPopup);
    }

    _showStarChestReward(text, onClose) {
      const overlay = document.getElementById("star-chest-reward-overlay");
      const textEl = document.getElementById("star-chest-reward-text");
      const okBtn = document.getElementById("btn-star-chest-reward-ok");
      if (!overlay || !textEl || !okBtn) {
        if (onClose) onClose();
        return;
      }
      textEl.textContent = text;
      overlay.classList.remove("hidden");
      const close = () => {
        overlay.classList.add("hidden");
        overlay.onclick = null;
        okBtn.onclick = null;
        if (onClose) onClose();
      };
      okBtn.onclick = close;
      overlay.onclick = (e) => { if (e.target === overlay) close(); };
    }

    _showHubView() {
      this._collectionView = "hub";
      this.closeAlbumFeaturesInfoOverlay();
      const hub = document.getElementById("album-overview-hub");
      const detail = document.getElementById("album-detail-view");
      const screen = document.getElementById("album-screen");
      const backBtn = document.getElementById("btn-album-back");
      if (hub) hub.classList.remove("hidden");
      if (detail) detail.classList.add("hidden");
      if (screen) screen.classList.remove("album-screen--detail");
      const titleEl = document.getElementById("album-screen-title");
      if (titleEl) titleEl.textContent = "Cards Album";
      const progressWrap = document.getElementById("album-header-progress");
      if (progressWrap) progressWrap.classList.add("hidden");
      if (backBtn) {
        backBtn.classList.add("hidden");
        backBtn.onclick = null;
      }
      this.renderAlbumsOverview();
    }

    _showDetailView() {
      this._collectionView = "albumDetail";
      this.closeAlbumFeaturesInfoOverlay();
      const hub = document.getElementById("album-overview-hub");
      const detail = document.getElementById("album-detail-view");
      const screen = document.getElementById("album-screen");
      if (hub) hub.classList.add("hidden");
      if (detail) detail.classList.remove("hidden");
      if (screen) screen.classList.add("album-screen--detail");
      const def = ALBUM_DEFS.find((a) => a.id === this._selectedAlbumId);
      const titleEl = document.getElementById("album-screen-title");
      if (titleEl) titleEl.textContent = def ? def.name : "Album";
      const progressWrap = document.getElementById("album-header-progress");
      if (progressWrap) progressWrap.classList.remove("hidden");
      this._updateAlbumProgress(this._selectedAlbumId);
      this._updateDetailPagerUI();
      const backBtn = document.getElementById("btn-album-back");
      if (backBtn) {
        backBtn.classList.remove("hidden");
        backBtn.onclick = () => this._onAlbumBackToHub();
      }
      const prevBtn = document.getElementById("btn-album-detail-prev");
      const nextBtn = document.getElementById("btn-album-detail-next");
      if (prevBtn) prevBtn.onclick = () => this._changeAlbumPage(-1);
      if (nextBtn) nextBtn.onclick = () => this._changeAlbumPage(1);
    }

    _onAlbumClose() {
      if (this._albumEventTimerId) {
        clearInterval(this._albumEventTimerId);
        this._albumEventTimerId = null;
      }
      this.closeStarChestsModal();
      this.closeAlbumFeaturesInfoOverlay();
      if (this._albumEscapeHandler) {
        window.removeEventListener("keydown", this._albumEscapeHandler);
        this._albumEscapeHandler = null;
      }
      document.documentElement.classList.remove("album-screen-active");
      document.body.classList.remove("album-screen-active");
      const cb = this._onAlbumBackCallback;
      this._onAlbumBackCallback = null;
      if (cb) cb();
      else this.app.ui.showScreen("game-screen");
    }

    _onAlbumBackToHub() {
      this._showHubView();
    }

    _startAlbumEventTimer() {
      const albumTimerEl = document.getElementById("album-event-timer");
      if (!albumTimerEl) return;
      const tick = () => {
        const ms = getRemainingMs(this.cm.getState(), "albumEvent");
        albumTimerEl.textContent = ms > 0 ? "Ends in: " + formatRemaining(ms) : "Ended";
        if (ms <= 0 && this._albumEventTimerId) {
          clearInterval(this._albumEventTimerId);
          this._albumEventTimerId = null;
        }
      };
      tick();
      if (this._albumEventTimerId) clearInterval(this._albumEventTimerId);
      this._albumEventTimerId = setInterval(tick, 1000);
    }

    renderAlbumsOverview() {
      const grid = document.getElementById("album-tiles-grid");
      if (!grid) return;
      grid.innerHTML = "";
      ALBUM_DEFS.forEach((def) => {
        const p = this.getAlbumProgress(def.id);
        const hasNew = this.albumHasNewCards(def.id);
        const tile = document.createElement("button");
        tile.type = "button";
        tile.className = "album-cover-tile"
          + (hasNew ? " album-cover-tile--new" : "")
          + (p.collected >= p.total ? " album-cover-tile--complete" : "");
        tile.dataset.albumId = def.id;
        const cover = document.createElement("div");
        cover.className = "album-cover-tile-art";
        const firstCardId = (def.cardIds && def.cardIds[0]) || null;
        const imgSrc = firstCardId && CARD_DEFS[firstCardId] && CARD_DEFS[firstCardId].imageSrc ? CARD_DEFS[firstCardId].imageSrc : "";
        if (imgSrc) {
          const img = document.createElement("img");
          img.src = imgSrc;
          img.alt = "";
          img.loading = "lazy";
          img.onerror = () => cover.classList.add("album-cover-tile-art--placeholder");
          cover.appendChild(img);
        } else {
          cover.classList.add("album-cover-tile-art--placeholder");
          cover.textContent = "?";
        }
        tile.appendChild(cover);
        if (hasNew) {
          const ribbon = document.createElement("span");
          ribbon.className = "album-tile-ribbon-new";
          ribbon.textContent = "NEW!";
          tile.appendChild(ribbon);
        }
        const nameSpan = document.createElement("span");
        nameSpan.className = "album-cover-tile-name";
        nameSpan.textContent = def.name || def.id;
        tile.appendChild(nameSpan);
        const pill = document.createElement("span");
        pill.className = "album-cover-tile-progress";
        pill.textContent = p.collected + "/" + p.total;
        tile.appendChild(pill);
        tile.onclick = () => this.openAlbum(def.id);
        grid.appendChild(tile);
      });
    }

    openAlbum(albumId) {
      this._selectedAlbumId = albumId;
      this._albumDetailPage = 1;
      this._renderAlbumGrid(albumId);
      this._updateAlbumProgress(albumId);
      this._updateDetailPagerUI();
      this._updateTapCollectHint();
      this._showDetailView();
      if (this._shouldAnimateNewPack()) {
        const inbox = (this.cm.getState().cards.newInbox || []).slice();
        const firstId = inbox[0];
        const firstAlbumId = firstId && CARD_DEFS[firstId] ? CARD_DEFS[firstId].albumId : null;
        if (firstAlbumId === albumId) {
          const getTile = (cardId) => document.querySelector("#album-grid [data-card-id=\"" + cardId + "\"]");
          const getImageSrc = (cardId) => (CARD_DEFS[cardId] && CARD_DEFS[cardId].imageSrc) || "";
          this.packAnimator.play(inbox, getTile, getImageSrc, () => {
            this.cm.setLastAnimatedInboxSignature(this._getInboxSignature());
          });
        }
      }
    }

    _updateAlbumProgress(albumId) {
      const id = albumId || this._selectedAlbumId;
      const p = this.cm.getAlbumProgress(id, true);
      const def = ALBUM_DEFS.find((a) => a.id === id);
      const el = document.getElementById("album-progress-text");
      if (el) el.textContent = p.collected + "/" + p.total;
      const nameEl = document.getElementById("album-name");
      if (nameEl) nameEl.textContent = def ? def.name : "";
    }

    _getAlbumPageCount(albumId) {
      const cards = this.cm.getCardsForAlbum(albumId || this._selectedAlbumId);
      const perPage = Math.max(1, this._albumDetailPageSize || 6);
      return Math.max(1, Math.ceil(cards.length / perPage));
    }

    _updateDetailPagerUI() {
      const pageCount = this._getAlbumPageCount(this._selectedAlbumId);
      this._albumDetailPage = Math.max(1, Math.min(pageCount, this._albumDetailPage || 1));
      const pageText = document.getElementById("album-detail-page-text");
      if (pageText) pageText.textContent = this._albumDetailPage + "/" + pageCount;
      const prevBtn = document.getElementById("btn-album-detail-prev");
      const nextBtn = document.getElementById("btn-album-detail-next");
      if (prevBtn) prevBtn.disabled = this._albumDetailPage <= 1;
      if (nextBtn) nextBtn.disabled = this._albumDetailPage >= pageCount;
    }

    _changeAlbumPage(delta) {
      const pageCount = this._getAlbumPageCount(this._selectedAlbumId);
      const next = Math.max(1, Math.min(pageCount, this._albumDetailPage + delta));
      if (next === this._albumDetailPage) return;
      this._albumDetailPage = next;
      this._renderAlbumGrid(this._selectedAlbumId);
      this._updateDetailPagerUI();
      this._updateTapCollectHint();
    }

    updateGlobalCardsProgress() {
      const total = getTotalCardsAvailable();
      const collected = this.cm.getCollectedTotal(true);
      const pct = total > 0 ? Math.min(100, (collected / total) * 100) : 0;
      const isComplete = total > 0 && collected >= total;

      const textEl = document.getElementById("cards-progress-text");
      if (textEl) textEl.textContent = collected + " / " + total;
      const textHomeEl = document.getElementById("cards-progress-text-home");
      if (textHomeEl) textHomeEl.textContent = collected + "/" + total;
      const fillHomeEl = document.getElementById("cards-progress-fill-home");
      if (fillHomeEl) fillHomeEl.style.width = pct + "%";

      if (isComplete && this.app && this.app._save) {
        this.app._save.bonusLevelUnlocked = true;
        saveSave(this.app._save);
      }

      const homeWidget = document.getElementById("cards-progress-widget-home");
      if (homeWidget) {
        if (this.cm.isAvailable()) homeWidget.classList.remove("hidden");
        else homeWidget.classList.add("hidden");
      }
    }

    showFinalRewardModal(onClose) {
      const modal = document.getElementById("final-reward-modal");
      if (!modal) return;
      if (typeof AudioPlayer !== "undefined" && AudioPlayer.win) AudioPlayer.win();
      modal.classList.remove("hidden");
      const close = () => {
        modal.classList.add("hidden");
        modal.onclick = null;
        const btn = document.getElementById("btn-final-reward-close");
        if (btn) btn.onclick = null;
        this.updateGlobalCardsProgress();
        if (onClose) onClose();
      };
      modal.onclick = (e) => { if (e.target === modal) close(); };
      const btn = document.getElementById("btn-final-reward-close");
      if (btn) btn.onclick = close;
    }

    _updateTapCollectHint() {
      const cards = this.cm.getCardsForAlbum(this._selectedAlbumId) || [];
      const hasNew = cards.some((c) => c.isNew);
      const el = document.getElementById("album-tap-collect-hint");
      if (hasNew) el.classList.remove("hidden");
      else el.classList.add("hidden");
    }

    _renderAlbumGrid(albumId) {
      const grid = document.getElementById("album-grid");
      if (!grid) return;
      grid.innerHTML = "";
      const id = albumId || this._selectedAlbumId;
      const cards = this.cm.getCardsForAlbum(id);
      const perPage = Math.max(1, this._albumDetailPageSize || 6);
      const pageCount = Math.max(1, Math.ceil(cards.length / perPage));
      this._albumDetailPage = Math.max(1, Math.min(pageCount, this._albumDetailPage || 1));
      const start = (this._albumDetailPage - 1) * perPage;
      const pageCards = cards.slice(start, start + perPage);
      pageCards.forEach((card) => {
        const tile = document.createElement("div");
        const cardState = card.isNew ? "new" : (card.collected ? "collected" : "locked");
        tile.className = "album-card-tile album-card-tile--" + cardState + (cardState === "locked" ? " locked" : "");
        tile.dataset.cardId = card.id;
        tile.innerHTML = '<span class="card-stars"></span>';
        const starsEl = tile.querySelector(".card-stars");
        if (starsEl) {
          starsEl.innerHTML = "";
          for (let i = 0; i < card.rarityStars; i++) {
            const s = document.createElement("img");
            s.src = ALBUM_CARD_STAR_SRC;
            s.alt = "";
            s.className = "card-star-icon";
            starsEl.appendChild(s);
          }
        }
        if (card.isNew) {
          const tag = document.createElement("span");
          tag.className = "card-new-tag";
          tag.textContent = "NEW";
          tile.appendChild(tag);
        }
        if (card.collected || card.isNew) {
          const art = document.createElement("div");
          art.className = "card-art";
          if (card.imageSrc) {
            const img = document.createElement("img");
            img.src = card.imageSrc;
            img.alt = card.name;
            img.loading = "lazy";
            img.className = "card-art-img";
            img.onerror = function () {
              art.classList.add("card-art-placeholder");
              this.style.display = "none";
            };
            art.appendChild(img);
          } else {
            art.classList.add("card-art-placeholder");
          }
          tile.appendChild(art);
          const nameSpan = document.createElement("span");
          nameSpan.className = "card-name";
          nameSpan.textContent = card.name;
          tile.appendChild(nameSpan);
          if (card.collected && card.duplicates > 0) {
            const dup = document.createElement("span");
            dup.className = "card-duplicate-count";
            dup.textContent = "x" + (card.duplicates + 1);
            tile.appendChild(dup);
          }
        } else {
          const sil = document.createElement("div");
          sil.className = "card-silhouette";
          sil.style.backgroundImage = "url('" + ALBUM_QUESTION_TILE_SRC + "')";
          tile.appendChild(sil);
        }
        tile.onclick = () => this._onCardTap(tile, card);
        grid.appendChild(tile);
      });
      this._updateDetailPagerUI();
    }

    _applyAlbumFigmaAssets() {
      const bg = document.querySelector("#album-screen .album-screen-bg");
      if (bg) bg.style.backgroundImage = "url('" + ALBUM_BG_SRC + "')";
      const cardIcon = document.querySelector("#album-screen .album-resource-icon--cards");
      if (cardIcon) cardIcon.style.backgroundImage = "url('" + ALBUM_ICON_CARD_SRC + "')";
      const chestBtn = document.getElementById("btn-album-stars");
      if (chestBtn) chestBtn.style.backgroundImage = "url('" + ALBUM_ICON_CHEST_SRC + "')";
      const infoBtn = document.getElementById("btn-album-info");
      if (infoBtn) infoBtn.style.backgroundImage = "url('" + ALBUM_ICON_INFO_SRC + "')";
      const coinIcon = document.querySelector("#album-screen .album-prize-icon--coin");
      if (coinIcon) coinIcon.style.backgroundImage = "url('" + ALBUM_ICON_COIN_SRC + "')";
      const gemIcon = document.querySelector("#album-screen .album-prize-icon--gem");
      if (gemIcon) gemIcon.style.backgroundImage = "url('" + ALBUM_ICON_GEM_SRC + "')";
      const sortIcon = document.querySelector("#album-screen .album-prize-icon--sort");
      if (sortIcon) sortIcon.style.backgroundImage = "url('" + ALBUM_ICON_SORT_SRC + "')";
      const prev = document.getElementById("btn-album-detail-prev");
      const next = document.getElementById("btn-album-detail-next");
      if (prev) prev.style.backgroundImage = "url('" + ALBUM_ICON_ARROW_LEFT_SRC + "')";
      if (next) next.style.backgroundImage = "url('" + ALBUM_ICON_ARROW_RIGHT_SRC + "')";
      const bottomBanner = document.querySelector("#album-screen .album-bottom-banner");
      if (bottomBanner) bottomBanner.style.backgroundImage = "url('" + ALBUM_BOTTOM_BANNER_SRC + "')";
    }

    _applyAlbumExchangeAssets() {
      const closeIcon = document.querySelector("#albumInfoOverlay .album-exchange-close");
      if (closeIcon) closeIcon.style.backgroundImage = "url('" + ALBUM_EXCHANGE_CLOSE_SRC + "')";
      const woodChest = document.querySelector("#albumInfoOverlay .album-exchange-chest--wood");
      if (woodChest) woodChest.style.backgroundImage = "url('" + ALBUM_EXCHANGE_CHEST_WOOD_SRC + "')";
      const silverChest = document.querySelector("#albumInfoOverlay .album-exchange-chest--silver");
      if (silverChest) silverChest.style.backgroundImage = "url('" + ALBUM_EXCHANGE_CHEST_SILVER_SRC + "')";
      const goldChest = document.querySelector("#albumInfoOverlay .album-exchange-chest--gold");
      if (goldChest) goldChest.style.backgroundImage = "url('" + ALBUM_EXCHANGE_CHEST_GOLD_SRC + "')";
      document.querySelectorAll("#albumInfoOverlay .album-exchange-pill-icon--coin").forEach((el) => {
        el.style.backgroundImage = "url('" + ALBUM_EXCHANGE_COIN_SRC + "')";
      });
      document.querySelectorAll("#albumInfoOverlay .album-exchange-pill-icon--energy").forEach((el) => {
        el.style.backgroundImage = "url('" + ALBUM_EXCHANGE_ENERGY_SRC + "')";
      });
      document.querySelectorAll("#albumInfoOverlay .album-exchange-pill-icon--gem").forEach((el) => {
        el.style.backgroundImage = "url('" + ALBUM_EXCHANGE_GEM_SRC + "')";
      });
      document.querySelectorAll("#albumInfoOverlay .album-exchange-pill-icon--bp").forEach((el) => {
        el.style.backgroundImage = "url('" + ALBUM_EXCHANGE_BP_STAR_SRC + "')";
      });
      document.querySelectorAll("#albumInfoOverlay .album-exchange-requirement-icon, #albumInfoOverlay .album-exchange-stars-icon").forEach((el) => {
        el.style.backgroundImage = "url('" + ALBUM_CARD_STAR_SRC + "')";
      });
    }

    _isFeaturesAlbum(albumId) {
      if (!albumId) return this._collectionView === "albumDetail";
      const def = ALBUM_DEFS.find((a) => a.id === albumId);
      const name = def && def.name ? String(def.name) : "";
      const explicitMatch = albumId === "features" || /features?/i.test(name);
      const hasExplicitFeaturesAlbum = ALBUM_DEFS.some((a) => a.id === "features" || /features?/i.test(String(a.name || "")));
      if (hasExplicitFeaturesAlbum) return explicitMatch;
      return this._collectionView === "albumDetail";
    }

    _applyAlbumFeaturesInfoAssets() {
      const pack = document.querySelector("#albumFeaturesInfoOverlay .album-features-tutorial-icon--pack");
      const star = document.querySelector("#albumFeaturesInfoOverlay .album-features-tutorial-icon--star");
      const chest = document.querySelector("#albumFeaturesInfoOverlay .album-features-tutorial-icon--chest");
      const tap = document.querySelector("#albumFeaturesInfoOverlay .album-features-info-close-icon");
      if (pack) pack.style.backgroundImage = "url('" + ALBUM_FEATURES_INFO_PACK_SRC + "')";
      if (star) star.style.backgroundImage = "url('" + ALBUM_FEATURES_INFO_STAR_SRC + "')";
      if (chest) chest.style.backgroundImage = "url('" + ALBUM_FEATURES_INFO_CHEST_SRC + "')";
      if (tap) tap.style.backgroundImage = "url('" + ALBUM_FEATURES_INFO_TAP_SRC + "')";
    }

    _onCardTap(tile, card) {
      if (!card.isNew) return;
      tile.classList.add("collecting");
      const result = this.cm.collectCard(card.id);
      setTimeout(() => {
        tile.classList.remove("collecting");
        this._renderAlbumGrid(this._selectedAlbumId);
        this._updateAlbumProgress(this._selectedAlbumId);
        this._updateTapCollectHint();
        this.updateGlobalCardsProgress();
        this.app.ui.setCoins(this.cm.getState().coins);
        const albumIdForReward = CARD_DEFS[card.id] ? CARD_DEFS[card.id].albumId : (ALBUM_DEFS[0] && ALBUM_DEFS[0].id);
        if (result && result.albumComplete) {
          this.showReward(result.reward, albumIdForReward, () => {
            this._updateCollectionButtons();
            if (result.allCardsComplete) this.showFinalRewardModal(() => this._updateCollectionButtons());
          });
        } else if (result && result.allCardsComplete) {
          this.showFinalRewardModal(() => this._updateCollectionButtons());
        }
        this._updateCollectionButtons();
      }, 400);
    }

    showReward(reward, albumId, onContinue) {
      if (typeof albumId === "function") {
        onContinue = albumId;
        albumId = ALBUM_DEFS[0] ? ALBUM_DEFS[0].id : "pixar";
      }
      document.getElementById("reward-name").textContent = reward.name;
      document.getElementById("reward-rarity").textContent = reward.rarity || "Common";
      const wrap = document.getElementById("reward-character-wrap");
      wrap.innerHTML = "";
      const img = new Image();
      img.src = generateRewardCharacterArt(reward.artSeed || 10, 140);
      wrap.appendChild(img);
      const p = this.cm.getAlbumProgress(albumId || (ALBUM_DEFS[0] && ALBUM_DEFS[0].id));
      document.getElementById("reward-progress-text").textContent = p.collected + "/" + p.total;
      this.rewardModal.classList.remove("hidden");
      const skip = () => {
        this.rewardModal.classList.add("hidden");
        if (onContinue) onContinue();
      };
      document.getElementById("reward-modal-skip").onclick = skip;
      this.rewardModal.onclick = (e) => { if (e.target === this.rewardModal) skip(); };
    }

    showToastCardFound() {
      this.toast.classList.remove("hidden");
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => this.toast.classList.add("hidden"), 2000);
    }

    showToastCardEarned() {
      const el = document.getElementById("toast-card-earned");
      if (!el) return;
      el.classList.remove("hidden");
      clearTimeout(this._toastCardEarnedTimer);
      this._toastCardEarnedTimer = setTimeout(() => el.classList.add("hidden"), 2000);
    }

    showToastUnlocksAfterLevel5() {
      const el = document.getElementById("toast-collection-locked");
      if (!el) return;
      el.classList.remove("hidden");
      clearTimeout(this._toastLockedTimer);
      this._toastLockedTimer = setTimeout(() => el.classList.add("hidden"), 2500);
    }

    updateCollectionButtons() {
      const save = this.cm.getState();
      const unlocked = this.cm.isAvailable();
      const albumActive = isEventActive(save, "albumEvent");
      const available = unlocked && albumActive;
      const hasNew = (save.cards.newInbox || []).length > 0;
      const btn = document.getElementById("nav-collection");
      if (btn) {
        btn.classList.toggle("locked", !available);
        btn.classList.toggle("event-ended", unlocked && !albumActive);
        btn.setAttribute("aria-disabled", available ? "false" : "true");
        btn.title = available ? "Collection" : (unlocked && !albumActive ? "Event ended" : "Unlocks after Level 2");
        btn.setAttribute("aria-label", available ? "Collection" : (unlocked && !albumActive ? "Event ended" : "Unlocks after Level 2"));
        const badge = btn.querySelector(".nav-badge") || btn.querySelector(".collection-badge");
        if (badge) {
          if (available && hasNew) badge.classList.remove("hidden");
          else badge.classList.add("hidden");
        }
      }
      this.updateAlbumStarsUI();
    }
  }

  class LostTempleManager {
    constructor(saveRef, persistFn, appRef) {
      this._save = saveRef;
      this._persist = persistFn || (() => saveSave(this._save));
      this.app = appRef;
      this._timerId = null;
      this._tutorialActive = false;
      this._breakAnimActive = false;
      this._escapeHandler = null;
    }

    _ensureEventAndStage() {
      if (!this._save.lostTempleEvent) {
        this._save.lostTempleEvent = { startAt: Date.now(), endAt: Date.now() + EVENT_DURATION_MS };
      }
      const maxStage = LOST_TEMPLE_STAGES.length - 1;
      const stageIndex = Math.max(0, Math.min(maxStage, this._save.lostTempleCurrentStage || 0));
      this._save.lostTempleCurrentStage = stageIndex;
      if (!this._save.lostTempleState
        || this._save.lostTempleState.stageIndex !== stageIndex
        || this._save.lostTempleState.boardSize !== LOST_TEMPLE_STAGES[stageIndex].boardSize
        || typeof this._save.lostTempleState.gemGoal !== "number") {
        this._save.lostTempleState = buildLostTempleStageState(stageIndex);
      }
    }

    updateWidget() {
      const widget = document.getElementById("lost-temple-widget");
      if (widget) widget.classList.remove("hidden");
      const countEl = document.getElementById("lost-temple-widget-hammers");
      if (countEl) countEl.textContent = String(Math.max(0, this._save.eventHammers || 0));
      const timerEl = document.getElementById("lost-temple-widget-timer");
      if (timerEl) {
        const remain = getRemainingMs(this._save, "lostTempleEvent");
        const d = Math.max(0, Math.ceil(remain / 86400000));
        timerEl.textContent = remain > 0 ? (d + "d") : "end";
      }
      const badge = document.getElementById("lost-temple-badge");
      const st = this._save.lostTempleState;
      const claimable = !!(st && st.chestClaimable && !st.chestClaimed);
      const showBadge = (this._save.eventHammers || 0) > 0 || claimable;
      if (badge) badge.classList.toggle("hidden", !showBadge);
    }

    openScreen() {
      this._ensureEventAndStage();
      const screen = document.getElementById("lostTempleScreen");
      if (!screen) return;
      this._bindButtons();
      document.documentElement.classList.add("lost-temple-screen-active");
      document.body.classList.add("lost-temple-screen-active");
      this._escapeHandler = (e) => {
        if (e.key !== "Escape") return;
        const infoOverlay = document.getElementById("lostTempleInfoOverlay");
        if (infoOverlay && !infoOverlay.classList.contains("hidden")) {
          this.closeInfoOverlay();
          e.preventDefault();
          return;
        }
        e.preventDefault();
        this.closeScreen();
      };
      window.addEventListener("keydown", this._escapeHandler);
      this._render();
      screen.classList.remove("hidden");
      this._startTimer();
      if (!this._save.lostTempleTutorialCompleted) {
        this.startTutorial();
      }
    }

    closeScreen() {
      const screen = document.getElementById("lostTempleScreen");
      if (screen) screen.classList.add("hidden");
      this._stopTimer();
      this._unbindButtons();
      this.closeInfoOverlay();
      if (this._escapeHandler) {
        window.removeEventListener("keydown", this._escapeHandler);
        this._escapeHandler = null;
      }
      document.documentElement.classList.remove("lost-temple-screen-active");
      document.body.classList.remove("lost-temple-screen-active");
    }

    _bindButtons() {
      const closeBtn = document.getElementById("btn-lost-temple-close");
      const infoBtn = document.getElementById("btn-lost-temple-info");
      const claimBtn = document.getElementById("btn-lost-temple-claim");
      const nextBtn = document.getElementById("btn-lost-temple-next-stage");
      if (closeBtn) closeBtn.onclick = () => this.closeScreen();
      if (infoBtn) infoBtn.onclick = () => this.openInfoOverlay();
      if (claimBtn) claimBtn.onclick = () => this.claimChest();
      if (nextBtn) nextBtn.onclick = () => this.nextStage();
      const infoOverlay = document.getElementById("lostTempleInfoOverlay");
      if (infoOverlay) infoOverlay.onclick = (e) => { if (e.target === infoOverlay) this.closeInfoOverlay(); };
      const infoContinue = document.getElementById("btn-lost-temple-info-continue");
      if (infoContinue) infoContinue.onclick = () => this.closeInfoOverlay();
    }

    _unbindButtons() {
      const ids = [
        "btn-lost-temple-close",
        "btn-lost-temple-info",
        "btn-lost-temple-claim",
        "btn-lost-temple-next-stage",
        "btn-lost-temple-info-continue",
      ];
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.onclick = null;
      });
      const infoOverlay = document.getElementById("lostTempleInfoOverlay");
      if (infoOverlay) infoOverlay.onclick = null;
    }

    _startTimer() {
      const tick = () => {
        const timerEl = document.getElementById("lost-temple-timer");
        if (timerEl) timerEl.textContent = "Ends in: " + formatRemaining(getRemainingMs(this._save, "lostTempleEvent"));
      };
      tick();
      this._stopTimer();
      this._timerId = setInterval(tick, 1000);
    }

    _stopTimer() {
      if (this._timerId) clearInterval(this._timerId);
      this._timerId = null;
    }

    _render() {
      this._ensureEventAndStage();
      const st = this._save.lostTempleState;
      const board = document.getElementById("lost-temple-board");
      if (!board || !st) return;
      board.innerHTML = "";
      board.style.gridTemplateColumns = "repeat(" + st.boardSize + ", 1fr)";
      st.tiles.forEach((tile, idx) => {
        const btn = document.createElement("button");
        btn.type = "button";
        const patternClass = " lost-temple-tile--pattern-" + (idx % 4);
        btn.className = "lost-temple-tile" + patternClass + (tile.broken ? " lost-temple-tile--broken" : "") + ((this._save.eventHammers || 0) <= 0 ? " lost-temple-tile--nohammer" : "");
        btn.setAttribute("role", "gridcell");
        if (tile.broken) {
          const icon = this._lootIcon(tile.lootType);
          btn.textContent = icon;
          const label = document.createElement("span");
          label.className = "lost-temple-loot-label";
          label.textContent = this._lootLabel(tile.lootType);
          btn.appendChild(label);
        }
        btn.onclick = () => this.onTileTap(idx);
        board.appendChild(btn);
      });
      const stageLabel = document.getElementById("lost-temple-stage-label");
      if (stageLabel) stageLabel.textContent = "Stage " + (st.stageIndex + 1) + "/" + LOST_TEMPLE_STAGES.length;
      const obj = document.getElementById("lost-temple-objective");
      if (obj) obj.textContent = st.chestClaimable ? "Chest is ready! Claim your reward." : "Find chest tokens to fill progress.";
      const ch = document.getElementById("lost-temple-chest-progress");
      if (ch) ch.textContent = st.chestProgress + "/" + st.chestGoal;
      const gem = document.getElementById("lost-temple-gem-progress");
      if (gem) gem.textContent = st.gemProgress + "/" + st.gemGoal;
      const hm = document.getElementById("lost-temple-hammers-count");
      if (hm) hm.textContent = String(Math.max(0, this._save.eventHammers || 0));
      const claimBtn = document.getElementById("btn-lost-temple-claim");
      const nextBtn = document.getElementById("btn-lost-temple-next-stage");
      if (claimBtn) claimBtn.classList.toggle("hidden", !(st.chestClaimable && !st.chestClaimed));
      if (nextBtn) nextBtn.classList.toggle("hidden", !(st.boardCompleted && st.chestClaimed));
      this.updateWidget();
    }

    _lootIcon(type) {
      if (type === "chest") return "🧩";
      if (type === "gem") return "💎";
      if (type === "relic") return "🗿";
      if (type === "bonusHammer") return "🔨";
      if (type === "coins") return "🪙";
      return "·";
    }

    _lootLabel(type) {
      if (type === "chest") return "Chest";
      if (type === "gem") return "Gem";
      if (type === "relic") return "Relic";
      if (type === "bonusHammer") return "Hammer";
      if (type === "coins") return "Coins";
      return "";
    }

    onTileTap(idx) {
      const st = this._save.lostTempleState;
      if (!st || !st.tiles[idx]) return;
      if (this._breakAnimActive) return;
      const tile = st.tiles[idx];
      if (tile.broken) return;
      if (!this.app.canUseHammer()) return;
      this.app.spendHammer();
      const board = document.getElementById("lost-temple-board");
      const tileEl = board && board.children ? board.children[idx] : null;
      const finishBreak = () => {
        tile.broken = true;
        this._applyLoot(tile.lootType);
        st.boardCompleted = st.tiles.every((t) => t.broken);
        this._persist();
        this._breakAnimActive = false;
        this._render();
        if (this._tutorialActive) {
          this.finishTutorial();
        }
      };
      this._breakAnimActive = true;
      this._playHammerHitAnimation(tileEl, tile.lootType, finishBreak);
    }

    _playHammerHitAnimation(tileEl, lootType, onDone) {
      if (!tileEl) {
        if (onDone) onDone();
        return;
      }
      tileEl.classList.add("lost-temple-tile--impact");
      const hammer = document.createElement("span");
      hammer.className = "lost-temple-hit-hammer";
      hammer.textContent = "🔨";
      tileEl.appendChild(hammer);

      const crack = document.createElement("span");
      crack.className = "lost-temple-hit-crack";
      crack.textContent = "✶";
      tileEl.appendChild(crack);

      const spark = document.createElement("span");
      spark.className = "lost-temple-hit-spark";
      spark.textContent = this._lootIcon(lootType);
      tileEl.appendChild(spark);

      setTimeout(() => {
        tileEl.classList.remove("lost-temple-tile--impact");
        if (hammer.parentNode) hammer.parentNode.removeChild(hammer);
        if (crack.parentNode) crack.parentNode.removeChild(crack);
      }, 340);

      setTimeout(() => {
        if (spark.parentNode) spark.parentNode.removeChild(spark);
        if (onDone) onDone();
      }, 430);
    }

    _applyLoot(type) {
      const st = this._save.lostTempleState;
      if (!st) return;
      if (type === "chest") {
        st.chestProgress = Math.min(st.chestGoal, st.chestProgress + 1);
        if (st.chestProgress >= st.chestGoal) st.chestClaimable = true;
        return;
      }
      if (type === "gem") {
        st.gemProgress = Math.min(st.gemGoal, (st.gemProgress || 0) + 1);
        this._save.gemsTotal = (this._save.gemsTotal || 0) + 1;
        return;
      }
      if (type === "relic") {
        this.app.collectionManager.addAlbumStars(2);
        this.app.collectionUI.updateAlbumStarsUI();
        return;
      }
      if (type === "bonusHammer") {
        this.app.addHammers(1);
        return;
      }
      if (type === "coins") {
        this.app.addCoins(15);
      }
    }

    claimChest() {
      const st = this._save.lostTempleState;
      if (!st || !st.chestClaimable || st.chestClaimed) return;
      st.chestClaimed = true;
      const reward = this._rollChestReward(st.chestTier);
      this.app.addCoins(reward.coins);
      this.app.collectionManager.addAlbumStars(reward.albumStars);
      this.app.addHammers(reward.hammers);
      this._persist();
      this.app.collectionUI.updateAlbumStarsUI();
      this._showChestPopup(reward);
      this._render();
    }

    _rollChestReward(tier) {
      if (tier === "mystery") {
        return { name: "Mystery Chest", coins: 500, albumStars: 20, hammers: 4, packStars: 3, cardCount: 4 };
      }
      if (tier === "archaeologist") {
        return { name: "Archaeologist's Chest", coins: 260, albumStars: 10, hammers: 2, packStars: 2, cardCount: 3 };
      }
      return { name: "Adventurer's Chest", coins: 120, albumStars: 4, hammers: 1, packStars: 1, cardCount: 2 };
    }

    _showChestPopup(reward) {
      const popup = document.getElementById("lostTempleChestPopup");
      const title = document.getElementById("lost-temple-chest-title");
      const text = document.getElementById("lost-temple-chest-reward-text");
      const ok = document.getElementById("btn-lost-temple-chest-ok");
      if (!popup || !title || !text || !ok) return;
      title.textContent = reward.name;
      text.textContent = "+" + reward.coins + " coins\n+" + reward.albumStars + " album stars\n+" + reward.hammers + " hammers";
      popup.classList.remove("hidden");
      const close = () => {
        popup.classList.add("hidden");
        popup.onclick = null;
        ok.onclick = null;
        this.app._openPackOpeningFlowGeneric(reward.packStars, reward.cardCount, () => {
          this.app.collectionUI.updateCollectionButtons();
          this.app.collectionUI.updateGlobalCardsProgress();
        });
      };
      ok.onclick = close;
      popup.onclick = (e) => { if (e.target === popup) close(); };
    }

    nextStage() {
      const nextIndex = Math.min(LOST_TEMPLE_STAGES.length - 1, (this._save.lostTempleCurrentStage || 0) + 1);
      this._save.lostTempleCurrentStage = nextIndex;
      this._save.lostTempleState = buildLostTempleStageState(nextIndex);
      this._persist();
      this._render();
    }

    openInfoOverlay() {
      const overlay = document.getElementById("lostTempleInfoOverlay");
      if (!overlay) return;
      overlay.classList.remove("hidden");
      const infoContinue = document.getElementById("btn-lost-temple-info-continue");
      if (infoContinue) infoContinue.onclick = () => this.closeInfoOverlay();
    }

    closeInfoOverlay() {
      const overlay = document.getElementById("lostTempleInfoOverlay");
      if (overlay) overlay.classList.add("hidden");
    }

    startTutorial() {
      const overlay = document.getElementById("lostTempleTutorialOverlay");
      const btn = document.getElementById("btn-lost-temple-tutorial-ok");
      if (!overlay || !btn) return;
      this._tutorialActive = true;
      overlay.classList.remove("hidden");
      btn.onclick = () => {
        overlay.classList.add("hidden");
        btn.onclick = null;
      };
    }

    finishTutorial() {
      const overlay = document.getElementById("lostTempleTutorialOverlay");
      if (overlay) overlay.classList.add("hidden");
      this._tutorialActive = false;
      this._save.lostTempleTutorialCompleted = true;
      this._persist();
    }
  }

  class CollectionPackAnimator {
    constructor() {
      this._overlay = null;
      this._onComplete = null;
      this._timeouts = [];
      this._playing = false;
    }

    _clearTimeouts() {
      this._timeouts.forEach((t) => clearTimeout(t));
      this._timeouts = [];
    }

    _removeAllFlyingCards() {
      document.querySelectorAll(".flying-card").forEach((el) => el.remove());
    }

    _skip() {
      if (!this._playing) return;
      this._playing = false;
      this._clearTimeouts();
      this._removeAllFlyingCards();
      if (this._overlay && this._overlay.parentNode) this._overlay.parentNode.removeChild(this._overlay);
      this._overlay = null;
      if (this._onComplete) {
        const fn = this._onComplete;
        this._onComplete = null;
        fn();
      }
    }

    play(cardIds, getTileByCardId, getCardImageSrc, onComplete) {
      if (this._playing) return;
      this._playing = true;
      this._onComplete = onComplete;
      const ids = cardIds.slice(0, 3);
      const overlay = document.createElement("div");
      overlay.className = "pack-overlay";
      overlay.setAttribute("aria-hidden", "false");

      const skipBar = document.createElement("div");
      skipBar.className = "pack-overlay-skip tap-to-skip-bar";
      skipBar.innerHTML = '<span class="tap-to-skip-text">Tap to skip</span>';
      skipBar.onclick = () => this._skip();
      overlay.onclick = (e) => { if (e.target === overlay) this._skip(); };

      const packEl = document.createElement("div");
      packEl.className = "card-pack";
      packEl.innerHTML = '<div class="card-pack-inner"><div class="card-pack-flap"></div><div class="card-pack-shine"></div></div>';

      const sparkleContainer = document.createElement("div");
      sparkleContainer.className = "pack-sparkles";

      overlay.appendChild(packEl);
      overlay.appendChild(sparkleContainer);
      overlay.appendChild(skipBar);
      document.body.appendChild(overlay);
      this._overlay = overlay;

      const packRect = () => packEl.getBoundingClientRect();
      const packCenter = () => {
        const r = packRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      };

      this._timeouts.push(setTimeout(() => {
        packEl.classList.add("pack-opening");
        for (let i = 0; i < 8; i++) {
          const sp = document.createElement("div");
          sp.className = "pack-sparkle";
          sp.style.left = (50 + (Math.random() - 0.5) * 40) + "%";
          sp.style.top = (50 + (Math.random() - 0.5) * 40) + "%";
          sp.style.animationDelay = (i * 0.05) + "s";
          sparkleContainer.appendChild(sp);
        }
      }, 800));

      const self = this;
      const finish = () => {
        if (!self._playing) return;
        self._timeouts.push(setTimeout(() => {
          self._playing = false;
          self._clearTimeouts();
          self._removeAllFlyingCards();
          if (self._overlay && self._overlay.parentNode) self._overlay.parentNode.removeChild(self._overlay);
          self._overlay = null;
          if (self._onComplete) {
            const fn = self._onComplete;
            self._onComplete = null;
            fn();
          }
        }, 400));
      };

      const flyCards = () => {
        const center = packCenter();
        let landed = 0;
        ids.forEach((cardId, i) => {
          const tile = getTileByCardId(cardId);
          if (!tile) {
            landed++;
            if (landed === ids.length) finish();
            return;
          }
          const fly = document.createElement("div");
          fly.className = "flying-card";
          const img = document.createElement("img");
          img.src = getCardImageSrc(cardId) || "";
          img.alt = "";
          img.onerror = () => fly.classList.add("flying-card-placeholder");
          fly.appendChild(img);
          fly.style.left = center.x + "px";
          fly.style.top = center.y + "px";
          document.body.appendChild(fly);
          const flyRect = fly.getBoundingClientRect();
          const targetRect = tile.getBoundingClientRect();
          const startX = center.x - flyRect.width / 2;
          const startY = center.y - flyRect.height / 2;
          const endX = targetRect.left + (targetRect.width - flyRect.width) / 2;
          const endY = targetRect.top + (targetRect.height - flyRect.height) / 2;
          fly.style.left = startX + "px";
          fly.style.top = startY + "px";
          fly.style.transform = "scale(0.5)";
          requestAnimationFrame(() => {
            fly.classList.add("flying-card-fly");
            fly.style.setProperty("--fly-end-x", (endX - startX) + "px");
            fly.style.setProperty("--fly-end-y", (endY - startY) + "px");
          });
          const t = 600 + i * 120;
          self._timeouts.push(setTimeout(() => {
            fly.remove();
            tile.classList.add("pack-land-pulse");
            const glow = document.createElement("div");
            glow.className = "pack-land-glow";
            tile.appendChild(glow);
            setTimeout(() => glow.remove(), 600);
            setTimeout(() => tile.classList.remove("pack-land-pulse"), 400);
            landed++;
            if (landed === ids.length) finish();
          }, t));
        });
        if (ids.length === 0) finish();
      };

      this._timeouts.push(setTimeout(() => flyCards(), 1400));
    }
  }

  function buildShapeLevels() {
    const schedule = [
      "triangle", "square", "pentagon", "hexagon", "star", "circle", "heart",
      "triangle", "square", "pentagon", "hexagon", "star", "circle", "heart",
      "triangle", "square", "pentagon", "hexagon", "star", "circle", "heart",
      "triangle", "square", "pentagon", "hexagon", "star", "circle", "heart",
      "triangle", "square",
    ];
    const levels = [];
    for (let i = 0; i < 30; i++) {
      const pieceCount = i % 2 === 0 ? 10 : 12;
      const cols = pieceCount === 10 ? 2 : 3;
      const rows = pieceCount === 10 ? 5 : 4;
      const shapeType = schedule[i];
      const shapeSeed = i + 1;
      const rotation = (i % 7 >= 4) ? 90 : 0;
      levels.push({
        id: i,
        pieceCount,
        cols,
        rows,
        shapeType,
        shapeSeed,
        rotation,
      });
    }
    return levels;
  }

  const BONUS_LEVEL_DEF = {
    id: "bonus_album_complete",
    pieceCount: 12,
    cols: 3,
    rows: 4,
    shapeType: "star",
    shapeSeed: 99,
    rotation: 0,
  };

  class LevelManager {
    constructor() {
      this.levelEntries = [];
      EXTERNAL_PLAYABLE_LEVELS.forEach((entry) => {
        this.levelEntries.push({
          id: entry.id,
          title: entry.title || entry.id,
          type: "html-playable",
          src: entry.src,
        });
      });
      buildShapeLevels().forEach((level, idx) => {
        this.levelEntries.push({
          id: "native_level_" + (idx + 1),
          title: "Native Level " + (idx + 1),
          type: "native-shape",
          level,
        });
      });
    }

    getLevelEntry(index) {
      return this.levelEntries[index] || null;
    }

    getLevel(index) {
      const entry = this.getLevelEntry(index);
      return entry && entry.type === "native-shape" ? entry.level : null;
    }

    getBonusLevel() {
      return BONUS_LEVEL_DEF;
    }

    getTotalLevels() {
      return this.levelEntries.length;
    }
  }

  class PuzzleBoard {
    constructor(containerEl, onComplete) {
      this.container = containerEl;
      this.onComplete = onComplete;
      this.slots = [];
      this.placedCount = 0;
      this.totalPieces = 0;
      this.gridEl = null;
    }

    build(level) {
      this.container.innerHTML = "";
      this.placedCount = 0;
      this.totalPieces = level.pieceCount;
      const { cols, rows } = level;
      const pieceUrls = generateShapePieces(level);

      const slotSize = Math.min(90, Math.floor(280 / Math.max(cols, rows)));
      const ghostUrl = getShapeGhostDataUrl(level);
      const ghostEl = document.createElement("div");
      ghostEl.className = "board-shape-ghost";
      ghostEl.setAttribute("aria-hidden", "true");
      ghostEl.style.backgroundImage = "url(" + ghostUrl + ")";
      ghostEl.style.width = cols * slotSize + "px";
      ghostEl.style.height = rows * slotSize + "px";
      this.container.appendChild(ghostEl);

      this.gridEl = document.createElement("div");
      this.gridEl.className = "board-grid";
      this.gridEl.style.display = "grid";
      this.gridEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
      this.gridEl.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
      this.gridEl.style.width = cols * slotSize + "px";
      this.gridEl.style.height = rows * slotSize + "px";

      this.slots = [];
      for (let i = 0; i < level.pieceCount; i++) {
        const slot = document.createElement("div");
        slot.className = "slot";
        slot.dataset.pieceId = String(i);
        slot.dataset.slotIndex = String(i);
        this.slots.push({
          el: slot,
          pieceId: i,
          filled: false,
          pieceUrl: pieceUrls[i],
        });
        this.gridEl.appendChild(slot);
      }
      this.container.appendChild(this.gridEl);
      return pieceUrls;
    }

    getSlotAtPoint(clientX, clientY) {
      for (const s of this.slots) {
        if (s.filled) continue;
        const rect = s.el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(clientX - cx, clientY - cy);
        if (dist <= SNAP_THRESHOLD) return s;
      }
      return null;
    }

    getSlotByPieceId(pieceId) {
      return this.slots.find((s) => s.pieceId === Number(pieceId));
    }

    placePiece(pieceId, pieceUrl, isCorrectSlot) {
      const slot = this.getSlotByPieceId(pieceId);
      if (!slot || slot.filled) return false;
      if (!isCorrectSlot) return false;

      slot.filled = true;
      const div = document.createElement("div");
      div.className = "piece-in-slot just-placed";
      div.style.backgroundImage = `url(${pieceUrl})`;
      div.dataset.pieceId = String(pieceId);
      slot.el.classList.add("filled");
      slot.el.appendChild(div);

      slot.el.style.position = "relative";
      for (let i = 0; i < 6; i++) {
        const sp = document.createElement("div");
        sp.className = "sparkle";
        const w = slot.el.offsetWidth || 60;
        const h = slot.el.offsetHeight || 60;
        sp.style.left = w / 2 + (Math.random() - 0.5) * w * 0.8 + "px";
        sp.style.top = h / 2 + (Math.random() - 0.5) * h * 0.8 + "px";
        slot.el.appendChild(sp);
        setTimeout(() => sp.remove(), 600);
      }

      setTimeout(() => div.classList.remove("just-placed"), 500);
      this.placedCount++;
      if (this.placedCount === this.totalPieces) this.onComplete();
      return true;
    }

    getPlacedCount() {
      return this.placedCount;
    }

    getTotalPieces() {
      return this.totalPieces;
    }
  }

  class PieceTray {
    constructor(containerEl, board, opts = {}) {
      this.container = containerEl;
      this.board = board;
      this.onPlace = opts.onPlace || (() => {});
      this.onWrongDrop = opts.onWrongDrop || (() => {});
      this.beforePlace = opts.beforePlace || null;
      this.pieces = [];
      this.dragging = null;
      this.pointerId = null;
      this.offsetX = 0;
      this.offsetY = 0;
    }

    build(pieceUrls, pieceSize = 64) {
      this.container.innerHTML = "";
      this.pieces = pieceUrls.map((url, i) => {
        const el = document.createElement("div");
        el.className = "tray-piece";
        el.dataset.pieceId = String(i);
        el.style.width = pieceSize + "px";
        el.style.height = pieceSize + "px";
        el.style.backgroundImage = `url(${url})`;
        el.style.backgroundSize = "cover";
        el.style.backgroundPosition = "center";
        this.container.appendChild(el);
        return { el, pieceId: i, url, placed: false };
      });
      this._bindPointerEvents();
    }

    _bindPointerEvents() {
      this.container.addEventListener("pointerdown", (e) => {
        const pieceEl = e.target.closest(".tray-piece");
        if (!pieceEl || e.button !== 0) return;
        const piece = this.pieces[Number(pieceEl.dataset.pieceId)];
        if (!piece || piece.placed) return;
        e.preventDefault();
        this._startDrag(piece, e);
      });

      document.addEventListener("pointermove", (e) => {
        if (this.dragging && e.pointerId === this.pointerId) this._moveDrag(e);
      });

      document.addEventListener("pointerup", (e) => {
        if (this.dragging && e.pointerId === this.pointerId) this._endDrag(e);
      });
      document.addEventListener("pointercancel", (e) => {
        if (this.dragging && e.pointerId === this.pointerId) this._cancelDrag();
      });
    }

    _startDrag(piece, e) {
      this.dragging = piece;
      this.pointerId = e.pointerId;
      const rect = piece.el.getBoundingClientRect();
      this.offsetX = e.clientX - rect.left;
      this.offsetY = e.clientY - rect.top;
      piece.el.classList.add("dragging");
      piece.el.setPointerCapture?.(e.pointerId);
    }

    _moveDrag(e) {
      if (!this.dragging) return;
      const el = this.dragging.el;
      el.style.position = "fixed";
      el.style.left = e.clientX - this.offsetX + "px";
      el.style.top = e.clientY - this.offsetY + "px";
      el.style.zIndex = "1000";
    }

    _endDrag(e) {
      if (!this.dragging) return;
      const piece = this.dragging;
      const slot = this.board.getSlotAtPoint(e.clientX, e.clientY);

      piece.el.classList.remove("dragging");
      piece.el.style.position = "";
      piece.el.style.left = "";
      piece.el.style.top = "";
      piece.el.style.zIndex = "";
      piece.el.releasePointerCapture?.(e.pointerId);

      if (slot && slot.pieceId === piece.pieceId) {
        if (this.beforePlace && !this.beforePlace()) {
          this.dragging = null;
          this.pointerId = null;
          return;
        }
        const placed = this.board.placePiece(piece.pieceId, piece.url, true);
        if (placed) {
          piece.placed = true;
          piece.el.style.visibility = "hidden";
          piece.el.style.pointerEvents = "none";
          this.onPlace(piece.pieceId);
        }
      } else {
        this.onWrongDrop(piece.pieceId);
        piece.el.classList.add("wrong-drop");
        setTimeout(() => piece.el.classList.remove("wrong-drop"), 500);
      }
      this.dragging = null;
      this.pointerId = null;
    }

    _cancelDrag() {
      if (this.dragging) {
        this.dragging.el.classList.remove("dragging");
        this.dragging.el.style.position = "";
        this.dragging.el.style.left = "";
        this.dragging.el.style.top = "";
        this.dragging.el.style.zIndex = "";
        this.dragging = null;
        this.pointerId = null;
      }
    }

    cancelDrag() {
      this._cancelDrag();
    }
  }

  class UI {
    constructor() {
      this.levelNumberEl = document.getElementById("level-number");
      this.coinsCountEl = document.getElementById("coins-count");
      this.progressTextEl = document.getElementById("progress-text");
      this.winModal = document.getElementById("win-modal");
      this.winStars = document.getElementById("win-stars");
      this.winStats = document.getElementById("win-stats");
      this.settingsModal = document.getElementById("settings-modal");
    }

    showScreen(id) {
      document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
      const el = document.getElementById(id);
      if (el) el.classList.add("active");
      document.body.classList.toggle("cards-screen-clean", id === "album-screen");
      document.body.classList.toggle("daily-tasks-clean", id === "daily-tasks-screen");
      const externalLevelActive = !!(window.gameApp && window.gameApp._externalLevelActive);
      const galleryActive = id === "gallery-screen";
      document.body.classList.toggle("home-layout-active", id === "start-screen" || galleryActive || (id === "game-screen" && externalLevelActive));
      document.body.classList.toggle("level-active", id === "game-screen");
      document.body.classList.toggle("gallery-screen-active", galleryActive);
      const stripStart = document.getElementById("status-strip-start");
      const stripGame = document.getElementById("status-strip-game");
      if (stripStart) stripStart.classList.add("hidden");
      if (stripGame) stripGame.classList.add("hidden");
      if ((id === "start-screen" || id === "gallery-screen") && stripStart) stripStart.classList.remove("hidden");
      if (id === "game-screen" && externalLevelActive && stripStart) stripStart.classList.remove("hidden");
      if (id === "game-screen" && !externalLevelActive && stripGame) stripGame.classList.remove("hidden");
      document.querySelectorAll(".nav-item").forEach((n) => n.classList.remove("active"));
      const navMap = { "start-screen": "nav-home", "gallery-screen": "nav-game", "album-screen": "nav-collection", "daily-tasks-screen": "nav-daily-tasks" };
      const navId = navMap[id];
      if (navId) {
        const navEl = document.getElementById(navId);
        if (navEl) navEl.classList.add("active");
      }
      if (window.gameApp && typeof window.gameApp._updateCheatAutoButton === "function") {
        window.gameApp._updateCheatAutoButton();
      }
      if (id !== "game-screen" && window.gameApp && typeof window.gameApp._clearBattlePassTutorial === "function") {
        window.gameApp._clearBattlePassTutorial();
      }
      if (id !== "daily-tasks-screen" && window.gameApp && typeof window.gameApp.closeDailyTasksScreen === "function") {
        window.gameApp.closeDailyTasksScreen();
      }
      if (window.gameApp && typeof window.gameApp.updateBattlePassWidget === "function") {
        window.gameApp.updateBattlePassWidget();
      }
      if (id === "start-screen" && window.gameApp && window.gameApp.collectionUI && typeof window.gameApp.collectionUI.updateGlobalCardsProgress === "function") {
        window.gameApp.collectionUI.updateGlobalCardsProgress();
      }
    }

    setLevelNumber(n) {
      if (this.levelNumberEl) this.levelNumberEl.textContent = n + 1;
      const homeLevel = document.getElementById("level-number-home");
      if (homeLevel) homeLevel.textContent = n + 1;
    }

    setLevelLabel(text) {
      if (this.levelNumberEl) this.levelNumberEl.textContent = text;
      const homeLevel = document.getElementById("level-number-home");
      if (homeLevel) homeLevel.textContent = text;
    }

    setCoins(n) {
      const v = String(n == null ? 0 : n);
      if (this.coinsCountEl) this.coinsCountEl.textContent = v;
      const startEl = document.getElementById("coins-count-start");
      if (startEl) startEl.textContent = v;
    }

    setProgress(placed, total) {
      if (this.progressTextEl) this.progressTextEl.textContent = `Pieces placed ${placed} / ${total}`;
    }

    showWinModal(stars, timeSec, mistakes, onNext, onReplay) {
      this.winModal.classList.remove("hidden");
      this.winStars.querySelectorAll(".star").forEach((s, i) => {
        s.classList.toggle("earned", i < stars);
      });
      this.winStats.textContent = `Time: ${timeSec}s • Mistakes: ${mistakes}`;
      document.getElementById("btn-next-level").onclick = onNext;
      document.getElementById("btn-replay").onclick = onReplay;
    }

    hideWinModal() {
      this.winModal.classList.add("hidden");
    }

    showSettingsModal() {
      this.settingsModal.classList.remove("hidden");
    }

    hideSettingsModal() {
      this.settingsModal.classList.add("hidden");
    }
  }

  const AudioPlayer = {
    ctx: null,
    init() {
      if (this.ctx) return;
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    },
    beep(freq, duration, type) {
      if (!this.ctx) this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.frequency.value = freq;
      osc.type = type || "sine";
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + duration);
    },
    place() {
      this.beep(523, 0.1, "sine");
      setTimeout(() => this.beep(659, 0.1, "sine"), 80);
    },
    wrong() {
      this.beep(200, 0.15, "sawtooth");
      setTimeout(() => this.beep(180, 0.15, "sawtooth"), 100);
    },
    win() {
      [523, 659, 784, 1047].forEach((f, i) => {
        setTimeout(() => this.beep(f, 0.12, "sine"), i * 80);
      });
    },
  };

  /* ===================================================================
     Moon Observatory Event Manager
     =================================================================== */
  class RubyCaveManager {
    static SHAPES = {
      star:{color:"#ffd639",rich:"#f0a000",bg:"#fef9e7",border:"#f5c518",shadow:"rgba(245,197,24,.34)",svg:`<svg viewBox="0 0 100 100"><polygon points="50,8 61,38 94,38 67,58 78,90 50,70 22,90 33,58 6,38 39,38" fill="FILL"/></svg>`},
      heart:{color:"#ff5c8a",rich:"#e0245e",bg:"#fde8ee",border:"#f44074",shadow:"rgba(244,64,116,.30)",svg:`<svg viewBox="0 0 100 100"><path d="M50 88 C25 65 5 50 5 33 5 18 17 8 30 8 38 8 46 13 50 20 54 13 62 8 70 8 83 8 95 18 95 33 95 50 75 65 50 88Z" fill="FILL"/></svg>`},
      moon:{color:"#a47cff",rich:"#6a3de8",bg:"#f0eaff",border:"#8b5cf6",shadow:"rgba(139,92,246,.30)",svg:`<svg viewBox="0 0 100 100"><path d="M70 66 A30 30 0 1 1 34 30 A24 24 0 1 0 70 66Z" fill="FILL"/></svg>`},
      diamond:{color:"#4fc3f7",rich:"#0288d1",bg:"#e4f4fd",border:"#29b6f6",shadow:"rgba(41,182,246,.30)",svg:`<svg viewBox="0 0 100 100"><polygon points="50,5 90,50 50,95 10,50" fill="FILL"/></svg>`},
      tree:{color:"#66d97f",rich:"#2e8b47",bg:"#e6f7ec",border:"#4caf50",shadow:"rgba(76,175,80,.30)",svg:`<svg viewBox="0 0 100 100"><polygon points="50,6 80,45 66,45 85,75 15,75 34,45 20,45" fill="FILL"/><rect x="42" y="75" width="16" height="20" rx="2" fill="FILL"/></svg>`},
      bolt:{color:"#ffb74d",rich:"#ef6c00",bg:"#fff2e4",border:"#ffa726",shadow:"rgba(255,167,38,.30)",svg:`<svg viewBox="0 0 100 100"><polygon points="57,6 28,52 48,52 36,94 73,42 51,42" fill="FILL"/></svg>`},
      clover:{color:"#7ed957",rich:"#388e3c",bg:"#ebf8e5",border:"#66bb6a",shadow:"rgba(102,187,106,.30)",svg:`<svg viewBox="0 0 100 100"><circle cx="38" cy="34" r="17" fill="FILL"/><circle cx="62" cy="34" r="17" fill="FILL"/><circle cx="38" cy="58" r="17" fill="FILL"/><circle cx="62" cy="58" r="17" fill="FILL"/><rect x="47" y="71" width="6" height="20" rx="2" fill="FILL"/></svg>`}
    };
    static LEVELS = [
      {slots:[{shape:"star",x:23,y:28,size:19},{shape:"heart",x:75,y:30,size:19},{shape:"diamond",x:33,y:67,size:19},{shape:"tree",x:67,y:67,size:19}],tray:["tree","star","diamond","heart"]},
      {slots:[{shape:"moon",x:21,y:27,size:18},{shape:"diamond",x:77,y:28,size:18},{shape:"heart",x:29,y:69,size:18},{shape:"star",x:71,y:68,size:18}],tray:["heart","moon","star","diamond"]},
      {slots:[{shape:"tree",x:18,y:24,size:17},{shape:"bolt",x:50,y:22,size:17},{shape:"heart",x:82,y:26,size:17},{shape:"moon",x:30,y:66,size:17},{shape:"diamond",x:70,y:66,size:17}],tray:["heart","tree","moon","diamond","bolt"]},
      {slots:[{shape:"clover",x:22,y:30,size:16.5},{shape:"star",x:50,y:24,size:16.5},{shape:"diamond",x:78,y:30,size:16.5},{shape:"moon",x:32,y:68,size:16.5},{shape:"tree",x:68,y:68,size:16.5}],tray:["moon","tree","clover","star","diamond"]},
      {slots:[{shape:"star",x:18,y:24,size:15.5},{shape:"heart",x:50,y:22,size:15.5},{shape:"moon",x:82,y:25,size:15.5},{shape:"diamond",x:20,y:65,size:15.5},{shape:"tree",x:50,y:68,size:15.5},{shape:"bolt",x:80,y:64,size:15.5}],tray:["moon","bolt","star","tree","heart","diamond"]},
      {slots:[{shape:"clover",x:16,y:28,size:15},{shape:"tree",x:42,y:24,size:15},{shape:"diamond",x:76,y:26,size:15},{shape:"bolt",x:23,y:66,size:15},{shape:"heart",x:56,y:66,size:15},{shape:"moon",x:84,y:67,size:15}],tray:["diamond","heart","clover","moon","tree","bolt"]},
      {slots:[{shape:"star",x:14,y:24,size:14.2},{shape:"heart",x:33,y:22,size:14.2},{shape:"moon",x:52,y:24,size:14.2},{shape:"diamond",x:72,y:22,size:14.2},{shape:"tree",x:88,y:26,size:14.2},{shape:"bolt",x:30,y:67,size:14.2},{shape:"clover",x:68,y:67,size:14.2}],tray:["clover","star","diamond","heart","tree","bolt","moon"]},
      {slots:[{shape:"star",x:22,y:20,size:13.8},{shape:"heart",x:50,y:19,size:13.8},{shape:"diamond",x:78,y:20,size:13.8},{shape:"moon",x:16,y:48,size:13.8},{shape:"bolt",x:50,y:48,size:13.8},{shape:"tree",x:84,y:48,size:13.8},{shape:"clover",x:50,y:77,size:13.8}],tray:["moon","star","tree","heart","clover","bolt","diamond"]},
      {slots:[{shape:"heart",x:13,y:23,size:13.4},{shape:"moon",x:31,y:24,size:13.4},{shape:"diamond",x:50,y:22,size:13.4},{shape:"bolt",x:69,y:24,size:13.4},{shape:"star",x:87,y:22,size:13.4},{shape:"tree",x:31,y:69,size:13.4},{shape:"clover",x:69,y:69,size:13.4}],tray:["bolt","heart","clover","moon","tree","diamond","star"]},
      {slots:[{shape:"star",x:14,y:20,size:13},{shape:"heart",x:33,y:18,size:13},{shape:"moon",x:50,y:22,size:13},{shape:"diamond",x:67,y:18,size:13},{shape:"tree",x:86,y:20,size:13},{shape:"bolt",x:33,y:69,size:13},{shape:"clover",x:67,y:69,size:13}],tray:["tree","heart","bolt","diamond","star","clover","moon"]}
    ];
    static EVENT_LEVELS = [
      { id: "event_level_1_html", type: "html-playable", src: "levels/PuzzleCity_City2_unity_Full_merged.html" }
    ];
    static ENERGY_MAX = 5;
    static REGEN_MS = 5 * 60 * 1000;
    static NODE_POS = [
      [5,50],[15,50],[25,50],[35,50],[45,50],[55,50],[65,50],[75,50],[85,50],[95,50]
    ];

    constructor(save, saveFn) {
      this._save = save;
      this._saveFn = saveFn;
      this._screen = document.getElementById("rubyCaveScreen");

      if (!save.rubyCaveEventEnd) {
        save.rubyCaveEventEnd = Date.now() + 2 * 24 * 60 * 60 * 1000;
        saveFn();
      }

      this.completed = save.rubyCaveCompleted || 0;
      this.energy = typeof save.rubyCaveEnergy === "number" ? save.rubyCaveEnergy : RubyCaveManager.ENERGY_MAX;
      this.nextEnergyAt = save.rubyCaveNextEnergyAt || null;
      this.eventEnd = save.rubyCaveEventEnd;
      this.currentLevel = 0;
      this.placed = 0;
      this.slots = [];
      this.activePiece = null;
      this.originRect = null;
      this.offX = 0;
      this.offY = 0;
      this._toastTimer = null;
      this._eventExternalActive = false;
      this._eventExternalFrameBound = false;
      this._eventExternalLoadedLevelIndex = -1;
      this._eventExternalLoadedSrc = "";
      this._eventExternalSeenPieceIds = new Set();
      this._eventExternalObserver = null;
      this._eventExternalLevelDone = false;
      this._activeInternalLevelIndex = 0;

      this._cacheEls();
      this._bindEvents();
      this._startTimers();
    }

    _cacheEls() {
      const q = (id) => document.getElementById(id);
      this.el = {
        hub: q("rc-hub"),
        game: q("rc-game"),
        enterBtn: q("rc-enterBtn"),
        backBtn: q("rc-backBtn"),
        closeBtn: q("rc-closeBtn"),
        nextLevelBtn: q("rc-nextLevelBtn"),
        refillBtn: q("rc-refillBtn"),
        done: q("rc-done"),
        energyModal: q("rc-energyModal"),
        toast: q("rc-toast"),
        hubTimer: q("rc-hubTimer"),
        gameTimer: q("rc-gameTimer"),
        hubEnergy: q("rc-hubEnergy"),
        gameEnergy: q("rc-gameEnergy"),
        hubRegen: q("rc-hubRegen"),
        gameRegen: q("rc-gameRegen"),
        hubProgress: q("rc-hubProgress"),
        hubSum: q("rc-hubSum"),
        gameInfo: q("rc-gameInfo"),
        nodes: q("rc-nodes"),
        scene: q("rc-scene"),
        tray: q("rc-tray"),
        externalHost: q("rc-external-host"),
        externalFrame: q("rc-external-frame"),
        grandReward: q("rc-grand-reward"),
        grandClaim: q("rc-grand-claim"),
      };
    }

    _bindEvents() {
      this.el.enterBtn.addEventListener("click", (e) => this._handleEnterLevel(e));
      this.el.enterBtn.addEventListener("pointerup", (e) => this._handleEnterLevel(e));
      this.el.backBtn.addEventListener("click", () => this._showView("hub"));
      this.el.closeBtn.addEventListener("click", () => this.close());
      this.el.nextLevelBtn.addEventListener("click", (e) => this._handleNextLevel(e));
      this.el.nextLevelBtn.addEventListener("pointerup", (e) => this._handleNextLevel(e));
      this.el.refillBtn.addEventListener("click", () => {
        this.energy = RubyCaveManager.ENERGY_MAX;
        this.nextEnergyAt = null;
        this._persist();
        this._updateEnergyUI();
        this.el.energyModal.classList.remove("rc-visible");
      });
      this.el.grandClaim.addEventListener("click", () => this._claimGrandReward());

      this._onDown = (e) => this._pointerDown(e);
      this._onMove = (e) => this._pointerMove(e);
      this._onUp = () => this._pointerUp();
      document.addEventListener("pointerdown", this._onDown);
      document.addEventListener("pointermove", this._onMove);
      document.addEventListener("pointerup", this._onUp);

      const infoBtn = document.getElementById("rc-infoBtn");
      const infoPanel = document.getElementById("rc-info-panel");
      const infoBackdrop = document.getElementById("rc-info-backdrop");
      if (infoBtn && infoPanel && infoBackdrop) {
        const toggle = () => {
          const hidden = infoPanel.classList.toggle("rc-info-panel--hidden");
          infoBackdrop.classList.toggle("rc-info-panel--hidden", hidden);
        };
        infoBtn.addEventListener("click", toggle);
        infoBackdrop.addEventListener("click", toggle);
      }

      this._bindExternalEventFrame();
    }

    _startTimers() {
      this._timerInterval = setInterval(() => this._updateTimerUI(), 1000);
      this._regenInterval = setInterval(() => this._regenTick(), 1000);
    }

    _persist() {
      this._save.rubyCaveCompleted = this.completed;
      this._save.rubyCaveEnergy = this.energy;
      this._save.rubyCaveNextEnergyAt = this.nextEnergyAt;
      this._save.rubyCaveEventEnd = this.eventEnd;
      this._saveFn();
    }

    _svg(shape, fill) {
      return RubyCaveManager.SHAPES[shape].svg.replace(/FILL/g, fill);
    }

    _showToast(msg) {
      this.el.toast.textContent = msg;
      this.el.toast.classList.add("rc-show");
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => this.el.toast.classList.remove("rc-show"), 850);
    }

    _eventLevelDefs() {
      if (this._cachedEventLevelDefs) return this._cachedEventLevelDefs;
      const defs = RubyCaveManager.EVENT_LEVELS.slice();
      RubyCaveManager.LEVELS.forEach((_, idx) => {
        defs.push({
          id: "event_internal_level_" + String(idx + 2),
          type: "internal",
          internalIndex: idx,
        });
      });
      this._cachedEventLevelDefs = defs;
      return defs;
    }

    _eventLevelCount() {
      return this._eventLevelDefs().length;
    }

    _eventLevelDef(index) {
      const defs = this._eventLevelDefs();
      if (!defs.length) return null;
      const safeIndex = Math.max(0, Math.min(index, defs.length - 1));
      return defs[safeIndex];
    }

    _showView(name) {
      this.el.hub.classList.add("rc-view--hidden");
      this.el.game.classList.add("rc-view--hidden");
      if (name === "hub") {
        this._stopExternalEventLevel();
        this.el.hub.classList.remove("rc-view--hidden");
        this._updateHubProgress();
      } else {
        this.el.game.classList.remove("rc-view--hidden");
      }
      this._updateEnergyUI();
      this._updateTimerUI();
    }

    _timerText() {
      const s = Math.max(0, Math.floor((this.eventEnd - Date.now()) / 1000));
      const d = Math.floor(s / 86400);
      const h = Math.floor((s % 86400) / 3600);
      const m = Math.floor((s % 3600) / 60);
      const ss = s % 60;
      return `${d}d ${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(ss).padStart(2,"0")}`;
    }

    _updateTimerUI() {
      const t = this._timerText();
      if (this.el.hubTimer) this.el.hubTimer.textContent = `🕐 ${t}`;
      if (this.el.gameTimer) this.el.gameTimer.textContent = `🕐 ${t}`;
    }

    _updateEnergyUI() {
      const val = `${this.energy}/${RubyCaveManager.ENERGY_MAX}`;
      this.el.hubEnergy.textContent = val;
      this.el.gameEnergy.textContent = val;
      let txt = "• Full";
      if (this.energy < RubyCaveManager.ENERGY_MAX) {
        if (!this.nextEnergyAt) this.nextEnergyAt = Date.now() + RubyCaveManager.REGEN_MS;
        const left = Math.max(0, Math.ceil((this.nextEnergyAt - Date.now()) / 1000));
        const m = Math.floor(left / 60), s = left % 60;
        txt = `• ${m}:${String(s).padStart(2,"0")}`;
      }
      this.el.hubRegen.textContent = txt;
      this.el.gameRegen.textContent = txt;
    }

    _regenTick() {
      if (this.energy >= RubyCaveManager.ENERGY_MAX) { this.nextEnergyAt = null; this._updateEnergyUI(); return; }
      if (!this.nextEnergyAt) this.nextEnergyAt = Date.now() + RubyCaveManager.REGEN_MS;
      while (this.energy < RubyCaveManager.ENERGY_MAX && this.nextEnergyAt && Date.now() >= this.nextEnergyAt) {
        this.energy += 1;
        this.nextEnergyAt = this.energy < RubyCaveManager.ENERGY_MAX ? this.nextEnergyAt + RubyCaveManager.REGEN_MS : null;
      }
      this._persist();
      this._updateEnergyUI();
    }

    _updateHubProgress() {
      const total = this._eventLevelCount();
      const current = Math.min(this.completed + 1, total);
      const remain = Math.max(0, total - this.completed);
      this.el.hubProgress.textContent = `Completed ${this.completed} • Current ${current} • Remaining ${remain}`;
      if (this.completed >= total) {
        this.el.hubSum.textContent = "All levels completed!";
        this.el.enterBtn.textContent = "Completed";
        this.el.enterBtn.disabled = true;
      } else {
        this.el.hubSum.textContent = `Level ${current} is ready`;
        this.el.enterBtn.textContent = "Play";
        this.el.enterBtn.disabled = false;
      }
      this._drawNodes();
    }

    _drawNodes() {
      this.el.nodes.innerHTML = "";
      const total = this._eventLevelCount();
      for (let i = 0; i < total; i++) {
        const fallbackX = total > 1 ? (5 + (90 * i / (total - 1))) : 50;
        const nodePos = RubyCaveManager.NODE_POS[i] || [fallbackX, 50];
        const [x, y] = nodePos;
        const n = document.createElement("div");
        n.className = "rc-node";
        if (i < this.completed) n.classList.add("rc-done");
        else if (i === this.completed) n.classList.add("rc-cur");
        else n.classList.add("rc-lock");
        n.style.left = `${x}%`;
        n.style.top = `${y}%`;
        n.textContent = i < this.completed ? "✓" : (i + 1);
        this.el.nodes.appendChild(n);
      }
    }

    _buildLevel(idx) {
      this._stopExternalEventLevel();
      const lvl = RubyCaveManager.LEVELS[idx];
      this._activeInternalLevelIndex = idx;
      this.placed = 0;
      this.slots = [];
      this.el.scene.innerHTML = "";
      this.el.tray.innerHTML = "";
      const S = RubyCaveManager.SHAPES;

      lvl.slots.forEach((s) => {
        const slot = document.createElement("div");
        slot.className = "rc-slot";
        slot.dataset.shape = s.shape;
        slot.style.setProperty("--x", `${s.x}%`);
        slot.style.setProperty("--y", `${s.y}%`);
        slot.style.setProperty("--size", `${s.size}%`);
        slot.innerHTML = this._svg(s.shape, "#151529");
        const p = document.createElement("div");
        p.className = "rc-placed";
        p.innerHTML = this._svg(s.shape, S[s.shape].color);
        slot.appendChild(p);
        this.el.scene.appendChild(slot);
        this.slots.push(slot);
      });

      lvl.tray.forEach((shape) => {
        const d = document.createElement("div");
        d.className = "rc-piece";
        d.dataset.shape = shape;
        d.style.setProperty("--b", S[shape].border);
        d.style.setProperty("--bg", S[shape].bg);
        d.style.setProperty("--shadow", S[shape].shadow);
        d.innerHTML = this._svg(shape, S[shape].rich);
        this.el.tray.appendChild(d);
      });
    }

    _bindExternalEventFrame() {
      if (!this.el.externalFrame || this._eventExternalFrameBound) return;
      this._eventExternalFrameBound = true;
      this.el.externalFrame.addEventListener("load", () => {
        if (!this._eventExternalActive) return;
        this._attachExternalEventBridge();
      });
    }

    _attachExternalEventBridge() {
      try {
        const frameWin = this.el.externalFrame.contentWindow;
        if (!frameWin) return;
        const doc = frameWin.document;
        frameWin.gameEnd = () => this._onExternalEventLevelCompleted();
        frameWin.openStore = () => {};
        if (doc && doc.head) {
          const style = doc.createElement("style");
          style.textContent = "#dl,#winDl,.downloadBtn,#winBtns{display:none !important;}";
          doc.head.appendChild(style);
        }
        this._stopExternalEventObserver();
        const layer = doc ? doc.getElementById("pieceLayer") : null;
        if (!layer) return;
        this._eventExternalSeenPieceIds = new Set();
        layer.querySelectorAll(".piece[data-i]").forEach((el) => {
          const id = String(el.getAttribute("data-i") || "");
          if (id) this._eventExternalSeenPieceIds.add(id);
        });
        this._eventExternalObserver = new MutationObserver((mutations) => {
          mutations.forEach((m) => {
            m.addedNodes.forEach((node) => {
              if (!(node instanceof frameWin.Element)) return;
              if (!node.classList.contains("piece")) return;
              const pieceId = String(node.getAttribute("data-i") || "");
              if (!pieceId || this._eventExternalSeenPieceIds.has(pieceId)) return;
              this._eventExternalSeenPieceIds.add(pieceId);
              this._onExternalEventPiecePlaced(pieceId);
            });
          });
        });
        this._eventExternalObserver.observe(layer, { childList: true });
      } catch (_) {
        // Keep event-level bridge best-effort.
      }
    }

    _stopExternalEventObserver() {
      if (this._eventExternalObserver) {
        this._eventExternalObserver.disconnect();
        this._eventExternalObserver = null;
      }
      this._eventExternalSeenPieceIds = new Set();
    }

    _onExternalEventPiecePlaced(pieceId) {
      if (this._eventExternalLevelDone) return;
      if (this.energy < 1) {
        this.el.energyModal.classList.add("rc-visible");
        this._showToast("Not enough energy");
        return;
      }
      this.energy -= 1;
      if (this.energy < RubyCaveManager.ENERGY_MAX && !this.nextEnergyAt) {
        this.nextEnergyAt = Date.now() + RubyCaveManager.REGEN_MS;
      }
      this._persist();
      this._updateEnergyUI();
    }

    _startExternalEventLevel(levelDef) {
      const src = levelDef && levelDef.src ? String(levelDef.src) : "";
      if (!src || !this.el.externalHost || !this.el.externalFrame) return false;
      this._bindExternalEventFrame();
      this._eventExternalActive = true;
      this._eventExternalLevelDone = false;
      this.el.game.classList.add("rc-game--external");
      this.el.externalHost.classList.remove("rc-external-host--hidden");
      if (this._eventExternalLoadedLevelIndex === this.currentLevel && this._eventExternalLoadedSrc === src) {
        this._attachExternalEventBridge();
        return true;
      }
      this._eventExternalLoadedLevelIndex = this.currentLevel;
      this._eventExternalLoadedSrc = src;
      this.el.externalFrame.src = src;
      return true;
    }

    _stopExternalEventLevel() {
      this._eventExternalActive = false;
      this._eventExternalLevelDone = false;
      this._stopExternalEventObserver();
      if (this.el.game) this.el.game.classList.remove("rc-game--external");
      if (this.el.externalHost) this.el.externalHost.classList.add("rc-external-host--hidden");
    }

    _onExternalEventLevelCompleted() {
      if (!this._eventExternalActive || this._eventExternalLevelDone) return;
      this._eventExternalLevelDone = true;
      this.completed = Math.max(this.completed, this.currentLevel + 1);
      this._persist();
      if (this.completed >= this._eventLevelCount() && !this._save.rubyCaveRewardClaimed) {
        this._showGrandReward();
      } else {
        this.el.done.classList.add("rc-visible");
      }
    }

    _matchSlot(piece) {
      const shape = piece.dataset.shape;
      const px = parseFloat(piece.style.left) + piece.offsetWidth / 2;
      const py = parseFloat(piece.style.top) + piece.offsetHeight / 2;
      for (const s of this.slots) {
        if (s.classList.contains("rc-filled")) continue;
        if (s.dataset.shape !== shape) continue;
        const r = s.getBoundingClientRect();
        const sx = r.left + r.width / 2, sy = r.top + r.height / 2;
        if (Math.hypot(px - sx, py - sy) < r.width * 0.48) return s;
      }
      return null;
    }

    _toTray(piece) {
      piece.classList.remove("rc-drag");
      piece.classList.add("rc-ret");
      piece.style.left = this.originRect.left + "px";
      piece.style.top = this.originRect.top + "px";
      const end = () => {
        piece.classList.remove("rc-ret");
        piece.style.left = "";
        piece.style.top = "";
        piece.style.width = "";
        piece.style.height = "";
        piece.removeEventListener("transitionend", end);
      };
      piece.addEventListener("transitionend", end);
    }

    _snap(piece, slot) {
      const r = slot.getBoundingClientRect();
      const size = r.width;
      piece.classList.remove("rc-drag");
      piece.classList.add("rc-snap");
      piece.style.left = (r.left + r.width / 2 - size / 2) + "px";
      piece.style.top = (r.top + r.height / 2 - size / 2) + "px";
      piece.style.width = size + "px";
      piece.style.height = size + "px";
      piece.style.setProperty("--b", "transparent");
      piece.style.setProperty("--bg", "transparent");
      piece.style.setProperty("--shadow", "transparent");
      const end = () => {
        piece.removeEventListener("transitionend", end);
        slot.classList.add("rc-filled");
        piece.remove();
        this.placed += 1;
        const internalIdx = typeof this._activeInternalLevelIndex === "number" ? this._activeInternalLevelIndex : 0;
        const targetCount = RubyCaveManager.LEVELS[internalIdx] ? RubyCaveManager.LEVELS[internalIdx].tray.length : 0;
        if (targetCount > 0 && this.placed >= targetCount) {
          this.completed = Math.max(this.completed, this.currentLevel + 1);
          this._persist();
          if (this.completed >= this._eventLevelCount() && !this._save.rubyCaveRewardClaimed) {
            this._showGrandReward();
          } else {
            this.el.done.classList.add("rc-visible");
          }
        }
      };
      piece.addEventListener("transitionend", end);
    }

    _pointerDown(e) {
      if (this._screen.classList.contains("hidden")) return;
      if (this.el.game.classList.contains("rc-view--hidden")) return;
      if (this.el.done.classList.contains("rc-visible")) return;
      if (this.el.energyModal.classList.contains("rc-visible")) return;
      if (this.el.grandReward.classList.contains("rc-visible")) return;
      const piece = e.target.closest(".rc-piece");
      if (!piece) return;
      if (this.energy <= 0) {
        this.el.energyModal.classList.add("rc-visible");
        this._showToast("Not enough energy");
        return;
      }
      this.activePiece = piece;
      this.originRect = piece.getBoundingClientRect();
      this.offX = e.clientX - this.originRect.left;
      this.offY = e.clientY - this.originRect.top;
      piece.classList.add("rc-drag");
      piece.style.left = this.originRect.left + "px";
      piece.style.top = this.originRect.top + "px";
      piece.style.width = this.originRect.width + "px";
      piece.style.height = this.originRect.height + "px";
      piece.setPointerCapture(e.pointerId);
    }

    _pointerMove(e) {
      if (!this.activePiece) return;
      this.activePiece.style.left = (e.clientX - this.offX) + "px";
      this.activePiece.style.top = (e.clientY - this.offY) + "px";
    }

    _pointerUp() {
      if (!this.activePiece) return;
      const piece = this.activePiece;
      this.activePiece = null;
      const target = this._matchSlot(piece);
      if (!target) { this._toTray(piece); return; }
      if (this.energy < 1) {
        this._toTray(piece);
        this.el.energyModal.classList.add("rc-visible");
        this._showToast("Not enough energy");
        return;
      }
      this.energy -= 1;
      if (this.energy < RubyCaveManager.ENERGY_MAX && !this.nextEnergyAt) {
        this.nextEnergyAt = Date.now() + RubyCaveManager.REGEN_MS;
      }
      this._persist();
      this._updateEnergyUI();
      this._snap(piece, target);
    }

    _handleEnterLevel(evt) {
      if (evt) { evt.preventDefault(); evt.stopPropagation(); }
      this.el.done.classList.remove("rc-visible");
      this.el.energyModal.classList.remove("rc-visible");
      const totalLevels = this._eventLevelCount();
      if (this.completed >= totalLevels) {
        this._showToast("All event levels completed");
        return;
      }
      const nextIdx = Math.min(Math.max(0, this.completed), totalLevels - 1);
      this.currentLevel = nextIdx;
      const def = this._eventLevelDef(nextIdx);
      if (def && def.type === "html-playable") {
        const started = this._startExternalEventLevel(def);
        if (!started) {
          this._showToast("Event level unavailable");
          return;
        }
      } else {
        const internalIdx = def && typeof def.internalIndex === "number" ? def.internalIndex : 0;
        this._buildLevel(internalIdx);
      }
      this.el.gameInfo.textContent = `Level ${nextIdx + 1} / ${totalLevels}`;
      this._showView("game");
    }

    _handleNextLevel(evt) {
      if (evt) { evt.preventDefault(); evt.stopPropagation(); }
      this.completed = Math.max(this.completed, this.currentLevel + 1);
      this._persist();
      this.el.done.classList.remove("rc-visible");
      this._stopExternalEventLevel();
      this._showView("hub");
    }

    _showGrandReward() {
      this.el.grandReward.classList.add("rc-visible");
    }

    _claimGrandReward() {
      this._save.rubyCaveRewardClaimed = true;
      this._persist();
      this.el.grandReward.classList.remove("rc-visible");
      this._showView("hub");
    }

    open() {
      this._screen.classList.remove("hidden");
      this._showView("hub");
      if (!this._save.rubyCaveTutorialDone) {
        this._tutorStep = 0;
        setTimeout(() => this._runTutorialStep(), 350);
      }
    }

    close() {
      this._endTutorial();
      this.el.done.classList.remove("rc-visible");
      this.el.energyModal.classList.remove("rc-visible");
      this.el.grandReward.classList.remove("rc-visible");
      this._stopExternalEventLevel();
      this._screen.classList.add("hidden");
    }

    /* ---------- Tutorial ---------- */
    _tutorEls() {
      if (this._tutorElsCached) return this._tutorElsCached;
      this._tutorElsCached = {
        overlay: document.getElementById("rc-tutorial-overlay"),
        highlight: document.getElementById("rc-tutor-highlight"),
        bubble: document.getElementById("rc-tutor-bubble"),
        text: document.getElementById("rc-tutor-text"),
        finger: document.getElementById("rc-tutor-finger"),
      };
      return this._tutorElsCached;
    }

    _runTutorialStep() {
      const t = this._tutorEls();
      if (!t.overlay) return;
      t.overlay.classList.remove("rc-tutor-hidden");

      const steps = [
        () => this._tutorStepTimer(),
        () => this._tutorStepPlay(),
        () => this._tutorStepPuzzle(),
        () => this._tutorStepEnergy(),
      ];
      if (this._tutorStep >= steps.length) {
        this._endTutorial();
        return;
      }
      steps[this._tutorStep]();
    }

    _positionTutor(targetEl, bubbleText, bubbleBelow) {
      const t = this._tutorEls();
      const inner = this._screen.querySelector(".rc-inner");
      if (!targetEl || !inner) return;
      const ir = inner.getBoundingClientRect();
      const r = targetEl.getBoundingClientRect();
      const pad = 6;
      const hl = t.highlight;
      hl.style.left = (r.left - ir.left - pad) + "px";
      hl.style.top = (r.top - ir.top - pad) + "px";
      hl.style.width = (r.width + pad * 2) + "px";
      hl.style.height = (r.height + pad * 2) + "px";
      hl.style.borderRadius = getComputedStyle(targetEl).borderRadius || "12px";

      t.text.textContent = bubbleText;
      const bub = t.bubble;
      bub.style.left = "50%";
      bub.style.transform = "translateX(-50%)";
      if (bubbleBelow) {
        bub.style.top = (r.bottom - ir.top + 18) + "px";
        bub.style.bottom = "";
      } else {
        bub.style.top = "";
        bub.style.bottom = (ir.bottom - r.top + 18) + "px";
      }

      const finger = t.finger;
      finger.classList.remove("rc-tutor-finger--drag");
      finger.style.left = (r.left - ir.left + r.width / 2 - 14) + "px";
      finger.style.top = (r.bottom - ir.top + 2) + "px";
    }

    _tutorStepTimer() {
      const target = this.el.hubTimer;
      this._positionTutor(target, "This is a limited-time event! Complete it before the timer runs out.", true);
      this._tutorTapHandler = () => {
        this._tutorStep = 1;
        this._runTutorialStep();
      };
      this._tutorEls().overlay.addEventListener("click", this._tutorTapHandler, { once: true });
    }

    _tutorStepPlay() {
      const target = this.el.enterBtn;
      this._positionTutor(target, "Tap Play to enter the event level and start solving puzzles!", false);
      const t = this._tutorEls();
      t.finger.style.top = (target.getBoundingClientRect().top - this._screen.querySelector(".rc-inner").getBoundingClientRect().top - 32) + "px";

      this._tutorTapHandler = () => {
        t.overlay.classList.add("rc-tutor-hidden");
        this._tutorStep = 2;
        this._handleEnterLevel(null);
        setTimeout(() => this._runTutorialStep(), 500);
      };
      t.overlay.addEventListener("click", this._tutorTapHandler, { once: true });
    }

    _tutorStepPuzzle() {
      const t = this._tutorEls();
      t.overlay.classList.remove("rc-tutor-hidden");
      const inner = this._screen.querySelector(".rc-inner");
      if (!inner) return;
      const ir = inner.getBoundingClientRect();

      const firstPiece = this.el.tray.querySelector(".rc-piece");
      const firstSlot = this.el.scene.querySelector(".rc-slot");
      if (!firstPiece || !firstSlot) { this._tutorStep = 3; this._runTutorialStep(); return; }

      const pr = firstPiece.getBoundingClientRect();
      const sr = firstSlot.getBoundingClientRect();
      const pad = 8;

      const minX = Math.min(pr.left, sr.left) - ir.left - pad;
      const minY = Math.min(pr.top, sr.top) - ir.top - pad;
      const maxX = Math.max(pr.right, sr.right) - ir.left + pad;
      const maxY = Math.max(pr.bottom, sr.bottom) - ir.top + pad;
      const hl = t.highlight;
      hl.style.left = minX + "px";
      hl.style.top = minY + "px";
      hl.style.width = (maxX - minX) + "px";
      hl.style.height = (maxY - minY) + "px";
      hl.style.borderRadius = "18px";

      t.text.textContent = "Drag puzzle pieces from the tray and drop them into matching slots!";
      const bub = t.bubble;
      bub.style.left = "50%";
      bub.style.transform = "translateX(-50%)";
      bub.style.top = (minY - 80) + "px";
      bub.style.bottom = "";
      if (parseFloat(bub.style.top) < 40) {
        bub.style.top = "";
        bub.style.bottom = (ir.height - maxY - 70) + "px";
      }

      const finger = t.finger;
      finger.classList.add("rc-tutor-finger--drag");
      const dx = (sr.left + sr.width / 2) - (pr.left + pr.width / 2);
      const dy = (sr.top + sr.height / 2) - (pr.bottom);
      finger.style.setProperty("--drag-dx", dx + "px");
      finger.style.setProperty("--drag-dy", dy + "px");
      finger.style.left = (pr.left - ir.left + pr.width / 2 - 14) + "px";
      finger.style.top = (pr.bottom - ir.top) + "px";

      this._tutorTapHandler = () => {
        finger.classList.remove("rc-tutor-finger--drag");
        this._tutorStep = 3;
        this._runTutorialStep();
      };
      t.overlay.addEventListener("click", this._tutorTapHandler, { once: true });
    }

    _tutorStepEnergy() {
      const target = this.el.gameEnergy?.closest(".rc-energy-pill") || this.el.gameEnergy;
      if (!target) { this._endTutorial(); return; }
      this._positionTutor(target, "This event has its own energy. Each piece placed costs 1 energy — separate from the main game!", true);
      this._tutorTapHandler = () => {
        this._endTutorial();
      };
      this._tutorEls().overlay.addEventListener("click", this._tutorTapHandler, { once: true });
    }

    _endTutorial() {
      const t = this._tutorEls();
      if (t.overlay) t.overlay.classList.add("rc-tutor-hidden");
      if (this._tutorTapHandler) {
        t.overlay.removeEventListener("click", this._tutorTapHandler);
        this._tutorTapHandler = null;
      }
      if (!this._save.rubyCaveTutorialDone) {
        this._save.rubyCaveTutorialDone = true;
        this._saveFn();
      }
    }

    resetFromSave() {
      if (!this._save.rubyCaveEventEnd) {
        this._save.rubyCaveEventEnd = Date.now() + 2 * 24 * 60 * 60 * 1000;
        this._saveFn();
      }
      this.completed = this._save.rubyCaveCompleted || 0;
      this.energy = typeof this._save.rubyCaveEnergy === "number" ? this._save.rubyCaveEnergy : RubyCaveManager.ENERGY_MAX;
      this.nextEnergyAt = this._save.rubyCaveNextEnergyAt || null;
      this.eventEnd = this._save.rubyCaveEventEnd;
      this.currentLevel = 0;
      this.placed = 0;
      this.slots = [];
      this._activeInternalLevelIndex = 0;
      this._stopExternalEventLevel();
    }
  }

  class GameApp {
    constructor() {
      window.gameApp = this;
      this._save = loadSave();
      this.levelManager = new LevelManager();
      this.collectionManager = new CollectionManager(this._save, () => saveSave(this._save));
      this.leaderboardManager = new LeaderboardManager(this._save, () => saveSave(this._save));
      this.lostTempleManager = new LostTempleManager(this._save, () => saveSave(this._save), this);
      this.rubyCaveManager = new RubyCaveManager(this._save, () => saveSave(this._save));
      this._migrateCollectionState();
      this.ui = new UI();
      this.board = new PuzzleBoard(
        document.getElementById("puzzle-board"),
        () => this.handlePuzzleComplete()
      );
      this.pieceTray = new PieceTray(
        document.getElementById("piece-tray"),
        this.board,
        {
          onPlace: (pieceId) => this.onPiecePlaced(pieceId),
          onWrongDrop: () => this.onWrongDrop(),
          beforePlace: () => this._trySpendPuzzleEnergy(),
        }
      );
      this.collectionUI = new CollectionUI(this.collectionManager, this);
      this.currentLevelIndex = this._save.currentLevel;
      this.startTime = 0;
      this.mistakes = 0;
      this._cheatPlaceAnimating = false;
      this._pendingBattlePassUnlockAfterWin = false;
      this._pendingWheelUnlockAfterWin = false;
      this._pendingLeaderboardUnlockAfterWin = false;
      this._pendingLostTempleUnlockAfterWin = false;
      this._bpTutorDragAnimationId = null;
      this._playingBonusLevel = false;
      this._dailyTasksResetTimerId = null;
      this._dailyTasksEscapeHandler = null;
      this._externalLevelActive = false;
      this._externalLevelFrameBound = false;
      this._externalLevelLoadedIndex = -1;
      this._externalLevelLoadedSrc = "";
      this.externalLevelHostEl = document.getElementById("external-level-host");
      this.externalLevelFrameEl = document.getElementById("external-level-frame");
      this._applySaveToUI();
      this._bindGlobalButtons();
      this._bindExternalLevelHost();
      this.collectionUI.updateCollectionButtons();
      this.lostTempleManager.updateWidget();
      this.ui.showScreen("start-screen");
    }

    _migrateCollectionState() {
      this._save.collectionUnlocked = true;
      this._save.collectionTutorialCompleted = true;
      if (!this._save.albumEvent) {
        this._save.albumEvent = { startAt: Date.now(), endAt: Date.now() + EVENT_DURATION_MS };
      }
      if (!this._save.battlePassEvent) {
        this._save.battlePassEvent = { startAt: Date.now(), endAt: Date.now() + EVENT_DURATION_MS };
      }
      if (!this._save.lostTempleEvent) {
        this._save.lostTempleEvent = { startAt: Date.now(), endAt: Date.now() + EVENT_DURATION_MS };
      }
      saveSave(this._save);
    }

    addCoins(amount) {
      this._save.coins = (this._save.coins || 0) + (amount || 0);
      saveSave(this._save);
      this.ui.setCoins(this._save.coins);
    }

    addHammers(amount) {
      const add = Math.max(0, parseInt(amount, 10) || 0);
      if (!add) return;
      this._save.eventHammers = (this._save.eventHammers || 0) + add;
      saveSave(this._save);
      this.lostTempleManager.updateWidget();
      const screen = document.getElementById("lostTempleScreen");
      if (screen && !screen.classList.contains("hidden")) this.lostTempleManager._render();
    }

    canUseHammer() {
      return (this._save.eventHammers || 0) > 0;
    }

    spendHammer() {
      if (!this.canUseHammer()) return false;
      this._save.eventHammers = Math.max(0, (this._save.eventHammers || 0) - 1);
      saveSave(this._save);
      this.lostTempleManager.updateWidget();
      return true;
    }

    _applySaveToUI() {
      this._syncDailyTasksData();
      this.ui.setLevelNumber(this.currentLevelIndex);
      this.ui.setCoins(this._save.coins);
      this._updatePuzzleEnergyUI();
      const music = this._save.musicOn !== "false";
      const sfx = this._save.sfxOn !== "false";
      document.getElementById("toggle-music").setAttribute("aria-checked", music);
      document.getElementById("toggle-sfx").setAttribute("aria-checked", sfx);
      const trophies = (this._save.rewards && this._save.rewards.trophies) || 0;
      const trophiesEl = document.getElementById("settings-trophies-count");
      if (trophiesEl) trophiesEl.textContent = trophies;
      const navTrophies = document.getElementById("nav-trophies-count");
      if (navTrophies) navTrophies.textContent = this.leaderboardManager ? this.leaderboardManager.getPlayerScore() : (this._save.piecesCollectedTotal || 0);
      const goldCupRow = document.getElementById("settings-gold-cup-row");
      if (goldCupRow) goldCupRow.classList.toggle("hidden", !(this._save.rewards && this._save.rewards.trophiesGoldCup));
      if (window.gameApp && window.gameApp.collectionUI && typeof window.gameApp.collectionUI.updateGlobalCardsProgress === "function") {
        window.gameApp.collectionUI.updateGlobalCardsProgress();
      }
      if (window.gameApp && typeof window.gameApp.updateLeaderboardWidget === "function") {
        window.gameApp.updateLeaderboardWidget();
      }
      if (window.gameApp && typeof window.gameApp.updatePiggyWidget === "function") {
        window.gameApp.updatePiggyWidget();
      }
      const debugPanel = document.getElementById("debug-cheat-panel");
      if (debugPanel) debugPanel.classList.remove("hidden");
      const autoBtn = document.getElementById("btn-cheat-auto");
      if (autoBtn) autoBtn.classList.remove("hidden");
      if (window.gameApp && typeof window.gameApp._updateCheatAutoButton === "function") {
        window.gameApp._updateCheatAutoButton();
      }
      this.updateWheelWidget();
      if (window.gameApp && typeof window.gameApp.updateBattlePassWidget === "function") {
        window.gameApp.updateBattlePassWidget();
      }
      if (window.gameApp && typeof window.gameApp.updateRaceEventWidget === "function") {
        window.gameApp.updateRaceEventWidget();
      }
      if (window.gameApp && window.gameApp.lostTempleManager && typeof window.gameApp.lostTempleManager.updateWidget === "function") {
        window.gameApp.lostTempleManager.updateWidget();
      }
      if (window.gameApp && typeof window.gameApp.updateProfileWidget === "function") {
        window.gameApp.updateProfileWidget();
      }
      this._renderDailyTasksScreen();
    }

    _todayKey() {
      const d = new Date();
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    }

    _syncDailyTasksData() {
      const today = this._todayKey();
      if (this._save.dailyTasksDateKey !== today) {
        const prevDay = Math.max(1, parseInt(this._save.dailyTasksDayIndex, 10) || 1);
        this._save.dailyTasksDateKey = today;
        this._save.dailyTasksClaims = {};
        this._save.dailyTasksMainRewardClaimed = false;
        this._save.dailyTasksDayIndex = ((prevDay % 7) + 1);
        this._save.dailyTasksProgress = { level1Complete: 0, piecesPlaced: 0, wheelSpins: 0, raceActions: 0, piggyClaims: 0 };
        saveSave(this._save);
      }
      if (!this._save.dailyTasksProgress || typeof this._save.dailyTasksProgress !== "object") {
        this._save.dailyTasksProgress = { level1Complete: 0, piecesPlaced: 0, wheelSpins: 0, raceActions: 0, piggyClaims: 0 };
      }
      if (!this._save.dailyTasksClaims || typeof this._save.dailyTasksClaims !== "object") {
        this._save.dailyTasksClaims = {};
      }
      if (typeof this._save.dailyTasksMainRewardClaimed !== "boolean") this._save.dailyTasksMainRewardClaimed = false;
      if (typeof this._save.dailyTasksDayIndex !== "number") this._save.dailyTasksDayIndex = 1;
      const progress = this._save.dailyTasksProgress;
      progress.level1Complete = Math.max(0, parseInt(progress.level1Complete, 10) || 0);
      progress.piecesPlaced = Math.max(0, parseInt(progress.piecesPlaced, 10) || 0);
      progress.wheelSpins = Math.max(0, parseInt(progress.wheelSpins, 10) || 0);
      progress.raceActions = Math.max(0, parseInt(progress.raceActions, 10) || 0);
      progress.piggyClaims = Math.max(0, parseInt(progress.piggyClaims, 10) || 0);
    }

    _secondsUntilDailyReset() {
      const now = new Date();
      const reset = new Date(now);
      reset.setHours(24, 0, 0, 0);
      return Math.max(0, Math.floor((reset.getTime() - now.getTime()) / 1000));
    }

    _dailyTaskModels() {
      this._syncDailyTasksData();
      const progress = this._save.dailyTasksProgress || {};
      const claims = this._save.dailyTasksClaims || {};
      return DAILY_TASK_DEFS.map((def) => {
        const current = Math.max(0, parseInt(progress[def.progressKey], 10) || 0);
        const target = Math.max(1, parseInt(def.target, 10) || 1);
        const done = current >= target;
        const claimed = !!claims[def.id];
        const state = claimed ? "claimed" : (done ? "completed" : (current > 0 ? "in_progress" : "not_started"));
        return { ...def, current, target, done, claimed, state };
      });
    }

    _dailyMainPoints(models) {
      const tasks = models || this._dailyTaskModels();
      return tasks.reduce((sum, t) => sum + (t.claimed ? (t.points || 0) : 0), 0);
    }

    _renderDailyTasksScreen() {
      const listEl = document.getElementById("daily-tasks-list");
      if (!listEl) return;
      const tasks = this._dailyTaskModels();
      const dayEl = document.getElementById("daily-tasks-day");
      if (dayEl) {
        const dayIdx = Math.max(1, Math.min(7, parseInt(this._save.dailyTasksDayIndex, 10) || 1));
        dayEl.textContent = "Day " + String(dayIdx) + "/7";
      }
      const mainTarget = 15;
      const mainCurrent = Math.min(mainTarget, this._dailyMainPoints(tasks));
      const mainFill = document.getElementById("daily-tasks-main-fill");
      if (mainFill) mainFill.style.width = Math.round((mainCurrent / mainTarget) * 100) + "%";
      const mainCurrentEl = document.getElementById("daily-tasks-main-current");
      if (mainCurrentEl) mainCurrentEl.textContent = String(mainCurrent);
      const mainTargetEl = document.getElementById("daily-tasks-main-target");
      if (mainTargetEl) mainTargetEl.textContent = String(mainTarget);
      const mainClaimBtn = document.getElementById("btn-daily-main-claim");
      if (mainClaimBtn) {
        const canClaimMain = mainCurrent >= mainTarget && !this._save.dailyTasksMainRewardClaimed;
        mainClaimBtn.disabled = !canClaimMain;
        mainClaimBtn.textContent = this._save.dailyTasksMainRewardClaimed ? "Claimed" : (canClaimMain ? "Claim" : "Locked");
      }
      listEl.innerHTML = "";
      tasks.forEach((task) => {
        const pct = Math.max(0, Math.min(100, Math.round((task.current / task.target) * 100)));
        const item = document.createElement("article");
        item.className = "daily-task-item state-" + task.state;
        item.innerHTML =
          `<div class="daily-task-grid">` +
            `<div class="daily-task-points">` +
              `<span class="daily-task-points-medal">🏅</span>` +
              `<span class="daily-task-points-value">+${task.points}</span>` +
              `<button type="button" class="daily-task-cheat" data-task-cheat-id="${task.id}" ${task.claimed ? "disabled" : ""}>Cheat</button>` +
            `</div>` +
            `<div class="daily-task-center">` +
              `<h3 class="daily-task-title">${task.title}</h3>` +
              `<div class="daily-task-bar"><div class="daily-task-bar-fill" style="width:${pct}%"></div></div>` +
              `<p class="daily-task-progress">${Math.min(task.current, task.target)}/${task.target}</p>` +
            `</div>` +
            `<div class="daily-task-reward">${task.rewardText}</div>` +
          `</div>` +
          `<div class="daily-task-actions">` +
            `<button type="button" class="daily-task-claim" data-task-id="${task.id}" ${task.done && !task.claimed ? "" : "disabled"}>` +
              `${task.claimed ? "Claimed" : (task.done ? "Claim" : "In Progress")}` +
            `</button>` +
          `</div>`;
        listEl.appendChild(item);
      });
      const resetEl = document.getElementById("daily-tasks-refresh-timer");
      if (resetEl) {
        const sec = this._secondsUntilDailyReset();
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        resetEl.textContent = `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m`;
      }
    }

    _claimDailyTask(taskId) {
      const task = DAILY_TASK_DEFS.find((t) => t.id === taskId);
      if (!task) return;
      const model = this._dailyTaskModels().find((t) => t.id === taskId);
      if (!model || !model.done || model.claimed) return;
      this._save.dailyTasksClaims[taskId] = true;
      if (task.rewardCoins) this._save.coins = (this._save.coins || 0) + task.rewardCoins;
      if (task.rewardGems) this._save.gemsTotal = (this._save.gemsTotal || 0) + task.rewardGems;
      saveSave(this._save);
      this.ui.setCoins(this._save.coins);
      this._renderDailyTasksScreen();
    }

    _cheatCompleteDailyTask(taskId) {
      const task = DAILY_TASK_DEFS.find((t) => t.id === taskId);
      if (!task) return;
      this._syncDailyTasksData();
      if (!this._save.dailyTasksProgress || typeof this._save.dailyTasksProgress !== "object") return;
      this._save.dailyTasksProgress[task.progressKey] = Math.max(task.target || 1, parseInt(this._save.dailyTasksProgress[task.progressKey], 10) || 0);
      saveSave(this._save);
      this._renderDailyTasksScreen();
    }

    _claimDailyMainReward() {
      this._syncDailyTasksData();
      const mainTarget = 15;
      if (this._save.dailyTasksMainRewardClaimed) return;
      if (this._dailyMainPoints() < mainTarget) return;
      this._save.dailyTasksMainRewardClaimed = true;
      this._save.coins = (this._save.coins || 0) + 120;
      this._save.albumStars = (this._save.albumStars || 0) + 10;
      saveSave(this._save);
      this.ui.setCoins(this._save.coins);
      this.collectionUI.updateCollectionButtons();
      this._renderDailyTasksScreen();
    }

    _openDailyTasksInfoOverlay() {
      const overlay = document.getElementById("daily-tasks-info-overlay");
      if (!overlay) return;
      overlay.classList.remove("hidden");
      const close = () => this._closeDailyTasksInfoOverlay();
      overlay.onclick = (e) => { if (e.target === overlay) close(); };
      const cont = document.getElementById("daily-tasks-info-continue");
      if (cont) cont.onclick = close;
    }

    _closeDailyTasksInfoOverlay() {
      const overlay = document.getElementById("daily-tasks-info-overlay");
      if (!overlay) return;
      overlay.classList.add("hidden");
      overlay.onclick = null;
      const cont = document.getElementById("daily-tasks-info-continue");
      if (cont) cont.onclick = null;
    }

    openDailyTasksScreen() {
      const screen = document.getElementById("daily-tasks-screen");
      if (!screen) return;
      this.ui.showScreen("daily-tasks-screen");
      const listEl = document.getElementById("daily-tasks-list");
      if (listEl) {
        listEl.onclick = (e) => {
          const cheatBtn = e.target.closest(".daily-task-cheat");
          if (cheatBtn) {
            const cheatTaskId = cheatBtn.getAttribute("data-task-cheat-id");
            if (cheatTaskId) this._cheatCompleteDailyTask(cheatTaskId);
            return;
          }
          const btn = e.target.closest(".daily-task-claim");
          if (!btn) return;
          const taskId = btn.getAttribute("data-task-id");
          if (taskId) this._claimDailyTask(taskId);
        };
      }
      const mainClaimBtn = document.getElementById("btn-daily-main-claim");
      if (mainClaimBtn) mainClaimBtn.onclick = () => this._claimDailyMainReward();
      const infoBtn = document.getElementById("btn-daily-tasks-info");
      if (infoBtn) infoBtn.onclick = () => this._openDailyTasksInfoOverlay();
      this._renderDailyTasksScreen();
      if (this._dailyTasksResetTimerId) clearInterval(this._dailyTasksResetTimerId);
      this._dailyTasksResetTimerId = setInterval(() => this._renderDailyTasksScreen(), 1000);
      if (this._dailyTasksEscapeHandler) window.removeEventListener("keydown", this._dailyTasksEscapeHandler);
      this._dailyTasksEscapeHandler = (e) => {
        if (e.key !== "Escape") return;
        const overlay = document.getElementById("daily-tasks-info-overlay");
        if (overlay && !overlay.classList.contains("hidden")) {
          e.preventDefault();
          this._closeDailyTasksInfoOverlay();
        }
      };
      window.addEventListener("keydown", this._dailyTasksEscapeHandler);
    }

    closeDailyTasksScreen() {
      this._closeDailyTasksInfoOverlay();
      const listEl = document.getElementById("daily-tasks-list");
      if (listEl) listEl.onclick = null;
      const infoBtn = document.getElementById("btn-daily-tasks-info");
      if (infoBtn) infoBtn.onclick = null;
      const mainClaimBtn = document.getElementById("btn-daily-main-claim");
      if (mainClaimBtn) mainClaimBtn.onclick = null;
      if (this._dailyTasksResetTimerId) {
        clearInterval(this._dailyTasksResetTimerId);
        this._dailyTasksResetTimerId = null;
      }
      if (this._dailyTasksEscapeHandler) {
        window.removeEventListener("keydown", this._dailyTasksEscapeHandler);
        this._dailyTasksEscapeHandler = null;
      }
    }

    _saveState() {
      this._save.currentLevel = this.currentLevelIndex;
      this._save.coins = this.getCoins();
      this._save.musicOn = document.getElementById("toggle-music").getAttribute("aria-checked");
      this._save.sfxOn = document.getElementById("toggle-sfx").getAttribute("aria-checked");
      if (this._save.rewards) {
        const trophiesEl = document.getElementById("settings-trophies-count");
        if (trophiesEl) this._save.rewards.trophies = parseInt(trophiesEl.textContent, 10) || 0;
      }
      saveSave(this._save);
    }

    getCoins() {
      const el = document.getElementById("coins-count");
      return el ? parseInt(el.textContent, 10) || 0 : DEFAULT_COINS;
    }

    _updateCheatAutoButton() {
      const btn = document.getElementById("btn-cheat-auto");
      if (!btn || btn.classList.contains("hidden")) return;
      const gameActive = document.getElementById("game-screen").classList.contains("active");
      const winOpen = !document.getElementById("win-modal").classList.contains("hidden");
      const disabled = !gameActive || winOpen;
      btn.disabled = disabled;
      btn.classList.toggle("cheat-auto-disabled", disabled);
    }

    _bindExternalLevelHost() {
      const backBtn = document.getElementById("btn-external-level-back");
      if (backBtn) {
        backBtn.onclick = () => {
          if (this._externalLevelActive) this._stopExternalPlayableLevel();
          this.ui.showScreen("start-screen");
        };
      }
      const skipBtn = document.getElementById("btn-external-level-skip");
      if (skipBtn) skipBtn.onclick = () => this._skipCurrentLevel();
      if (this.externalLevelFrameEl && !this._externalLevelFrameBound) {
        this._externalLevelFrameBound = true;
        this.externalLevelFrameEl.addEventListener("load", () => {
          if (!this._externalLevelActive) return;
          // Best effort bridge: if same-origin/same-file context allows it,
          // connect the uploaded level callbacks to our flow.
          try {
            const frameWin = this.externalLevelFrameEl.contentWindow;
            if (frameWin) {
              frameWin.gameEnd = () => this._onExternalPlayableCompleted();
              // Spend 1 main energy for each newly placed piece in embedded levels.
              const doc = frameWin.document;
              const layer = doc ? doc.getElementById("pieceLayer") : null;
              if (layer) {
                if (this._externalPieceObserver) {
                  this._externalPieceObserver.disconnect();
                  this._externalPieceObserver = null;
                }
                this._externalSeenPieceIds = new Set();
                layer.querySelectorAll(".piece[data-i]").forEach((el) => {
                  const id = String(el.dataset.i || "");
                  if (id) this._externalSeenPieceIds.add(id);
                });
                this._externalPieceObserver = new MutationObserver((mutations) => {
                  mutations.forEach((m) => {
                    m.addedNodes.forEach((node) => {
                      if (!(node instanceof frameWin.Element)) return;
                      if (!node.classList.contains("piece")) return;
                      const pieceId = String(node.getAttribute("data-i") || "");
                      if (!pieceId || this._externalSeenPieceIds.has(pieceId)) return;
                      this._externalSeenPieceIds.add(pieceId);
                      this._onExternalPiecePlaced(pieceId);
                    });
                  });
                });
                this._externalPieceObserver.observe(layer, { childList: true });
              }
              // Disable outbound store action and hide download CTAs from embedded level.
              frameWin.openStore = () => {};
              if (doc && doc.head) {
                const style = doc.createElement("style");
                const hideHints = this.currentLevelIndex > 0;
                style.textContent =
                  "#dl,#winDl,.downloadBtn,#winBtns{display:none !important;}" +
                  (hideHints
                    ? "#hintOverlay,#hintHand,#scrollHintOverlay,#scrollHintHand{display:none !important;opacity:0 !important;pointer-events:none !important;}"
                    : "");
                doc.head.appendChild(style);
              }
              if (this.currentLevelIndex > 0) {
                try {
                  const doc = frameWin.document;
                  const hintOverlay = doc ? doc.getElementById("hintOverlay") : null;
                  if (hintOverlay) hintOverlay.dataset.hand1Ready = "0";
                  const scrollHintOverlay = doc ? doc.getElementById("scrollHintOverlay") : null;
                  if (scrollHintOverlay) scrollHintOverlay.dataset.hand2Ready = "0";
                  frameWin.runBoosterTutorial = () => {};
                } catch (_) {
                  // Keep best-effort only.
                }
              }
            }
          } catch (_) {
            // Cross-origin restrictions are expected in some runtimes.
          }
        });
      }
    }

    _toggleGameplayHostUI(useExternalHost) {
      const progressBar = document.querySelector("#game-screen .progress-bar");
      const gameArea = document.querySelector("#game-screen .game-area");
      const debugPanel = document.getElementById("debug-cheat-panel");
      if (this.externalLevelHostEl) this.externalLevelHostEl.classList.toggle("hidden", !useExternalHost);
      if (progressBar) progressBar.classList.toggle("hidden", useExternalHost);
      if (gameArea) gameArea.classList.toggle("hidden", useExternalHost);
      if (debugPanel) debugPanel.classList.toggle("hidden", useExternalHost);
    }

    _startExternalPlayableLevel(entry, levelIndex) {
      if (!entry || !entry.src || !this.externalLevelFrameEl) {
        this.loadLevel(levelIndex);
        return;
      }
      this._externalLevelActive = true;
      this.currentLevelIndex = Math.max(0, levelIndex);
      this.ui.setLevelNumber(this.currentLevelIndex);
      this._saveState();
      this.ui.showScreen("game-screen");
      this._toggleGameplayHostUI(true);
      const currentSrc = String(this.externalLevelFrameEl.src || "");
      const canReuseExistingState =
        this._externalLevelLoadedIndex === levelIndex &&
        currentSrc &&
        currentSrc !== "about:blank" &&
        currentSrc.indexOf(entry.src) >= 0;
      if (!canReuseExistingState) {
        this.externalLevelFrameEl.src = entry.src;
        this._externalLevelLoadedIndex = levelIndex;
        this._externalLevelLoadedSrc = entry.src;
      }
    }

    _stopExternalPlayableLevel() {
      this._externalLevelActive = false;
      // Keep iframe state in memory so returning with Play resumes same progress.
      this._toggleGameplayHostUI(false);
    }

    _onExternalPlayableCompleted() {
      const next = this.currentLevelIndex + 1;
      this._stopExternalPlayableLevel();
      this.currentLevelIndex = Math.min(next, this.levelManager.getTotalLevels() - 1);
      this._saveState();
      this.ui.showScreen("start-screen");
      this._renderGalleryScreen();
    }

    _skipCurrentLevel() {
      const next = this.currentLevelIndex + 1;
      if (next >= this.levelManager.getTotalLevels()) {
        this.ui.showScreen("start-screen");
        return;
      }
      if (this._externalLevelActive) this._stopExternalPlayableLevel();
      this._launchLevelByIndex(next);
    }

    _resolveGalleryLevels() {
      const currentProgress = Math.max(0, parseInt(this._save.currentLevel, 10) || 0);
      return GALLERY_LEVEL_DEFS.map((def, index) => {
        let state = "locked";
        if (typeof def.playableLevelIndex === "number") {
          if (currentProgress > def.playableLevelIndex) state = "completed";
          else if (currentProgress === def.playableLevelIndex) state = "unlocked";
          else state = "locked";
        }
        return {
          id: def.id,
          label: "Level " + String(index + 1),
          featureIcon: def.featureIcon,
          state,
          playableLevelIndex: def.playableLevelIndex,
        };
      });
    }

    _renderGalleryScreen() {
      const grid = document.getElementById("gallery-grid");
      if (!grid) return;
      const levels = this._resolveGalleryLevels();
      grid.innerHTML = "";
      levels.forEach((entry) => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "gallery-level-card state-" + entry.state;
        card.setAttribute("role", "listitem");
        card.setAttribute("aria-disabled", entry.state === "locked" ? "true" : "false");

        const bg = document.createElement("span");
        bg.className = "gallery-level-bg";
        bg.setAttribute("aria-hidden", "true");
        card.appendChild(bg);

        const overlay = document.createElement("span");
        overlay.className = "gallery-level-overlay";
        overlay.setAttribute("aria-hidden", "true");
        card.appendChild(overlay);

        const featureIcon = document.createElement("span");
        featureIcon.className = "gallery-level-feature-icon " + entry.featureIcon;
        featureIcon.setAttribute("aria-hidden", "true");
        card.appendChild(featureIcon);

        const badge = document.createElement("span");
        badge.className = "gallery-level-state-badge";
        if (entry.state === "unlocked") badge.textContent = "50%";
        badge.setAttribute("aria-hidden", "true");
        card.appendChild(badge);

        const title = document.createElement("span");
        title.className = "gallery-level-title";
        title.textContent = entry.label;
        card.appendChild(title);

        if (entry.state !== "locked" && typeof entry.playableLevelIndex === "number") {
          card.onclick = () => this._launchLevelByIndex(entry.playableLevelIndex);
        } else {
          card.onclick = null;
        }
        grid.appendChild(card);
      });
    }

    openGalleryScreen() {
      if (this._externalLevelActive) this._stopExternalPlayableLevel();
      this._renderGalleryScreen();
      this.ui.showScreen("gallery-screen");
    }

    _launchLevelByIndex(index) {
      const safeIndex = Math.max(0, Math.min(index, this.levelManager.getTotalLevels() - 1));
      this.currentLevelIndex = safeIndex;
      this.ui.setLevelNumber(this.currentLevelIndex);
      const entry = this.levelManager.getLevelEntry(this.currentLevelIndex);
      if (entry && entry.type === "html-playable") {
        this._startExternalPlayableLevel(entry, this.currentLevelIndex);
        return;
      }
      this.ui.showScreen("game-screen");
      this._toggleGameplayHostUI(false);
      this.loadLevel(this.currentLevelIndex);
    }

    cheatPlaceOnePiece() {
      const gameScreen = document.getElementById("game-screen");
      const winModal = document.getElementById("win-modal");
      if (!gameScreen || !gameScreen.classList.contains("active")) return;
      if (!winModal || !winModal.classList.contains("hidden")) return;
      if (this._cheatPlaceAnimating) return;
      if (!this._trySpendPuzzleEnergy()) return;
      this.pieceTray.cancelDrag();
      const piece = this.pieceTray.pieces.find((p) => !p.placed);
      if (!piece) return;
      const slot = this.board.getSlotByPieceId(piece.pieceId);
      if (!slot || slot.filled) return;

      this._cheatPlaceAnimating = true;
      const doPlace = () => {
        this._cheatPlaceAnimating = false;
        const placed = this.board.placePiece(piece.pieceId, piece.url, true);
        if (!placed) return;
        piece.placed = true;
        piece.el.style.visibility = "hidden";
        piece.el.style.pointerEvents = "none";
        this.onPiecePlaced(piece.pieceId);
      };

      const trayRect = piece.el.getBoundingClientRect();
      const slotRect = slot.el.getBoundingClientRect();
      const w = trayRect.width;
      const h = trayRect.height;
      const endX = slotRect.left + (slotRect.width - w) / 2;
      const endY = slotRect.top + (slotRect.height - h) / 2;

      const clone = document.createElement("div");
      clone.className = "cheat-fly-piece";
      clone.style.width = w + "px";
      clone.style.height = h + "px";
      clone.style.left = trayRect.left + "px";
      clone.style.top = trayRect.top + "px";
      clone.style.backgroundImage = "url(" + piece.url + ")";
      document.body.appendChild(clone);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          clone.style.left = endX + "px";
          clone.style.top = endY + "px";
        });
      });
      clone.addEventListener("transitionend", () => {
        clone.remove();
        doPlace();
      }, { once: true });
      setTimeout(() => {
        if (clone.parentNode) {
          clone.remove();
          doPlace();
        }
      }, 400);
    }

    startGame() {
      const savedLevel = Math.max(0, parseInt(this._save.currentLevel, 10) || 0);
      this._launchLevelByIndex(savedLevel);
    }

    loadLevel(index) {
      const level = this.levelManager.getLevel(index);
      if (!level) return;
      this._stopExternalPlayableLevel();
      this.currentLevelIndex = index;
      this.startTime = Date.now();
      this.mistakes = 0;
      this._saveState();

      this._clearBattlePassTutorial();

      const pieceUrls = this.board.build(level);
      this.pieceTray.build(pieceUrls, 64);

      this.ui.setLevelNumber(index);
      this.ui.setProgress(0, level.pieceCount);
      this.ui.setCoins(this.getCoins());
      this.collectionUI.updateCollectionButtons();

      if (this._save.battlePassUnlocked) {
        this._startBattlePassTutorialIfNeeded();
      }
    }

    loadBonusLevel() {
      const level = this.levelManager.getBonusLevel();
      if (!level) return;
      this._playingBonusLevel = true;
      this.startTime = Date.now();
      this.mistakes = 0;

      this._clearBattlePassTutorial();

      const gameArea = document.querySelector(".game-area");
      if (gameArea) gameArea.classList.add("game-area--bonus");

      const pieceUrls = this.board.build(level);
      this.pieceTray.build(pieceUrls, 64);

      this.ui.setLevelLabel("Bonus Level");
      this.ui.setProgress(0, level.pieceCount);
      this.ui.setCoins(this.getCoins());
      this.collectionUI.updateCollectionButtons();
    }

    replayBonusLevel() {
      this.ui.hideWinModal();
      this._updateCheatAutoButton();
      this.loadBonusLevel();
    }

    onPiecePlaced(pieceId) {
      this._awardMetaProgressOnPiecePlaced(pieceId);
      if (this._save.bpTutorStep === 1) {
        this._save.bpTutorStep = 2;
        saveSave(this._save);
        this._bpTutorHideHand();
        if (this._bpTutorDragAnimationId) {
          cancelAnimationFrame(this._bpTutorDragAnimationId);
          this._bpTutorDragAnimationId = null;
        }
        this._bpTutorShowHandAtElement(this._getBPWidgetElement(), "Tap Battle Pass to see rewards!");
      }
      this.ui.setProgress(this.board.getPlacedCount(), this.board.getTotalPieces());
      if (document.getElementById("toggle-sfx").getAttribute("aria-checked") === "true") {
        AudioPlayer.place();
      }
    }

    _awardMetaProgressOnPiecePlaced(pieceId) {
      const piecePoints = 1;
      let saveDirty = false;
      if (this._save.leaderboardUnlocked) {
        this.leaderboardManager.incrementOnPiecePlaced();
      }
      if (this._save.battlePassUnlocked && isEventActive(this._save, "battlePassEvent")) {
        this._save.bpStarsTotal = (this._save.bpStarsTotal || 0) + piecePoints;
        saveDirty = true;
      }
      if (!this._save.piggyBroken && this._save.piggyGemsStored < this._save.piggyCap) {
        this._save.piggyGemsStored = Math.min(this._save.piggyCap, (this._save.piggyGemsStored || 0) + piecePoints);
        saveDirty = true;
      }
      if (this._save.raceUnlocked && isRaceActive(this._save)) {
        raceOnPuzzleCompleted(this._save);
        saveDirty = true;
      }
      this._syncDailyTasksData();
      this._save.dailyTasksProgress.piecesPlaced = (this._save.dailyTasksProgress.piecesPlaced || 0) + piecePoints;
      saveDirty = true;
      if (saveDirty) saveSave(this._save);
      const navPieces = document.getElementById("nav-trophies-count");
      if (navPieces) navPieces.textContent = this.leaderboardManager.getPlayerScore();
      this.updateBattlePassWidget();
      this.updatePiggyWidget();
      this.updateRaceEventWidget();
      this._renderDailyTasksScreen();
      const raceScreen = document.getElementById("raceEventScreen");
      if (raceScreen && !raceScreen.classList.contains("hidden")) {
        this._renderRaceTrack();
      }
    }

    _onExternalPiecePlaced(pieceId) {
      this._awardMetaProgressOnPiecePlaced(pieceId);
      this._trySpendPuzzleEnergy();
    }

    onWrongDrop() {
      this.mistakes++;
      if (document.getElementById("toggle-sfx").getAttribute("aria-checked") === "true") {
        AudioPlayer.wrong();
      }
    }

    _trySpendPuzzleEnergy() {
      if ((this._save.puzzleEnergy || 0) >= 1) {
        this._save.puzzleEnergy = Math.max(0, this._save.puzzleEnergy - 1);
        saveSave(this._save);
        this._updatePuzzleEnergyUI();
        return true;
      }
      this._showEnergyRefillPopup();
      return false;
    }

    _addPuzzleEnergy(amount) {
      this._save.puzzleEnergy = (this._save.puzzleEnergy || 0) + amount;
      saveSave(this._save);
      this._updatePuzzleEnergyUI();
    }

    _updatePuzzleEnergyUI() {
      const val = this._save.puzzleEnergy || 0;
      const elGame = document.getElementById("energy-count-game");
      if (elGame) elGame.textContent = val;
      const elStart = document.getElementById("energy-count-start");
      if (elStart) elStart.textContent = val;
    }

    _showEnergyRefillPopup() {
      const modal = document.getElementById("energy-refill-modal");
      if (modal) modal.classList.remove("hidden");
    }

    _hideEnergyRefillPopup() {
      const modal = document.getElementById("energy-refill-modal");
      if (modal) modal.classList.add("hidden");
    }

    _refillEnergy() {
      this._addPuzzleEnergy(20);
      this._hideEnergyRefillPopup();
    }

    completeLevel(opts) {
      opts = opts || {};
      const winModal = document.getElementById("win-modal");
      if (!winModal.classList.contains("hidden")) return;
      this.pieceTray.cancelDrag();
      const cheated = opts.cheated === true;
      const timeSec = cheated ? 0 : Math.round((Date.now() - this.startTime) / 1000);
      const mistakes = cheated ? 0 : this.mistakes;

      if (this._playingBonusLevel) {
        this._playingBonusLevel = false;
        const gameArea = document.querySelector(".game-area");
        if (gameArea) gameArea.classList.remove("game-area--bonus");
        const bonusLevel = this.levelManager.getBonusLevel();
        const total = bonusLevel ? bonusLevel.pieceCount : 12;
        const stars = cheated ? 3 : (timeSec <= total * 5 && mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1);
        this._save.bonusLevelCompleted = true;
        this._save.bonusLevelTimesPlayed = (this._save.bonusLevelTimesPlayed || 0) + 1;
        this._save.coins = (this._save.coins || 0) + 100;
        if (!this._save.rewards) this._save.rewards = { trophies: 0, unlockedRewards: [], trophiesGoldCup: false };
        this._save.rewards.trophiesGoldCup = true;
        if (this._save.rewards.unlockedRewards.indexOf("goldCup") < 0) {
          this._save.rewards.unlockedRewards = this._save.rewards.unlockedRewards || [];
          this._save.rewards.unlockedRewards.push("goldCup");
        }
        saveSave(this._save);
        this.ui.setLevelNumber(this.currentLevelIndex);
        if (document.getElementById("toggle-sfx").getAttribute("aria-checked") === "true") {
          AudioPlayer.win();
        }
        this.ui.showWinModal(
          stars,
          timeSec,
          mistakes,
          () => {
            this.ui.hideWinModal();
            this.ui.showScreen("start-screen");
            this._showToastBonusCompleted();
            this.collectionUI.updateGlobalCardsProgress();
          },
          () => this.replayBonusLevel()
        );
        this._updateCheatAutoButton();
        return;
      }

      const stars = cheated ? 3 : this._computeStars(timeSec, this.mistakes);
      if (!cheated && this.currentLevelIndex === 0) {
        this._syncDailyTasksData();
        this._save.dailyTasksProgress.level1Complete = 1;
      }

      this.collectionManager.onLevelCompleted(this.currentLevelIndex, { cheated });
      this.addHammers(1);
      this.collectionUI.updateCollectionButtons();

      if (document.getElementById("toggle-sfx").getAttribute("aria-checked") === "true") {
        AudioPlayer.win();
      }
      this.ui.showWinModal(
        stars,
        timeSec,
        mistakes,
        () => this._onNextLevelClick(),
        () => this.replayLevel()
      );
      this._updateCheatAutoButton();
    }

    _onNextLevelClick() {
      this.nextLevel();
    }

    handlePuzzleComplete() {
      this.completeLevel({ cheated: false });
    }

    skipLevelCheat() {
      const gameScreen = document.getElementById("game-screen");
      const winModal = document.getElementById("win-modal");
      const settingsModal = document.getElementById("settings-modal");
      const activeTag = document.activeElement ? document.activeElement.tagName : "";
      if (!gameScreen.classList.contains("active")) return;
      if (!winModal.classList.contains("hidden")) return;
      if (!settingsModal.classList.contains("hidden")) return;
      if (["INPUT", "TEXTAREA", "SELECT"].indexOf(activeTag) >= 0) return;
      this.pieceTray.cancelDrag();
      this.completeLevel({ cheated: true });
    }

    _computeStars(timeSec, mistakes) {
      const level = this.levelManager.getLevel(this.currentLevelIndex);
      const total = level ? level.pieceCount : 10;
      const fastTime = timeSec <= total * 5;
      const okTime = timeSec <= total * 10;
      const fewMistakes = mistakes <= 2;
      const noMistakes = mistakes === 0;
      if (noMistakes && fastTime) return 3;
      if (fewMistakes && (fastTime || okTime)) return 2;
      return 1;
    }

    nextLevel() {
      this.ui.hideWinModal();
      this._updateCheatAutoButton();
      const next = this.currentLevelIndex + 1;
      if (next >= this.levelManager.getTotalLevels()) {
        this.currentLevelIndex = 0;
        this.loadLevel(0);
      } else {
        this.currentLevelIndex = next;
        this.loadLevel(next);
      }
    }

    replayLevel() {
      this.ui.hideWinModal();
      this._updateCheatAutoButton();
      this.loadLevel(this.currentLevelIndex);
    }

    _bindGlobalButtons() {
      document.getElementById("btn-play").onclick = () => this.startGame();
      document.getElementById("btn-back").onclick = () => {
        if (this._playingBonusLevel) {
          this._playingBonusLevel = false;
          const gameArea = document.querySelector(".game-area");
          if (gameArea) gameArea.classList.remove("game-area--bonus");
          this.ui.setLevelNumber(this.currentLevelIndex);
        }
        if (this._externalLevelActive) this._stopExternalPlayableLevel();
        this.ui.showScreen("start-screen");
      };
      document.getElementById("btn-close-settings").onclick = () => {
        this.ui.hideSettingsModal();
        this._saveState();
      };
      const btnEditProfile = document.getElementById("btn-edit-profile");
      if (btnEditProfile) btnEditProfile.onclick = () => { this.ui.hideSettingsModal(); this.openProfileModal(true); };
      document.getElementById("toggle-music").onclick = () => this._toggle("toggle-music");
      document.getElementById("toggle-sfx").onclick = () => this._toggle("toggle-sfx");
      document.getElementById("btn-reset-progress").onclick = () => this.resetProgress();
      document.getElementById("btn-cheat-open-all-albums").onclick = () => this.cheatOpenAllAlbums();
      document.getElementById("btn-cheat-add-album-stars").onclick = () => this.cheatAddAlbumStars();
      document.getElementById("btn-cheat-add-hammers").onclick = () => this.cheatAddEventHammers();

      document.getElementById("nav-home").onclick = () => {
        if (this._externalLevelActive) this._stopExternalPlayableLevel();
        this.ui.showScreen("start-screen");
      };
      document.getElementById("nav-game").onclick = () => this.openGalleryScreen();
      document.getElementById("nav-settings").onclick = () => {
        if (this._externalLevelActive) this._stopExternalPlayableLevel();
        this.rubyCaveManager.open();
      };
      const navDailyTasks = document.getElementById("nav-daily-tasks");
      if (navDailyTasks) navDailyTasks.onclick = () => this.openDailyTasksScreen();
      const btnHomeSettings = document.getElementById("btn-home-settings");
      if (btnHomeSettings) btnHomeSettings.onclick = () => this.openSettings();
      document.getElementById("curs_add_leaderboard_from_trophy_button").onclick = () => this.onLeaderboardTrophyClick();
      const openCollection = () => {
        if (this._externalLevelActive) this._stopExternalPlayableLevel();
        this.collectionUI.showAlbum();
      };
      document.getElementById("nav-collection").onclick = openCollection;

      const openBattlePass = () => {
        this.openBattlePassScreen();
      };
      document.getElementById("nav-battle-pass").onclick = openBattlePass;
      const bpWidget = document.getElementById("btn-battle-pass-widget");
      if (bpWidget) bpWidget.onclick = openBattlePass;
      const bpWidgetGame = document.getElementById("btn-battle-pass-widget-game");
      if (bpWidgetGame) bpWidgetGame.onclick = openBattlePass;

      const openWheel = () => {
        this.openWheelScreen();
      };
      const btnWheel = document.getElementById("btn-wheel-widget");
      if (btnWheel) btnWheel.onclick = openWheel;

      const openRaceEvent = () => {
        this.openRaceEventScreen();
      };
      const btnRaceWidget = document.getElementById("btn-race-event-widget");
      if (btnRaceWidget) btnRaceWidget.onclick = openRaceEvent;
      const openLostTemple = () => this.onLostTempleClick();
      const btnLostTempleWidget = document.getElementById("btn-lost-temple-widget");
      if (btnLostTempleWidget) btnLostTempleWidget.onclick = openLostTemple;

      const navRubyCave = document.getElementById("nav-ruby-cave");
      if (navRubyCave) navRubyCave.onclick = () => this.rubyCaveManager.open();

      const giftBtn = document.getElementById("cards-progress-gift");
      if (giftBtn) giftBtn.onclick = (e) => { e.preventDefault(); this.onGiftClicked(); };

      const btnProfileStart = document.getElementById("btn-profile-widget-start");
      if (btnProfileStart) btnProfileStart.onclick = () => this.openProfileModal(true);
      const piggyWidgetStart = document.getElementById("piggy-widget-start");
      if (piggyWidgetStart) piggyWidgetStart.onclick = () => { if (!this._save.piggyBroken) this.openPiggyModal(); };

      const btnProfileGame = document.getElementById("btn-profile-widget-game");
      if (btnProfileGame) btnProfileGame.onclick = () => this.openProfileModal(true);
      const piggyWidget = document.getElementById("piggy-widget");
      if (piggyWidget) piggyWidget.onclick = () => { if (!this._save.piggyBroken) this.openPiggyModal(); };
      const piggyModalClose = document.getElementById("piggy-modal-close");
      if (piggyModalClose) piggyModalClose.onclick = () => this.closePiggyModal();
      const piggyPurchase = document.getElementById("piggy-btn-purchase");
      if (piggyPurchase) piggyPurchase.onclick = () => { if (this._save.piggyGemsStored >= (this._save.piggyCap || PIGGY_CAP_DEFAULT)) this._breakPiggyBank(); };
      const piggyLater = document.getElementById("piggy-btn-later");
      if (piggyLater) piggyLater.onclick = () => this.closePiggyModal();

      const btnBonusPlay = document.getElementById("btn-bonus-level-play");
      if (btnBonusPlay) btnBonusPlay.onclick = () => this._onBonusLevelPlayClick();
      const btnBonusClose = document.getElementById("btn-bonus-level-close");
      if (btnBonusClose) btnBonusClose.onclick = () => this.closeBonusLevelModal();
      const bonusModal = document.getElementById("bonus-level-modal");
      if (bonusModal) bonusModal.onclick = (e) => { if (e.target === bonusModal) this.closeBonusLevelModal(); };

      const autoBtn = document.getElementById("btn-cheat-auto");
      if (autoBtn) autoBtn.onclick = () => this.cheatPlaceOnePiece();

      document.addEventListener("keydown", (e) => {
        if (e.key !== "N" || !e.shiftKey) return;
        const gameScreen = document.getElementById("game-screen");
        const winModal = document.getElementById("win-modal");
        const activeTag = document.activeElement ? document.activeElement.tagName : "";
        if (!gameScreen.classList.contains("active")) return;
        if (!winModal.classList.contains("hidden")) return;
        if (["INPUT", "TEXTAREA", "SELECT"].indexOf(activeTag) >= 0) return;
        e.preventDefault();
        this.skipLevelCheat();
      });

      document.getElementById("coins-display").addEventListener("pointerdown", () => {});

      const skipBtn = document.getElementById("btn-skip-level");
      let longPressTimer = null;
      let longPressHandled = false;
      skipBtn.addEventListener("pointerdown", (e) => {
        longPressHandled = false;
        longPressTimer = setTimeout(() => {
          longPressHandled = true;
          const autoBtn = document.getElementById("btn-cheat-auto");
          if (autoBtn) autoBtn.classList.remove("hidden");
        }, LONG_PRESS_MS);
      });
      skipBtn.addEventListener("pointerup", () => {
        if (longPressTimer) clearTimeout(longPressTimer);
        longPressTimer = null;
        if (!longPressHandled) this.skipLevelCheat();
      });
      skipBtn.addEventListener("pointercancel", () => {
        if (longPressTimer) clearTimeout(longPressTimer);
        longPressTimer = null;
      });
      skipBtn.addEventListener("click", (e) => e.preventDefault());

      // TODO: Replace with real ad SDK callback when ads are integrated
      const btnRefillAd = document.getElementById("btn-energy-refill-ad");
      if (btnRefillAd) btnRefillAd.onclick = () => this._refillEnergy();

      // TODO: Replace with real gem-spending logic when purchase flow is ready
      const btnRefillGems = document.getElementById("btn-energy-refill-gems");
      if (btnRefillGems) btnRefillGems.onclick = () => this._refillEnergy();

      const btnRefillClose = document.getElementById("btn-energy-refill-close");
      if (btnRefillClose) btnRefillClose.onclick = () => this._hideEnergyRefillPopup();

      const refillModal = document.getElementById("energy-refill-modal");
      if (refillModal) refillModal.onclick = (e) => { if (e.target === refillModal) this._hideEnergyRefillPopup(); };
    }

    _toggle(id) {
      const btn = document.getElementById(id);
      const current = btn.getAttribute("aria-checked") === "true";
      btn.setAttribute("aria-checked", !current);
      this._saveState();
    }

    openSettings() {
      this.ui.showSettingsModal();
      const trophies = (this.collectionManager.getState().rewards && this.collectionManager.getState().rewards.trophies) || 0;
      const el = document.getElementById("settings-trophies-count");
      if (el) el.textContent = trophies;
    }

    updateBattlePassWidget() {
      const bpStarsTotal = Math.max(0, parseInt(this._save.bpStarsTotal, 10) || 0);
      const towardNext = bpStarsTotal % BP_STARS_PER_CARD;
      const progressText = towardNext + "/" + BP_STARS_PER_CARD;
      const fillPct = (towardNext / BP_STARS_PER_CARD) * 100;
      const widgetHome = document.getElementById("battle-pass-widget");
      const widgetGame = document.getElementById("battle-pass-widget-game");
      if (widgetHome) widgetHome.classList.remove("hidden");
      const countHome = document.getElementById("battle-pass-widget-count");
      if (countHome) countHome.textContent = progressText;
      const fillHome = document.getElementById("battle-pass-widget-fill");
      if (fillHome) fillHome.style.width = fillPct + "%";
      const progressHome = widgetHome ? widgetHome.querySelector(".battle-pass-widget-progress") : null;
      if (progressHome) progressHome.setAttribute("aria-valuenow", towardNext);
      if (widgetGame) widgetGame.classList.remove("hidden");
      const countGame = document.getElementById("battle-pass-widget-count-game");
      if (countGame) countGame.textContent = progressText;
      const fillGame = document.getElementById("battle-pass-widget-fill-game");
      if (fillGame) fillGame.style.width = fillPct + "%";
      const progressGame = widgetGame ? widgetGame.querySelector(".battle-pass-widget-progress") : null;
      if (progressGame) progressGame.setAttribute("aria-valuenow", towardNext);
      const navCount = document.getElementById("nav-battle-pass-count");
      if (navCount) navCount.textContent = progressText;
    }

    _showBattlePassUnlockPopup(onAfter) {
      const modal = document.getElementById("battle-pass-unlock-modal");
      if (!modal) {
        if (onAfter) onAfter();
        return;
      }
      modal.classList.remove("hidden");
      const go = () => {
        modal.classList.add("hidden");
        document.getElementById("btn-battle-pass-lets-go").onclick = null;
        modal.onclick = null;
        this.updateBattlePassWidget();
        if (!this._save.bpTutorCompleted) {
          this._save.bpTutorStep = 1;
          saveSave(this._save);
          if (onAfter) onAfter();
        } else {
          this.openBattlePassScreen();
          if (onAfter) onAfter();
        }
      };
      document.getElementById("btn-battle-pass-lets-go").onclick = go;
      modal.onclick = (e) => { if (e.target === modal) go(); };
    }

    _showRaceTutorialAndStart(onAfter) {
      const overlay = document.getElementById("raceEventTutorialOverlay");
      if (!overlay) {
        startRace(this._save);
        saveSave(this._save);
        this.updateRaceEventWidget();
        if (onAfter) onAfter();
        return;
      }
      overlay.classList.remove("hidden");
      const dismiss = () => {
        overlay.classList.add("hidden");
        this._save.raceTutorialCompleted = true;
        startRace(this._save);
        saveSave(this._save);
        this.updateRaceEventWidget();
        document.getElementById("btn-race-tutorial-ok").onclick = null;
        overlay.onclick = null;
        if (onAfter) onAfter();
      };
      document.getElementById("btn-race-tutorial-ok").onclick = dismiss;
      overlay.onclick = (e) => { if (e.target === overlay) dismiss(); };
    }

    _openPackOpeningFlow(tier, packStars, onComplete) {
      this.collectionManager._ensureCardsStructure();
      const modal = document.getElementById("pack-opening-modal");
      const packView = document.getElementById("pack-pack-view");
      const revealView = document.getElementById("pack-reveal-view");
      const packIcon = document.getElementById("pack-pack-icon");
      const revealList = document.getElementById("pack-reveal-list");
      const doneBtn = document.getElementById("pack-done-btn");
      if (!modal || !packView || !revealView || !packIcon || !revealList || !doneBtn) return;
      ensurePackMeta(this._save, tier);
      const meta = this._save.bpPremiumPackMeta[tier];
      const cardCount = meta && typeof meta.cardCount === "number" ? meta.cardCount : 2;
      packIcon.innerHTML = "";
      packIcon.className = "pack-pack-icon";
      const packIconEl = renderPackIcon({ cardCount, locked: false, dimmed: false, size: "large", claimable: true });
      packIcon.appendChild(packIconEl);
      packView.classList.remove("hidden");
      revealView.classList.add("hidden");
      revealList.innerHTML = "";
      modal.classList.remove("hidden");

      const self = this;
      const mysteryCardSrc = CARD_IMAGE_BASE + "card_01.png";

      function onPackTap() {
        packView.onclick = null;
        packView.classList.add("pack-pack-view--bounce");
        const runOpen = () => {
          packView.classList.remove("pack-pack-view--bounce");
          const packResult = rollPack(packStars, self._save, cardCount);
        applyPackResults(self._save, packResult);
        if (!self._save.bpClaims.premiumClaimedTiers) self._save.bpClaims.premiumClaimedTiers = [];
        if (self._save.bpClaims.premiumClaimedTiers.indexOf(tier) < 0) self._save.bpClaims.premiumClaimedTiers.push(tier);
        saveSave(self._save);

        packResult.results.forEach((r) => {
          const item = document.createElement("div");
          item.className = "pack-reveal-item pack-reveal-item--r" + r.rarity;
          if (r.isDuplicate && (r.coinsAwarded || r.starsAwarded)) {
            const coinPart = r.coinsAwarded ? ("+<span class=\"pack-reveal-coins-num\">" + r.coinsAwarded + "</span> coins") : "";
            const starPart = r.starsAwarded ? (" +" + r.starsAwarded + " stars") : "";
            item.innerHTML = "<span class=\"pack-reveal-coins\">" + coinPart + starPart + "</span>";
          } else {
            const def = CARD_DEFS[r.cardId];
            const src = def && def.imageSrc ? def.imageSrc : mysteryCardSrc;
            const name = def ? def.name : "Card";
            const img = document.createElement("img");
            img.src = src;
            img.alt = name;
            img.className = "pack-reveal-thumb";
            img.onerror = function () { this.src = mysteryCardSrc; };
            item.appendChild(img);
            const label = document.createElement("span");
            label.className = "pack-reveal-name";
            label.textContent = name;
            item.appendChild(label);
          }
          revealList.appendChild(item);
        });

        packView.classList.add("hidden");
        revealView.classList.remove("hidden");
        self.ui.setCoins(self._save.coins);
        if (self.collectionUI && typeof self.collectionUI.updateAlbumStarsUI === "function") self.collectionUI.updateAlbumStarsUI();
        };
        setTimeout(runOpen, 280);
      }

      packView.onclick = onPackTap;

      function closeModal() {
        modal.classList.add("hidden");
        self.ui.setCoins(self._save.coins);
        doneBtn.onclick = null;
        if (onComplete) onComplete();
      }

      doneBtn.onclick = () => closeModal();
      modal.onclick = (e) => {
        if (e.target === modal) {
          modal.classList.add("hidden");
          modal.onclick = null;
          doneBtn.onclick = null;
        }
      };
    }

    _openGrandPrizePackFlow(onComplete) {
      this.collectionManager._ensureCardsStructure();
      const modal = document.getElementById("pack-opening-modal");
      const packView = document.getElementById("pack-pack-view");
      const revealView = document.getElementById("pack-reveal-view");
      const packIcon = document.getElementById("pack-pack-icon");
      const revealList = document.getElementById("pack-reveal-list");
      const doneBtn = document.getElementById("pack-done-btn");
      if (!modal || !packView || !revealView || !packIcon || !revealList || !doneBtn) return;
      const cardCount = 5;
      const packStars = 3;
      packIcon.innerHTML = "";
      packIcon.className = "pack-pack-icon";
      const packIconEl = renderPackIcon({ cardCount, locked: false, dimmed: false, size: "large", claimable: true });
      packIcon.appendChild(packIconEl);
      packView.classList.remove("hidden");
      revealView.classList.add("hidden");
      revealList.innerHTML = "";
      modal.classList.remove("hidden");

      const self = this;
      const mysteryCardSrc = CARD_IMAGE_BASE + "card_01.png";

      function onPackTap() {
        packView.onclick = null;
        packView.classList.add("pack-pack-view--bounce");
        const runOpen = () => {
          packView.classList.remove("pack-pack-view--bounce");
          const packResult = rollPack(packStars, self._save, cardCount);
          applyPackResults(self._save, packResult);
          if (!self._save.raceState) self._save.raceState = {};
          self._save.raceState.claimed = true;
          self._syncDailyTasksData();
          self._save.dailyTasksProgress.raceActions = Math.max(1, self._save.dailyTasksProgress.raceActions || 0);
          self.addHammers(5);
          saveSave(self._save);
          self._renderDailyTasksScreen();

          packResult.results.forEach((r) => {
            const item = document.createElement("div");
            item.className = "pack-reveal-item pack-reveal-item--r" + r.rarity;
            if (r.isDuplicate && (r.coinsAwarded || r.starsAwarded)) {
              const coinPart = r.coinsAwarded ? ("+<span class=\"pack-reveal-coins-num\">" + r.coinsAwarded + "</span> coins") : "";
              const starPart = r.starsAwarded ? (" +" + r.starsAwarded + " stars") : "";
              item.innerHTML = "<span class=\"pack-reveal-coins\">" + coinPart + starPart + "</span>";
            } else {
              const def = CARD_DEFS[r.cardId];
              const src = def && def.imageSrc ? def.imageSrc : mysteryCardSrc;
              const name = def ? def.name : "Card";
              const img = document.createElement("img");
              img.src = src;
              img.alt = name;
              img.className = "pack-reveal-thumb";
              img.onerror = function () { this.src = mysteryCardSrc; };
              item.appendChild(img);
              const label = document.createElement("span");
              label.className = "pack-reveal-name";
              label.textContent = name;
              item.appendChild(label);
            }
            revealList.appendChild(item);
          });

          packView.classList.add("hidden");
          revealView.classList.remove("hidden");
          self.ui.setCoins(self._save.coins);
          if (self.collectionUI && typeof self.collectionUI.updateAlbumStarsUI === "function") self.collectionUI.updateAlbumStarsUI();
        };
        setTimeout(runOpen, 280);
      }

      packView.onclick = onPackTap;

      function closeModal() {
        modal.classList.add("hidden");
        self.ui.setCoins(self._save.coins);
        doneBtn.onclick = null;
        self.updateRaceEventWidget();
        if (onComplete) onComplete();
      }

      doneBtn.onclick = () => closeModal();
      modal.onclick = (e) => {
        if (e.target === modal) {
          modal.classList.add("hidden");
          modal.onclick = null;
          doneBtn.onclick = null;
          self.updateRaceEventWidget();
        }
      };
    }

    _openPackOpeningFlowGeneric(packStars, cardCount, onComplete) {
      this.collectionManager._ensureCardsStructure();
      const modal = document.getElementById("pack-opening-modal");
      const packView = document.getElementById("pack-pack-view");
      const revealView = document.getElementById("pack-reveal-view");
      const packIcon = document.getElementById("pack-pack-icon");
      const revealList = document.getElementById("pack-reveal-list");
      const doneBtn = document.getElementById("pack-done-btn");
      if (!modal || !packView || !revealView || !packIcon || !revealList || !doneBtn) return;
      packIcon.innerHTML = "";
      packIcon.className = "pack-pack-icon";
      const packIconEl = renderPackIcon({ cardCount, locked: false, dimmed: false, size: "large", claimable: true });
      packIcon.appendChild(packIconEl);
      packView.classList.remove("hidden");
      revealView.classList.add("hidden");
      revealList.innerHTML = "";
      modal.classList.remove("hidden");

      const self = this;
      const mysteryCardSrc = CARD_IMAGE_BASE + "card_01.png";

      function onPackTap() {
        packView.onclick = null;
        packView.classList.add("pack-pack-view--bounce");
        const runOpen = () => {
          packView.classList.remove("pack-pack-view--bounce");
          const packResult = rollPack(packStars, self._save, cardCount);
          applyPackResults(self._save, packResult);
          saveSave(self._save);

          packResult.results.forEach((r) => {
            const item = document.createElement("div");
            item.className = "pack-reveal-item pack-reveal-item--r" + r.rarity;
            if (r.isDuplicate && (r.coinsAwarded || r.starsAwarded)) {
              const coinPart = r.coinsAwarded ? ("+<span class=\"pack-reveal-coins-num\">" + r.coinsAwarded + "</span> coins") : "";
              const starPart = r.starsAwarded ? (" +" + r.starsAwarded + " stars") : "";
              item.innerHTML = "<span class=\"pack-reveal-coins\">" + coinPart + starPart + "</span>";
            } else {
              const def = CARD_DEFS[r.cardId];
              const src = def && def.imageSrc ? def.imageSrc : mysteryCardSrc;
              const name = def ? def.name : "Card";
              const img = document.createElement("img");
              img.src = src;
              img.alt = name;
              img.className = "pack-reveal-thumb";
              img.onerror = function () { this.src = mysteryCardSrc; };
              item.appendChild(img);
              const label = document.createElement("span");
              label.className = "pack-reveal-name";
              label.textContent = name;
              item.appendChild(label);
            }
            revealList.appendChild(item);
          });

          packView.classList.add("hidden");
          revealView.classList.remove("hidden");
          self.ui.setCoins(self._save.coins);
          if (self.collectionUI && typeof self.collectionUI.updateAlbumStarsUI === "function") self.collectionUI.updateAlbumStarsUI();
        };
        setTimeout(runOpen, 280);
      }

      packView.onclick = onPackTap;

      function closeModal() {
        modal.classList.add("hidden");
        self.ui.setCoins(self._save.coins);
        doneBtn.onclick = null;
        if (onComplete) onComplete();
      }

      doneBtn.onclick = () => closeModal();
      modal.onclick = (e) => {
        if (e.target === modal) {
          modal.classList.add("hidden");
          modal.onclick = null;
          doneBtn.onclick = null;
          if (onComplete) onComplete();
        }
      };
    }

    openBattlePassScreen() {
      if (this._save.bpTutorStep === 2) {
        this._save.bpTutorCompleted = true;
        this._save.bpTutorStep = 0;
        saveSave(this._save);
        this._clearBattlePassTutorial();
      }
      const screen = document.getElementById("battlePassScreen");
      if (!screen) return;
      const bpStarsTotal = Math.max(0, parseInt(this._save.bpStarsTotal, 10) || 0);
      const towardNext = bpStarsTotal % BP_STARS_PER_CARD;
      const currentTier = Math.floor(bpStarsTotal / BP_STARS_PER_CARD) + 1;
      const countEl = document.getElementById("battle-pass-modal-count");
      if (countEl) countEl.textContent = bpStarsTotal;
      const towardEl = document.getElementById("battle-pass-modal-toward");
      if (towardEl) towardEl.textContent = String(currentTier);
      const fillEl = document.getElementById("battle-pass-modal-fill");
      if (fillEl) fillEl.style.width = (towardNext / BP_STARS_PER_CARD) * 100 + "%";
      const listEl = document.getElementById("battle-pass-reward-list");
      const activateBtn = document.getElementById("btn-battle-pass-activate");
      const activatePriceEl = document.getElementById("bp-activate-price");
      const premiumActive = this._save.battlePassPremiumActive === true;
      const bpClaims = this._save.bpClaims || { freeClaimedTiers: [], premiumClaimedTiers: [] };
      const freeClaimed = bpClaims.freeClaimedTiers || [];
      const premiumClaimed = bpClaims.premiumClaimedTiers || [];

      if (activateBtn) {
        activateBtn.disabled = premiumActive;
        activateBtn.textContent = premiumActive ? "Activated" : "Activate";
        activateBtn.onclick = premiumActive ? null : () => {
          this._save.battlePassPremiumActive = true;
          saveSave(this._save);
          activateBtn.disabled = true;
          activateBtn.textContent = "Activated";
          if (activatePriceEl) activatePriceEl.textContent = "Owned";
          renderList();
        };
      }

      const self = this;
      function renderList() {
        if (!listEl) return;
        const stars = Math.max(0, parseInt(self._save.bpStarsTotal, 10) || 0);
        const claims = self._save.bpClaims || { freeClaimedTiers: [], premiumClaimedTiers: [] };
        const fClaimed = claims.freeClaimedTiers || [];
        const pClaimed = claims.premiumClaimedTiers || [];
        const premiumOn = self._save.battlePassPremiumActive === true;
        const tiersCount = 10;
        const mysteryCardSrc = CARD_IMAGE_BASE + "card_01.png";
        const allCardIds = ALBUM_DEFS.reduce((acc, a) => acc.concat(a.cardIds || []), []);
        const cards = self._save.cards || {};
        const inbox = cards.newInbox || [];
        const uncollected = allCardIds.filter((id) => !cards.collected[id] && inbox.indexOf(id) < 0);
        const premiumAwardedCount = pClaimed.length;

        for (let ti = 1; ti <= tiersCount; ti++) ensurePackMeta(self._save, ti);
        saveSave(self._save);

        listEl.innerHTML = "";
        const rowsContainer = document.createElement("div");
        rowsContainer.className = "bp-track-list";

        for (let t = 1; t <= tiersCount; t++) {
          const requiredStars = t * BP_STARS_PER_CARD;
          const tierUnlocked = stars >= requiredStars;
          const freeClaimedT = fClaimed.indexOf(t) >= 0;
          const premiumClaimedT = pClaimed.indexOf(t) >= 0;
          const isCurrent = t === (Math.floor(stars / BP_STARS_PER_CARD) + 1);
          const premiumLocked = !premiumOn || !tierUnlocked;
          const premiumClaimable = premiumOn && tierUnlocked && !premiumClaimedT;
          const freeClaimable = tierUnlocked && !freeClaimedT;

          const row = document.createElement("div");
          row.className = "bp-tier-row" + (isCurrent ? " bp-tier-row--current" : "");

          const freeCard = document.createElement("div");
          freeCard.className = "bp-tier-card bp-tier-card--free"
            + (!tierUnlocked ? " bp-tier-card--locked" : "")
            + (freeClaimedT ? " bp-tier-card--claimed" : "")
            + (freeClaimable ? " bp-tier-card--claimable" : "");
          const freeReward = document.createElement("div");
          freeReward.className = "bp-tier-reward";
          freeReward.innerHTML = `<img class="bp-tier-reward-icon" src="${BP_GEM_ICON_SRC}" alt="" aria-hidden="true"><span class="bp-tier-reward-count">x3</span>`;
          freeCard.appendChild(freeReward);

          if (freeClaimable) {
            const claimBtn = document.createElement("button");
            claimBtn.type = "button";
            claimBtn.className = "bp-claim-btn";
            claimBtn.textContent = "Claim";
            claimBtn.onclick = (e) => {
              e.stopPropagation();
              if (!freeClaimable) return;
              self._save.xpTotal = (self._save.xpTotal || 0) + BP_XP_PER_TIER;
              if (!self._save.bpClaims.freeClaimedTiers) self._save.bpClaims.freeClaimedTiers = [];
              if (self._save.bpClaims.freeClaimedTiers.indexOf(t) < 0) self._save.bpClaims.freeClaimedTiers.push(t);
              self.addHammers(1);
              saveSave(self._save);
              renderList();
            };
            freeCard.appendChild(claimBtn);
          }

          if (freeClaimedT || (!tierUnlocked && !freeClaimable)) {
            const block = document.createElement("div");
            block.className = "bp-tier-block";
            block.textContent = freeClaimedT ? "✓" : "";
            freeCard.appendChild(block);
          }

          row.appendChild(freeCard);

          const center = document.createElement("div");
          center.className = "bp-tier-center";
          const point = document.createElement("div");
          point.className = "bp-tier-point" + (tierUnlocked ? " bp-tier-point--unlocked" : "") + (isCurrent ? " bp-tier-point--current" : "");
          point.textContent = String(t);
          center.appendChild(point);
          row.appendChild(center);

          const premiumCard = document.createElement("div");
          premiumCard.className = "bp-tier-card bp-tier-card--premium"
            + (premiumLocked ? " bp-tier-card--locked" : "")
            + (premiumClaimedT ? " bp-tier-card--claimed" : "")
            + (premiumClaimable ? " bp-tier-card--claimable" : "");
          const premiumReward = document.createElement("div");
          premiumReward.className = "bp-tier-reward";
          premiumReward.innerHTML = `<img class="bp-tier-reward-icon bp-tier-reward-icon--chest" src="${BP_CHEST_ICON_SRC}" alt="" aria-hidden="true"><span class="bp-tier-reward-count">x3</span>`;
          premiumCard.appendChild(premiumReward);

          if (premiumClaimable) {
            const claimBtn = document.createElement("button");
            claimBtn.type = "button";
            claimBtn.className = "bp-claim-btn";
            claimBtn.textContent = "Claim";
            claimBtn.onclick = (e) => {
              e.stopPropagation();
              if (!premiumClaimable) return;
              self._openPackOpeningFlow(t, getPackStarsForTier(t), () => {
                self.addHammers(2);
                renderList();
                self.collectionUI.updateCollectionButtons();
                self.collectionUI.updateGlobalCardsProgress();
              });
            };
            premiumCard.appendChild(claimBtn);
          }

          if (premiumClaimedT || premiumLocked) {
            const block = document.createElement("div");
            block.className = "bp-tier-block";
            block.textContent = premiumClaimedT ? "✓" : "🔒";
            premiumCard.appendChild(block);
          }

          row.appendChild(premiumCard);

          rowsContainer.appendChild(row);
        }
        listEl.appendChild(rowsContainer);
      }
      renderList();
      const bpTimerEl = document.getElementById("battle-pass-event-timer");
      if (bpTimerEl) {
        const tick = () => {
          const ms = getRemainingMs(this._save, "battlePassEvent");
          bpTimerEl.textContent = ms > 0 ? "Ends in: " + formatRemaining(ms) : "Ended";
        };
        tick();
        if (this._bpEventTimerId) clearInterval(this._bpEventTimerId);
        this._bpEventTimerId = setInterval(tick, 1000);
      }
      screen.classList.remove("hidden");
      document.documentElement.classList.add("bp-screen-active");
      document.body.classList.add("bp-screen-active");
      const infoOverlay = document.getElementById("battlePassInfoOverlay");
      const closeInfo = () => {
        if (infoOverlay) infoOverlay.classList.add("hidden");
        if (infoOverlay) infoOverlay.onclick = null;
        const continueBtn = document.getElementById("btn-bp-info-continue");
        if (continueBtn) continueBtn.onclick = null;
      };
      const close = () => {
        screen.classList.add("hidden");
        closeInfo();
        if (this._bpEventTimerId) {
          clearInterval(this._bpEventTimerId);
          this._bpEventTimerId = null;
        }
        if (this._bpEscapeHandler) {
          window.removeEventListener("keydown", this._bpEscapeHandler);
          this._bpEscapeHandler = null;
        }
        document.documentElement.classList.remove("bp-screen-active");
        document.body.classList.remove("bp-screen-active");
        document.getElementById("btn-battle-pass-close").onclick = null;
        document.getElementById("btn-battle-pass-info").onclick = null;
      };
      if (this._bpEscapeHandler) {
        window.removeEventListener("keydown", this._bpEscapeHandler);
      }
      this._bpEscapeHandler = (e) => {
        if (e.key !== "Escape") return;
        const info = document.getElementById("battlePassInfoOverlay");
        if (info && !info.classList.contains("hidden")) {
          closeInfo();
          e.preventDefault();
          return;
        }
        e.preventDefault();
        close();
      };
      window.addEventListener("keydown", this._bpEscapeHandler);
      document.getElementById("btn-battle-pass-close").onclick = close;
      const infoBtn = document.getElementById("btn-battle-pass-info");
      if (infoBtn) {
        infoBtn.onclick = () => {
          if (infoOverlay) {
            infoOverlay.classList.remove("hidden");
            infoOverlay.onclick = (e) => { if (e.target === infoOverlay) closeInfo(); };
            const continueBtn = document.getElementById("btn-bp-info-continue");
            if (continueBtn) continueBtn.onclick = closeInfo;
          }
        };
      }
    }

    updateWheelWidget() {
      const now = Date.now();
      const nextFree = Math.max(0, parseInt(this._save.wheelNextFreeAt, 10) || 0);
      const freeAvailable = now >= nextFree;
      const widget = document.getElementById("wheel-widget");
      if (widget) widget.classList.remove("hidden");
      const badge = document.getElementById("wheel-badge");
      if (badge) badge.classList.toggle("hidden", !freeAvailable);
    }

    updateRaceEventWidget() {
      const active = isRaceActive(this._save);
      const claimable = isRaceClaimable(this._save);
      const showBadge = active || claimable;
      const widget = document.getElementById("race-event-widget");
      if (widget) widget.classList.remove("hidden");
      const badge = document.getElementById("race-event-badge");
      if (badge) badge.classList.toggle("hidden", !showBadge);
    }

    _renderRaceTrack() {
      syncRaceBotPoints(this._save);
      const rs = getRaceState(this._save);
      const playerPoints = rs.playerPoints;
      const botPoints = rs.botPoints.slice();
      const lanesEl = document.getElementById("race-track-lanes");
      if (!lanesEl) return;
      const lanes = lanesEl.querySelectorAll(".race-lane");
      for (let i = 0; i < lanes.length; i++) lanes[i].innerHTML = "";
      const order = [0, 1, "player", 3, 4];
      const pointsFor = (idx) => {
        if (idx === "player") return playerPoints;
        return botPoints[idx] || 0;
      };
      for (let i = 0; i < order.length; i++) {
        const lane = lanes[i];
        if (!lane) continue;
        const key = order[i];
        const points = pointsFor(key);
        const lanePct = Math.min(100, (points / RACE_TARGET_POINTS) * 100);
        const pct = 4 + (lanePct * 0.88);
        const racer = document.createElement("div");
        racer.className = "race-racer " + (key === "player" ? "race-racer--player" : "race-racer--bot");
        racer.style.bottom = pct + "%";
        const kartImg = document.createElement("img");
        kartImg.className = "race-racer-kart";
        kartImg.src = RACE_LANE_CAR_SRCS[i] || RACE_LANE_CAR_SRCS[2];
        kartImg.alt = "";
        kartImg.setAttribute("aria-hidden", "true");
        const bubble = document.createElement("span");
        bubble.className = "race-racer-points";
        bubble.textContent = points;
        racer.appendChild(bubble);
        racer.appendChild(kartImg);
        lane.appendChild(racer);
      }
      const pointPills = document.querySelectorAll("#raceEventScreen .race-point-pill");
      for (let i = 0; i < pointPills.length; i++) {
        const key = order[i];
        pointPills[i].textContent = String(pointsFor(key));
      }
      const yourPointsEl = document.getElementById("race-your-points-num");
      if (yourPointsEl) yourPointsEl.textContent = playerPoints;
    }

    openRaceEventScreen() {
      const screen = document.getElementById("raceEventScreen");
      if (!screen) return;
      const htmlEl = document.documentElement;
      const bodyEl = document.body;
      const rs = getRaceState(this._save);
      if (this._save.raceUnlocked && !rs.active && !rs.winner) {
        startRace(this._save);
        saveSave(this._save);
        this.updateRaceEventWidget();
      }
      const currentState = getRaceState(this._save);
      const raceStateLabel = !this._save.raceUnlocked
        ? "locked"
        : currentState.winner
          ? (currentState.winner === "player" && !currentState.claimed ? "reward" : "completed")
          : (currentState.active ? "active" : "idle");
      screen.dataset.raceState = raceStateLabel;
      this._renderRaceTrack();
      const profile = this._save.playerProfile;
      const playerName = (profile && profile.name && String(profile.name).trim()) ? String(profile.name).trim() : "You";
      const playerAvatarId = (profile && typeof profile.avatarId === "number") ? Math.max(0, Math.min(AVATAR_COUNT - 1, profile.avatarId)) : 0;
      const playerAccessoryId = (profile && profile.accessoryId) ? String(profile.accessoryId) : "none";
      const playerPanel = screen.querySelector(".race-racer-panel--player");
      if (playerPanel) {
        const nameEl = playerPanel.querySelector(".race-racer-name");
        if (nameEl) nameEl.textContent = playerName;
        const imgEl = playerPanel.querySelector(".race-racer-avatar-img");
        const svgEl = playerPanel.querySelector(".race-racer-avatar-svg");
        const avatarHtml = renderPlayerAvatar({ avatarId: playerAvatarId, accessoryId: playerAccessoryId, size: "medium" });
        if (svgEl) {
          svgEl.innerHTML = avatarHtml;
        } else if (imgEl) {
          const wrap = document.createElement("div");
          wrap.className = "race-racer-avatar-svg";
          wrap.innerHTML = avatarHtml;
          imgEl.parentNode.replaceChild(wrap, imgEl);
        }
      }
      const opponentNames = Array.isArray(this._save.raceBotNames) && this._save.raceBotNames.length >= 4
        ? this._save.raceBotNames
        : RACE_BOT_NAMES;
      const opponentNameIds = [
        "race-racer-name-0",
        "race-racer-name-1",
        "race-racer-name-3",
        "race-racer-name-4",
      ];
      for (let i = 0; i < opponentNameIds.length; i++) {
        const nameEl = document.getElementById(opponentNameIds[i]);
        if (!nameEl) continue;
        const botName = String(opponentNames[i] || RACE_BOT_NAMES[i] || "Rival").trim();
        nameEl.textContent = botName || "Rival";
      }
      const rewardState = this._save.raceRewards || {};
      const rewardCoinsEl = document.getElementById("race-reward-coins");
      const rewardGemsEl = document.getElementById("race-reward-gems");
      const rewardBoostEl = document.getElementById("race-reward-boost");
      if (rewardCoinsEl) rewardCoinsEl.textContent = String(Math.max(0, parseInt(rewardState.coins, 10) || 300));
      if (rewardGemsEl) rewardGemsEl.textContent = String(Math.max(0, parseInt(rewardState.gems, 10) || 150));
      if (rewardBoostEl) rewardBoostEl.textContent = String(Math.max(0, parseInt(rewardState.boost, 10) || 10));
      const winner = getRaceWinner(this._save);
      const timerEl = document.getElementById("race-event-timer");
      const updateTimer = () => {
        const state = getRaceState(this._save);
        if (state.winner) {
          if (timerEl) timerEl.textContent = "Finished";
          return;
        }
        if (!state.startTime) {
          if (timerEl) timerEl.textContent = formatRaceRemaining(RACE_EVENT_DURATION_MS);
          return;
        }
        const remaining = (state.startTime + RACE_EVENT_DURATION_MS) - Date.now();
        if (timerEl) timerEl.textContent = remaining <= 0 ? "Ended" : formatRaceRemaining(remaining);
      };
      const self = this;
      const close = () => {
        screen.classList.add("hidden");
        if (self._raceEventRefreshId) { clearInterval(self._raceEventRefreshId); self._raceEventRefreshId = null; }
        if (self._raceEventEscapeHandler) {
          window.removeEventListener("keydown", self._raceEventEscapeHandler);
          self._raceEventEscapeHandler = null;
        }
        htmlEl.classList.remove("race-screen-active");
        bodyEl.classList.remove("race-screen-active");
        document.getElementById("btn-race-event-close").onclick = null;
        document.getElementById("btn-race-continue").onclick = null;
        document.getElementById("btn-race-event-info").onclick = null;
        const infoOverlay = document.getElementById("raceEventInfoOverlay");
        if (infoOverlay) {
          infoOverlay.classList.add("hidden");
          infoOverlay.onclick = null;
        }
        const infoContinue = document.getElementById("btn-race-info-continue");
        if (infoContinue) infoContinue.onclick = null;
        const rp = document.getElementById("raceResultPopup");
        if (rp) rp.classList.add("hidden");
        delete screen.dataset.raceState;
      };
      document.getElementById("btn-race-event-close").onclick = close;
      document.getElementById("btn-race-continue").onclick = close;
      const infoBtn = document.getElementById("btn-race-event-info");
      if (infoBtn) {
        infoBtn.onclick = () => {
          const infoOverlay = document.getElementById("raceEventInfoOverlay");
          if (infoOverlay) {
            const closeInfo = () => infoOverlay.classList.add("hidden");
            infoOverlay.classList.remove("hidden");
            infoOverlay.onclick = (e) => { if (e.target === infoOverlay) closeInfo(); };
            const infoContinue = document.getElementById("btn-race-info-continue");
            if (infoContinue) infoContinue.onclick = closeInfo;
          }
        };
      }
      this._raceEventEscapeHandler = (e) => {
        if (e.key !== "Escape") return;
        const infoOverlay = document.getElementById("raceEventInfoOverlay");
        if (infoOverlay && !infoOverlay.classList.contains("hidden")) {
          infoOverlay.classList.add("hidden");
          e.preventDefault();
          return;
        }
        const rp = document.getElementById("raceResultPopup");
        if (rp && !rp.classList.contains("hidden")) {
          rp.classList.add("hidden");
          e.preventDefault();
          close();
          return;
        }
        e.preventDefault();
        close();
      };
      window.addEventListener("keydown", this._raceEventEscapeHandler);
      screen.classList.remove("hidden");
      htmlEl.classList.add("race-screen-active");
      bodyEl.classList.add("race-screen-active");
      const resultPopup = document.getElementById("raceResultPopup");
      const resultTitle = document.getElementById("race-result-title");
      const resultMessage = document.getElementById("race-result-message");
      const btnClaim = document.getElementById("btn-race-claim-prize");
      const btnResultClose = document.getElementById("btn-race-result-close");
      if (winner && resultPopup) {
        resultPopup.classList.remove("hidden");
        if (winner === "player") {
          if (resultTitle) resultTitle.textContent = "You Won!";
          const claimed = !!(this._save.raceState && this._save.raceState.claimed);
          if (resultMessage) resultMessage.textContent = claimed ? "You already claimed your prize!" : "Claim your Grand Prize";
          if (btnClaim) {
            if (claimed) btnClaim.classList.add("hidden");
            else {
              btnClaim.classList.remove("hidden");
              btnClaim.onclick = () => {
                resultPopup.classList.add("hidden");
                btnClaim.onclick = null;
                this._openGrandPrizePackFlow(() => close());
              };
            }
          }
        } else {
          if (resultTitle) resultTitle.textContent = "You Lost";
          if (resultMessage) resultMessage.textContent = "Better luck next time!";
          if (btnClaim) btnClaim.classList.add("hidden");
        }
        if (btnResultClose) btnResultClose.onclick = () => { resultPopup.classList.add("hidden"); close(); };
      }
      const refreshTrack = () => {
        this._renderRaceTrack();
        updateTimer();
      };
      if (this._raceEventRefreshId) clearInterval(this._raceEventRefreshId);
      this._raceEventRefreshId = setInterval(refreshTrack, 1000);
      updateTimer();
    }

    _showWheelUnlockTutorial(onAfter) {
      const overlay = document.getElementById("wheel-tutorial-overlay");
      if (!overlay) {
        if (onAfter) onAfter();
        return;
      }
      this._save.wheelTutorialSeen = true;
      saveSave(this._save);
      this.updateWheelWidget();
      overlay.classList.remove("hidden");
      const dismiss = () => {
        overlay.classList.add("hidden");
        document.getElementById("btn-wheel-tutorial-ok").onclick = null;
        overlay.onclick = null;
        this.openWheelScreen();
        if (onAfter) onAfter();
      };
      document.getElementById("btn-wheel-tutorial-ok").onclick = dismiss;
      overlay.onclick = (e) => { if (e.target === overlay) dismiss(); };
    }

    _showLeaderboardUnlockTutorial(onAfter) {
      const overlay = document.getElementById("leaderboard-tutorial-overlay");
      if (!overlay) {
        if (onAfter) onAfter();
        return;
      }
      this._leaderboardTutorCallback = onAfter;
      this._leaderboardTutorOverlayVisible = true;
      this.updateLeaderboardWidget();
      document.body.classList.add("leaderboard-tutor-active");
      overlay.classList.remove("hidden");
      const btnGotIt = document.getElementById("btn-leaderboard-tutorial-got-it");
      const dismiss = () => this._finishLeaderboardTutorial();
      if (btnGotIt) btnGotIt.onclick = dismiss;
      overlay.onclick = (e) => { if (e.target === overlay) dismiss(); };
    }

    _finishLeaderboardTutorial() {
      const overlay = document.getElementById("leaderboard-tutorial-overlay");
      if (overlay) overlay.classList.add("hidden");
      document.body.classList.remove("leaderboard-tutor-active");
      this._leaderboardTutorOverlayVisible = false;
      this._save.leaderboardTutorCompleted = true;
      saveSave(this._save);
      const btnGotIt = document.getElementById("btn-leaderboard-tutorial-got-it");
      if (btnGotIt) btnGotIt.onclick = null;
      const cb = this._leaderboardTutorCallback;
      this._leaderboardTutorCallback = null;
      if (cb) cb();
    }

    updateLeaderboardWidget() {
      const trophyBtn = document.getElementById("curs_add_leaderboard_from_trophy_button");
      if (trophyBtn) {
        trophyBtn.setAttribute("aria-label", "Leaderboard");
      }
    }

    updatePiggyWidget() {
      const piggyModal = document.getElementById("piggy-bank-modal");
      if (piggyModal && !piggyModal.classList.contains("hidden") && typeof PiggyBankScreen !== "undefined") {
        PiggyBankScreen.syncFromSave(this);
      }
      const widget = document.getElementById("piggy-widget");
      if (!widget) return;
      if (this._save.piggyBroken) {
        widget.classList.add("hidden");
        return;
      }
      widget.classList.remove("hidden");
      const stored = Math.min(this._save.piggyCap, this._save.piggyGemsStored || 0);
      const cap = this._save.piggyCap || PIGGY_CAP_DEFAULT;
      const isFull = stored >= cap;
      const countEl = document.getElementById("piggy-widget-count");
      if (countEl) countEl.textContent = stored + "/" + cap;
      const badgeEl = document.getElementById("piggy-full-badge");
      if (badgeEl) {
        badgeEl.classList.toggle("hidden", !isFull);
      }
      widget.classList.toggle("piggy-widget--full", isFull);
      const widgetStart = document.getElementById("piggy-widget-start");
      if (widgetStart) {
        if (this._save.piggyBroken) widgetStart.classList.add("hidden");
        else widgetStart.classList.remove("hidden");
        const countStart = document.getElementById("piggy-widget-count-start");
        if (countStart) countStart.textContent = stored + "/" + cap;
        const badgeStart = document.getElementById("piggy-full-badge-start");
        if (badgeStart) badgeStart.classList.toggle("hidden", !isFull);
        widgetStart.classList.toggle("piggy-widget--full", isFull);
      }
    }

    updateProfileWidget() {
      this._ensurePlayerProfile();
      const profile = this._save.playerProfile;
      const avatarId = Math.max(0, Math.min(AVATAR_COUNT - 1, parseInt(profile.avatarId, 10) || 0));
      const accessoryId = (profile.accessoryId != null && profile.accessoryId !== "") ? String(profile.accessoryId) : "none";
      const html = renderPlayerAvatar({ avatarId, accessoryId, size: "small" });
      const elGame = document.getElementById("profile-widget-avatar-game");
      const elStart = document.getElementById("profile-widget-avatar-start");
      if (elGame) elGame.innerHTML = html;
      if (elStart) elStart.innerHTML = html;
    }

    openPiggyModal() {
      if (typeof PiggyBankScreen !== "undefined" && PiggyBankScreen.open) {
        PiggyBankScreen.open(this);
        return;
      }
      if (this._save.piggyBroken) return;
      const modal = document.getElementById("piggy-bank-modal");
      if (!modal) return;
      modal.classList.remove("hidden");
    }

    closePiggyModal() {
      if (typeof PiggyBankScreen !== "undefined" && PiggyBankScreen.close) {
        PiggyBankScreen.close();
        return;
      }
      const modal = document.getElementById("piggy-bank-modal");
      if (modal) modal.classList.add("hidden");
    }

    _breakPiggyBank() {
      if (this._save.piggyBroken) return;
      const amount = this._save.piggyGemsStored || 0;
      this._save.gemsTotal = (this._save.gemsTotal || 0) + amount;
      this._save.piggyGemsStored = 0;
      this._save.piggyBroken = true;
      this._syncDailyTasksData();
      this._save.dailyTasksProgress.piggyClaims = Math.max(1, this._save.dailyTasksProgress.piggyClaims || 0);
      saveSave(this._save);
      this._renderDailyTasksScreen();
      this.closePiggyModal();
      this.updatePiggyWidget();
      const popup = document.getElementById("piggy-reward-popup");
      const amountEl = document.getElementById("piggy-reward-amount");
      if (amountEl) amountEl.textContent = "+" + amount + " gems";
      if (popup) {
        popup.classList.remove("hidden");
        const closePopup = () => {
          popup.classList.add("hidden");
          document.getElementById("piggy-reward-close").onclick = null;
          popup.onclick = null;
        };
        document.getElementById("piggy-reward-close").onclick = closePopup;
        popup.onclick = (e) => { if (e.target === popup) closePopup(); };
      }
    }

    openWheelScreen() {
      const modal = document.getElementById("wheel-modal");
      if (!modal) return;
      modal.setAttribute("data-wheel-state", "loading");
      document.documentElement.classList.add("wheel-screen-active");
      document.body.classList.add("wheel-screen-active");
      const now = Date.now();
      const nextFree = Math.max(0, parseInt(this._save.wheelNextFreeAt, 10) || 0);
      const freeAvailable = now >= nextFree;
      const pool = this.collectionManager.getWheelSegmentPool();
      const rotatable = document.getElementById("wheel-rotatable");
      const segmentsEl = document.getElementById("wheel-segments");
      const stateFromCooldown = () => {
        const n = Math.max(0, parseInt(this._save.wheelNextFreeAt, 10) || 0);
        return Date.now() >= n ? "ready" : "disabled";
      };
      const setWheelState = (state) => modal.setAttribute("data-wheel-state", state);
      if (segmentsEl && pool.length === WHEEL_SEGMENTS) {
        segmentsEl.innerHTML = "";
        const segmentAngle = 360 / WHEEL_SEGMENTS;
        const mysteryCardSrc = CARD_IMAGE_BASE + "card_01.png";
        for (let i = 0; i < WHEEL_SEGMENTS; i++) {
          const item = pool[i];
          const seg = document.createElement("div");
          seg.className = "wheel-segment";
          seg.style.transform = "rotate(" + (i * segmentAngle) + "deg)";
          const inner = document.createElement("div");
          inner.className = "wheel-segment-inner";
          if (item.type === "pack") {
            const packEl = renderPackIcon({ cardCount: item.cardCount, locked: false, dimmed: false, size: "small", claimable: false });
            packEl.classList.add("wheel-segment-pack");
            inner.appendChild(packEl);
          } else if (item.type === "hammers") {
            const h = document.createElement("div");
            h.className = "wheel-segment-hammers";
            h.textContent = "🔨+" + item.amount;
            inner.appendChild(h);
          } else {
            const cardId = item.cardId;
            const def = cardId && CARD_DEFS[cardId];
            const imgSrc = (def && def.imageSrc) ? def.imageSrc : mysteryCardSrc;
            const img = document.createElement("img");
            img.src = imgSrc;
            img.alt = (def && def.name) ? def.name : "Card";
            img.className = "wheel-segment-card-thumb";
            img.onerror = function () { this.src = mysteryCardSrc; };
            inner.appendChild(img);
          }
          const mul = document.createElement("div");
          mul.className = "wheel-segment-multiplier";
          if (item.type === "pack") mul.textContent = "x" + (item.cardCount || 1);
          else if (item.type === "hammers") mul.textContent = "x" + (item.amount || 1);
          else mul.textContent = "x1";
          inner.appendChild(mul);
          seg.appendChild(inner);
          segmentsEl.appendChild(seg);
        }
      }
      if (rotatable) rotatable.style.transition = "none";
      if (rotatable) rotatable.style.transform = "rotate(0deg)";
      const spinBtn = document.getElementById("btn-wheel-spin");
      const timerEl = document.getElementById("wheel-timer");
      const timerValue = document.getElementById("wheel-timer-value");
      const subtitleEl = document.getElementById("wheel-subtitle");
      if (freeAvailable) {
        if (spinBtn) {
          spinBtn.textContent = "Free Spin";
          spinBtn.disabled = false;
          spinBtn.classList.remove("hidden");
        }
        if (subtitleEl) subtitleEl.textContent = "Spin for free!";
        if (timerEl) timerEl.classList.add("hidden");
        setWheelState("ready");
      } else {
        if (spinBtn) {
          spinBtn.disabled = true;
          spinBtn.textContent = "SPIN";
        }
        if (subtitleEl) subtitleEl.textContent = "Come back for your next free spin.";
        if (timerEl) timerEl.classList.remove("hidden");
        setWheelState("disabled");
        const updateTimer = () => {
          const remain = Math.max(0, nextFree - Date.now());
          if (remain <= 0) {
            if (timerValue) timerValue.textContent = "00:00:00";
            spinBtn.disabled = false;
            spinBtn.textContent = "Free Spin";
            timerEl.classList.add("hidden");
            if (subtitleEl) subtitleEl.textContent = "Spin for free!";
            setWheelState("ready");
            if (this._wheelTimerId) clearInterval(this._wheelTimerId);
            this._wheelTimerId = null;
            return;
          }
          const h = Math.floor(remain / 3600000);
          const m = Math.floor((remain % 3600000) / 60000);
          const s = Math.floor((remain % 60000) / 1000);
          if (timerValue) timerValue.textContent = String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
        };
        updateTimer();
        if (this._wheelTimerId) clearInterval(this._wheelTimerId);
        this._wheelTimerId = setInterval(updateTimer, 1000);
      }
      const spinCheatBtn = document.getElementById("btn-wheel-spin-cheat");
      const doSpin = (useCooldown) => {
        setWheelState("spinning");
        if (subtitleEl) subtitleEl.textContent = "Spinning...";
        if (spinBtn) spinBtn.disabled = true;
        if (spinCheatBtn) spinCheatBtn.disabled = true;
        if (spinBtn) spinBtn.onclick = null;
        if (spinCheatBtn) spinCheatBtn.onclick = null;
        const wonIndex = Math.floor(Math.random() * WHEEL_SEGMENTS);
        const wonItem = pool[wonIndex];
        const segmentAngle = 360 / WHEEL_SEGMENTS;
        const fullTurns = 360 * 4;
        const finalDeg = fullTurns - wonIndex * segmentAngle;
        if (rotatable) {
          rotatable.style.transition = "transform " + (WHEEL_SPIN_DURATION_MS / 1000) + "s cubic-bezier(0.2, 0.8, 0.2, 1)";
          rotatable.style.transform = "rotate(" + finalDeg + "deg)";
        }
        setTimeout(() => {
          const pointerEl = document.querySelector(".wheel-pointer");
          if (pointerEl) {
            pointerEl.classList.add("wheel-pointer-glow");
            setTimeout(() => pointerEl.classList.remove("wheel-pointer-glow"), 600);
          }
          this._syncDailyTasksData();
          this._save.dailyTasksProgress.wheelSpins = (this._save.dailyTasksProgress.wheelSpins || 0) + 1;
          if (useCooldown) {
            this._save.wheelNextFreeAt = Date.now() + WHEEL_FREE_COOLDOWN_MS;
          }
          saveSave(this._save);
          this.updateWheelWidget();
          this._renderDailyTasksScreen();
          close();
          setWheelState("result");
          if (wonItem.type === "pack") {
            this._openPackOpeningFlowGeneric(wonItem.packStars, wonItem.cardCount, () => {
              this.collectionUI.updateCollectionButtons();
              this.collectionUI.updateGlobalCardsProgress();
              setWheelState(stateFromCooldown());
            });
            return;
          }
          if (wonItem.type === "hammers") {
            this.addHammers(wonItem.amount || 1);
            const rewardModal = document.getElementById("wheel-reward-modal");
            const rewardTitle = document.querySelector(".wheel-reward-title");
            const cardBack = document.getElementById("wheel-reward-card-back");
            if (rewardTitle) rewardTitle.textContent = "You won +" + (wonItem.amount || 1) + " hammers!";
            if (cardBack) {
              cardBack.innerHTML = "<div class=\"wheel-hammer-reward\">🔨</div>";
            }
            if (rewardModal) rewardModal.classList.remove("hidden");
            const onAwesome = () => {
              if (rewardModal) rewardModal.classList.add("hidden");
              document.getElementById("btn-wheel-reward-ok").onclick = null;
              rewardModal.onclick = null;
              setWheelState(stateFromCooldown());
            };
            document.getElementById("btn-wheel-reward-ok").onclick = onAwesome;
            rewardModal.onclick = (e) => { if (e.target === rewardModal) onAwesome(); };
            return;
          }
          const cardId = wonItem.cardId;
          this.collectionManager.awardCardFromWheel(cardId);
          saveSave(this._save);
          this.collectionUI.updateCollectionButtons();
          this.collectionUI.updateGlobalCardsProgress();
          const rewardModal = document.getElementById("wheel-reward-modal");
          const cardBack = document.getElementById("wheel-reward-card-back");
          const rewardTitle = document.querySelector(".wheel-reward-title");
          if (cardBack) {
            cardBack.innerHTML = "";
            const def = cardId && CARD_DEFS[cardId];
            const wonSrc = (def && def.imageSrc) ? def.imageSrc : CARD_IMAGE_BASE + "card_01.png";
            const wonImg = document.createElement("img");
            wonImg.src = wonSrc;
            wonImg.alt = (def && def.name) ? def.name : "Card";
            wonImg.className = "wheel-reward-card-img";
            wonImg.onerror = function () { this.src = CARD_IMAGE_BASE + "card_01.png"; };
            cardBack.appendChild(wonImg);
          }
          if (rewardTitle && cardId && CARD_DEFS[cardId] && CARD_DEFS[cardId].name) {
            rewardTitle.textContent = "You won " + CARD_DEFS[cardId].name + "!";
          } else if (rewardTitle) {
            rewardTitle.textContent = "You won a Card!";
          }
          if (rewardModal) rewardModal.classList.remove("hidden");
          const onAwesome = () => {
            if (rewardModal) rewardModal.classList.add("hidden");
            document.getElementById("btn-wheel-reward-ok").onclick = null;
            rewardModal.onclick = null;
            setWheelState(stateFromCooldown());
          };
          document.getElementById("btn-wheel-reward-ok").onclick = onAwesome;
          rewardModal.onclick = (e) => { if (e.target === rewardModal) onAwesome(); };
        }, WHEEL_SPIN_DURATION_MS + 200);
      };

      let keyHandler = null;
      const close = () => {
        modal.classList.add("hidden");
        modal.removeAttribute("data-wheel-state");
        document.documentElement.classList.remove("wheel-screen-active");
        document.body.classList.remove("wheel-screen-active");
        if (this._wheelTimerId) clearInterval(this._wheelTimerId);
        this._wheelTimerId = null;
        document.getElementById("btn-wheel-close").onclick = null;
        if (spinBtn) spinBtn.onclick = null;
        if (spinCheatBtn) spinCheatBtn.onclick = null;
        if (keyHandler) {
          document.removeEventListener("keydown", keyHandler);
          keyHandler = null;
        }
      };
      document.getElementById("btn-wheel-close").onclick = close;
      keyHandler = (e) => {
        if (e.key !== "Escape") return;
        e.preventDefault();
        close();
      };
      document.addEventListener("keydown", keyHandler);

      modal.classList.remove("hidden");

      if (spinBtn && freeAvailable) {
        spinBtn.onclick = () => doSpin(true);
      }
      if (spinCheatBtn) {
        spinCheatBtn.onclick = () => doSpin(false);
      }
    }

    _showToastBattlePassLocked() {
      const el = document.getElementById("toast-battle-pass-locked");
      if (!el) return;
      el.classList.remove("hidden");
      clearTimeout(this._toastBattlePassLockedTimer);
      this._toastBattlePassLockedTimer = setTimeout(() => el.classList.add("hidden"), 2500);
    }

    _showToastEventEnded() {
      const el = document.getElementById("toast-event-ended");
      if (!el) return;
      el.classList.remove("hidden");
      clearTimeout(this._toastEventEndedTimer);
      this._toastEventEndedTimer = setTimeout(() => el.classList.add("hidden"), 2500);
    }

    _showToastLeaderboardLocked() {
      const el = document.getElementById("toast-leaderboard-locked");
      if (!el) return;
      el.classList.remove("hidden");
      clearTimeout(this._toastLeaderboardLockedTimer);
      this._toastLeaderboardLockedTimer = setTimeout(() => el.classList.add("hidden"), 2500);
    }

    _showToastBonusLevelLocked() {
      const el = document.getElementById("toast-bonus-level-locked");
      if (!el) return;
      el.classList.remove("hidden");
      clearTimeout(this._toastBonusLevelLockedTimer);
      this._toastBonusLevelLockedTimer = setTimeout(() => el.classList.add("hidden"), 2500);
    }

    _showToastBonusCompleted() {
      const el = document.getElementById("toast-bonus-completed");
      if (!el) return;
      el.classList.remove("hidden");
      clearTimeout(this._toastBonusCompletedTimer);
      this._toastBonusCompletedTimer = setTimeout(() => el.classList.add("hidden"), 2500);
    }

    _showToastRaceLocked() {
      const el = document.getElementById("toast-race-locked");
      if (!el) return;
      el.classList.remove("hidden");
      clearTimeout(this._toastRaceLockedTimer);
      this._toastRaceLockedTimer = setTimeout(() => el.classList.add("hidden"), 2500);
    }

    _showToastLostTempleLocked() {
      const el = document.getElementById("toast-lost-temple-locked");
      if (!el) return;
      el.classList.remove("hidden");
      clearTimeout(this._toastLostTempleLockedTimer);
      this._toastLostTempleLockedTimer = setTimeout(() => el.classList.add("hidden"), 2500);
    }

    onLostTempleClick() {
      this.lostTempleManager.openScreen();
    }

    onLeaderboardTrophyClick() {
      this.leaderboardManager.openLeaderboardModal();
    }

    _ensurePlayerProfile() {
      if (!this._save.playerProfile || typeof this._save.playerProfile !== "object") {
        this._save.playerProfile = {
          id: getStablePlayerId(),
          name: generateDefaultUserName(),
          avatarId: 0,
          accessoryId: "none",
          createdAt: Date.now(),
        };
      }
      if (!this._save.playerProfile.id) this._save.playerProfile.id = getStablePlayerId();
      if (!this._save.playerProfile.name || !String(this._save.playerProfile.name).trim()) {
        this._save.playerProfile.name = generateDefaultUserName();
      }
      this._save.playerProfile.avatarId = Math.max(0, Math.min(AVATAR_COUNT - 1, parseInt(this._save.playerProfile.avatarId, 10) || 0));
      if (this._save.playerProfile.accessoryId === undefined || this._save.playerProfile.accessoryId === null) {
        this._save.playerProfile.accessoryId = "none";
      }
    }

    _validateProfileName(raw) {
      const s = String(raw || "").trim().replace(/\s+/g, " ");
      if (s.length === 0) return null;
      const allowed = /^[a-zA-Z0-9 _]+$/;
      if (!allowed.test(s)) return null;
      if (s.length < 3 || s.length > 16) return null;
      return s;
    }

    showProfileSetupIfNeeded() {
      if (this._save.profileSetupCompleted) return;
      this._ensurePlayerProfile();
      saveSave(this._save);
      this.openProfileModal(false);
    }

    _saveProfileFromModal(pillEl, inputEl) {
      const raw = inputEl && inputEl.value !== undefined ? String(inputEl.value).trim() : (pillEl ? pillEl.textContent : "").trim();
      const validated = this._validateProfileName(raw);
      const profile = this._save.playerProfile;
      const fallback = (profile.name && String(profile.name).trim()) ? String(profile.name).trim() : generateDefaultUserName();
      const name = validated !== null ? validated : fallback;
      this._save.playerProfile.name = name;
      this._save.playerProfile.avatarId = Math.max(0, Math.min(AVATAR_COUNT - 1, parseInt(this._save.playerProfile.avatarId, 10) || 0));
      saveSave(this._save);
      if (pillEl) pillEl.textContent = name;
      this.updateProfileWidget();
    }

    _updateProfileModalPreview(previewEl, avatarId, accessoryId) {
      if (!previewEl) return;
      const aid = Math.max(0, Math.min(AVATAR_COUNT - 1, parseInt(avatarId, 10) || 0));
      const accId = (accessoryId != null && accessoryId !== "") ? String(accessoryId) : "none";
      previewEl.innerHTML = renderPlayerAvatar({ avatarId: aid, accessoryId: accId, size: "large" });
    }

    openProfileModal(isEdit) {
      this._ensurePlayerProfile();
      const modal = document.getElementById("profile-modal");
      if (!modal) return;
      const profile = this._save.playerProfile;
      const pillEl = document.getElementById("profile-username-pill");
      const inputEl = document.getElementById("profile-username-input");
      const previewEl = document.getElementById("profile-preview");
      const skinsPanel = document.getElementById("profile-skins-panel");
      const accessoriesPanel = document.getElementById("profile-accessories-panel");
      const tabAccessories = document.getElementById("profile-tab-accessories");
      const tabSkins = document.getElementById("profile-tab-skins");
      const skinsGrid = document.getElementById("profile-skins-grid");
      const displayName = (profile.name && String(profile.name).trim()) ? String(profile.name).trim() : generateDefaultUserName();
      if (pillEl) {
        pillEl.textContent = displayName;
        pillEl.classList.remove("hidden");
      }
      if (inputEl) {
        inputEl.value = displayName;
        inputEl.setAttribute("maxlength", "16");
        inputEl.classList.add("hidden");
      }
      this._updateProfileModalPreview(previewEl, profile.avatarId, profile.accessoryId);
      const currentAccessoryId = (profile.accessoryId != null && profile.accessoryId !== "") ? String(profile.accessoryId) : "none";
      const profileSkinCatalog = [
        { avatarId: 0, state: "used", label: "Used", selectable: true },
        { avatarId: 1, state: "available", label: "Available", selectable: true },
        { avatarId: 2, state: "available", label: "Available", selectable: true },
        { avatarId: 3, state: "locked-ads", label: "0/10", icon: PROFILE_ICON_ADS_SRC, selectable: false },
        { avatarId: 4, state: "locked-gems", label: "5", icon: PROFILE_ICON_GEM_SRC, selectable: false },
        { avatarId: 5, state: "locked-gems", label: "10", icon: PROFILE_ICON_GEM_SRC, selectable: false },
      ];
      const renderSkins = () => {
        if (!skinsGrid) return;
        skinsGrid.innerHTML = "";
        profileSkinCatalog.forEach((item) => {
          const isSelected = item.avatarId === profile.avatarId;
          const card = document.createElement("div");
          card.className = "profile-item-card" + (item.selectable ? "" : " profile-item-card--locked");
          const button = document.createElement("button");
          button.type = "button";
          button.className = "profile-item-button";
          if (!item.selectable) {
            button.setAttribute("aria-disabled", "true");
          }
          const thumb = document.createElement("div");
          thumb.className = "profile-item-thumb" + (isSelected ? " profile-item-thumb--selected" : "");
          thumb.innerHTML = getAvatarSvg(item.avatarId);
          const pill = document.createElement("div");
          const toneClass = item.state === "used" ? " profile-item-pill--used" : (item.state === "available" ? " profile-item-pill--available" : "");
          pill.className = "profile-item-pill" + toneClass;
          if (item.icon) {
            const icon = document.createElement("img");
            icon.className = "profile-item-price-icon";
            icon.src = item.icon;
            icon.alt = "";
            icon.setAttribute("aria-hidden", "true");
            pill.appendChild(icon);
          }
          const txt = document.createElement("span");
          txt.textContent = item.label;
          pill.appendChild(txt);
          button.appendChild(thumb);
          button.appendChild(pill);
          button.onclick = () => {
            if (!item.selectable) return;
            this._save.playerProfile.avatarId = item.avatarId;
            saveSave(this._save);
            this._updateProfileModalPreview(previewEl, item.avatarId, profile.accessoryId);
            renderSkins();
            this.updateProfileWidget();
          };
          card.appendChild(button);
          skinsGrid.appendChild(card);
        });
      };
      const switchToSkins = () => {
        if (tabSkins) { tabSkins.classList.add("profile-tab--active"); tabSkins.classList.remove("profile-tab--inactive"); }
        if (tabAccessories) { tabAccessories.classList.remove("profile-tab--active"); tabAccessories.classList.add("profile-tab--inactive"); }
        if (skinsPanel) skinsPanel.classList.remove("hidden");
        if (accessoriesPanel) accessoriesPanel.classList.add("hidden");
      };
      const switchToAccessories = () => {
        if (tabAccessories) { tabAccessories.classList.add("profile-tab--active"); tabAccessories.classList.remove("profile-tab--inactive"); }
        if (tabSkins) { tabSkins.classList.remove("profile-tab--active"); tabSkins.classList.add("profile-tab--inactive"); }
        if (accessoriesPanel) accessoriesPanel.classList.remove("hidden");
        if (skinsPanel) skinsPanel.classList.add("hidden");
      };
      if (tabSkins) tabSkins.onclick = switchToSkins;
      if (tabAccessories) tabAccessories.onclick = switchToAccessories;
      const accessoriesGrid = document.getElementById("profile-accessories-grid");
      if (accessoriesGrid) {
        accessoriesGrid.innerHTML = "";
        ACCESSORY_DEFS.forEach((def) => {
          const tile = document.createElement("div");
          tile.className = "profile-item-card";
          tile.setAttribute("role", "listitem");
          const button = document.createElement("button");
          button.type = "button";
          button.className = "profile-item-button";
          const thumb = document.createElement("div");
          thumb.className = "profile-item-thumb" + (def.id === currentAccessoryId ? " profile-item-thumb--selected" : "");
          if (def.id === "none") {
            thumb.innerHTML = "<span class=\"profile-username-pill\" style=\"font-size:0.9rem;padding:0;line-height:1;\">None</span>";
          } else if (def.iconSvg) {
            thumb.innerHTML = def.iconSvg;
          } else {
            thumb.innerHTML = "<span class=\"profile-username-pill\" style=\"font-size:0.75rem;padding:0;line-height:1.1;\">" + (def.displayName || def.id) + "</span>";
          }
          const pill = document.createElement("div");
          pill.className = "profile-item-pill" + (def.id === currentAccessoryId ? " profile-item-pill--used" : " profile-item-pill--available");
          const txt = document.createElement("span");
          txt.textContent = def.id === currentAccessoryId ? "Used" : "Available";
          pill.appendChild(txt);
          button.appendChild(thumb);
          button.appendChild(pill);
          tile.appendChild(button);
          if (def.id === "none") {
            tile.setAttribute("data-accessory-id", "none");
          }
          button.onclick = () => {
            this._save.playerProfile.accessoryId = def.id;
            saveSave(this._save);
            profile.accessoryId = def.id;
            this._updateProfileModalPreview(previewEl, profile.avatarId, def.id);
            accessoriesGrid.querySelectorAll(".profile-item-thumb").forEach((t) => t.classList.remove("profile-item-thumb--selected"));
            accessoriesGrid.querySelectorAll(".profile-item-pill").forEach((t) => {
              t.classList.remove("profile-item-pill--used");
              t.classList.add("profile-item-pill--available");
              const s = t.querySelector("span");
              if (s) s.textContent = "Available";
            });
            thumb.classList.add("profile-item-thumb--selected");
            pill.classList.remove("profile-item-pill--available");
            pill.classList.add("profile-item-pill--used");
            txt.textContent = "Used";
            this.updateProfileWidget();
          };
          accessoriesGrid.appendChild(tile);
        });
      }
      renderSkins();
      const commitName = () => {
        if (inputEl && !inputEl.classList.contains("hidden")) {
          this._saveProfileFromModal(pillEl, inputEl);
          inputEl.classList.add("hidden");
          if (pillEl) pillEl.classList.remove("hidden");
        }
      };
      if (pillEl) {
        pillEl.onclick = () => {
          if (inputEl) {
            inputEl.value = pillEl.textContent;
            pillEl.classList.add("hidden");
            inputEl.classList.remove("hidden");
            inputEl.focus();
          }
        };
      }
      if (inputEl) {
        inputEl.onkeydown = (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commitName();
          }
        };
        inputEl.onblur = () => commitName();
      }
      const close = () => {
        commitName();
        modal.classList.add("hidden");
        if (!isEdit) this._save.profileSetupCompleted = true;
        saveSave(this._save);
        if (this._profileModalEscapeHandler) {
          window.removeEventListener("keydown", this._profileModalEscapeHandler);
          this._profileModalEscapeHandler = null;
        }
        if (pillEl) pillEl.onclick = null;
        if (inputEl) {
          inputEl.onkeydown = null;
          inputEl.onblur = null;
        }
        if (tabSkins) tabSkins.onclick = null;
        if (tabAccessories) tabAccessories.onclick = null;
        if (accessoriesGrid) {
          accessoriesGrid.querySelectorAll(".profile-item-button").forEach((t) => { t.onclick = null; });
          accessoriesGrid.innerHTML = "";
        }
        if (skinsGrid) {
          skinsGrid.querySelectorAll(".profile-item-button").forEach((t) => { t.onclick = null; });
          skinsGrid.innerHTML = "";
        }
        modal.onclick = null;
        const closeBtn = document.getElementById("profile-modal-close");
        if (closeBtn) closeBtn.onclick = null;
        this.updateProfileWidget();
      };
      modal.onclick = (e) => { if (e.target === modal) close(); };
      this._profileModalEscapeHandler = (e) => {
        if (e.key !== "Escape") return;
        e.preventDefault();
        close();
      };
      window.addEventListener("keydown", this._profileModalEscapeHandler);
      const closeBtn = document.getElementById("profile-modal-close");
      if (closeBtn) closeBtn.onclick = () => close();
      modal.classList.remove("hidden");
    }

    onGiftClicked() {
      this.openBonusLevelModal();
    }

    openBonusLevelModal() {
      const modal = document.getElementById("bonus-level-modal");
      if (!modal) return;
      const completedHint = document.getElementById("bonus-level-modal-completed-hint");
      if (completedHint) {
        completedHint.classList.toggle("hidden", !this._save.bonusLevelCompleted);
      }
      modal.classList.remove("hidden");
    }

    closeBonusLevelModal() {
      const modal = document.getElementById("bonus-level-modal");
      if (modal) modal.classList.add("hidden");
    }

    _onBonusLevelPlayClick() {
      this.closeBonusLevelModal();
      this.ui.showScreen("game-screen");
      this.loadBonusLevel();
    }

    _clearBattlePassTutorial() {
      if (this._bpTutorDragAnimationId) {
        cancelAnimationFrame(this._bpTutorDragAnimationId);
        this._bpTutorDragAnimationId = null;
      }
      this._bpTutorHideHand();
      if (this._bpTutorResizeHandler) {
        window.removeEventListener("resize", this._bpTutorResizeHandler);
        this._bpTutorResizeHandler = null;
      }
    }

    _bpTutorHideHand() {
      const overlay = document.getElementById("bp-tutor-overlay");
      if (overlay) {
        overlay.classList.add("hidden");
        overlay.classList.remove("bp-tutor-overlay--dim");
      }
    }

    _bpTutorShowHandAtElement(targetEl, tooltipText) {
      const overlay = document.getElementById("bp-tutor-overlay");
      const handWrap = overlay ? overlay.querySelector(".bp-tutor-hand-wrap") : null;
      const tooltipEl = document.getElementById("bp-tutor-tooltip");
      if (!overlay || !handWrap) return;
      overlay.classList.remove("hidden");
      overlay.classList.add("bp-tutor-overlay--dim");
      handWrap.classList.remove("bp-tutor-hand-wrap--dragging");
      const updatePos = () => {
        if (!targetEl || !targetEl.getBoundingClientRect) return;
        const rect = targetEl.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        handWrap.style.left = cx + "px";
        handWrap.style.top = (cy - 10) + "px";
        if (tooltipEl) {
          tooltipEl.style.left = cx + "px";
          tooltipEl.style.top = (cy + 44) + "px";
          tooltipEl.style.transform = "translateX(-50%)";
          tooltipEl.textContent = tooltipText || "";
          tooltipEl.style.display = tooltipText ? "block" : "none";
        }
      };
      updatePos();
      this._bpTutorResizeHandler = updatePos;
      window.removeEventListener("resize", this._bpTutorResizeHandler);
      window.addEventListener("resize", this._bpTutorResizeHandler);
    }

    _bpTutorShowHandDragAnimation(pieceEl, slotEl, tooltipText) {
      const overlay = document.getElementById("bp-tutor-overlay");
      const handWrap = overlay ? overlay.querySelector(".bp-tutor-hand-wrap") : null;
      const tooltipEl = document.getElementById("bp-tutor-tooltip");
      if (!overlay || !handWrap) return;
      overlay.classList.remove("hidden");
      overlay.classList.add("bp-tutor-overlay--dim");
      handWrap.classList.add("bp-tutor-hand-wrap--dragging");
      if (tooltipEl) {
        tooltipEl.textContent = tooltipText || "";
        tooltipEl.style.display = tooltipText ? "block" : "none";
      }
      const self = this;
      const DURATION_MS = 2000;
      const startTime = Date.now();
      function tick() {
        if (self._save.bpTutorStep !== 1) return;
        const pieceRect = pieceEl.getBoundingClientRect();
        const slotRect = slotEl.getBoundingClientRect();
        const fromX = pieceRect.left + pieceRect.width / 2;
        const fromY = pieceRect.top + pieceRect.height / 2 - 10;
        const toX = slotRect.left + slotRect.width / 2;
        const toY = slotRect.top + slotRect.height / 2 - 10;
        const elapsed = (Date.now() - startTime) % (DURATION_MS + 400);
        let t = elapsed < DURATION_MS ? elapsed / DURATION_MS : 1;
        if (elapsed >= DURATION_MS) t = 1;
        const ease = t < 1 ? t * t * (3 - 2 * t) : 1;
        const x = fromX + (toX - fromX) * ease;
        const y = fromY + (toY - fromY) * ease;
        handWrap.style.left = x + "px";
        handWrap.style.top = y + "px";
        if (tooltipEl) {
          tooltipEl.style.left = x + "px";
          tooltipEl.style.top = (y + 44) + "px";
          tooltipEl.style.transform = "translateX(-50%)";
        }
        self._bpTutorDragAnimationId = requestAnimationFrame(tick);
      }
      tick();
    }

    _startBattlePassTutorialIfNeeded() {
      if (!this._save.battlePassUnlocked) return;
      if (!isEventActive(this._save, "battlePassEvent")) return;
      if (this._save.bpTutorCompleted) return;

      if (this._save.bpTutorStep === 0) {
        this._save.bpTutorStep = 1;
        saveSave(this._save);
      }

      if (this._save.bpTutorStep === 2) {
        this._bpTutorShowHandAtElement(this._getBPWidgetElement(), "Tap Battle Pass to see rewards!");
        return;
      }

      if (this._save.bpTutorStep === 1) {
        const piece = this.pieceTray.pieces.find((p) => !p.placed);
        const slot = piece && this.board.getSlotByPieceId(piece.pieceId);
        if (piece && piece.el && slot && slot.el) {
          this._bpTutorShowHandDragAnimation(piece.el, slot.el, "Place puzzle pieces to earn Battle Pass points!");
        } else {
          this._bpTutorShowHandAtElement(this.pieceTray.container, "Place puzzle pieces to earn Battle Pass points!");
        }
      }
    }

    _getBPWidgetElement() {
      const gameScreen = document.getElementById("game-screen");
      if (gameScreen && gameScreen.classList.contains("active")) {
        const el = document.getElementById("btn-battle-pass-widget-game");
        if (el) return el;
      }
      return document.getElementById("btn-battle-pass-widget") || document.getElementById("btn-battle-pass-widget-game");
    }

    resetProgress() {
      try {
        this._clearBattlePassTutorial();
        const music = this._save.musicOn;
        const sfx = this._save.sfxOn;
        Object.assign(this._save, getDefaultSave());
        this._save.musicOn = music;
        this._save.sfxOn = sfx;
        const now = Date.now();
        if (!this._save.albumEvent) this._save.albumEvent = { startAt: now, endAt: now + EVENT_DURATION_MS };
        if (!this._save.battlePassEvent) this._save.battlePassEvent = { startAt: now, endAt: now + EVENT_DURATION_MS };
        if (!this._save.lostTempleEvent) this._save.lostTempleEvent = { startAt: now, endAt: now + EVENT_DURATION_MS };
        this.currentLevelIndex = 0;
        saveSave(this._save);
        this._applySaveToUI();
        this.updateWheelWidget();
        this.updateRaceEventWidget();
        this.lostTempleManager.updateWidget();
        this.rubyCaveManager.resetFromSave();
        this.collectionUI.updateCollectionButtons();
        this.ui.hideSettingsModal();
        this.ui.showScreen("start-screen");
      } catch (_) {}
    }

    cheatOpenAllAlbums() {
      const now = Date.now();
      this._save.collectionUnlocked = true;
      this._save.collectionTutorialCompleted = true;
      this._save.albumEvent = { startAt: now, endAt: now + EVENT_DURATION_MS };
      this._save.battlePassUnlocked = true;
      this._save.battlePassEvent = { startAt: now, endAt: now + EVENT_DURATION_MS };
      this._save.leaderboardUnlocked = true;
      this._save.leaderboardTutorCompleted = true;
      this.collectionManager._ensureCardsStructure();
      const cards = this._save.cards;
      ALBUM_DEFS.forEach((def) => {
        (def.cardIds || []).forEach((id) => {
          cards.collected[id] = true;
        });
        if (this._save.albums[def.id]) {
          this._save.albums[def.id].collectedCount = (def.cardIds || []).length;
        }
      });
      cards.newInbox = [];
      saveSave(this._save);
      this._applySaveToUI();
      this.updateBattlePassWidget();
      this.updateLeaderboardWidget();
      this.collectionUI.updateCollectionButtons();
      this.collectionUI.updateGlobalCardsProgress();
      this.ui.hideSettingsModal();
      this.collectionUI.showAlbum();
    }

    cheatAddAlbumStars() {
      this.collectionManager.addAlbumStars(10000);
      this.collectionUI.updateAlbumStarsUI();
      this._saveState();
    }

    cheatAddEventHammers() {
      this.addHammers(10000);
      this._saveState();
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    window.gameApp = new GameApp();
  });
})();
