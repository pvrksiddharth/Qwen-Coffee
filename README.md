# Qwen-Coffee
Interactive Specialty Coffee Store

What Makes This Project Unique

Qwen-Coffee isn't just another e-commerce template - it's a hand-crafted specialty coffee store with delightful micro-interactions and a fully tested codebase. Here's what sets it apart:

Desktop Sparkle Magic

A custom tinny gold star particle system that follows your cursor across the page - built from scratch (no animation libraries for this one). It features realistic physics: velocity, gravity, fade-out lifecycles, and rotation per particle. Smartly gated to desktop only via a useIsDesktop hook, so mobile performance stays untouched, and capped at 120 particles to keep 60fps buttery-smooth.

Respectful Motion & Accessibility

All sparkle and hover animations automatically disable when a user has prefers-reduced-motion enabled. Motion should delight, never discomfort.

Genuinely Tested (Not Just "It Works on My Machine")

55 unit tests across 5 suites using Vitest + Testing Library, covering:
Cart logic - add/remove/quantity edge cases
Filter engine - search, category, and price predicates
Sparkle physics - particle lifecycle, spawn caps, and decay math tested as pure functions
UI components - rendered behavior verified with real DOM assertions
Plus clean TypeScript (tsc --noEmit passes) - no suppressed errors, no any shortcuts.

Smooth UI Engineering

Custom easing curves and refined transition timing throughout cards, buttons, and hover states - the kind of polish you feel before you notice it. Built with React 18 + Vite + Tailwind CSS v4 + Framer Motion.

Modern Full Stack of Interactions

Drag-and-drop powered by dnd-kit, celebratory canvas-confetti moments, live analytics charts with Recharts, and Supabase integration for real data - all in a snappy Vite dev experience.
