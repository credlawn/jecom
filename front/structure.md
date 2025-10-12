### High-Level Overview

Your project is a monorepo containing a backend built with the **Frappe** framework and a frontend built with **Next.js**. The key architectural principle is that the frontend is decoupled from the backend, and all communication happens through a well-defined API layer. The frontend **does not** access the database directly.

### Backend (`myecom` Frappe App)

The backend is a custom Frappe application named `myecom`. Frappe is a full-stack framework that provides a database abstraction layer (DocTypes), a UI, and a REST API. Your custom logic is implemented in the `myecom` app.

The key directories in `myecom/myecom` are:

*   `api`: This directory contains the Python files that define your API endpoints. These are whitelisted functions that can be called from the frontend. This is the only way the frontend can access backend data.
*   `myecom`: This directory contains the **DocTypes** for your application. DocTypes are the data models for your application, defining the fields and relationships for your data (similar to tables in a traditional database schema).
*   `public`: This directory is for static assets that are served directly by the Frappe framework.
*   `hooks.py`: This is a standard Frappe file that allows you to "hook" into various events in the Frappe framework, allowing you to extend and customize its behavior.

### Frontend (`front` Next.js App)

The frontend is a modern React application built with Next.js. It is responsible for rendering the user interface and fetching all data from the `myecom` backend.

The key directories in `front/src` are:

*   `app`: This is the main application directory for your Next.js app, containing all the pages and routes.
*   `components`: This directory contains reusable React components that are used throughout the application.
*   `get-api-data`: This is a crucial directory that acts as a data-fetching layer. It contains functions that are responsible for calling the Frappe API endpoints. This abstraction means that your UI components are not making direct API calls, making the code cleaner and easier to maintain.
*   `lib`: This directory likely contains the Frappe client instance and other utility functions.
*   `redux`: This directory contains the Redux store, actions, and reducers for managing the application's state.
*   `types`: This directory contains TypeScript type definitions, which helps ensure that the data flowing between the frontend and backend is consistent.

### Data Flow

The data flow between the frontend and backend is as follows:

1.  A React component in `front/src/app` or `front/src/components` needs to display some data.
2.  It calls a data-fetching function from `front/src/get-api-data`.
3.  This function uses a Frappe API client (likely initialized in `front/src/lib`) to make a request to a specific endpoint defined in `myecom/myecom/api`.
4.  The Python function in the `api` directory on the backend executes, fetches the required data from the Frappe DocTypes, and returns it as a JSON response.
5.  The data-fetching function in `front/src/get-api-data` receives the JSON response and returns it to the React component.
6.  The component then renders the data.

This architecture ensures a clean separation of concerns, improves security by not exposing the database directly to the frontend, and allows the frontend and backend to be developed and scaled independently.

### `old-src` Directory

The `old-src` directory appears to be a previous version of the frontend. The `GEMINI.md` file indicates a refactoring effort is underway to migrate from a system that used Prisma for direct database access to the current, more robust API-driven approach.
