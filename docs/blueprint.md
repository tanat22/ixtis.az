# **App Name**: AssetRover

## Core Features:

- Role-Based Access: User authentication with role-based access control (Super Admin, Admin, Field User). Field Users only see assets in their assigned region.
- Dashboard Overview: Dashboard providing a high-level overview of asset inventory, ticket status, and user activity.
- Asset Management (Windows): Windows application for asset management and administration, allowing for assignment of roles.
- Asset Capture (Android): Android application for field users to add asset information, including asset type (Direk, Qutu, etc.) via dropdown selections.
- Zabbix Ticket Integration: Automated import of Zabbix tickets into the Windows application, and dispatching the tickets to field users based on their roles and assigned areas.
- Navigation Integration: A tool in the Android app allows field users to click a "Navigate to Point" button.  The tool decides when the button is pressed, opening Waze (if installed) or another navigation app, pre-populated with asset GPS coordinates.
- Audit Logging: Comprehensive logging of all data modifications, additions, and deletions, with tracking of the user performing the action. Super Admin has access to full audit log.

## Style Guidelines:

- Primary color: Slate blue (#708090), conveying professionalism.
- Background color: Light gray (#E0E0E0) for a clean and neutral backdrop.
- Accent color: Warm orange (#FF7F50), creating contrast, especially in buttons
- Body and headline font: 'Inter' sans-serif for a modern, readable interface.
- Use clear, consistent icons to represent asset types and actions. Simple line icons preferred.
- Employ a grid-based layout for consistent placement of elements, ensuring a professional appearance. Optimize for both Windows and Android screens.
- Incorporate subtle transitions for feedback upon user interaction (e.g., button presses).  Avoid overly decorative animation.