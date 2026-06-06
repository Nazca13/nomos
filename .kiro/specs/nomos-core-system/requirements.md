# Requirements Document

## Introduction

NOMOS (from ancient Greek meaning "Order/Law") is an autonomous financial intelligence system that transforms unstructured financial data into structured, predictive, and meaningful financial insights through AI automation. Unlike traditional finance applications that demand manual discipline and create cognitive overload, NOMOS acts as an autonomous entity that converts chaos into order using AI as the primary data entry gateway.

The system is built on Next.js 15+ with TypeScript, Tailwind CSS, Shadcn UI, Prisma 7, PostgreSQL, and Vercel AI SDK. It employs an AI-first ingestion pipeline where AI serves not merely as a chatbot but as the main data entry point, processing unstructured input (casual text, voice notes, receipts) and converting it into structured database records.

## Glossary

- **NOMOS_System**: The complete autonomous financial intelligence application
- **AI_Command_Center**: The conversational engine interface with split-screen chat and predictive canvas
- **Stream_Chat**: The left column real-time streaming text interaction interface
- **Predictive_Canvas**: The right column proactive graphical visualization for future projections
- **Bento_Dashboard**: The main analytical page displaying financial status in modular grid layout
- **Smart_Ledger**: The high-density table interface for raw data management and manual auditing
- **LLM_Gateway**: The Vercel AI SDK integration layer for processing natural language input
- **Entity_Extractor**: The AI component that converts unstructured text into structured JSON format
- **Confirmation_Card**: The interactive UI component that displays extracted data before database commit
- **Vault_Widget**: The 2x2 Bento grid component displaying total net worth
- **Quick_Command_Bar**: The 2x1 Bento grid component with single-line AI input
- **Budget_Radar**: The 1x2 Bento grid component showing budget limit monitor
- **Cashflow_Matrix**: The 2x2 Bento grid component comparing inflows and outflows
- **Forecast_Engine**: The mathematical predictive model for future balance projections
- **Transaction_Entity**: Database record representing a single financial transaction
- **Account_Entity**: Database record representing a financial account (bank, e-wallet, cash)
- **Budget_Entity**: Database record representing spending limits per category
- **User_Session**: Authenticated user context with security token for tenant isolation
- **Tabular_Nums**: CSS font-variant-numeric setting preventing layout shifts in numeric displays
- **Midnight_Tech_Theme**: The dark high-contrast design system with functional neon accents

## Requirements

### Requirement 1: AI-Powered Natural Language Financial Input

**User Story:** As a user, I want to input financial transactions using casual natural language, so that I can record expenses without manual form filling.

#### Acceptance Criteria

1. WHEN a user submits casual text input like "I just transferred 150k to Sipa for lunch split using Gopay", THE Entity_Extractor SHALL parse the text and extract structured financial entities (amount, recipient, category, payment method)
2. THE Entity_Extractor SHALL return a JSON object containing at minimum: amount (numeric), description (string), category (string), account identifier (string), and transaction type (INCOME or EXPENSE)
3. WHEN the Entity_Extractor cannot confidently extract required fields from input text, THE AI_Command_Center SHALL request clarification from the user before proceeding
4. FOR ALL valid natural language inputs, THE Entity_Extractor SHALL complete parsing and return structured JSON within 2.5 seconds (latency budget requirement)
5. THE Entity_Extractor SHALL support multiple currency formats including abbreviations like "150k" (150,000) and explicit amounts like "3000000" (3 million)

### Requirement 2: Interactive Transaction Confirmation Workflow

**User Story:** As a user, I want to review AI-extracted transaction details before saving, so that I can verify accuracy and prevent incorrect data entry.

#### Acceptance Criteria

1. WHEN the Entity_Extractor successfully extracts structured data from user input, THE AI_Command_Center SHALL render a Confirmation_Card component in the Stream_Chat interface before any database operation
2. THE Confirmation_Card SHALL display all extracted fields in a scannable static card format including: amount with proper currency formatting, transaction type (income/expense), category, account name, and original raw input text
3. THE Confirmation_Card SHALL provide two action buttons: "Confirm" (saves to database) and "Cancel" (discards extraction)
4. WHEN the user clicks "Confirm", THE NOMOS_System SHALL save the Transaction_Entity to the PostgreSQL database via Prisma 7 with Zod validation
5. WHEN the user clicks "Cancel", THE NOMOS_System SHALL discard the extracted data and await new user input without any database mutation
6. AFTER a successful confirmation and save operation, THE AI_Command_Center SHALL display a success message in the Stream_Chat and clear the Confirmation_Card

### Requirement 3: Real-Time Streaming Conversational Interface

**User Story:** As a user, I want to see AI responses stream in real-time, so that I experience natural conversational interaction without perceived lag.

#### Acceptance Criteria

1. WHEN the LLM_Gateway processes user input, THE Stream_Chat SHALL display response tokens progressively as they are received from the LLM (streaming text rendering)
2. THE Stream_Chat SHALL maintain a chronological conversation history showing user messages and AI responses with clear visual distinction
3. THE Stream_Chat SHALL display timestamps for each conversation turn using monospace font with tabular-nums formatting
4. WHEN the user submits new input while AI is streaming a response, THE Stream_Chat SHALL queue the new input and process it after the current stream completes
5. THE Stream_Chat SHALL support markdown formatting in AI responses including code blocks, bold text, and bulleted lists

### Requirement 4: Predictive Financial Impact Visualization

**User Story:** As a user, I want to see the future financial impact of hypothetical spending decisions, so that I can make informed choices before committing to purchases.

#### Acceptance Criteria

1. WHEN a user discusses future spending plans in the Stream_Chat (e.g., "What if I buy a 3 million monitor next month?"), THE Predictive_Canvas SHALL render a graphical simulation showing projected balance impact
2. THE Forecast_Engine SHALL calculate future balance projections using the formula: B(t) = B₀ + Σᵢ₌₁ⁿ Iᵢ(t) - Σⱼ₌₁ᵐ Eⱼ(t) - (ω · Mₐᵥₓ · t), where B₀ is current balance, I represents fixed income, E represents fixed expenses, Mₐᵥₓ is average daily variable spending, and ω is lifestyle inflation weight
3. THE Forecast_Engine SHALL aggregate historical transaction data from the last 30 days to calculate Mₐᵥₓ (average daily unstructured spending)
4. THE Predictive_Canvas SHALL display a time-series line chart with X-axis representing days (0 to 90) and Y-axis representing projected balance in currency units
5. WHEN a hypothetical expense is introduced in conversation, THE Predictive_Canvas SHALL overlay a comparison line showing balance trajectory with and without the hypothetical expense
6. THE Forecast_Engine SHALL use a default lifestyle inflation weight factor (ω) of 1.0, modifiable per user in future iterations

### Requirement 5: Bento Grid Dashboard Layout System

**User Story:** As a user, I want a scannable dashboard overview of my financial status, so that I can quickly assess my financial health without navigating multiple pages.

#### Acceptance Criteria

1. THE Bento_Dashboard SHALL implement a responsive grid layout using CSS Grid with explicit grid-template-areas defining widget placement
2. THE Bento_Dashboard SHALL render exactly four core widgets: Vault_Widget (2x2 grid cells), Quick_Command_Bar (2x1 grid cells), Budget_Radar (1x2 grid cells), and Cashflow_Matrix (2x2 grid cells)
3. WHEN viewport width is below 768px (mobile), THE Bento_Dashboard SHALL stack widgets vertically in single-column layout while preserving aspect ratios
4. THE Bento_Dashboard SHALL apply the Midnight_Tech_Theme color palette with background: #09090b, card backgrounds: #18181b, and borders: #27272a
5. WHEN data updates occur (new transaction, budget change), THE Bento_Dashboard SHALL reactively update affected widgets without full page reload using React Query revalidation

### Requirement 6: Net Worth Aggregation Display

**User Story:** As a user, I want to see my total net worth aggregated from all accounts, so that I have a single source of truth for my financial position.

#### Acceptance Criteria

1. THE Vault_Widget SHALL calculate total net worth by summing the balance field across all Account_Entity records belonging to the authenticated user
2. THE Vault_Widget SHALL display the aggregated net worth as a large prominent monetary value using monospace font with tabular-nums CSS property
3. THE Vault_Widget SHALL render a mini sparkline chart showing net worth trend over the last 30 days
4. THE Vault_Widget SHALL format currency values with proper thousand separators and two decimal places precision (e.g., "1,234,567.89")
5. WHEN any transaction is recorded that affects account balances, THE Vault_Widget SHALL recalculate and update the displayed net worth within 500ms

### Requirement 7: Quick Command Terminal Interface

**User Story:** As a user, I want to execute quick AI commands from the dashboard, so that I can perform common tasks without opening the full chat interface.

#### Acceptance Criteria

1. THE Quick_Command_Bar SHALL render a single-line text input resembling a Linux terminal prompt with the format "~/nomos_ >"
2. WHEN the user submits input via the Quick_Command_Bar, THE NOMOS_System SHALL process it through the same LLM_Gateway pipeline as the full AI_Command_Center
3. THE Quick_Command_Bar SHALL support shorthand transaction entries like "out 50k food bca" which translates to expense of 50,000 in food category from BCA account
4. AFTER processing a Quick_Command_Bar input, THE NOMOS_System SHALL display a compact toast notification showing the action result (success or error) without navigating away from Bento_Dashboard
5. THE Quick_Command_Bar SHALL clear the input field after successful command submission

### Requirement 8: Budget Limit Monitoring with Visual Alerts

**User Story:** As a user, I want to monitor my spending against budget limits, so that I can avoid overspending in specific categories.

#### Acceptance Criteria

1. THE Budget_Radar SHALL display a circular radial progress indicator showing the ratio of spentAmount to limitAmount for active Budget_Entity records
2. THE Budget_Radar SHALL support both daily and monthly budget periods as defined in the Budget_Entity.period field
3. WHEN spentAmount exceeds 80% of limitAmount, THE Budget_Radar SHALL change the progress indicator color from cyan (#06b6d4) to rose (#f43f5e)
4. THE Budget_Radar SHALL aggregate spentAmount by summing all Transaction_Entity.amount values where category matches Budget_Entity.category and timestamp falls within the current budget period (startDate to endDate)
5. WHEN no Budget_Entity records exist for the user, THE Budget_Radar SHALL display a placeholder message: "No budgets configured" with a link to budget setup

### Requirement 9: Cash Flow Comparison Visualization

**User Story:** As a user, I want to visualize the comparison between cash inflows and outflows, so that I can identify spending patterns and income trends.

#### Acceptance Criteria

1. THE Cashflow_Matrix SHALL aggregate all Transaction_Entity records where type equals "INCOME" to calculate total inflows for the current month
2. THE Cashflow_Matrix SHALL aggregate all Transaction_Entity records where type equals "EXPENSE" to calculate total outflows for the current month
3. THE Cashflow_Matrix SHALL render a side-by-side grouped bar chart with two bars: one representing income (colored emerald #10b981) and one representing expenses (colored rose #f43f5e)
4. THE Cashflow_Matrix SHALL display numeric labels on top of each bar showing exact amounts in currency format using monospace font with tabular-nums
5. WHEN total expenses exceed total income for the month, THE Cashflow_Matrix SHALL display a warning icon and supplementary text "Net negative: [difference amount]"

### Requirement 10: High-Density Transaction Table with Inline Editing

**User Story:** As a user, I want to view and edit all my transactions in a high-performance table, so that I can manually audit and correct financial records.

#### Acceptance Criteria

1. THE Smart_Ledger SHALL render all Transaction_Entity records using @tanstack/react-table with virtualized rows for performance optimization with thousands of entries
2. THE Smart_Ledger SHALL display columns for: timestamp, description, category, account name, amount, and transaction type (income/expense)
3. WHEN the user clicks on a table cell in the category or amount columns, THE Smart_Ledger SHALL enable inline editing mode allowing direct value modification without opening a modal
4. WHEN the user completes an inline edit and clicks outside the cell or presses Enter, THE Smart_Ledger SHALL persist the change to the PostgreSQL database via Prisma 7
5. THE Smart_Ledger SHALL apply conditional text color formatting: emerald (#10b981) for income transactions and rose (#f43f5e) for expense transactions

### Requirement 11: Global Transaction Search Filter

**User Story:** As a user, I want to search transactions across all fields simultaneously, so that I can quickly locate specific records without navigating complex filters.

#### Acceptance Criteria

1. THE Smart_Ledger SHALL provide a global text filter input field above the transaction table
2. WHEN the user types in the global filter input, THE Smart_Ledger SHALL filter visible rows by matching the input string against description, category, and account name fields simultaneously (case-insensitive)
3. THE Smart_Ledger SHALL update the filtered results in real-time as the user types (debounced with 300ms delay to optimize performance)
4. THE Smart_Ledger SHALL display the count of visible filtered rows versus total row count in the format "Showing X of Y transactions"
5. WHEN the global filter input is empty, THE Smart_Ledger SHALL display all transactions without filtering

### Requirement 12: Immutable Transaction History with Audit Trail

**User Story:** As a system administrator, I want transaction records to be immutable at the database level, so that financial history integrity is preserved for auditing.

#### Acceptance Criteria

1. THE NOMOS_System SHALL store the original user input text in the Transaction_Entity.rawPrompt field when transactions are created via AI natural language input
2. THE NOMOS_System SHALL preserve the rawPrompt field value even when other transaction fields (category, amount, description) are modified through Smart_Ledger inline editing
3. WHEN a Transaction_Entity is created, THE NOMOS_System SHALL record the timestamp field with the current UTC datetime, which SHALL NOT be modifiable through any UI interface
4. THE NOMOS_System SHALL NOT provide any UI mechanism to delete Transaction_Entity records; deletion SHALL only be possible via direct database access by administrators
5. THE NOMOS_System SHALL maintain the Transaction_Entity.id field as an immutable UUID primary key

### Requirement 13: Design System Typography Rules

**User Story:** As a designer, I want consistent typography rules enforced across the application, so that the UI maintains visual coherence and readability.

#### Acceptance Criteria

1. THE NOMOS_System SHALL use Sans-Serif font family (Inter or Geist Sans) for all narrative text, page titles, navigation menus, button labels, and form labels
2. THE NOMOS_System SHALL use Monospace font family (JetBrains Mono or Geist Mono) for all monetary amounts, transaction dates, percentages, terminal logs, and numeric data displays
3. WHEN rendering monetary values or numeric data, THE NOMOS_System SHALL apply CSS utility class `.font-financial` which sets font-variant-numeric: tabular-nums to prevent layout shifts during real-time updates
4. THE NOMOS_System SHALL apply the Midnight_Tech_Theme color token `foreground: #fafafa` for primary text and numeric values
5. THE NOMOS_System SHALL apply the Midnight_Tech_Theme color token `muted: #a1a1aa` for secondary text labels, timestamps, and supporting information

### Requirement 14: Semantic Color Coding for Financial States

**User Story:** As a user, I want consistent color coding for financial states, so that I can quickly interpret positive and negative conditions without reading labels.

#### Acceptance Criteria

1. THE NOMOS_System SHALL apply emerald color (#10b981) to all income transactions, positive cash flows, and healthy budget states
2. THE NOMOS_System SHALL apply rose color (#f43f5e) to all expense transactions, negative cash flows, and critical budget states (>80% spent)
3. THE NOMOS_System SHALL apply cyan color (#06b6d4) to AI agent indicators, active interactions, and interactive elements in the AI_Command_Center
4. THE NOMOS_System SHALL use zinc-50 (#fafafa) for foreground text, zinc-400 (#a1a1aa) for muted text, zinc-800 (#27272a) for borders, zinc-900 (#18181b) for card backgrounds, and zinc-950 (#09090b) for the main app background
5. THE NOMOS_System SHALL NOT use color as the sole means of conveying information; all colored indicators SHALL be accompanied by text labels or icons for accessibility compliance

### Requirement 15: Prisma 7 Edge-Compatible Database Connection

**User Story:** As a backend engineer, I want database queries to use edge-compatible connection pooling, so that the application maintains high concurrency performance in serverless environments.

#### Acceptance Criteria

1. THE NOMOS_System SHALL configure Prisma Client to use @prisma/adapter-pg for PostgreSQL connections in all API routes and server components
2. THE NOMOS_System SHALL initialize database connections using isolated connection instances to prevent pool connection leaks in serverless environments
3. WHEN multiple concurrent API requests are processed, THE NOMOS_System SHALL reuse connection pool instances efficiently without exceeding PostgreSQL connection limits
4. THE NOMOS_System SHALL validate all database mutation operations using Zod schema validation before executing Prisma queries
5. THE NOMOS_System SHALL handle database connection errors gracefully and return appropriate HTTP error responses (500 Internal Server Error) with generic error messages that do not expose database implementation details

### Requirement 16: Strict Multi-Tenant Data Isolation

**User Story:** As a security engineer, I want absolute data isolation between users, so that unauthorized access to other users' financial data is impossible.

#### Acceptance Criteria

1. WHEN any API route processes a database query, THE NOMOS_System SHALL validate the User_Session token and extract the authenticated userId before executing any data retrieval or mutation
2. THE NOMOS_System SHALL include the authenticated userId as a WHERE clause filter in ALL Prisma queries for User, Account, Transaction, Budget, and AiInsight models
3. THE NOMOS_System SHALL reject any API request that attempts to access accountId, transactionId, or budgetId values not belonging to the authenticated user with HTTP 403 Forbidden error
4. THE NOMOS_System SHALL NOT expose user IDs, account IDs, or any internal database identifiers in client-side URLs or API responses except when necessary for authorized operations
5. WHEN a session token is invalid or expired, THE NOMOS_System SHALL return HTTP 401 Unauthorized and redirect the user to the authentication page

### Requirement 17: AI Response Latency Performance Budget

**User Story:** As a user, I want AI responses to feel instantaneous, so that the conversation flow remains natural without frustrating delays.

#### Acceptance Criteria

1. WHEN the user submits input in the Stream_Chat or Quick_Command_Bar, THE LLM_Gateway SHALL begin streaming response tokens within 500ms of submission
2. THE Entity_Extractor SHALL complete structured JSON extraction and render the Confirmation_Card within 2.5 seconds of user input submission
3. WHEN the LLM_Gateway experiences response delays exceeding 3 seconds, THE AI_Command_Center SHALL display a loading indicator with the message "Processing..."
4. THE NOMOS_System SHALL implement request timeout handling: if the LLM_Gateway does not respond within 10 seconds, THE system SHALL display an error message and allow the user to retry
5. THE NOMOS_System SHALL log AI response latency metrics (time from request to first token, time to complete response) for performance monitoring and optimization

### Requirement 18: Account Balance Synchronization

**User Story:** As a user, I want account balances to update automatically when transactions are recorded, so that my financial overview remains accurate without manual reconciliation.

#### Acceptance Criteria

1. WHEN a Transaction_Entity is created with type "EXPENSE", THE NOMOS_System SHALL decrement the corresponding Account_Entity.balance by the transaction amount using an atomic database update
2. WHEN a Transaction_Entity is created with type "INCOME", THE NOMOS_System SHALL increment the corresponding Account_Entity.balance by the transaction amount using an atomic database update
3. WHEN a Transaction_Entity is updated via Smart_Ledger inline editing (amount or account changed), THE NOMOS_System SHALL recalculate and update the affected Account_Entity.balance values to maintain consistency
4. THE NOMOS_System SHALL execute balance updates within the same database transaction as the Transaction_Entity creation or update to ensure atomicity
5. WHEN balance calculation errors occur (e.g., insufficient balance for expense in cash accounts), THE NOMOS_System SHALL rollback the transaction and display an appropriate error message to the user

### Requirement 19: Responsive Mobile-First Layout Adaptation

**User Story:** As a mobile user, I want the application to adapt gracefully to small screens, so that I can manage my finances on any device without horizontal scrolling.

#### Acceptance Criteria

1. WHEN viewport width is below 768px, THE Bento_Dashboard SHALL stack all widgets vertically in single-column layout while preserving individual widget aspect ratios
2. WHEN viewport width is below 768px, THE AI_Command_Center SHALL switch from horizontal split-screen layout to vertical stacked layout with Stream_Chat above Predictive_Canvas
3. THE Smart_Ledger SHALL implement horizontal scrolling for the transaction table on mobile viewports while keeping action columns (edit, delete) sticky on the right edge
4. WHEN viewport width is below 640px, THE NOMOS_System SHALL reduce font sizes proportionally: headings by 20%, body text by 10%, maintaining minimum 14px font size for accessibility
5. THE NOMOS_System SHALL ensure all interactive elements (buttons, input fields, clickable rows) have minimum touch target size of 44x44 pixels on mobile devices for accessibility compliance

### Requirement 20: Budget Period Auto-Rollover

**User Story:** As a user, I want budgets to automatically reset at the end of each period, so that I don't need to manually recreate monthly or weekly budgets.

#### Acceptance Criteria

1. WHEN the current date exceeds a Budget_Entity.endDate, THE NOMOS_System SHALL automatically create a new Budget_Entity record with identical limitAmount, category, and period values but updated startDate and endDate for the next period
2. THE NOMOS_System SHALL reset the spentAmount field to 0.0 in the newly created Budget_Entity for the new period
3. THE NOMOS_System SHALL execute budget rollover checks via a scheduled background job that runs daily at midnight UTC
4. THE NOMOS_System SHALL preserve historical Budget_Entity records for past periods to enable trend analysis and historical reporting
5. WHEN a user deletes a budget, THE NOMOS_System SHALL set a soft-delete flag or isActive=false rather than physically removing the record, preventing auto-rollover for that budget category

### Requirement 21: AI Insight Generation for Spending Anomalies

**User Story:** As a user, I want to receive automatic alerts when unusual spending patterns occur, so that I can investigate potential fraud or budget overruns.

#### Acceptance Criteria

1. WHEN a Transaction_Entity is created with an amount exceeding 3 standard deviations from the user's 30-day average transaction amount in the same category, THE NOMOS_System SHALL generate an AiInsight record with type "ANOMALY"
2. THE NOMOS_System SHALL analyze transaction patterns daily via a scheduled background job and generate AiInsight records with type "SUGGESTION" when spending in a category exceeds the previous month's average by more than 20%
3. WHEN a Budget_Entity.spentAmount reaches 90% of limitAmount, THE NOMOS_System SHALL generate an AiInsight record with type "WARNING" containing the message "Budget nearly exhausted: [category] at [percentage]%"
4. THE NOMOS_System SHALL display unread AiInsight records (isRead=false) as notification badges in the application header, showing the count of unread insights
5. WHEN the user views an AiInsight in the notifications panel, THE NOMOS_System SHALL update the isRead field to true

### Requirement 22: Transaction Category Autocomplete

**User Story:** As a user, I want category suggestions based on my historical transaction patterns, so that I can quickly categorize transactions consistently.

#### Acceptance Criteria

1. WHEN the user begins typing in a category field (Smart_Ledger inline edit or manual transaction form), THE NOMOS_System SHALL display an autocomplete dropdown showing previously used category values for the authenticated user
2. THE NOMOS_System SHALL rank autocomplete suggestions by frequency: most commonly used categories appear first in the dropdown
3. THE Entity_Extractor SHALL learn from historical transaction data: when extracting category from natural language input, THE system SHALL prefer category values the user has used before over generic defaults
4. THE NOMOS_System SHALL support both predefined category values (Food, Transport, Utilities, Entertainment, Healthcare, Shopping, Income) and custom user-defined categories
5. WHEN a new custom category is entered and saved, THE NOMOS_System SHALL add it to the autocomplete suggestions for future transactions

### Requirement 23: Account Selection Context Awareness

**User Story:** As a user, I want the system to intelligently suggest which account I'm using based on context clues, so that I don't need to specify the account explicitly every time.

#### Acceptance Criteria

1. WHEN the Entity_Extractor processes natural language input containing payment method keywords (e.g., "Gopay", "BCA", "cash"), THE system SHALL match these keywords against Account_Entity.name values for the authenticated user
2. WHEN the Entity_Extractor cannot identify an account from the input text, THE AI_Command_Center SHALL default to the user's most frequently used account for the transaction category
3. THE NOMOS_System SHALL calculate account usage frequency by counting Transaction_Entity records grouped by accountId and category within the last 90 days
4. WHEN multiple Account_Entity records match the extracted payment method keyword, THE AI_Command_Center SHALL display a disambiguation question asking the user to select the correct account
5. THE Entity_Extractor SHALL support common payment method abbreviations: "GoPay"/"Gopay"/"GP" for e-wallets, bank name acronyms like "BCA"/"Mandiri"/"BNI" for bank accounts, "cash"/"tunai" for cash accounts

### Requirement 24: Export Transaction History

**User Story:** As a user, I want to export my transaction history to CSV format, so that I can perform external analysis or import data into accounting software.

#### Acceptance Criteria

1. THE Smart_Ledger SHALL provide an "Export to CSV" button that generates a CSV file containing all visible filtered transactions
2. THE exported CSV file SHALL include columns: timestamp (ISO 8601 format), description, category, account name, amount (numeric without currency symbols), type (INCOME/EXPENSE), and original raw prompt if available
3. WHEN the user clicks "Export to CSV", THE NOMOS_System SHALL generate the file on the server side and trigger a browser download with filename format: "nomos-transactions-YYYY-MM-DD.csv"
4. THE export function SHALL respect the current Smart_Ledger filters: only transactions matching the active global search filter SHALL be included in the CSV
5. THE NOMOS_System SHALL sanitize all text fields in the CSV export to prevent CSV injection attacks (escape leading special characters: =, +, -, @)

### Requirement 25: Dark Mode as Default with Optional Light Mode

**User Story:** As a user, I want the application to default to dark mode, so that I have a comfortable viewing experience in low-light environments.

#### Acceptance Criteria

1. THE NOMOS_System SHALL apply the Midnight_Tech_Theme (dark mode) by default on first application load without requiring user configuration
2. THE NOMOS_System SHALL provide a theme toggle control in the application header allowing users to switch between dark mode and light mode
3. WHEN the user toggles to light mode, THE NOMOS_System SHALL invert the color palette: background becomes zinc-50, cards become white, text becomes zinc-900, while preserving semantic colors (emerald for income, rose for expenses)
4. THE NOMOS_System SHALL persist the user's theme preference in browser localStorage and apply it on subsequent application loads
5. THE NOMOS_System SHALL respect the user's operating system color scheme preference (prefers-color-scheme media query) only if no explicit theme preference is stored in localStorage
