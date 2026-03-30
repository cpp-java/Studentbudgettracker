# Student Budget Tracker

A comprehensive budget management application designed for university students to track expenses, manage budgets, and monitor their financial health.

## Features

### Authentication
- Register and login using KU number (e.g., k1234567) or email (e.g., k1234567@kingston.ac.uk)
- Secure password authentication with minimum 6 character requirement
- Change password functionality in settings

### Expense Tracking
- Quick expense logging with predefined categories:
  - Food
  - Books
  - Transport
  - Entertainment
  - Housing
  - Other
- Add notes and receipt photos to expenses
- View and filter expense history
- Edit and delete expenses

### Income Management
- Track incoming money from various sources (salary, allowance, part-time jobs)
- View total income and transaction history
- Calculate actual balance (Income - Expenses)

### Budget Management
- Set budgets for each expense category and overall spending
- Visual budget indicators with color-coded status:
  - 🟢 Green: Safe (< 80% spent)
  - 🟡 Yellow: Warning (80-99% spent)
  - 🔴 Red: Exceeded (≥ 100% spent)
- Track remaining budget in real-time

### Analytics & Insights
- Pie charts showing spending distribution by category
- Bar charts comparing budgets vs actual spending
- Date range filtering (week, month, 3 months)
- Visual spending trends

### Settings & Profile
- Change password with validation
- Edit account details
- Notification preferences (Budget alerts, weekly reports, expense reminders)
- Sign out functionality

## Technology Stack

- **Frontend**: React + TypeScript
- **Routing**: React Router
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

1. Register with your KU number or university email
2. Set up your budgets for different categories
3. Start logging expenses and income
4. Monitor your financial health through the dashboard and analytics

## Navigation

- **Home**: Dashboard with balance overview and recent transactions
- **Expenses**: Add, view, and manage expenses
- **Analytics**: Visual insights and spending trends
- **Settings**: Account management and preferences

## Key Highlights

- Mobile-friendly responsive design
- Clean, modern interface with gradient backgrounds
- Real-time balance calculations
- Category-based spending tracking
- Visual budget status indicators
- Quick action buttons for adding expenses and income
