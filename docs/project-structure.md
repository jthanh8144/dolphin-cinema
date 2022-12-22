```
.
├── README.md
├── commitlint.config.js
├── docker
│   └── app
│       ├── Dockerfile.develop
│       └── Dockerfile.local
├── docker-compose.yaml
├── docs
│   ├── git-branch-convention.md
│   └── project-structure.md
├── env.example
├── nodemon.json
├── package-lock.json
├── package.json
├── public
│   ├── favicon.ico
│   └── images
│       ├── express-typescript.png
│       ├── portfolio
│       │   ├── cabin.png
│       │   ├── cake.png
│       │   ├── circus.png
│       │   ├── game.png
│       │   ├── safe.png
│       │   └── submarine.png
│       └── profile.png
├── src
│   ├── app
│   │   ├── controllers
│   │   │   ├── index.ts
│   │   │   └── user.controller.ts
│   │   ├── dtos
│   │   │   ├── index.ts
│   │   │   └── user.dto.ts
│   │   ├── entities
│   │   │   ├── index.ts
│   │   │   └── user.entity.ts
│   │   ├── middlewares
│   │   │   ├── error.middleware.ts
│   │   │   ├── index.ts
│   │   │   └── validation.middleware.ts
│   │   ├── repositories
│   │   │   ├── index.ts
│   │   │   └── user.repository.ts
│   │   └── routers
│   │       ├── index.ts
│   │       └── user.route.ts
│   ├── database
│   │   ├── migrations
│   │   │   └── 1659022649842-CreateUserTable.ts
│   │   └── seeds
│   ├── main.ts
│   └── shared
│       ├── configs
│       │   ├── data-source.config.ts
│       │   └── environment.config.ts
│       ├── constants
│       │   ├── environment.constant.ts
│       │   └── index.ts
│       └── providers
│           ├── app.provider.ts
│           ├── database.provider.ts
│           ├── env-load.provider.ts
│           ├── index.ts
│           └── logger.provider.ts
├── tsconfig.json
└── views

22 directories, 45 files
```
