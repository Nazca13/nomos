# Implementation Plan: NOMOS Core System

## Overview

This implementation plan converts the comprehensive NOMOS design into discrete TypeScript coding tasks. The system comprises three main modules (AI Command Center, Bento Dashboard, Smart Ledger) built on Next.js 15+ with an AI-first ingestion pipeline. Tasks are sequenced to build foundational infrastructure first, then implement core features, followed by testing and optimization.

## Tasks

- [ ] 1. Project foundation and core infrastructure
  - [ ] 1.1 Set up TypeScript project structure and dependencies
    - Install and configure Vercel AI SDK, Prisma 7 with PostgreSQL adapter
    - Configure Next.js 15+ with React Server Components
    - Set up Tailwind CSS with Shadcn UI components
    - Create directory structure: `/src/components`, `/src/lib`, `/src/types`, `/src/app`
    - _Requirements: 15.1, 15.2_

  - [ ] 1.2 Initialize database schema and core types
    - Deploy existing Prisma schema with performance indexes
    - Create TypeScript interfaces for Transaction, Account, Budget, AiInsight entities
    - Implement Zod validation schemas for all database operations
    - Configure edge-compatible Prisma connection with @prisma/adapter-pg
    - _Requirements: 15.1, 15.3, 15.4, 16.2_

  - [ ]* 1.3 Write property test for database schema consistency
    - **Property 5: Database Transaction Persistence**
    - **Validates: Requirements 2.4**
    - Test that confirmed transactions create valid Transaction_Entity records
    - _Requirements: 2.4_

  - [ ] 1.4 Implement Midnight Tech design system foundation
    - Create CSS variables for Midnight Tech color palette (zinc-950 background, zinc-900 cards)
    - Configure typography rules: Sans-serif for UI text, Monospace for financial data
    - Implement `.font-financial` utility class with tabular-nums for layout stability
    - Set up semantic color tokens: emerald for income, rose for expenses, cyan for AI elements
    - _Requirements: 13.1, 13.2, 13.3, 14.1, 14.2, 14.3_

- [ ] 2. AI integration layer implementation
  - [ ] 2.1 Create LLM Gateway with streaming support
    - Implement `/api/ai/chat/route.ts` with Vercel AI SDK streaming
    - Configure OpenAI GPT-4 integration with function calling support
    - Add timeout handling and error recovery for AI requests
    - Implement request queuing and rate limiting mechanisms
    - _Requirements: 1.1, 3.1, 3.4, 17.1, 17.4_

  - [ ]* 2.2 Write property test for AI response latency
    - **Property 2: Entity Extraction Performance Budget**
    - **Validates: Requirements 1.4**
    - Test that entity extraction completes within 2.5 seconds
    - _Requirements: 1.4, 17.2_

  - [ ] 2.3 Implement Entity Extractor with schema validation
    - Create entity extraction logic using Zod schemas and function calling
    - Implement confidence scoring and clarification request handling
    - Add support for currency format normalization (150k, 3M, etc.)
    - Integrate with user account and category history for context awareness
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 22.3, 23.1, 23.2_

  - [ ]* 2.4 Write property test for entity extraction schema consistency
    - **Property 1: Entity Extraction Schema Consistency**
    - **Validates: Requirements 1.2**
    - Test that all successful extractions return required JSON fields
    - _Requirements: 1.2_

  - [ ]* 2.5 Write property test for currency format normalization
    - **Property 3: Currency Format Normalization**
    - **Validates: Requirements 1.5**
    - Test parsing of various currency formats (150k, 3000000, etc.)
    - _Requirements: 1.5_

- [ ] 3. Checkpoint - Ensure AI infrastructure tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. AI Command Center module implementation
  - [ ] 4.1 Create Stream Chat interface with real-time streaming
    - Implement conversational UI with chronological message history
    - Add progressive token rendering for streaming AI responses
    - Include timestamp display with monospace formatting
    - Implement markdown formatting support for AI responses
    - _Requirements: 3.1, 3.2, 3.3, 3.5, 13.2_

  - [ ] 4.2 Implement Confirmation Card component
    - Create interactive transaction approval UI component
    - Display extracted data in scannable card format with currency formatting
    - Add Confirm/Cancel action buttons with database persistence
    - Implement success/error messaging after confirmation
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.6, 13.3_

  - [ ]* 4.3 Write property test for confirmation workflow triggering
    - **Property 4: Confirmation Workflow Triggering**
    - **Validates: Requirements 2.1**
    - Test that successful extractions trigger Confirmation_Card rendering
    - _Requirements: 2.1_

  - [ ]* 4.4 Write property test for cancellation side-effect prevention
    - **Property 6: Cancellation Side-Effect Prevention**
    - **Validates: Requirements 2.5**
    - Test that cancelled transactions don't create database mutations
    - _Requirements: 2.5_

  - [ ] 4.5 Create Predictive Canvas with financial forecasting
    - Implement future balance projection using the forecast formula
    - Create time-series line chart with Recharts visualization
    - Add hypothetical expense overlay for "what-if" scenarios
    - Calculate lifestyle inflation and spending pattern analysis
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [ ] 5. Core transaction and account management
  - [ ] 5.1 Implement atomic transaction creation with balance synchronization
    - Create transaction persistence logic with Prisma database transactions
    - Implement atomic account balance updates (increment/decrement)
    - Add transaction rollback handling for balance validation errors
    - Include audit trail preservation with rawPrompt field
    - _Requirements: 2.4, 12.1, 12.2, 12.5, 18.1, 18.2, 18.4_

  - [ ]* 5.2 Write property test for expense balance synchronization
    - **Property 12: Expense Balance Synchronization**
    - **Validates: Requirements 18.1**
    - Test that expense transactions correctly decrease account balances
    - _Requirements: 18.1_

  - [ ]* 5.3 Write property test for income balance synchronization
    - **Property 13: Income Balance Synchronization**
    - **Validates: Requirements 18.2**
    - Test that income transactions correctly increase account balances
    - _Requirements: 18.2_

  - [ ] 5.4 Implement account selection context awareness
    - Create payment method keyword matching against user accounts
    - Add account usage frequency calculation for smart defaults
    - Implement disambiguation UI for ambiguous account references
    - Support common payment method abbreviations (Gopay, BCA, cash)
    - _Requirements: 23.1, 23.2, 23.3, 23.4, 23.5_

- [ ] 6. Bento Dashboard grid layout and widgets
  - [ ] 6.1 Create responsive Bento grid layout system
    - Implement CSS Grid layout with explicit grid-template-areas
    - Configure responsive design: desktop grid, mobile single-column stack
    - Apply Midnight Tech theme colors and spacing
    - Set up React Query for reactive widget updates
    - _Requirements: 5.1, 5.2, 5.4, 5.5, 19.1_

  - [ ] 6.2 Implement Vault Widget with net worth aggregation
    - Create net worth calculation by summing account balances
    - Display prominent monetary value with tabular-nums formatting
    - Add mini sparkline chart for 30-day trend visualization
    - Implement real-time updates with 500ms performance target
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 13.3_

  - [ ]* 6.3 Write property test for net worth aggregation accuracy
    - **Property 7: Net Worth Aggregation Accuracy**
    - **Validates: Requirements 6.1**
    - Test that displayed net worth equals sum of all account balances
    - _Requirements: 6.1_

  - [ ]* 6.4 Write property test for real-time balance update performance
    - **Property 8: Real-Time Balance Update Performance**
    - **Validates: Requirements 6.5**
    - Test that balance updates complete within 500ms
    - _Requirements: 6.5_

  - [ ] 6.5 Create Quick Command Bar terminal interface
    - Implement single-line terminal-style input (~/nomos_ >)
    - Integrate with LLM Gateway for shorthand command processing
    - Add compact toast notifications for command results
    - Support shorthand syntax like "out 50k food bca"
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ] 6.6 Implement Budget Radar with spending limits monitoring
    - Create circular radial progress indicator for budget tracking
    - Support daily and monthly budget periods
    - Implement color-coded alerts: cyan normal, rose >80% spent
    - Calculate spentAmount by aggregating transactions by category and period
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ] 6.7 Create Cashflow Matrix with income/expense comparison
    - Implement side-by-side grouped bar chart visualization
    - Calculate monthly income and expense aggregations
    - Apply semantic color coding: emerald for income, rose for expenses
    - Add warning indicators for negative net cash flow
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 7. Smart Ledger table interface and data management
  - [ ] 7.1 Create high-performance virtualized transaction table
    - Implement @tanstack/react-table with virtualized rows
    - Display columns: timestamp, description, category, account, amount, type
    - Apply conditional text coloring: emerald income, rose expenses
    - Configure table to handle thousands of transaction entries
    - _Requirements: 10.1, 10.2, 10.5, 13.2_

  - [ ]* 7.2 Write property test for table virtualization performance
    - **Property 9: Table Virtualization Performance**
    - **Validates: Requirements 10.1**
    - Test that table renders efficiently with thousands of entries
    - _Requirements: 10.1_

  - [ ] 7.3 Implement inline editing for transaction fields
    - Add click-to-edit functionality for category and amount columns
    - Create input validation and database persistence on edit complete
    - Handle Enter key and click-outside to complete edits
    - Include error handling and rollback for failed updates
    - _Requirements: 10.3, 10.4, 18.3_

  - [ ]* 7.4 Write property test for inline edit persistence
    - **Property 10: Inline Edit Persistence**
    - **Validates: Requirements 10.4**
    - Test that completed edits persist correctly to database
    - _Requirements: 10.4_

  - [ ] 7.5 Create global transaction search filter
    - Implement real-time search across description, category, account fields
    - Add debounced filtering (300ms delay) for performance optimization
    - Display filtered result count in "Showing X of Y transactions" format
    - Support case-insensitive matching across multiple fields
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [ ]* 7.6 Write property test for global filter matching
    - **Property 11: Global Filter Matching**
    - **Validates: Requirements 11.2**
    - Test that search matches across all specified fields correctly
    - _Requirements: 11.2_

- [ ] 8. Checkpoint - Ensure core module tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Advanced features and automation
  - [ ] 9.1 Implement transaction category autocomplete system
    - Create autocomplete dropdown with historical category suggestions
    - Rank suggestions by usage frequency (most used first)
    - Integrate with Entity Extractor for AI-driven category learning
    - Support both predefined and custom user-defined categories
    - _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5_

  - [ ]* 9.2 Write property test for autocomplete frequency ranking
    - **Property 14: Autocomplete Frequency Ranking**
    - **Validates: Requirements 22.2**
    - Test that suggestions are ordered by usage frequency
    - _Requirements: 22.2_

  - [ ] 9.3 Create AI insight generation system
    - Implement spending anomaly detection using statistical analysis
    - Generate automated suggestions for budget overruns
    - Create warning system for budget limit thresholds (90% spent)
    - Display unread insights as notification badges in UI header
    - _Requirements: 21.1, 21.2, 21.3, 21.4, 21.5_

  - [ ] 9.4 Implement budget period auto-rollover system
    - Create scheduled background job for daily budget period checks
    - Automatically generate new budget periods with reset spentAmount
    - Preserve historical budget records for trend analysis
    - Handle soft-delete logic to prevent rollover for deleted budgets
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5_

- [ ] 10. Data export and user experience features  
  - [ ] 10.1 Create CSV export functionality for transaction history
    - Implement server-side CSV generation with proper column formatting
    - Include all required fields: timestamp (ISO 8601), description, category, account, amount, type, rawPrompt
    - Apply CSV injection prevention by sanitizing text fields
    - Respect current table filters in export output
    - _Requirements: 24.1, 24.2, 24.3, 24.4, 24.5_

  - [ ]* 10.2 Write property test for CSV export column consistency
    - **Property 15: CSV Export Column Consistency**
    - **Validates: Requirements 24.2**
    - Test that exported CSV contains all specified columns correctly
    - _Requirements: 24.2_

  - [ ] 10.3 Implement dark/light mode theme system
    - Set Midnight Tech (dark) as default theme on first load
    - Create theme toggle control in application header
    - Implement light mode color palette inversion while preserving semantic colors
    - Persist user theme preference in browser localStorage
    - _Requirements: 25.1, 25.2, 25.3, 25.4, 25.5_

- [ ] 11. Security and multi-tenant isolation
  - [ ] 11.1 Implement strict multi-tenant data isolation
    - Add userId validation to all API routes before database queries
    - Include userId WHERE clause filters in all Prisma queries
    - Implement HTTP 403 Forbidden responses for unauthorized access attempts
    - Validate session tokens and handle expired/invalid sessions
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

  - [ ] 11.2 Add comprehensive input validation and security measures
    - Implement Zod validation for all API request bodies
    - Add SQL injection prevention in database queries
    - Prevent XSS attacks in user-generated content display
    - Sanitize CSV export data to prevent injection attacks
    - _Requirements: 15.4, 24.5_

- [ ] 12. Mobile responsiveness and accessibility
  - [ ] 12.1 Implement responsive mobile-first layouts
    - Configure Bento Dashboard vertical stacking on mobile (<768px)
    - Switch AI Command Center from horizontal to vertical split on mobile
    - Add horizontal scrolling for Smart Ledger table with sticky action columns
    - Reduce font sizes proportionally while maintaining 14px minimum
    - _Requirements: 19.1, 19.2, 19.3, 19.4_

  - [ ] 12.2 Ensure accessibility compliance
    - Implement minimum 44x44px touch targets for mobile interfaces
    - Add text labels alongside color-coded financial indicators
    - Test keyboard navigation for all interactive elements
    - Verify screen reader compatibility for financial data
    - _Requirements: 14.5, 19.5_

- [ ] 13. Performance optimization and monitoring
  - [ ] 13.1 Implement performance monitoring and optimization
    - Add AI response latency logging for performance metrics
    - Configure database connection pooling for edge compatibility
    - Implement React Query caching for dashboard widget data
    - Add loading states and error boundaries for better UX
    - _Requirements: 15.2, 15.3, 17.1, 17.3, 17.5_

  - [ ] 13.2 Add comprehensive error handling and recovery
    - Implement graceful AI service degradation for timeout/rate limits
    - Add automatic retry mechanisms with exponential backoff
    - Create user-friendly error messages without exposing system details
    - Implement offline mode detection and request queuing
    - _Requirements: 15.5, 17.4_

- [ ] 14. Integration testing and end-to-end validation
  - [ ]* 14.1 Write integration tests for AI-to-database pipeline
    - Test complete flow: natural language → extraction → confirmation → persistence
    - Validate multi-tenant isolation in realistic usage scenarios
    - Test concurrent transaction creation and balance synchronization
    - _Requirements: 1.1, 2.4, 16.2, 18.4_

  - [ ]* 14.2 Write integration tests for dashboard widget interactions
    - Test reactive updates when transactions affect widget data
    - Validate real-time balance synchronization across all widgets
    - Test responsive layout behavior on different screen sizes
    - _Requirements: 5.5, 6.5, 19.1_

- [ ] 15. Final checkpoint and production readiness
  - [ ] 15.1 Validate all requirements and run comprehensive test suite
    - Execute all property-based tests with 100+ iterations each
    - Verify all 25 requirements are implemented and testable
    - Test performance under realistic data volumes (1000+ transactions)
    - Validate security measures and multi-tenant isolation
    - _Requirements: ALL_

  - [ ] 15.2 Production deployment configuration
    - Configure environment variables for production database
    - Set up Vercel deployment with edge functions for AI endpoints
    - Configure monitoring and logging for production environment
    - Test production deployment with sample data
    - _Requirements: 15.1, 15.2, 17.5_

- [ ] 16. Final system validation
  - Ensure all tests pass, verify all 25 requirements are implemented, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional property-based tests that can be skipped for faster MVP delivery
- Each task references specific requirements for traceability and validation
- Checkpoints ensure incremental validation of complex integration points
- Property tests validate universal correctness properties as defined in the design document
- All monetary formatting uses tabular-nums for layout stability during real-time updates
- TypeScript strict mode is enforced throughout for type safety
- Multi-tenant isolation is validated at every data access point
- Performance budgets are enforced: AI responses <2.5s, balance updates <500ms
- The system defaults to Midnight Tech (dark) theme with semantic color coding

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["1.3", "1.4", "2.1"] },
    { "id": 2, "tasks": ["2.2", "2.3"] },
    { "id": 3, "tasks": ["2.4", "2.5", "4.1"] },
    { "id": 4, "tasks": ["4.2", "4.3", "4.4"] },
    { "id": 5, "tasks": ["4.5", "5.1"] },
    { "id": 6, "tasks": ["5.2", "5.3", "5.4", "6.1"] },
    { "id": 7, "tasks": ["6.2", "6.3", "6.4"] },
    { "id": 8, "tasks": ["6.5", "6.6", "6.7", "7.1"] },
    { "id": 9, "tasks": ["7.2", "7.3", "7.4"] },
    { "id": 10, "tasks": ["7.5", "7.6", "9.1"] },
    { "id": 11, "tasks": ["9.2", "9.3", "9.4", "10.1"] },
    { "id": 12, "tasks": ["10.2", "10.3", "11.1"] },
    { "id": 13, "tasks": ["11.2", "12.1", "12.2"] },
    { "id": 14, "tasks": ["13.1", "13.2"] },
    { "id": 15, "tasks": ["14.1", "14.2"] },
    { "id": 16, "tasks": ["15.1", "15.2"] }
  ]
}
```