## Cadus Lifesensor (part of the remo²hbo project)
For project description see https://github.com/cadus/remo2hbo-wiki/wiki

The app is an electron app based on react components. This means, it can be published easily to any desktop plattform (windows, linux, mac). With few modifications it can also be deployed in the web. As boilerplate, the following repository has been used: https://github.com/bradtraversy/simple-electron-react

### Install

#### Clone this repo

```
git clone https://github.com/cadus/remo2hbo_oktopus_frontend
```

#### Install dependencies

```
yarn install
```

### Usage

#### Run the app

```
yarn start
```

and with data stream simulation

```
python3 datastream/stream_replay.py -b datastream/3chECG_bp_pulse_spo2.resampled.bin | yarn start
```
