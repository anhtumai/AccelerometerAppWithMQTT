# AccelerometerAppWithMQTT

> This Ionic mobile app listens to accelerometer data in smartphone/Iphone and uploads to InfluxDB running on a Amazon EC2 instance: Ubuntu 18.04. This app makes use of MQTT over Websockets protocol for fast transmission.

## Table of Contents

1. [Summary](#Summary)

2. [Installation](#Installation)

## Summary

App overview:

[![lf52c1d0a6751e0ee.gif](https://s4.gifyu.com/images/lf52c1d0a6751e0ee.gif)](https://gifyu.com/image/lW5q)

InfluxDB output on AWS EC2 overview:
[![ezgif.com-video-to-gif4c0e11766da1fb1e.gif](https://s4.gifyu.com/images/ezgif.com-video-to-gif4c0e11766da1fb1e.gif)](https://gifyu.com/image/lW5l)

## Installation

```
$> git clone https://github.com/anhtumai/AccelerometerAppWithMQTT.git
$> cd AccelerometerAppWithMQTT
$> npm install
$> ionic cordova run android
```

After running the app, to view its output on the cloud, go to:
http://13.49.46.146:9999/orgs/058f3794a3113000/dashboards/058f3799d9c73000?lower=now%28%29%20-%205m

Username: username

Password: password
