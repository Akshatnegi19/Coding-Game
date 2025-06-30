import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import type { LucideIcon } from "lucide-react"

// Generic component with proper TypeScript constraints
interface MetricCardProps<T extends string | number> {
  title: string
  value: T
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
    period: string
  }
  formatter?: (value: T) => string
  className?: string
  variant?: "default" | "success" | "warning" | "danger"
}

// Default formatters with proper typing
const defaultFormatters = {
  currency: (value: number): string =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value),
  percentage: (value: number): string => `${value.toFixed(1)}%`,
  number: (value: number): string => value.toLocaleString(),
  string: (value: string): string => value,
} as const

// Type-safe formatter selection
type FormatterKey = keyof typeof defaultFormatters

export function MetricCard<T extends string | number>({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  formatter,
  className = "",
  variant = "default",
}: MetricCardProps<T>) {
  // Type-safe value formatting
  const formatValue = (val: T): string => {
    if (formatter) return formatter(val)

    if (typeof val === "number") {
      return defaultFormatters.number(val)
    }

    return defaultFormatters.string(val as string)
  }

  const getVariantStyles = (variant: MetricCardProps<T>["variant"]) => {
    const styles = {
      default: "border-gray-200",
      success: "border-green-200 bg-green-50",
      warning: "border-yellow-200 bg-yellow-50",
      danger: "border-red-200 bg-red-50",
    } as const

    return styles[variant || "default"]
  }

  const getTrendColor = (isPositive: boolean): string => {
    return isPositive ? "text-green-600" : "text-red-600"
  }

  return (
    <Card className={`${getVariantStyles(variant)} ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{formatValue(value)}</div>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        {trend && (
          <div className="flex items-center mt-2">
            <Badge variant="outline" className={`${getTrendColor(trend.isPositive)} border-current`}>
              {trend.isPositive ? "+" : ""}
              {trend.value.toFixed(1)}%
            </Badge>
            <span className="text-xs text-gray-500 ml-2">vs {trend.period}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Specialized metric cards with pre-configured formatters
export const CurrencyMetricCard = (props: Omit<MetricCardProps<number>, "formatter">) => (
  <MetricCard {...props} formatter={defaultFormatters.currency} />
)

export const PercentageMetricCard = (props: Omit<MetricCardProps<number>, "formatter">) => (
  <MetricCard {...props} formatter={defaultFormatters.percentage} />
)
