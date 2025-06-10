"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from 'lucide-react'

import { cn } from "@/lib/utils"

// Helper function to create dialog components (similar to createTableComponent)
const createDialogComponent = (Component, baseClasses, displayName) => {
  const DialogComponent = React.forwardRef(({ className, ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(baseClasses, className)}
      {...props}
    />
  ))
  DialogComponent.displayName = displayName || Component.displayName
  return DialogComponent
}

// Basic components
const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

// Components using the helper function
const DialogOverlay = createDialogComponent(
  DialogPrimitive.Overlay,
  "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  "DialogOverlay"
)

// Content needs special handling due to children and close button
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close
        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

// Simple div-based components using the helper pattern
const createDialogDivComponent = (baseClasses, displayName) => {
  const Component = ({ className, ...props }) => (
    <div className={cn(baseClasses, className)} {...props} />
  )
  Component.displayName = displayName
  return Component
}

const DialogHeader = createDialogDivComponent(
  "flex flex-col space-y-1.5 text-center sm:text-left",
  "DialogHeader"
)

const DialogFooter = createDialogDivComponent(
  "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
  "DialogFooter"
)

// Title and Description
const DialogTitle = createDialogComponent(
  DialogPrimitive.Title,
  "text-lg font-semibold leading-none tracking-tight",
  "DialogTitle"
)

const DialogDescription = createDialogComponent(
  DialogPrimitive.Description,
  "text-sm text-muted-foreground",
  "DialogDescription"
)

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
