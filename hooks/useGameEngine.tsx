"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import type { Challenge, GameSession, TestResult, ExecutionResult, Player, GameState } from "../types/game"
import { challenges } from "../data/challenges"

// Mock player data - Updated to have 0 completed challenges initially
const mockPlayer: Player = {
  id: "player1",
  username: "CodeMaster",
  level: 5,
  totalScore: 0, // Reset to 0
  completedChallenges: [], // Empty array - no completed challenges initially
  achievements: [
    {
      id: "first-solve",
      title: "First Steps",
      description: "Complete your first challenge",
      icon: "🎯",
      unlockedAt: new Date("2024-01-10"),
      category: "completion",
    },
    {
      id: "speed-demon",
      title: "Speed Demon",
      description: "Complete a challenge in under 30 seconds",
      icon: "⚡",
      unlockedAt: new Date("2024-01-12"),
      category: "speed",
    },
  ],
  streak: 0, // Reset streak to 0
  lastPlayedDate: new Date(),
}

export function useGameEngine() {
  const [gameState, setGameState] = useState<GameState>({
    currentChallenge: null,
    currentSession: null,
    player: mockPlayer,
    gameMode: "challenge",
    isPlaying: false,
  })

  const [code, setCode] = useState<string>("")
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isExecuting, setIsExecuting] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)

  // Timer effect for timed challenges
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>


    if (gameState.isPlaying && timeRemaining !== null && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            // Time's up!
            handleTimeUp()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [gameState.isPlaying, timeRemaining])

  // Safe code execution with error handling
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

  // Run all test cases for current challenge
  const runTests = useCallback(
    async (userCode: string): Promise<TestResult[]> => {
      if (!gameState.currentChallenge) return []

      setIsExecuting(true)
      const results: TestResult[] = []

      for (const testCase of gameState.currentChallenge.testCases) {
        const execution = await executeCode(userCode, testCase)

        const result: TestResult = {
          testCaseId: testCase.id,
          passed: execution.success && execution.output === testCase.expectedOutput,
          actualOutput: execution.output,
          expectedOutput: testCase.expectedOutput,
          executionTime: execution.executionTime,
          error: execution.error,
        }

        results.push(result)
      }

      setIsExecuting(false)
      setTestResults(results)
      return results
    },
    [gameState.currentChallenge, executeCode],
  )

  // Calculate score based on performance
  const calculateScore = useCallback(
    (challenge: Challenge, results: TestResult[], timeUsed: number, hintsUsed: number): number => {
      const passedTests = results.filter((r) => r.passed).length
      const totalTests = results.length

      if (passedTests === 0) return 0

      // Base score from test completion
      let score = (passedTests / totalTests) * challenge.maxScore

      // Hint penalty
      const hintPenalty = hintsUsed * 0.1
      score *= Math.max(0.5, 1 - hintPenalty)

      return Math.round(score)
    },
    [],
  )

  // Start a new challenge
  const startChallenge = useCallback((challengeId: string) => {
    const challenge = challenges.find((c) => c.id === challengeId)
    if (!challenge) return

    const session: GameSession = {
      challengeId,
      startTime: new Date(),
      code: challenge.starterCode,
      score: 0,
      attempts: 0,
      hintsUsed: 0,
      completed: false,
      testResults: [],
    }

    setGameState((prev) => ({
      ...prev,
      currentChallenge: challenge,
      currentSession: session,
      isPlaying: true,
    }))

    setCode(challenge.starterCode)
    setTestResults([])
    setTimeRemaining(challenge.timeLimit || null)
  }, [])

  // Submit solution
  const submitSolution = useCallback(async () => {
    if (!gameState.currentChallenge || !gameState.currentSession) return

    const results = await runTests(code)
    const allPassed = results.every((r) => r.passed)

    const timeUsed = gameState.currentSession.startTime
      ? (Date.now() - gameState.currentSession.startTime.getTime()) / 1000
      : 0

    const score = calculateScore(gameState.currentChallenge, results, timeUsed, gameState.currentSession.hintsUsed)

    const updatedSession: GameSession = {
      ...gameState.currentSession,
      endTime: new Date(),
      code,
      score,
      attempts: gameState.currentSession.attempts + 1,
      completed: allPassed,
      testResults: results,
    }

    setGameState((prev) => ({
      ...prev,
      currentSession: updatedSession,
      isPlaying: !allPassed,
    }))

    // Update player progress if completed
    if (allPassed) {
      setGameState((prev) => ({
        ...prev,
        player: {
          ...prev.player,
          totalScore: prev.player.totalScore + score,
          completedChallenges: prev.player.completedChallenges.includes(gameState.currentChallenge!.id)
            ? prev.player.completedChallenges
            : [...prev.player.completedChallenges, gameState.currentChallenge!.id],
          streak: prev.player.streak + 1, // Increment streak when completing a challenge
        },
      }))
    }

    return { allPassed, score, results }
  }, [gameState.currentChallenge, gameState.currentSession, code, runTests, calculateScore])

  // Use hint
  const useHint = useCallback(
    (hintIndex: number) => {
      if (!gameState.currentSession || !gameState.currentChallenge) return null

      setGameState((prev) => ({
        ...prev,
        currentSession: prev.currentSession
          ? {
              ...prev.currentSession,
              hintsUsed: prev.currentSession.hintsUsed + 1,
            }
          : null,
      }))

      return gameState.currentChallenge.hints[hintIndex]
    },
    [gameState.currentSession, gameState.currentChallenge],
  )

  // Handle time up
  const handleTimeUp = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      isPlaying: false,
    }))
  }, [])

  // Get available challenges based on player level
  const availableChallenges = useMemo(() => {
    return challenges.filter((challenge) => {
      const difficultyLevel = {
        beginner: 1,
        intermediate: 3,
        advanced: 5,
      }
      return difficultyLevel[challenge.difficulty] <= gameState.player.level
    })
  }, [gameState.player.level])

  // Get player statistics
    const playerStats = useMemo(() => {
    const completedCount = gameState.player.completedChallenges.length
    const totalChallenges = challenges.length
    const completionRate = totalChallenges > 0 ? (completedCount / totalChallenges) * 100 : 0

    return {
      completedChallenges: completedCount,
      totalChallenges,
      completionRate,
      currentStreak: gameState.player.streak,
      totalScore: gameState.player.totalScore,
      level: gameState.player.level,
      achievements: gameState.player.achievements.length,
    }
  }, [gameState.player])

  // Reset the engine so the UI can return to the challenge list
  const resetGame = () => {
    setGameState((prev) => ({
      ...prev,
      currentChallenge: null,
      currentSession: null,
      isPlaying: false,
    }))
    setCode("")
    setTestResults([])
    setTimeRemaining(null)
  }

  return {
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
    resetGame,
    setGameState,
  }
}
