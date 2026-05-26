---
name: Wager
colors:
  # Light mode
  primary: "#4f46e5"
  on-primary: "#ffffff"
  primary-container: "#eef2ff"
  primary-hover: "#4338ca"
  primary-muted: "#a5b4fc"
  secondary: "#64748b"
  on-secondary: "#ffffff"
  secondary-container: "#f1f5f9"
  success: "#10b981"
  on-success: "#ffffff"
  success-container: "#d1fae5"
  success-content: "#065f46"
  warning: "#f59e0b"
  on-warning: "#ffffff"
  warning-container: "#fef3c7"
  warning-content: "#92400e"
  danger: "#ef4444"
  on-danger: "#ffffff"
  danger-container: "#fee2e2"
  danger-content: "#991b1b"
  
  # Light neutrals
  bg: "#ffffff"
  surface: "#f9fafb"
  border: "#e5e7eb"
  muted: "#6b7280"
  text: "#1f2937"
  heading: "#111827"
  footer-bg: "#f3f4f6"

  # Dark mode
  primary-dark: "#6366f1"
  on-primary-dark: "#ffffff"
  primary-container-dark: "#1e1b4b"
  primary-hover-dark: "#818cf8"
  secondary-dark: "#94a3b8"
  on-secondary-dark: "#020617"
  secondary-container-dark: "#1e293b"
  success-dark: "#34d399"
  on-success-dark: "#022c22"
  success-container-dark: "#064e3b"
  success-content-dark: "#6ee7b7"
  warning-dark: "#fbbf24"
  on-warning-dark: "#451a03"
  warning-container-dark: "#78350f"
  warning-content-dark: "#fde68a"
  danger-dark: "#f87171"
  on-danger-dark: "#450a0a"
  danger-container-dark: "#7f1d1d"
  danger-content-dark: "#fca5a5"

  # Dark neutrals
  bg-dark: "#0f172a"
  surface-dark: "#1e293b"
  border-dark: "#334155"
  muted-dark: "#94a3b8"
  text-dark: "#e2e8f0"
  heading-dark: "#f1f5f9"
  footer-bg-dark: "#0f172a"

typography:
  h1:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontWeight: 800
    fontSize: 2.25rem
    lineHeight: 1.2
  h2:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontWeight: 700
    fontSize: 1.5rem
    lineHeight: 1.3
  h3:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontWeight: 600
    fontSize: 1.25rem
    lineHeight: 1.4
  body-lg:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontWeight: 400
    fontSize: 1.125rem
    lineHeight: 1.6
  body-md:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontWeight: 400
    fontSize: 1rem
    lineHeight: 1.6
  body-sm:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontWeight: 400
    fontSize: 0.875rem
    lineHeight: 1.5
  caption:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontWeight: 500
    fontSize: 0.75rem
    lineHeight: 1.5
    letterSpacing: 0.025em
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  "2xl": 48px
  "3xl": 64px
rounded:
  none: 0
  sm: 4px
  md: 8px
  lg: 12px
  full: 9999px
---

# Wager Design System

## Overview
A modern, trustworthy design for a social accountability app. The palette combines a confident indigo primary with functional greens/ambers/reds for status semantics. Typography uses system fonts for zero-load performance. Full dark mode support via `dark:` class prefix.

## Colors — Light Mode
- **Primary (#4f46e5):** Indigo. Confidence, trust, action. Buttons, nav, links.
- **Secondary (#64748b):** Slate. Secondary actions, borders, supporting text.
- **Success (#10b981):** Emerald. Resolved bets, positive outcomes.
- **Warning (#f59e0b):** Amber. Pending items, attention needed.
- **Danger (#ef4444):** Red. Cancelled wagers, destructive actions.

## Colors — Dark Mode
Dark variants use the `-dark` suffix. Primary shifts slightly brighter (`#6366f1`) for contrast on dark backgrounds. Semantic colors use brighter shades (`-dark` suffix). Background flips to `#0f172a` (slate-900), surfaces to `#1e293b` (slate-800).

### Status Badge Mapping (Both Modes)
| Status | Light (bg/text) | Dark (bg/text) |
|--------|-----------------|-----------------|
| PENDING | `warning-container` / `warning-content` | `warning-container-dark` / `warning-content-dark` |
| SUBMITTED | `primary-container` / `primary-hover` | `primary-container-dark` / `primary-hover-dark` |
| VOTING | `secondary-container` / `secondary` | `secondary-container-dark` / `secondary-dark` |
| RESOLVED | `success-container` / `success-content` | `success-container-dark` / `success-content-dark` |
| CANCELLED | `danger-container` / `danger-content` | `danger-container-dark` / `danger-content-dark` |

## Typography
System font stack. Zero network requests. Headings use 800/700/600 weights. Body at 1rem/1.6 line-height.

| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| h1 | 2.25rem | 800 | Page titles |
| h2 | 1.5rem | 700 | Section headings |
| h3 | 1.25rem | 600 | Card titles |
| body-lg | 1.125rem | 400 | Featured text |
| body-md | 1rem | 400 | Body content |
| body-sm | 0.875rem | 400 | Metadata |
| caption | 0.75rem | 500 | Badges, labels |

## Spacing
| Token | Value |
|-------|-------|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| 2xl | 48px |
| 3xl | 64px |

## Rounded
| Token | Value | Usage |
|-------|-------|-------|
| none | 0 | Full-bleed |
| sm | 4px | Inputs, form elements |
| md | 8px | Cards, buttons, containers |
| lg | 12px | Modals, dialogs |
| full | 9999px | Badges, pills |

## Usage Guidelines
- Apply dark mode with `dark:` prefix: `bg-white dark:bg-bg-dark text-neutral-text dark:text-text-dark`
- Status badges: `bg-warning-container dark:bg-warning-container-dark text-warning-content dark:text-warning-content-dark`
- Buttons: primary CTA uses `bg-primary dark:bg-primary-dark text-on-primary`
- Cards: `bg-white dark:bg-surface-dark border-border dark:border-border-dark`
- Inputs: `border-border dark:border-border-dark bg-white dark:bg-surface-dark text-text dark:text-text-dark`
