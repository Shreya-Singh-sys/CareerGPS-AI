# CareerGPS AI

CareerGPS AI is a web application designed to help students analyze their resumes, identify skill gaps, explore career paths, and find relevant job opportunities. The platform provides a unified interface for career analysis, skill development guidance, and job discovery.

## Project Overview

CareerGPS AI provides tools that assist users in understanding how their current skills align with industry expectations. The platform allows users to upload their resume, analyze skills, identify missing competencies, and receive recommendations for improvement.

Core goals of the system:

- Resume analysis and skill extraction
- Skill gap identification
- Career roadmap guidance
- Job discovery and matching
- Profile management and application tracking

## Technology Stack

This project is built using the following technologies:

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui component library

These technologies provide a modern frontend architecture with fast development and scalable UI components.

## Project Structure

The project follows a component-based architecture.

```
career-gps-ai/
- public
- src
  - components
  - pages
  - hooks
  - lib
  - App.tsx
  - main.tsx
- index.html
- package.json
- vite.config.ts
```

Key directories:

- `components` - reusable UI components
- `pages` - main application views
- `hooks` - reusable React hooks
- `lib` - utility functions and shared logic

## Installation

Before running the project locally, ensure the following tools are installed:

- Node.js
- npm

Clone the repository:

```bash
git clone <REPOSITORY_URL>
```

Navigate into the project folder:

```bash
cd career-gps-ai
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will start locally with hot reload enabled.

## Development

During development you can modify files inside the `src` directory. Changes will automatically reload in the browser.

Typical development tasks include:

- creating new components
- modifying page layouts
- integrating APIs
- updating UI styles

## Build

To create a production build:

```bash
npm run build
```

This will generate optimized files for deployment.

## Deployment

After building the project, the generated production files can be deployed to any static hosting service, such as:

- Vercel
- Netlify
- GitHub Pages
- AWS S3
- Cloudflare Pages

## Contribution

Contributions are welcome. To contribute:

- fork the repository
- create a new branch
- commit your changes
- submit a pull request

Ensure code follows the existing project structure and formatting conventions.

## License

This project is provided for educational and development purposes.
