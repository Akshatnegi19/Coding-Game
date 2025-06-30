export interface LeaderboardEntry {
  id: string
  username: string
  avatar?: string
  level: number
  totalScore: number
  challengesCompleted: number
  averageTime: number // in seconds
  streak: number
  rank: number
  country?: string
  joinedDate: Date
  lastActive: Date
  badges: string[]
}

export interface LeaderboardStats {
  totalPlayers: number
  averageScore: number
  topScore: number
  mostCompletedChallenges: number
}

export type LeaderboardCategory = "overall" | "weekly" | "monthly" | "speed" | "streak" | "beginners"

export interface CategoryLeaderboard {
  category: LeaderboardCategory
  title: string
  description: string
  entries: LeaderboardEntry[]
  stats: LeaderboardStats
}
