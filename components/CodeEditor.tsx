"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Textarea } from "./ui/textarea"
import { Play, RotateCcw, Lightbulb, Copy, Check, Zap, Clock, BookOpen } from "lucide-react"

interface CodeEditorProps {
  code: string
  onChange: (code: string) => void
  onRun: () => void
  onSubmit: () => void
  onReset: () => void
  onHint: () => void
  onShowSolution: () => void // Add this new prop
  isExecuting: boolean
  canSubmit: boolean
  timeRemaining?: number | null
  hintsUsed: number
  maxHints: number
}

export function CodeEditor({
  code,
  onChange,
  onRun,
  onSubmit,
  onReset,
  onHint,
  onShowSolution, // Add this
  isExecuting,
  canSubmit,
  timeRemaining,
  hintsUsed,
  maxHints,
}: CodeEditorProps) {
  const [copied, setCopied] = useState(false)
  const [fontSize, setFontSize] = useState(14)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy code:", err)
    }
  }, [code])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getTimeColor = (seconds: number): string => {
    if (seconds > 60) return "text-green-600"
    if (seconds > 30) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Zap className="h-5 w-5 text-blue-600" />
            <span>Code Editor</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
              {timeRemaining != null && (
                <Badge variant="outline" className={`${getTimeColor(timeRemaining)} border-current`}>
                  <Clock className="h-3 w-3 mr-1" />
                  {formatTime(timeRemaining)}
                </Badge>
              )}
            <Badge variant="outline">
              Hints: {hintsUsed}/{maxHints}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRun}
              disabled={isExecuting}
              className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
            >
              <Play className="h-4 w-4 mr-1" />
              {isExecuting ? "Running..." : "Run Tests"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onSubmit}
              disabled={!canSubmit || isExecuting}
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
            >
              Submit Solution
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onHint}
              disabled={hintsUsed >= maxHints}
              className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-200"
            >
              <Lightbulb className="h-4 w-4 mr-1" />
              Hint
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onShowSolution}
              className="bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200"
            >
              <BookOpen className="h-4 w-4 mr-1" />
              Solution
            </Button>

            <Button variant="outline" size="sm" onClick={handleCopy} className="bg-gray-50 hover:bg-gray-100">
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 relative">
          <Textarea
            value={code}
            onChange={(e) => onChange(e.target.value)}
            className="h-full min-h-[400px] font-mono resize-none"
            style={{ fontSize: `${fontSize}px` }}
            placeholder="Write your code here..."
            spellCheck={false}
          />

          {/* Line numbers overlay */}
          <div className="absolute left-3 top-3 text-gray-400 text-sm font-mono pointer-events-none select-none">
            {code.split("\n").map((_, index) => (
              <div key={index} style={{ height: "1.5em", fontSize: `${fontSize}px` }}>
                {index + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Editor Settings */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span>JavaScript</span>
            <span>•</span>
            <span>{code.split("\n").length} lines</span>
            <span>•</span>
            <span>{code.length} characters</span>
          </div>

          <div className="flex items-center space-x-2">
            <label htmlFor="font-size" className="text-xs">
              Font Size:
            </label>
            <select
              id="font-size"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="text-xs border rounded px-1 py-0.5"
            >
              <option value={12}>12px</option>
              <option value={14}>14px</option>
              <option value={16}>16px</option>
              <option value={18}>18px</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
