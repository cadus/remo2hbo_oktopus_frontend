## Cadus Lifesensor (part of the remo²hbo project)
For project description see https://github.com/cadus/remo2hbo-wiki/wiki

The app is an electron app based on react components. This means, it can be published easily for any desktop plattform (windows, linux, mac). With few modifications it can also be deployed in the web.

### Install

#### Clone this repo

```
git clone https://github.com/cadus/remo2hbo_oktopus_frontend
```

#### Install dependencies

```
npm install
```

or

```
yarn
```

### Usage

#### Run the app

```
npm run start
```

or

```
yarn start
```

#### Build the app (automatic)

```
npm run package
```

or

```
yarn package
```

#### Build the app (manual)

```
npm run build
```

or

```
yarn build
```

#### Test the app (after `npm run build` || `yarn run build`)

```
npm run prod
```

```
yarn prod
```

### Change app title

Change the app title in the **webpack.build.config.js** and the **webpack.dev.config.js** files
