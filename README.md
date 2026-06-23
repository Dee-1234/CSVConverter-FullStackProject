# CSVConverter-FullStackProject
CSVConverter is an intelligent, full-stack data visualization and analysis console designed to remove the friction between raw data and actionable insights. It provides a hybrid interface that allows users to interact with CSV datasets using either Natural Language (powered by AI) or precise SQL commands. By bridging the gap between flat tabular data and interactive visual dashboards, CSVConverter transforms static files into dynamic analytical assets.

Core Functionality
-The application operates on a dual-mode engine, allowing users to choose the analytical paradigm that best suits their needs:
1. AI-Powered Insights: Leveraging the Google Gemini API, users can submit natural language queries (e.g., "Show me the sales trend for Q1 by  region").The backend interprets the intent, performs the necessary calculations, and returns structured data ready for immediate visualization.
2. SQL-Driven Precision: For power users, CSVConverter provides an embedded SQL console. This mode interacts with an H2 In-Memory database, enabling complex, performant queries on uploaded CSV data, offering full control over filtering, grouping, and aggregation.

Key Features
1. Dynamic CSV Parsing: Utilizes the Apache Commons CSV library to process uploaded files, map headers, and dynamically create queryable schemas in real-time, regardless of the file structure.
2. Adaptive Visualization Engine: Automatically renders data using Recharts. Users can toggle between Bar, Line, and Pie charts to best suit the context of their data.
3. Multi-View Interface: A tabbed UI architecture allows users to switch seamlessly between a high-level Visualization View and a granular Raw Data (Table) View.
4. High-Speed Processing: Designed as a localized, fast-response tool, it uses H2 for high-speed, transient data processing, ensuring performance without the overhead of external database dependencies.

# Tech Stack:
# Frontend
1. React for the user interface.
2. Tailwind CSS for clean, modern styling.
3. Recharts to handle data visualization and charts based on the parsed data.
# Backend
1. Java 17 & Spring Boot as the core application framework.
2. Apache Commons CSV to handle the heavy lifting of reading, parsing, and formatting the CSV data.
3. JdbcTemplate for executing flexible, dynamic SQL queries.
4. H2 Database an in-memory database used for quick, session-based data storage without needing a heavy persistent setup.
# AI Integration
1. Google Gemini API integrated directly into the application to handle natural language processing tasks on the data.

Screen Shots
https://github.com/Dee-1234/CSVConverter-FullStackProject/tree/main/Screenshots
