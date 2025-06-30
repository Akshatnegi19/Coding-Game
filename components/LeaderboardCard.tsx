"use client"

import { Card, CardContent } from "./ui/card"
import { Trophy, Clock, Zap, Target, Calendar } from "lucide-react"
import type { LeaderboardEntry } from "../types/leaderboard"

interface LeaderboardCardProps {
  entry: LeaderboardEntry
  category: string
  isCurrentUser?: boolean
}

export function LeaderboardCard({ entry, category, isCurrentUser = false }: LeaderboardCardProps) {
  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-yellow-600 bg-yellow-50 border-yellow-200"
    if (rank === 2) return "text-gray-600 bg-gray-50 border-gray-200"
    if (rank === 3) return "text-orange-600 bg-orange-50 border-orange-200"
    return "text-blue-600 bg-blue-50 border-blue-200"
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇"
    if (rank === 2) return "🥈"
    if (rank === 3) return "🥉"
    return `#${rank}`
  }

  const formatTime = (seconds: number) => {
    if (seconds === 0) return "N/A"
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Today"
    if (diffDays === 2) return "Yesterday"
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    return date.toLocaleDateString()
  }

  const getCategoryMetric = () => {
    switch (category) {
      case "speed":
        return {
          icon: <Clock className="h-4 w-4" />,
          label: "Avg Time",
          value: formatTime(entry.averageTime),
        }
      case "streak":
        return {
          icon: <Zap className="h-4 w-4" />,
          label: "Streak",
          value: `${entry.streak} days`,
        }
      default:
        return {
          icon: <Target className="h-4 w-4" />,
          label: "Completed",
          value: `${entry.challengesCompleted}`,
        }
    }
  }

  const categoryMetric = getCategoryMetric()

  return (
    <Card className={`transition-all hover:shadow-md ${isCurrentUser ? "ring-2 ring-purple-500 bg-purple-50" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Left side - Rank and User Info */}
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${getRankColor(entry.rank)}`}
            >
              <span className="font-bold text-lg">
                {typeof getRankIcon(entry.rank) === "string" && getRankIcon(entry.rank).startsWith("#")
                  ? getRankIcon(entry.rank)
                  : getRankIcon(entry.rank)}
              </span>
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{entry.avatar}</span>
                <div>
                  <h3 className={`font-semibold ${isCurrentUser ? "text-purple-700" : "text-gray-900"}`}>
                    {entry.username}
                    {isCurrentUser && <span className="ml-2 text-sm text-purple-600">(You)</span>}
                  </h3>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <span>Level {entry.level}</span>
                    </span>
                    {entry.country && (
                      <span className="flex items-center space-x-1">
                        <span>{entry.country}</span>
                      </span>
                    )}
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(entry.lastActive)}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Badges */}
              {entry.badges.length > 0 && (
                <div className="flex items-center space-x-1 mt-2">
                  {entry.badges.map((badge, index) => (
                    <span key={index} className="text-lg">
                      {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right side - Stats */}
          <div className="text-right space-y-2">
            <div className="flex items-center space-x-2">
              <Trophy className="h-4 w-4 text-yellow-600" />
              <span className="font-bold text-lg text-gray-900">{entry.totalScore.toLocaleString()}</span>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              {categoryMetric.icon}
              <span>
                {categoryMetric.label}: {categoryMetric.value}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
