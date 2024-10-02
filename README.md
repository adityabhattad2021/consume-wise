# ConsumeWise v0.1


![Decode your choices, elevate your health](https://github.com/user-attachments/assets/d1cfaa67-3ea7-4c82-aba8-8bb1d89801c6)


# Overview

ConsumeWise is an AI-powered product review catalog and consumption tracker that helps users make informed decisions about healthier FMCG food alternatives. By leveraging Google Gemini, ConsumeWise analyzes health products, monitors users' consumption patterns, and provides personalized recommendations for improving dietary habits.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prototype Deployed Instance](#prototype-deployed-instance)
- [Getting Started](#getting-started)
- [Folder Structure](#folder-structure)
- [Architecture](#architecture)
- [Future Enhancements](#future-enhancements)

## Features

- **Data Collection**: Scrapes product data from major FMCG platforms (currently BigBasket for prototyping).
- **AI-Generated Insights**: 
  - Ingredient breakdowns
  - Nutritional information
  - Identification of misleading claims
  - Tailored recommendations based on users' health needs
- **Regular User Consumption Analysis**: 
  - Generates reports evaluating users' choices against their health goals
  - Provides recommendations for improvement
  - Suggests healthier alternatives


## Tech Stack

The major technologies used are:
- **Next.js**: Used as the primary framework for the application
- **PostgreSQL**: Relational database for storing all the data of the application
- **Redis and Upstash**: Used for rate limiting
- **Google Gemini**: Primary LLM for product analysis and report generation

## Prototype Deployed Instance

You can access the live prototype of ConsumeWise at the following URL:
https://consume-wise.vercel.app/

## Getting Started

### Prerequisites

- **Bun**: This is a new JS runtime/package manager.

### Installation

1. Fork the repository: https://github.com/consumer-ai-lab/consume-wise/

### Running Locally

1. Clone your forked repository
2. Navigate to the project directory:
   ```
   cd consume-wise
   ```
3. Install dependencies:
   ```
   bun run install
   ```
4. Start the development server:
   ```
   bun run dev
   ```

## Folder Structure

```
.
├── README.md
├── frontend
│   ├── README.md
│   ├── bun.lockb
│   ├── components.json
│   ├── docker-compose.yaml
│   ├── next-env.d.ts
│   ├── next.config.mjs
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── prisma
│   │   ├── migrations
│   │   └── schema.prisma
│   ├── public
│   │   └── images
│   │       └── gemini.png
│   ├── src
│   │   ├── api_schema
│   │   │   ├── product
│   │   │   └── user
│   │   ├── app
│   │   │   ├── (application)
│   │   │   ├── (onboarding)
│   │   │   ├── api
│   │   │   ├── favicon.ico
│   │   │   ├── fonts
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── loading.tsx
│   │   ├── auth.ts
│   │   ├── components
│   │   ├── hooks
│   │   ├── lib
│   │   │   ├── analyze.ts
│   │   │   ├── capitalize_word.ts
│   │   │   ├── categories.ts
│   │   │   ├── confetti.ts
│   │   │   ├── personalization.ts
│   │   │   ├── prisma.ts
│   │   │   ├── products.ts
│   │   │   ├── ratelimit.ts
│   │   │   ├── scores.ts
│   │   │   ├── scraper.ts
│   │   │   ├── seed.ts
│   │   │   └── utils.ts
│   │   └── mocks
│   │       └── product.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── vercel.json
└── langgraph
    ├── README.md
    ├── agent.ts
    ├── bun.lockb
    ├── index.ts
    ├── package.json
    ├── seed-database.ts
    └── tsconfig.json
```


## Architecture

![architecture diagram](https://github.com/user-attachments/assets/c32b0fd9-4eb7-484b-83cb-9c8e145b5a12)

## Future Enhancements

- Expand product listings to include all major FMCG sites
- Enhance personalization with user location and budget data
- Integrate with health apps like HealthifyMe
- Enable retailers to list their products directly on the platform
