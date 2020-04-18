import { Component } from "@angular/core";
import {
  DeviceMotion,
  DeviceMotionAccelerationData,
  DeviceMotionAccelerometerOptions,
} from "@ionic-native/device-motion/ngx";

import * as MQTT from "paho-mqtt";
import { Observable } from "rxjs";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  mqtt_url: string;
  mqtt_port: number;

  x: string;
  y: string;
  z: string;
  timestamp: number;
  gra_x: number;
  gra_y: number;
  gra_z: number;
  alpha: number;

  acceleration_observer: Observable<DeviceMotionAccelerationData>;
  acceleration_subscriber: any;
  connectedMQTTUrl: string;

  mqttBrokerConnectFlag: boolean;
  listeningFlag: boolean;
  sendingMQTTFlag: boolean;

  topics: string[] = [
    "telegraf/x",
    "telegraf/y",
    "telegraf/z",
    "telegraf/timestamp",
  ];

  client: MQTT.Client;

  constructor() {
    this.x = "-";
    this.y = "-";
    this.z = "-";

    this.mqtt_url = "13.49.46.146";
    this.mqtt_port = 9001;

    this.alpha = 0.8;
    this.gra_x = 0;
    this.gra_y = 0;
    this.gra_z = 0;

    this.connectedMQTTUrl = "";

    this.mqttBrokerConnectFlag = false;
    this.listeningFlag = false;
    this.sendingMQTTFlag = false;
  }

  connectToMQTTBroker(hostname: string, port: number, id: string) {
    let options = {
      timeout: 60,
      useSSL: false,
      onSuccess: this.onConnect.bind(this),
      onFailure: this.onFailure.bind(this),
    };
    this.client = new MQTT.Client(hostname, port, id);

    this.client.onConnectionLost = this.onConnectionLost.bind(this);
    this.client.onMessageArrived = this.onMessageArrived.bind(this);
    this.client.connect(options);
  }

  disconnectMQTTBroker() {
    this.client.disconnect();
    this.mqttBrokerConnectFlag = false;
    this.client = undefined;
    this.connectedMQTTUrl = "";
  }

  onConnect() {
    console.log("onConnect");
    this.mqttBrokerConnectFlag = true;
    this.connectedMQTTUrl = this.mqtt_url + ":" + this.mqtt_port;

    console.log(this.client);
    console.log(this.mqttBrokerConnectFlag);
    console.log(this);
  }
  onFailure() {
    console.log("onFailure");
    this.mqttBrokerConnectFlag = false;
    this.client = undefined;

    alert("Fail to connect to MQTT broker, please recheck");
  }

  onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:" + responseObject.errorMessage);
      this.mqttBrokerConnectFlag = false;
      this.client = undefined;
    }
  }
  onMessageArrived(message) {
    console.log("onMessageArrived:" + message.payloadString);
  }

  sendMessage() {
    console.log("Connected", this.mqttBrokerConnectFlag);

    let values: string[] = [this.x, this.y, this.z, this.timestamp.toString()];

    for (let i = 0; i < 3; i++) {
      let message = new MQTT.Message(values[i]);
      message.destinationName = this.topics[i];
      this.client.send(message);
    }
  }

  async startListening() {
    if (this.listeningFlag == true) {
      return;
    }
    this.listeningFlag = true;
    var option: DeviceMotionAccelerometerOptions = {
      frequency: 50,
    };
    this.acceleration_subscriber = new DeviceMotion()
      .watchAcceleration(option)
      .subscribe((acceleration: DeviceMotionAccelerationData) => {
        console.log("get message");
        this.getAccelerationData(acceleration);
        if (
          this.sendingMQTTFlag == true &&
          this.mqttBrokerConnectFlag == true
        ) {
          this.sendMessage();
        }
      });
  }
  stopListening() {
    this.acceleration_subscriber.unsubscribe();
    this.listeningFlag = false;
  }
  getAccelerationData(acceleration: DeviceMotionAccelerationData) {
    this.gra_x = this.alpha * this.gra_x + (1 - this.alpha) * acceleration.x;
    this.gra_y = this.alpha * this.gra_y + (1 - this.alpha) * acceleration.y;
    this.gra_z = this.alpha * this.gra_z + (1 - this.alpha) * acceleration.z;

    this.x = "" + (acceleration.x - this.gra_x).toFixed(4);
    this.y = "" + (acceleration.y - this.gra_y).toFixed(4);
    this.z = "" + (acceleration.z - this.gra_z).toFixed(4);
    this.timestamp = acceleration.timestamp.toFixed(0);
  }

  sendOneTime() {
    console.log("send one time");
    this.sendMessage();
  }

  clearUrlNPort() {
    this.mqtt_port = null;
    this.mqtt_url = "";
  }

  connectMQTTBroker() {
    if (this.mqttBrokerConnectFlag == true || this.client != undefined) {
      alert("Already been connected");
      return;
    }
    if (this.mqtt_port == null) {
      alert("Enter port");
      return;
    }
    if (this.mqtt_url == "") {
      alert("Enter Remote address");
      return;
    }
    this.connectToMQTTBroker(this.mqtt_url, this.mqtt_port, "Client_Tablet");

    // this.clearUrlNPort();
  }

  enableSending(event: any) {
    this.sendingMQTTFlag = event.target.checked;
  }
}
