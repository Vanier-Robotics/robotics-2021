# Vanier Robotics Team Website 2021

## Installation:

Install [Node Here](https://nodejs.org/en/download/)

Install [Yarn Here](https://classic.yarnpkg.com/en/docs/install/)

## Setup:
```
yarn install
```

## Running

### Generating Website

```
node index.js
```
Outputs to `/build`

### Generating SCSS

```
yarn sass
```

### Running Webserver
```
yarn serve
```


# How it works

All the code is found in `/src`
### `/src/pug`:
- Contains all the templates for the webpages.

### `/src/data`:
- Contains all the text, contained in JSON files to facilitate the storage of translations

### `/src/scss`:
- Contains all the SCSS for CSS generation

### `index.js`
- Takes all the translations and generates the html files using pug.