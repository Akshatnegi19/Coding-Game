// Enums for better type safety and autocomplete
export enum AccountType {
  CHECKING = "checking",
  SAVINGS = "savings",
  CREDIT_CARD = "credit_card",
  INVESTMENT = "investment",
  LOAN = "loan",
}

export enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense",
  TRANSFER = "transfer",
}

export enum TransactionCategory {
  FOOD = "food",
  TRANSPORTATION = "transportation",
  ENTERTAINMENT = "entertainment",
  UTILITIES = "utilities",
  HEALTHCARE = "healthcare",
  SHOPPING = "shopping",
  SALARY = "salary",
  INVESTMENT = "investment",
  OTHER = "other",
}

export enum GoalStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
  PAUSED = "paused",
}

// Base interfaces with proper typing
export interface BaseEntity {
  readonly id: string
  readonly createdAt: Date
  readonly updatedAt: Date
}

export interface Account extends BaseEntity {
  name: string
  type: AccountType
  balance: number
  currency: string
  isActive: boolean
  institution?: string
  accountNumber?: string
  interestRate?: number
  creditLimit?: number
}

export interface Transaction extends BaseEntity {
  accountId: string
  amount: number
  type: TransactionType
  category: TransactionCategory
  description: string
  date: Date
  isRecurring: boolean
  tags?: string[]
  merchantName?: string
  location?: string
}

export interface Budget extends BaseEntity {
  name: string
  category: TransactionCategory
  limit: number
  spent: number
  period: "monthly" | "weekly" | "yearly"
  startDate: Date
  endDate: Date
  isActive: boolean
}

export interface FinancialGoal extends BaseEntity {
  name: string
  description?: string
  targetAmount: number
  currentAmount: number
  targetDate: Date
  status: GoalStatus
  category: string
  priority: "low" | "medium" | "high"
}

export interface Investment extends BaseEntity {
  symbol: string
  name: string
  shares: number
  purchasePrice: number
  currentPrice: number
  accountId: string
  sector?: string
  dividendYield?: number
}

// Utility types for better type manipulation
export type AccountSummary = Pick<Account, "id" | "name" | "type" | "balance">
export type TransactionSummary = Omit<Transaction, "createdAt" | "updatedAt">
export type CreateTransaction = Omit<Transaction, "id" | "createdAt" | "updatedAt">
export type UpdateAccount = Partial<Omit<Account, "id" | "createdAt" | "updatedAt">>

// Generic types for API responses
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  errors?: string[]
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Result type for error handling
export type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E }

// Financial metrics types
export interface FinancialMetrics {
  totalAssets: number
  totalLiabilities: number
  netWorth: number
  monthlyIncome: number
  monthlyExpenses: number
  savingsRate: number
  debtToIncomeRatio: number
}

export interface CategorySpending {
  category: TransactionCategory
  amount: number
  percentage: number
  transactionCount: number
}

// Advanced TypeScript: Conditional types
export type AccountByType<T extends AccountType> = T extends AccountType.CREDIT_CARD
  ? Account & { creditLimit: number; availableCredit: number }
  : T extends AccountType.INVESTMENT
    ? Account & { portfolioValue: number; totalReturn: number }
    : Account

// Mapped types for form validation
export type ValidationErrors<T> = {
  [K in keyof T]?: string
}

// Template literal types for dynamic keys
export type MetricKey = `${string}_metric`
export type ChartDataKey = `chart_${string}`

// Function type definitions
export type TransactionFilter = (transaction: Transaction) => boolean
export type AccountComparator = (a: Account, b: Account) => number
export type MetricCalculator<T> = (data: T[]) => number
