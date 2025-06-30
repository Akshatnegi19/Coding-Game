import type { LeaderboardEntry, CategoryLeaderboard } from "../types/leaderboard"

// Mock leaderboard data
export const mockLeaderboardData: LeaderboardEntry[] = [

  {
    id: "1",
    username: "CodeNinja",
    avatar: "🥷",
    level: 15,
    totalScore: 4850,
    challengesCompleted: 25,
    averageTime: 180,
    streak: 12,
    rank: 1,
    country: "🇺🇸",
    joinedDate: new Date("2023-08-15"),
    lastActive: new Date("2024-01-15"),
    badges: ["🏆", "⚡", "🔥"],
  },
  {
    id: "2",
    username: "AlgoMaster",
    avatar: "🧠",
    level: 14,
    totalScore: 4720,
    challengesCompleted: 24,
    averageTime: 165,
    streak: 8,
    rank: 2,
    country: "🇨🇦",
    joinedDate: new Date("2023-09-01"),
    lastActive: new Date("2024-01-14"),
    badges: ["🎯", "💡", "🚀"],
  },
  {
    id: "3",
    username: "SpeedCoder",
    avatar: "⚡",
    level: 13,
    totalScore: 4650,
    challengesCompleted: 23,
    averageTime: 95,
    streak: 15,
    rank: 3,
    country: "🇬🇧",
    joinedDate: new Date("2023-07-20"),
    lastActive: new Date("2024-01-15"),
    badges: ["⚡", "🏃", "💨"],
  },
  {
    id: "4",
    username: "DebugQueen",
    avatar: "👑",
    level: 12,
    totalScore: 4200,
    challengesCompleted: 22,
    averageTime: 220,
    streak: 6,
    rank: 4,
    country: "🇩🇪",
    joinedDate: new Date("2023-10-05"),
    lastActive: new Date("2024-01-13"),
    badges: ["🐛", "🔍", "✨"],
  },
  {
    id: "5",
    username: "CodeMaster", // Current player
    avatar: "🎮",
    level: 5,
    totalScore: 0,
    challengesCompleted: 0,
    averageTime: 0,
    streak: 0,
    rank: 847,
    country: "🇺🇸",
    joinedDate: new Date("2024-01-01"),
    lastActive: new Date("2024-01-15"),
    badges: ["🆕"],
  },
  {
    id: "6",
    username: "JavaJedi",
    avatar: "🗡️",
    level: 11,
    totalScore: 3950,
    challengesCompleted: 21,
    averageTime: 200,
    streak: 4,
    rank: 5,
    country: "🇯🇵",
    joinedDate: new Date("2023-11-12"),
    lastActive: new Date("2024-01-12"),
    badges: ["☕", "🌟"],
  },
  {
    id: "7",
    username: "PythonPro",
    avatar: "🐍",
    level: 10,
    totalScore: 3800,
    challengesCompleted: 20,
    averageTime: 175,
    streak: 7,
    rank: 6,
    country: "🇦🇺",
    joinedDate: new Date("2023-12-01"),
    lastActive: new Date("2024-01-11"),
    badges: ["🐍", "📊"],
  },
  {
    id: "8",
    username: "ReactRocket",
    avatar: "🚀",
    level: 9,
    totalScore: 3600,
    challengesCompleted: 19,
    averageTime: 190,
    streak: 3,
    rank: 7,
    country: "🇫🇷",
    joinedDate: new Date("2023-11-20"),
    lastActive: new Date("2024-01-10"),
    badges: ["⚛️", "🎨"],
  },
  {
    id: "9",
    username: "DataDragon",
    avatar: "🐲",
    level: 8,
    totalScore: 3400,
    challengesCompleted: 18,
    averageTime: 210,
    streak: 5,
    rank: 8,
    country: "🇰🇷",
    joinedDate: new Date("2023-12-15"),
    lastActive: new Date("2024-01-09"),
    badges: ["📈", "🔢"],
  },
  {
    id: "10",
    username: "WebWizard",
    avatar: "🧙",
    level: 7,
    totalScore: 3200,
    challengesCompleted: 17,
    averageTime: 185,
    streak: 2,
    rank: 9,
    country: "🇮🇳",
    joinedDate: new Date("2024-01-05"),
    lastActive: new Date("2024-01-08"),
    badges: ["🌐", "✨"],
  },
]

// Generate category-specific leaderboards
export const generateCategoryLeaderboards = (): CategoryLeaderboard[] => {
  const baseData = [...mockLeaderboardData]

  return [
    {
      category: "overall",
      title: "Overall Rankings",
      description: "Top performers across all challenges",
      entries: baseData
        .sort((a, b) => b.totalScore - a.totalScore)
        .map((entry, index) => ({
          ...entry,
          rank: index + 1,
        })),
      stats: {
        totalPlayers: 1247,
        averageScore: 2150,
        topScore: 4850,
        mostCompletedChallenges: 25,
      },
    },
    {
      category: "weekly",
      title: "This Week",
      description: "Top performers this week",
      entries: baseData
        .filter((entry) => {
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          return entry.lastActive >= weekAgo
        })
        .sort((a, b) => b.totalScore - a.totalScore)
        .map((entry, index) => ({
          ...entry,
          rank: index + 1,
        })),
      stats: {
        totalPlayers: 342,
        averageScore: 1850,
        topScore: 4850,
        mostCompletedChallenges: 25,
      },
    },
    {
      category: "monthly",
      title: "This Month",
      description: "Top performers this month",
      entries: baseData
        .filter((entry) => {
          const monthAgo = new Date()
          monthAgo.setMonth(monthAgo.getMonth() - 1)
          return entry.lastActive >= monthAgo
        })
        .sort((a, b) => b.totalScore - a.totalScore)
        .map((entry, index) => ({
          ...entry,
          rank: index + 1,
        })),
      stats: {
        totalPlayers: 892,
        averageScore: 2050,
        topScore: 4850,
        mostCompletedChallenges: 25,
      },
    },
    {
      category: "speed",
      title: "Speed Champions",
      description: "Fastest problem solvers",
      entries: baseData
        .filter((entry) => entry.averageTime > 0)
        .sort((a, b) => a.averageTime - b.averageTime)
        .map((entry, index) => ({
          ...entry,
          rank: index + 1,
        })),
      stats: {
        totalPlayers: 756,
        averageScore: 2200,
        topScore: 4650,
        mostCompletedChallenges: 23,
      },
    },
    {
      category: "streak",
      title: "Streak Masters",
      description: "Longest solving streaks",
      entries: baseData
        .sort((a, b) => b.streak - a.streak)
        .map((entry, index) => ({
          ...entry,
          rank: index + 1,
        })),
      stats: {
        totalPlayers: 623,
        averageScore: 2300,
        topScore: 4650,
        mostCompletedChallenges: 23,
      },
    },
    {
      category: "beginners",
      title: "Rising Stars",
      description: "Top performers under level 10",
      entries: baseData
        .filter((entry) => entry.level < 10)
        .sort((a, b) => b.totalScore - a.totalScore)
        .map((entry, index) => ({
          ...entry,
          rank: index + 1,
        })),
      stats: {
        totalPlayers: 445,
        averageScore: 1650,
        topScore: 3600,
        mostCompletedChallenges: 19,
      },
    },
  ]
}
