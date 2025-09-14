# Trading Economics Stock Search & Visualization

A React-based web application that provides real-time stock information and country economic data using the Trading Economics API. Built with modern web technologies including React 19, TypeScript, Tailwind CSS, and Shadcn UI components.

## Features

- **Stock Symbol Search**: Search and visualize stock information by ticker symbols with expandable description cards
- **Multi-Select Interface**: Select multiple stocks simultaneously using a custom multi-combobox component
- **Stock Data Table**: View detailed stock information including name, sector, industry, and sub-industry
- **Country Economic Metrics**: Display inflation rate, CPI, corruption index, and corruption rank for selected countries
- **Real-time Data**: Live data from Trading Economics API with built-in rate limiting
- **Responsive Design**: Modern UI with dark theme and monospace typography

## Tech Stack

- React 19 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Shadcn UI components
- Trading Economics API
- Axios for HTTP requests

## API Integration

The app integrates with Trading Economics API endpoints for:

- Stock descriptions and metadata
- Country economic indicators
- Real-time financial data

Built with rate limiting to respect API constraints and ensure optimal performance.

## Futher Development

Other features to develop:

- Graph to display the corruption data
- Stock financial data such as daily close, market cap, and % change
- The ability to search and display arbitrary country data and display in the same way as the stocks section
