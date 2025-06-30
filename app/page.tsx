"use client"

import "./index.css";
import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog"
import {
  Code,
  Trophy,
  Target,
  Zap,
  Star,
  Clock,
  Brain,
  TrendingUp,
  Play,
  BookOpen,
  Lightbulb,
  Copy,
} from "lucide-react"

import { generateCategoryLeaderboards } from "../data/leaderboard"
import { LeaderboardCard } from "../components/LeaderboardCard"
import type { LeaderboardCategory } from "../types/leaderboard"

import { useGameEngine } from "../hooks/useGameEngine"
import { CodeEditor } from "../components/CodeEditor"
import { TestResults } from "../components/TestResults"
import type { ExecutionResult } from "../types/ExecutionResult" // Import ExecutionResult

export default function CodingGame() {
  const {
    gameState,
    code,
    setCode,
    testResults,
    isExecuting,
    timeRemaining,
    availableChallenges,
    playerStats,
    startChallenge,
    submitSolution,
    runTests,
    useHint,
    resetGame, // ← add this
    setGameState,
  } = useGameEngine()

  const [activeTab, setActiveTab] = useState("challenges")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [showHint, setShowHint] = useState<string | null>(null)
  const [showSolution, setShowSolution] = useState<string | null>(null)

  const [selectedLeaderboardCategory, setSelectedLeaderboardCategory] = useState<LeaderboardCategory>("overall")
  const leaderboards = generateCategoryLeaderboards()
  const currentLeaderboard = leaderboards.find((lb) => lb.category === selectedLeaderboardCategory)

  const handleRunTests = async () => {
    await runTests(code)
  }

  const handleSubmit = async () => {
    const result = await submitSolution()
    if (result?.allPassed) {
      // Show success message or navigate to next challenge
    }
  }

  const handleUseHint = () => {
    if (!gameState.currentChallenge || !gameState.currentSession) return

    const hintIndex = gameState.currentSession.hintsUsed
    if (hintIndex < (gameState.currentChallenge?.hints.length || 0)) {
      const hint = gameState.currentChallenge?.hints[hintIndex]
      if (hint) {
        setShowHint(hint)
      }
    }
  }

  const handleShowSolution = () => {
    if (gameState.currentChallenge) {
      setShowSolution(gameState.currentChallenge.solution)
    }
  }

  const handleResetCode = () => {
    if (gameState.currentChallenge) {
      setCode(gameState.currentChallenge.starterCode)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 border-green-200"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "advanced":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "functions":
        return <Code className="h-4 w-4" />
      case "arrays":
        return <Target className="h-4 w-4" />
      case "loops":
        return <Zap className="h-4 w-4" />
      case "algorithms":
        return <Brain className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const filteredChallenges = availableChallenges.filter(
    (challenge) => selectedDifficulty === "all" || challenge.difficulty === selectedDifficulty,
  )

  const executeCode = useCallback(async (userCode: string, testCase: any): Promise<ExecutionResult> => {
    const startTime = performance.now()

    try {
      // Create a safe execution environment
      const func = new Function("return " + userCode)()

      if (typeof func !== "function") {
        throw new Error("Code must define a function")
      }

      // Execute with test case inputs
      const result = func(...testCase.input)
      const executionTime = performance.now() - startTime

      // If result is undefined but we expect a value, provide helpful error
      if (result === undefined && testCase.expectedOutput !== undefined) {
        return {
          success: false,
          output: result,
          error: "Function returned undefined. Did you forget to use 'return' instead of 'console.log'?",
          executionTime,
        }
      }

      return {
        success: true,
        output: result,
        executionTime,
      }
    } catch (error) {
      const executionTime = performance.now() - startTime
      return {
        success: false,
        output: null,
        error: error instanceof Error ? error.message : "Unknown error",
        executionTime,
      }
    }
  }, [])

  const handleBackToChallenges = () => {
    resetGame()
    setActiveTab("challenges")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                <Code className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CodeQuest</h1>
                <p className="text-sm text-gray-600">Interactive Coding Challenges</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                Level {playerStats.level}
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {playerStats.totalScore} points
              </Badge>
              <Button variant="outline" size="sm">
                <Trophy className="h-4 w-4 mr-2" />
                Leaderboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!gameState.isPlaying ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="challenges">Challenges</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            </TabsList>

            {/* Challenges Tab */}
            <TabsContent value="challenges" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Coding Challenges</h2>
                <div className="flex space-x-2">
                  <Button
                    variant={selectedDifficulty === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDifficulty("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={selectedDifficulty === "beginner" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDifficulty("beginner")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Beginner
                  </Button>
                  <Button
                    variant={selectedDifficulty === "intermediate" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDifficulty("intermediate")}
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    Intermediate
                  </Button>
                  <Button
                    variant={selectedDifficulty === "advanced" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDifficulty("advanced")}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Advanced
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredChallenges.map((challenge) => {
                  const isCompleted =
                    playerStats.completedChallenges > 0 && gameState.player.completedChallenges.includes(challenge.id)

                  return (
                    <Card key={challenge.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            {getCategoryIcon(challenge.category)}
                            <CardTitle className="text-lg">{challenge.title}</CardTitle>
                          </div>
                          {isCompleted && <Star className="h-5 w-5 text-yellow-500 fill-current" />}
                        </div>
                        <CardDescription>{challenge.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Badge className={getDifficultyColor(challenge.difficulty)}>{challenge.difficulty}</Badge>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Trophy className="h-4 w-4" />
                              <span>{challenge.maxScore} pts</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span className="capitalize">{challenge.category}</span>
                            {challenge.timeLimit && (
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{Math.floor(challenge.timeLimit / 60)}m</span>
                              </div>
                            )}
                          </div>

                          <Button
                            onClick={() => startChallenge(challenge.id)}
                            className="w-full bg-purple-600 hover:bg-purple-700"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            {isCompleted ? "Retry Challenge" : "Start Challenge"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            {/* Progress Tab */}
            <TabsContent value="progress" className="space-y-6">
              <h2 className="text-2xl font-bold">Your Progress</h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Challenges Completed</p>
                        <p className="text-3xl font-bold text-purple-600">{playerStats.completedChallenges}</p>
                      </div>
                      <Target className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Score</p>
                        <p className="text-3xl font-bold text-blue-600">{playerStats.totalScore}</p>
                      </div>
                      <Trophy className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Current Level</p>
                        <p className="text-3xl font-bold text-green-600">{playerStats.level}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Current Streak</p>
                        <p className="text-3xl font-bold text-orange-600">{playerStats.currentStreak}</p>
                      </div>
                      <Zap className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Completion Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Overall Progress</span>
                      <span>{playerStats.completionRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={playerStats.completionRate} className="h-3" />
                    <p className="text-sm text-gray-600">
                      {playerStats.completedChallenges} of {playerStats.totalChallenges} challenges completed
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-6">
              <h2 className="text-2xl font-bold">Achievements</h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gameState.player.achievements.map((achievement) => (
                  <Card key={achievement.id}>
                    <CardContent className="p-6">
                      <div className="text-center space-y-3">
                        <div className="text-4xl">{achievement.icon}</div>
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Unlocked {achievement.unlockedAt.toLocaleDateString()}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Leaderboard Tab */}
            <TabsContent value="leaderboard" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Leaderboard</h2>
                <div className="flex space-x-2">
                  {leaderboards.map((leaderboard) => (
                    <Button
                      key={leaderboard.category}
                      variant={selectedLeaderboardCategory === leaderboard.category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedLeaderboardCategory(leaderboard.category)}
                      className={
                        selectedLeaderboardCategory === leaderboard.category ? "bg-purple-600 hover:bg-purple-700" : ""
                      }
                    >
                      {leaderboard.title}
                    </Button>
                  ))}
                </div>
              </div>

              {currentLeaderboard && (
                <>
                  {/* Leaderboard Stats */}
                  <div className="grid md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {currentLeaderboard.stats.totalPlayers.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Total Players</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {currentLeaderboard.stats.averageScore.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Average Score</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {currentLeaderboard.stats.topScore.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Top Score</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {currentLeaderboard.stats.mostCompletedChallenges}
                        </div>
                        <div className="text-sm text-gray-600">Most Completed</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Category Description */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <h3 className="font-semibold text-lg mb-2">{currentLeaderboard.title}</h3>
                        <p className="text-gray-600">{currentLeaderboard.description}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Leaderboard Entries */}
                  <div className="space-y-3">
                    {currentLeaderboard.entries.slice(0, 10).map((entry) => (
                      <LeaderboardCard
                        key={entry.id}
                        entry={entry}
                        category={currentLeaderboard.category}
                        isCurrentUser={entry.username === gameState.player.username}
                      />
                    ))}
                  </div>

                  {/* Your Rank (if not in top 10) */}
                  {currentLeaderboard.entries.length > 10 && (
                    <>
                      <div className="text-center py-4">
                        <div className="text-gray-400">...</div>
                      </div>
                      {(() => {
                        const currentUserEntry = currentLeaderboard.entries.find(
                          (entry) => entry.username === gameState.player.username,
                        )
                        return currentUserEntry && currentUserEntry.rank > 10 ? (
                          <LeaderboardCard
                            entry={currentUserEntry}
                            category={currentLeaderboard.category}
                            isCurrentUser={true}
                          />
                        ) : null
                      })()}
                    </>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          /* Game Playing Interface */
          <div className="space-y-6">
            {/* Challenge Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{gameState.currentChallenge?.title}</CardTitle>
                    <CardDescription>{gameState.currentChallenge?.description}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getDifficultyColor(gameState.currentChallenge?.difficulty || "")}>
                      {gameState.currentChallenge?.difficulty}
                    </Badge>
                    <Badge variant="outline">{gameState.currentChallenge?.maxScore} points</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{gameState.currentChallenge?.instructions}</p>
              </CardContent>
            </Card>

            {/* Code Editor and Test Results */}
            <div className="grid lg:grid-cols-2 gap-6">
              <CodeEditor
                code={code}
                onChange={setCode}
                onRun={handleRunTests}
                onSubmit={handleSubmit}
                onReset={handleResetCode}
                onHint={handleUseHint}
                onShowSolution={handleShowSolution}
                isExecuting={isExecuting}
                canSubmit={testResults.length > 0 && testResults.every((r) => r.passed)}
                timeRemaining={timeRemaining}
                hintsUsed={gameState.currentSession?.hintsUsed || 0}
                maxHints={gameState.currentChallenge?.hints.length || 0}
              />

              <TestResults results={testResults} challenge={gameState.currentChallenge} isExecuting={isExecuting} />
            </div>

            {/* Back to Challenges */}
            <div className="flex justify-center">
              <Button variant="outline" onClick={handleBackToChallenges} className="bg-gray-50 hover:bg-gray-100">
                Back to Challenges
              </Button>
            </div>
          </div>
        )}

        {/* Hint Dialog */}
        <Dialog open={!!showHint} onOpenChange={() => setShowHint(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <span>Hint</span>
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-gray-700">{showHint}</p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Solution Dialog */}
        <Dialog open={!!showSolution} onOpenChange={() => setShowSolution(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-orange-500" />
                <span>Solution</span>
              </DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-orange-800 mb-2">
                  <strong>Note:</strong> Try to understand the solution and learn from it. You can copy this code to see
                  how it works!
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm font-mono whitespace-pre-wrap overflow-x-auto">
                  <code>{showSolution}</code>
                </pre>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (showSolution) {
                      navigator.clipboard.writeText(showSolution)
                    }
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Solution
                </Button>
                <Button
                  onClick={() => {
                    if (showSolution) {
                      setCode(showSolution)
                      setShowSolution(null)
                    }
                  }}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Use This Solution
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
