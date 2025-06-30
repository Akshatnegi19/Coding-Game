"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import { CheckCircle, XCircle, AlertTriangle, Target, Zap } from "lucide-react"
import type { TestResult, Challenge } from "../types/game"

interface TestResultsProps {
  results: TestResult[]
  challenge: Challenge | null
  isExecuting: boolean
}

export function TestResults({ results, challenge, isExecuting }: TestResultsProps) {
  if (!challenge) return null

  const passedTests = results.filter((r) => r.passed).length
  const totalTests = challenge.testCases.length
  const successRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0

  const getResultIcon = (passed: boolean, hasError: boolean) => {
    if (hasError) return <AlertTriangle className="h-4 w-4 text-orange-500" />
    return passed ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />
  }

  const formatOutput = (output: any): string => {
    if (output === null) return "null"
    if (output === undefined) return "undefined"
    if (typeof output === "string") return `"${output}"`
    return String(output)
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Target className="h-5 w-5 text-green-600" />
            <span>Test Results</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge
              variant="outline"
              className={successRate === 100 ? "bg-green-50 text-green-700 border-green-200" : ""}
            >
              {passedTests}/{totalTests} Passed
            </Badge>
          </div>
        </div>

        {results.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Success Rate</span>
              <span>{successRate.toFixed(1)}%</span>
            </div>
            <Progress value={successRate} className="h-2" />
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {isExecuting && (
          <div className="flex items-center justify-center py-8 text-gray-500">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
            <span>Running tests...</span>
          </div>
        )}

        {!isExecuting && results.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Click "Run Tests" to see results</p>
          </div>
        )}

        {!isExecuting && results.length > 0 && (
          <div className="space-y-3">
            {challenge.testCases.map((testCase, index) => {
              const result = results.find((r) => r.testCaseId === testCase.id)

              if (!result) return null

              return (
                <div
                  key={testCase.id}
                  className={`p-4 rounded-lg border ${
                    result.passed ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getResultIcon(result.passed, !!result.error)}
                      <span className="font-medium text-sm">Test {index + 1}</span>
                      {!testCase.isHidden && (
                        <Badge variant="outline" className="text-xs">
                          {result.executionTime.toFixed(2)}ms
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-3">{testCase.description}</p>

                  {!testCase.isHidden && (
                    <div className="space-y-2 text-xs">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium text-gray-600">Expected:</span>
                          <div className="bg-white p-2 rounded border font-mono">
                            {formatOutput(result.expectedOutput)}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Actual:</span>
                          <div className={`p-2 rounded border font-mono ${result.passed ? "bg-white" : "bg-red-50"}`}>
                            {result.error ? (
                              <span className="text-red-600">{result.error}</span>
                            ) : (
                              formatOutput(result.actualOutput)
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {testCase.isHidden && (
                    <div className="text-xs text-gray-500 italic">Hidden test case - details not shown</div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {results.length > 0 && successRate === 100 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-green-800 mb-1">All Tests Passed! 🎉</h3>
            <p className="text-sm text-green-700">Great job! Your solution is correct.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
