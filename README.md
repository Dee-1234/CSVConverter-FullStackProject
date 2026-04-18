# CSVConverter-FullStackProject
CSVConverter is an intelligent, full-stack data visualization and analysis console designed to remove the friction between raw data and actionable insights. It provides a hybrid interface that allows users to interact with CSV datasets using either Natural Language (powered by AI) or precise SQL commands. By bridging the gap between flat tabular data and interactive visual dashboards, CSVConverter transforms static files into dynamic analytical assets.

Core Functionality
-The application operates on a dual-mode engine, allowing users to choose the analytical paradigm that best suits their needs:
-AI-Powered Insights: Leveraging the Google Gemini API, users can submit natural language queries (e.g., "Show me the sales trend for Q1 by  region").The backend interprets the intent, performs the necessary calculations, and returns structured data ready for immediate visualization.
-SQL-Driven Precision: For power users, CSVConverter provides an embedded SQL console. This mode interacts with an H2 In-Memory database, enabling complex, performant queries on uploaded CSV data, offering full control over filtering, grouping, and aggregation.

Key Features
-Dynamic CSV Parsing: Utilizes the Apache Commons CSV library to process uploaded files, map headers, and dynamically create queryable schemas in real-time, regardless of the file structure.
-Adaptive Visualization Engine: Automatically renders data using Recharts. Users can toggle between Bar, Line, and Pie charts to best suit the context of their data.
-Multi-View Interface: A tabbed UI architecture allows users to switch seamlessly between a high-level Visualization View and a granular Raw Data (Table) View.
-High-Speed Processing: Designed as a localized, fast-response tool, it uses H2 for high-speed, transient data processing, ensuring performance without the overhead of external database dependencies.
