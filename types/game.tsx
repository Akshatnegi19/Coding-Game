// Game-related types with proper TypeScript patterns
export interface Challenge {
  id: string
  title: string
  description: string
  difficulty: "beginner" | "intermediate" | "advanced"
  category: "variables" | "functions" | "loops" | "arrays" | "objects" | "algorithms"
  instructions: string
  starterCode: string
  solution: string
  testCases: TestCase[]
  hints: string[]
  maxScore: number
  timeLimit?: number // in seconds
}

export interface TestCase {
  id: string
  input: any[]
  expectedOutput: any
  description: string
  isHidden?: boolean
}

export interface GameSession {
  challengeId: string
  startTime: Date
  endTime?: Date
  code: string
  score: number
  attempts: number
  hintsUsed: number
  completed: boolean
  testResults: TestResult[]
}

export interface TestResult {
  testCaseId: string
  passed: boolean
  actualOutput: any
  expectedOutput: any
  executionTime: number
  error?: string
}

export interface Player {
  id: string
  username: string
  level: number
  totalScore: number
  completedChallenges: string[]
  achievements: Achievement[]
  streak: number
  lastPlayedDate: Date
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: Date
  category: "completion" | "speed" | "efficiency" | "streak"
}

export interface LeaderboardEntry {
  playerId: string
  username: string
  score: number
  challengesCompleted: number
  averageTime: number
  rank: number
}

// Game mode types
export type GameMode = "challenge" | "speedrun" | "debug" | "code-golf" | "tutorial"

export interface GameState {
  currentChallenge: Challenge | null
  currentSession: GameSession | null
  player: Player
  gameMode: GameMode
  isPlaying: boolean
  timeRemaining?: number
}

// Code execution types
export interface ExecutionResult {
  success: boolean
  output: any
  error?: string
  executionTime: number
  memoryUsage?: number
}

// UI State types
export interface EditorState {
  code: string
  language: "javascript" | "python" | "typescript"
  theme: "light" | "dark"
  fontSize: number
  showLineNumbers: boolean
}
