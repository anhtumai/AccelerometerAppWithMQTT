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

[![new8b06026308c924f5.gif](https://s4.gifyu.com/images/new8b06026308c924f5.gif)](https://gifyu.com/image/lin8)

## Installation

```
$> git clone https://github.com/anhtumai/AccelerometerAppWithMQTT.git
$> cd AccelerometerAppWithMQTT
$> npm install
$> ionic cordova run android
```

After running the app, to view its output on the cloud, go to:
http://13.49.46.146:9999/orgs/058f3794a3113000/dashboards/058f3799d9c73000?lower=now%28%29%20-%201h

Username: username

Password: password

## Configuration

### Data flow

![b](https://user-images.githubusercontent.com/32799668/79673784-734ad780-81e5-11ea-8ce9-adbce9810f73.png)

### Set up telegraf and mosquitto

Output format from Ionic app:
```
{
    "x": float,
    "y": float,
    "z": float,
    "timestamp": int
}
```

telegraf.conf: https://gist.github.com/anhtumai/b6d19b499a69c495d1a5e12f4f138899

```
[[inputs.mqtt_consumer]]
  servers = ["ws://localhost:9001"]
  qos = 0

 topics = [
    "telegraf/#"
  ]

  connection_timeout = "30s"

  persistent_session = false
  client_id = "Telegraf"
  data_format = "json"
  json_strict = true

```

etc/mosquitto/mosquitto.conf: https://gist.github.com/anhtumai/8d50e4e8f69e839b7d83d4ce5c770be2


To start services:

```
$> sudo systemctl start mosquitto

$> sudo nohup telegraf --config telegraf.conf --debug &> /var/log/telegraf/telegraf.log  &

$> nohup influxd &> /var/log/influxd/influxd.log &
```

To view log file output:

```
$> sudo tail -f /var/log/telegraf/telegraf.log

$> sudo tail -f /var/log/mosquitto/mosquitto.log

$> sudo tail -f /var/log/influxd/influxd.log
```
