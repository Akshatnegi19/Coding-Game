export interface ExecutionResult {
  success: boolean
  output: any
  error?: string
  executionTime: number
  memoryUsage?: number
}
