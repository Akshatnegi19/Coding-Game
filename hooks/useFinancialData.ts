"use client";

import { useState, useCallback, useMemo } from "react";
import {
  AccountType,
  TransactionType,
  TransactionCategory,
} from "../types/financial";

import type {
  Account,
  Transaction,
  Budget,
  FinancialGoal,
  FinancialMetrics,
  CategorySpending,
  TransactionFilter,
} from "../types/financial";

export enum GoalStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
  PAUSED = "paused",
}

import * as React from "react";

// Generic hook for async fetching
export function useAsyncData<T>(
  fetchFn: () => Promise<T>,
  dependencies: React.DependencyList = []
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, dependencies);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// ✅ MAIN HOOK
export function useFinancialData() {
  const [accounts] = useState<Account[]>([
    {
      id: "1",
      name: "Main Checking",
      type: AccountType.CHECKING, // ✅ use enum
      balance: 5420.5,
      currency: "USD",
      isActive: true,
      institution: "Chase Bank",
      createdAt: new Date("2023-01-15"),
      updatedAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      name: "Emergency Savings",
      type: AccountType.SAVINGS, // ✅ use enum
      balance: 15000.0,
      currency: "USD",
      isActive: true,
      institution: "Ally Bank",
      interestRate: 4.5,
      createdAt: new Date("2023-01-15"),
      updatedAt: new Date("2024-01-15"),
    },
    {
      id: "3",
      name: "Credit Card",
      type: AccountType.CREDIT_CARD, // ✅ use enum
      balance: -2340.75,
      currency: "USD",
      isActive: true,
      institution: "Capital One",
      creditLimit: 10000,
      createdAt: new Date("2023-01-15"),
      updatedAt: new Date("2024-01-15"),
    },
  ]);

  const [transactions] = useState<Transaction[]>([
    {
      id: "1",
      accountId: "1",
      amount: -85.5,
      type: TransactionType.EXPENSE, // ✅ enum
      category: TransactionCategory.FOOD,
      description: "Grocery Store",
      date: new Date("2024-01-14"),
      isRecurring: false,
      merchantName: "Whole Foods",
      createdAt: new Date("2024-01-14"),
      updatedAt: new Date("2024-01-14"),
    },
    {
      id: "2",
      accountId: "1",
      amount: 3200.0,
      type: TransactionType.INCOME, // ✅ enum
      category: TransactionCategory.SALARY,
      description: "Monthly Salary",
      date: new Date("2024-01-01"),
      isRecurring: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: "3",
      accountId: "3",
      amount: -120.0,
      type: TransactionType.EXPENSE, // ✅ enum
      category: TransactionCategory.UTILITIES,
      description: "Electric Bill",
      date: new Date("2024-01-10"),
      isRecurring: true,
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-10"),
    },
  ]);

  const [budgets] = useState<Budget[]>([
    {
      id: "1",
      name: "Food Budget",
      category: TransactionCategory.FOOD,
      limit: 500,
      spent: 285.5,
      period: "monthly",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-01-31"),
      isActive: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      name: "Entertainment",
      category: TransactionCategory.ENTERTAINMENT,
      limit: 200,
      spent: 150.0,
      period: "monthly",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-01-31"),
      isActive: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-15"),
    },
  ]);

  const [goals] = useState<FinancialGoal[]>([
    {
      id: "1",
      name: "Emergency Fund",
      description: "6 months of expenses",
      targetAmount: 20000,
      currentAmount: 15000,
      targetDate: new Date("2024-06-01"),
      status: GoalStatus.ACTIVE,
      category: "savings",
      priority: "high",
      createdAt: new Date("2023-01-01"),
      updatedAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      name: "Vacation Fund",
      description: "Europe trip",
      targetAmount: 5000,
      currentAmount: 2500,
      targetDate: new Date("2024-08-01"),
      status: GoalStatus.ACTIVE,
      category: "travel",
      priority: "medium",
      createdAt: new Date("2023-06-01"),
      updatedAt: new Date("2024-01-15"),
    },
  ]);

  const financialMetrics = useMemo<FinancialMetrics>(() => {
    const totalAssets = accounts
      .filter((account) => account.balance > 0)
      .reduce((sum, account) => sum + account.balance, 0);

    const totalLiabilities = Math.abs(
      accounts.filter((account) => account.balance < 0).reduce((sum, account) => sum + account.balance, 0)
    );

    const monthlyIncome = transactions
      .filter((t) => t.type === TransactionType.INCOME && t.date.getMonth() === new Date().getMonth())
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = Math.abs(
      transactions
        .filter((t) => t.type === TransactionType.EXPENSE && t.date.getMonth() === new Date().getMonth())
        .reduce((sum, t) => sum + t.amount, 0)
    );

    return {
      totalAssets,
      totalLiabilities,
      netWorth: totalAssets - totalLiabilities,
      monthlyIncome,
      monthlyExpenses,
      savingsRate: monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0,
      debtToIncomeRatio: monthlyIncome > 0 ? (totalLiabilities / monthlyIncome) * 100 : 0,
    };
  }, [accounts, transactions]);

  const filterTransactions = useCallback(
    <T extends Transaction>(transactions: T[], filter: TransactionFilter): T[] => {
      return transactions.filter(filter);
    },
    []
  );

  const categorySpending = useMemo<CategorySpending[]>(() => {
    const currentMonth = new Date().getMonth();
    const monthlyExpenses = transactions.filter(
      (t) => t.type === TransactionType.EXPENSE && t.date.getMonth() === currentMonth
    );

    const totalExpenses = monthlyExpenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const categoryMap = new Map<TransactionCategory, { amount: number; count: number }>();

    monthlyExpenses.forEach((transaction) => {
      const current = categoryMap.get(transaction.category) || { amount: 0, count: 0 };
      categoryMap.set(transaction.category, {
        amount: current.amount + Math.abs(transaction.amount),
        count: current.count + 1,
      });
    });

    return Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        amount: data.amount,
        percentage: totalExpenses > 0 ? (data.amount / totalExpenses) * 100 : 0,
        transactionCount: data.count,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const getAccountsByType = useCallback(
    (type: AccountType): Account[] => {
      return accounts.filter((account) => account.type === type);
    },
    [accounts]
  );

  function calculateMetric(type: "total_balance"): number;
  function calculateMetric(type: "account_count"): number;
  function calculateMetric(type: "average_balance"): number;
  function calculateMetric(type: string): number {
    switch (type) {
      case "total_balance":
        return accounts.reduce((sum, account) => sum + account.balance, 0);
      case "account_count":
        return accounts.length;
      case "average_balance":
        return accounts.length > 0
          ? accounts.reduce((sum, account) => sum + account.balance, 0) / accounts.length
          : 0;
      default:
        return 0;
    }
  }

  return {
    accounts,
    transactions,
    budgets,
    goals,
    financialMetrics,
    categorySpending,
    filterTransactions,
    getAccountsByType,
    calculateMetric,
  } as const;
}

// ✅ Type guards still work:
export function isExpenseTransaction(
  transaction: Transaction
): transaction is Transaction & { type: TransactionType.EXPENSE } {
  return transaction.type === TransactionType.EXPENSE;
}

export function isIncomeTransaction(
  transaction: Transaction
): transaction is Transaction & { type: TransactionType.INCOME } {
  return transaction.type === TransactionType.INCOME;
}

export function isCreditCardAccount(account: Account): account is Account & { creditLimit: number } {
  return account.type === AccountType.CREDIT_CARD;
}
