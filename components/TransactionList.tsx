"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { ArrowUpCircle, ArrowDownCircle, Search, Filter, Calendar, DollarSign } from "lucide-react"
import type { Transaction, TransactionCategory, TransactionType, Account } from "../types/financial"

// Advanced TypeScript: Generic filtering and sorting
interface TransactionListProps {
  transactions: Transaction[]
  accounts: Account[]
  onTransactionClick?: (transaction: Transaction) => void
  maxItems?: number
  showFilters?: boolean
}

// Type-safe filter configuration
interface FilterConfig {
  search: string
  category: TransactionCategory | "all"
  type: TransactionType | "all"
  dateRange: "all" | "7days" | "30days" | "90days"
  minAmount?: number
  maxAmount?: number
}

// Utility type for sort options
type SortOption = "date-desc" | "date-asc" | "amount-desc" | "amount-asc"

// Declare TransactionCategory
const transactionCategory = {
  FOOD: "food",
  TRANSPORTATION: "transportation",
  ENTERTAINMENT: "entertainment",
  UTILITIES: "utilities",
  HEALTHCARE: "healthcare",
  SHOPPING: "shopping",
  SALARY: "salary",
  INVESTMENT: "investment",
  OTHER: "other",
} as const

export function TransactionList({
  transactions,
  accounts,
  onTransactionClick,
  maxItems,
  showFilters = true,
}: TransactionListProps) {
  const [filters, setFilters] = useState<FilterConfig>({
    search: "",
    category: "all",
    type: "all",
    dateRange: "all",
  })
  const [sortBy, setSortBy] = useState<SortOption>("date-desc")

  // Create account lookup map for O(1) access
  const accountMap = useMemo(() => {
    return new Map(accounts.map((account) => [account.id, account]))
  }, [accounts])

  // Type-safe filtering with proper predicates
  const filteredTransactions = useMemo(() => {
    const filtered = transactions.filter((transaction): transaction is Transaction => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch =
          transaction.description.toLowerCase().includes(searchLower) ||
          transaction.merchantName?.toLowerCase().includes(searchLower) ||
          accountMap.get(transaction.accountId)?.name.toLowerCase().includes(searchLower)

        if (!matchesSearch) return false
      }

      // Category filter
      if (filters.category !== "all" && transaction.category !== filters.category) {
        return false
      }

      // Type filter
      if (filters.type !== "all" && transaction.type !== filters.type) {
        return false
      }

      // Date range filter
      if (filters.dateRange !== "all") {
        const now = new Date()
        const transactionDate = new Date(transaction.date)
        const daysDiff = Math.floor((now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24))

        switch (filters.dateRange) {
          case "7days":
            if (daysDiff > 7) return false
            break
          case "30days":
            if (daysDiff > 30) return false
            break
          case "90days":
            if (daysDiff > 90) return false
            break
        }
      }

      // Amount filters
      if (filters.minAmount !== undefined && Math.abs(transaction.amount) < filters.minAmount) {
        return false
      }
      if (filters.maxAmount !== undefined && Math.abs(transaction.amount) > filters.maxAmount) {
        return false
      }

      return true
    })

    // Type-safe sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case "amount-desc":
          return Math.abs(b.amount) - Math.abs(a.amount)
        case "amount-asc":
          return Math.abs(a.amount) - Math.abs(b.amount)
        default:
          return 0
      }
    })

    return maxItems ? filtered.slice(0, maxItems) : filtered
  }, [transactions, filters, sortBy, maxItems, accountMap])

  // Type-safe filter update functions
  const updateFilter = <K extends keyof FilterConfig>(key: K, value: FilterConfig[K]): void => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case "income":
        return <ArrowUpCircle className="h-4 w-4 text-green-500" />
      case "expense":
        return <ArrowDownCircle className="h-4 w-4 text-red-500" />
      case "transfer":
        return <DollarSign className="h-4 w-4 text-blue-500" />
      default:
        return <DollarSign className="h-4 w-4 text-gray-500" />
    }
  }

  const getCategoryColor = (category: TransactionCategory): string => {
    const colors: Record<TransactionCategory, string> = {
      [transactionCategory.FOOD]: "bg-orange-100 text-orange-800",
      [transactionCategory.TRANSPORTATION]: "bg-blue-100 text-blue-800",
      [transactionCategory.ENTERTAINMENT]: "bg-purple-100 text-purple-800",
      [transactionCategory.UTILITIES]: "bg-yellow-100 text-yellow-800",
      [transactionCategory.HEALTHCARE]: "bg-red-100 text-red-800",
      [transactionCategory.SHOPPING]: "bg-pink-100 text-pink-800",
      [transactionCategory.SALARY]: "bg-green-100 text-green-800",
      [transactionCategory.INVESTMENT]: "bg-indigo-100 text-indigo-800",
      [transactionCategory.OTHER]: "bg-gray-100 text-gray-800",
    }
    return colors[category]
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Math.abs(amount))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Recent Transactions</span>
          </CardTitle>
          <Badge variant="outline">{filteredTransactions.length} transactions</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {showFilters && (
          <div className="space-y-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search transactions..."
                    value={filters.search}
                    onChange={(e) => updateFilter("search", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select
                value={filters.category}
                onValueChange={(value) => updateFilter("category", value as FilterConfig["category"])}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.values(transactionCategory).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.type}
                onValueChange={(value) => updateFilter("type", value as FilterConfig["type"])}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Newest First</SelectItem>
                  <SelectItem value="date-asc">Oldest First</SelectItem>
                  <SelectItem value="amount-desc">Highest Amount</SelectItem>
                  <SelectItem value="amount-asc">Lowest Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {filteredTransactions.map((transaction) => {
            const account = accountMap.get(transaction.accountId)

            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onTransactionClick?.(transaction)}
              >
                <div className="flex items-center space-x-4">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <h4 className="font-medium text-gray-900">{transaction.description}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{account?.name}</span>
                      <span>•</span>
                      <span>{new Date(transaction.date).toLocaleDateString()}</span>
                      {transaction.merchantName && (
                        <>
                          <span>•</span>
                          <span>{transaction.merchantName}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Badge className={getCategoryColor(transaction.category)}>{transaction.category}</Badge>
                  <div
                    className={`text-lg font-semibold ${
                      transaction.type === "income" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              </div>
            )
          })}

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No transactions found matching your filters</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
