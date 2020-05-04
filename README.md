# AccelerometerAppWithMQTT

> This Ionic mobile app listens to accelerometer data in smartphone/Iphone and uploads to InfluxDB running on a Amazon EC2 instance: Ubuntu 18.04. This app makes use of MQTT over Websockets protocol for fast transmission.

## Table of Contents

1. [Summary](#Summary)

2. [Installation](#Installation)

3. [MQTTBroker Configuration](#Configuration)

4. [Security](#Security)
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

### Set up MQTT Endpoint

Output format from Ionic app:
```
{
    "x": float,
    "y": float,
    "z": float,
    "timestamp": int
}
```

[telegraf.conf](https://gist.github.com/anhtumai/b6d19b499a69c495d1a5e12f4f138899)

```
[[inputs.mqtt_consumer]]
  servers = ["tcp://localhost:1884"]
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

[etc/mosquitto/mosquitto.conf](https://gist.github.com/anhtumai/8d50e4e8f69e839b7d83d4ce5c770be2)


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

### Security 

Use SSL over Websocket protocol to secure data transmission.

1. Use OpenSSL to set up mosquitto broker 

```
# generate server key 
$> openssl genrsa -des3 -out server.key 2048

# generate self signed CA certificate
$>  openssl req -new -x509 -days 365 -extensions v3_ca -keyout ca.key -out ca.crt

# Send the CSR to the CA, or sign it with your CA key:
$> openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt -days 365
```

Add Certs to mosquitto.conf file:
```
cafile /home/ubuntu/key/ca.crt
keyfile /home/ubuntu/key/server.key
certfile /home/ubuntu/key/server.crt
```

2. Bypassing/ Ignoring CA certificate in Android

SSL/TLS handshakes consist of 2 parts: verification and key exchange 

Since we use self-signed CA certificate, it is not possible to verify MQTT broker with Certificate Authority. We can add CA certificate to each Android device, but it takes time. A simpler approach is to make Android ignore CA cert verification. Since MQTT broker address is hard-coded into the software,  verification can be skipped.

How to do this: 
[Ignoring invalid SSL certificates on Cordova for Android and iOS](http://ivancevich.me/articles/ignoring-invalid-ssl-certificates-on-cordova-android-ios/)