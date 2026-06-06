# Implementation Plan: Scaffold Vendor Portal Application

This plan details the scaffolding of the new `vendor-portal` sub-project inside the `Rushik` workspace. The application will be a standalone supplier portal UI showcasing registration, login, and dashboard workflows with cohesive dark-blue gradients and green neon button glow animations.

## User Review Required

> [!IMPORTANT]
> - **Workspace Sub-project Location**: The standalone vendor portal will be created in [c:\Users\rushi\odoo\Rushik\vendor-portal](file:///c:/Users/rushi/odoo/Rushik/vendor-portal). This will not overwrite your existing backend or frontend servers.
> - **Self-Contained Styling**: The project will use standard CSS Modules (`.module.css`) to enforce component encapsulation and modularity.

## Proposed Changes

---

### [Configuration Files]

We will create the standard configuration files for a React + Vite + TypeScript application.

#### [NEW] [package.json](file:///c:/Users/rushi/odoo/Rushik/vendor-portal/package.json)
- Define standard Vite and TS scripts, plus package dependencies (`react`, `react-dom`, `lucide-react`).

#### [NEW] [tsconfig.json](file:///c:/Users/rushi/odoo/Rushik/vendor-portal/tsconfig.json)
- Setup TypeScript compiler options.

#### [NEW] [vite.config.ts](file:///c:/Users/rushi/odoo/Rushik/vendor-portal/vite.config.ts)
- Configure Vite React plugin.

#### [NEW] [index.html](file:///c:/Users/rushi/odoo/Rushik/vendor-portal/index.html)
- Main HTML entry point containing Vite anchor script.

---

### [Theme & Styling Files]

We will define the CSS styling modules for the vendor portal visual layout.

#### [NEW] [theme.css](file:///c:/Users/rushi/odoo/Rushik/vendor-portal/src/styles/theme.css)
- Custom variables, dark background gradient, and font styles.

#### [NEW] [Button.module.css](file:///c:/Users/rushi/odoo/Rushik/vendor-portal/src/styles/Button.module.css)
- Glowing green border button rules on hover/focus.

#### [NEW] [Auth.module.css](file:///c:/Users/rushi/odoo/Rushik/vendor-portal/src/styles/Auth.module.css)
- Glassmorphism card structures for Login/Registration boxes.

#### [NEW] [Dashboard.module.css](file:///c:/Users/rushi/odoo/Rushik/vendor-portal/src/styles/Dashboard.module.css)
- Sidebar, header shell, and widgets responsive sizing and spacing.

---

### [Component Files]

We will create the interactive React components.

#### [NEW] [Button.tsx](file:///c:/Users/rushi/odoo/Rushik/vendor-portal/src/components/common/Button.tsx)
- Reusable button with click compression physics.

#### [NEW] [LoginBox.tsx](file:///c:/Users/rushi/odoo/Rushik/vendor-portal/src/components/auth/LoginBox.tsx)
- Controlled email/password form with validation warnings.

#### [NEW] [RegistrationBox.tsx](file:///c:/Users/rushi/odoo/Rushik/vendor-portal/src/components/auth/RegistrationBox.tsx)
- Sign-up form capturing Company, Email, EIN, and password.

#### [NEW] [DashboardShell.tsx](file:///c:/Users/rushi/odoo/Rushik/vendor-portal/src/components/dashboard/DashboardShell.tsx)
- Layout wrapper linking to navigation buttons and main grids.

#### [NEW] [Widgets.tsx](file:///c:/Users/rushi/odoo/Rushik/vendor-portal/src/components/dashboard/Widgets.tsx)
- Active bids tables, KPI tiles, and invoices metrics list.

#### [NEW] [App.tsx](file:///c:/Users/rushi/odoo/Rushik/vendor-portal/src/App.tsx)
- Central page router state dispatcher.

#### [NEW] [main.tsx](file:///c:/Users/rushi/odoo/Rushik/vendor-portal/src/main.tsx)
- DOM mount hook.

---

## Verification Plan

### Manual Verification
1. **Scaffold check**: Verify all files generated successfully.
2. **Compile test**: Run `npm install` inside the newly created directory, and test compiling the app with `npm run build` to verify there are no TypeScript syntax errors.
