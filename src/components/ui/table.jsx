import * as React from "react"
import { cn } from "@/lib/utils"

const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto rounded-md border mb-2">
    <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
  </div>
))
Table.displayName = "Table"

const createTableComponent = (Tag, baseClasses, displayName) =>
  React.forwardRef(({ className, ...props }, ref) => (
    <Tag ref={ref} className={cn(baseClasses, className)} {...props} />
  ))

const TableHeader = createTableComponent("thead", "bg-muted/50", "TableHeader")
const TableBody = createTableComponent("tbody", "[&_tr:last-child]:border-0", "TableBody")
const TableFooter = createTableComponent(
  "tfoot",
  "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
  "TableFooter"
)
const TableRow = createTableComponent(
  "tr",
  "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
  "TableRow"
)
const TableHead = createTableComponent(
  "th",
  "h-10 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&:has([role=checkbox])]:pl-4",
  "TableHead"
)
const TableCell = createTableComponent(
  "td",
  "px-4 py-3 align-middle [&:has([role=checkbox])]:pr-0 [&:has([role=checkbox])]:pl-4",
  "TableCell"
)
const TableCaption = createTableComponent("caption", "mt-4 text-sm text-muted-foreground", "TableCaption")

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
