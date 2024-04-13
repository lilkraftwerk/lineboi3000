# Getting Started

I haven't set up Electron app packaging yet, so you can run locally via `npm` or `yarn`.

## Quick Start

### Install

`yarn` or `npm i` to install all dependencies

### Run The App

`yarn dev` or `npm dev` to run the dev server (devtools open, and Webpack rebuilds on changes to files)

`yarn start` or `npm start` to run the dev server

## Useful Yarn/NPM Commands

In a terminal window, navigate to the main folder and enter `yarn [command]` or `npm [command]`

| COMMAND              | RESULT                                                                          |
| -------------------- | ------------------------------------------------------------------------------- |
| `start`              | start app                                                                       |
| `dev`                | start app in dev mode (Webpack reloads changed files, dev tools are open        |
| `electron`           | run just main Electron window                                                   |
| `electron:dev`       | run Electron window in dev mode                                                 |
| `docs`               | Serve docs folder locally                                                       |
| `reset`              | Remove `node_modules` and `yarn.lock` file, reinstall                           |
| `webpack:watch`      | Start Webpack, reloads when files change                                        |
| `webpack:dev`        | Build Webpack files in dev mode                                                 |
| `webpack:prod`       | Build Webpack files in prod mode                                                |
| `cncserver`          | Start the server that interfaces with a Pen Plotter                             |
| `format`             | Run tools to format code style, check for ESLint accuracy, and format CSS files |
| `test`               | Run unit and e2e tests                                                          |
| `test:src`           | Just test files in `src` folder                                                 |
| `test:filters`       | Generate example images for filters                                             |
| `test:filters:watch` | Watch for changes to filter files and generate examples images                  |
| `test:update`        | Update screenshots for tests                                                    |
| `test:update:watch`  | Update screenshots for tests when files are changed                             |
| `test:watch`         | Run tests on changed files                                                      |
