<div align="center">

  <img src="frontend/src/assets/logo.png" alt="logo" width="150" height="auto" />
  <h1>Grocket</h1>
  <p>
    Grocket is an international online marketplace that specializes in secondhand items. It provides a platform for users to buy and sell a variety of used goods from all over the world, including clothing, electronics, furniture, and more.
  </p>
  
<!-- Badges -->
<p>
  <a href="https://github.com/alexzawadsky/Grocket/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/alexzawadsky/Grocket" alt="contributors" />
  </a>
  <a href="">
    <img src="https://img.shields.io/github/last-commit/alexzawadsky/Grocket" alt="last update" />
  </a>
</p>

<h4>
    <a href="https://github.com/Louis3797/awesome-readme-template/">View Demo</a>
  <span> · </span>
    <a href="https://github.com/Louis3797/awesome-readme-template">Documentation</a>
  <span> · </span>
    <a href="https://github.com/Louis3797/awesome-readme-template/issues/">Report Bug</a>
  <span> · </span>
    <a href="https://github.com/Louis3797/awesome-readme-template/issues/">Request Feature</a>
  </h4>
</div>

<br />

<!-- Table of Contents -->
# :notebook_with_decorative_cover: Table of Contents

- [:notebook\_with\_decorative\_cover: Table of Contents](#notebook_with_decorative_cover-table-of-contents)
  - [:star2: About the Project](#star2-about-the-project)
    - [:camera: Screenshots](#camera-screenshots)
    - [:space\_invader: Tech Stack](#space_invader-tech-stack)
    - [:dart: Features](#dart-features)
    - [:art: Color Reference](#art-color-reference)
    - [:key: Environment Variables](#key-environment-variables)
  - [:toolbox: Getting Started](#toolbox-getting-started)
    - [:bangbang: Prerequisites](#bangbang-prerequisites)
    - [:running: Run Locally](#running-run-locally)
      - [Frontend](#frontend)
      - [Backend](#backend)
    - [:triangular\_flag\_on\_post: Deployment in docker](#triangular_flag_on_post-deployment-in-docker)
  - [:handshake: Contact](#handshake-contact)

<!-- About the Project -->
## :star2: About the Project

<!-- Screenshots -->
### :camera: Screenshots

<div align="center">
  <img src="frontend/public/screenshot.png" alt="screenshot" />
</div>

<!-- TechStack -->
### :space_invader: Tech Stack


  <summary>Client</summary>
  <a href="https://reactjs.org/">React.js</a>
    <a href="https://tailwindcss.com/">TailwindCSS</a>
  <summary>Server</summary>
    <a href="https://reactjs.org/">React.js</a>
    <a href="https://tailwindcss.com/">TailwindCSS</a>
  <summary>Database</summary>
  <a href="https://reactjs.org/">React.js</a>
    <a href="https://tailwindcss.com/">TailwindCSS</a>
  <summary>Dev-Ops</summary>
  <a href="https://reactjs.org/">React.js</a>
    <a href="https://tailwindcss.com/">TailwindCSS</a>

<!-- Features -->
### :dart: Features

- Global
- Feature 2
- Feature 3

<!-- Color Reference -->
### :art: Color Reference

| Color         | Hex                                                              |
| ------------- | ---------------------------------------------------------------- |
| Primary Color | ![#FF9001](https://via.placeholder.com/10/FF9001?text=+) #FF9001 |

<!-- Env Variables -->
### :key: Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`API_KEY`

`ANOTHER_API_KEY`

<!-- Getting Started -->
## :toolbox: Getting Started

<!-- Prerequisites -->
### :bangbang: Prerequisites

This project uses Poetry as backend package manager

```bash
 kak postavit poetry
```

<!-- Run Locally -->
### :running: Run Locally

Clone the project

```bash
  git clone https://github.com/alexzawadsky/Grocket.git
```

#### Frontend

Go to the project directory

```bash
  cd frontend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

#### Backend

Go to the project directory

```bash
  cd backend
```

Install dependencies

```bash
  npm install
```

Make and apply DB migrations

```bash
  python manage.py makemigrations
  python manage.py migrate
```

Start the server

```bash
  python manage.py runserver
```

<!-- Deployment -->
### :triangular_flag_on_post: Deployment in docker

Go to the docker-compose directory

```bash
  cd infra
```

Start docker with bash script

```bash
  sh install.sh
```

<!-- Contact -->
## :handshake: Contact

All contact options are available in our profiles, feel free to DM using any option.