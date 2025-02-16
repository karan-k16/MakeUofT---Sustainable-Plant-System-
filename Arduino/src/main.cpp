#include <Arduino.h>
#include "dht.h"

#define dht_apin A0  // Analog Pin where temperature and humidity sensor is connected
#define moistureSensorPin A1  // Analog Pin where soil moisture sensor is connected

// Initialize DHT device
dht DHT;

// Moisture data
int moistureValue = 0;

// Timing variables
unsigned long lastCheck = 0;
const unsigned long timeInterval = 2000;  // 2 seconds

/*
Setup
*/
void setup() {
  delay(500);
  Serial.begin(9600);      // Initialize Serial Monitor (USB)
  delay(1000);
}

/*
Functions
*/

// Function to measure temperature and humidity
void tempratureAndHumidity() {
  DHT.read11(dht_apin); // Read temperature and humidity
}

// Function to measure soil moisture
void soilMoistureSensor() {
  moistureValue = analogRead(moistureSensorPin); // Read the sensor value
}

void printAll(){
  // Format data string
  // String data = "Humidity: " + String(DHT.humidity) + "%, Temperature: " + String(DHT.temperature) + "C" + "\nSoil Moisture Value: " + String(moistureValue);
  String data = String(DHT.humidity) + "\n" + String(DHT.temperature) + "\n" + String(moistureValue);
  Serial.println(data);
}

/*
Loop
*/
void loop() {
  unsigned long currentMillis = millis();
  // Check soil moisture every 2 seconds
  if (currentMillis - lastCheck >= timeInterval) {
    lastCheck = currentMillis;
    tempratureAndHumidity();
    soilMoistureSensor();
    printAll();
  }
}
