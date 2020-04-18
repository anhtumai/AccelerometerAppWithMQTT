# AccelerometerAppWithMQTT

> This Ionic mobile app listens to accelerometer data in smartphone/Iphone and uploads to InfluxDB running on a Amazon EC2 instance: Ubuntu 18.04. This app makes use of MQTT over Websockets protocol for fast transmission.

## Table of Contents

1. [Summary](#Summary)

2. [Installation](#Installation)

3. [MQTTBroker Configuration](#Configuration)

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

## Configuration

### Data flow

![b](https://user-images.githubusercontent.com/32799668/79673784-734ad780-81e5-11ea-8ce9-adbce9810f73.png)

### Set up telegraf and mosquitto

telegraf.conf: https://gist.github.com/anhtumai/b6d19b499a69c495d1a5e12f4f138899

etc/mosquitto/mosquitto.conf: https://gist.github.com/anhtumai/8d50e4e8f69e839b7d83d4ce5c770be2

```
$> sudo mosquitto -c /etc/mosquitto/mosquitto.conf
$> telegraf --config /path/to/telegraf.conf
$> sudo systemctl start influxd
```
