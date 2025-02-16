## Inspiration
We wanted to create an all-in-one plant ecosystem that records environmental data and tracks plant growth using computer vision. Our goal was to develop a system that could help plant owners monitor and optimize plant health with minimal manual intervention.

## What it does
WaterYouDoing is a smart plant monitoring system that records:
- **Temperature**
- **Moisture**
- **Humidity**
- **Plant growth tracking** using computer vision markers

All collected data is plotted on our frontend for easy visualization.

## How we built it
We used an **Arduino** and the technologies listed in our orders:
- **Sensors:** Humidity, soil moisture, temperature
- **Computer Vision:** OpenCV's Open Library for contour mapping and object recognition.
- **Camera Feed:** Connected via OpenCV to generate frames, mark pixels, and log pixel height differences in a CSV file.
- **Data Logging:** Measurements were timestamped for plotting and used for **linear regression to predict plant growth days**.
- **Microcontroller Connection:** PySerial was used to connect the Arduino to our local database.
- **Watering Mechanism:** A **servo motor** was used for water pumping, with a **backup wick system made of string** in case the servo failed.

## Challenges we ran into
- **Bluetooth module issues** – It didn't connect properly to our devices.
- **Servo motor problems** – Wires detached, making it unreliable.
- **Hardware transport** – Moving from residence to the venue was challenging.
- **Backend-frontend integration** – Learning how to connect everything in a short time.
- **Time constraints** – Balancing hardware setup and software development was difficult.

## Accomplishments that we're proud of
- Successfully implementing a **computer vision-based plant growth tracker**.
- Building a **working prototype** with multiple integrated sensors.
- Overcoming hardware setbacks with creative solutions like the **wick-based watering system**.
- Logging and predicting plant growth data using **linear regression**.

## What we learned
- **Hardware debugging skills**, especially with Bluetooth and servo motors.
- **OpenCV for plant tracking** and contour mapping.
- **Frontend-backend integration** and real-time data visualization.
- **Optimizing library usage** for efficient processing.

## What's next for WaterYouDoing
- **Scaling up** with a **peristaltic water pump** for better water flow control.
- **Improving the housing materials** for better durability and sensor accuracy.
- **Enhancing our computer vision model** using **Hugging Face** to estimate plant depth automatically.
- **Optimizing the codebase** for better efficiency and real-time performance.

We’re excited to continue improving **WaterYouDoing** and making plant monitoring smarter and more accessible!  

Created By: Karan Kardam, Daksh Khanna, Justin Lam, Arya Lum  

Built With: Arduino, OpenCV, Python, React, Flask
