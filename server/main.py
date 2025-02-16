import serial  # Import the serial library to communicate with Arduino
import csv
import time
import os
from datetime import datetime

# Define the COM port and baud rate
COM_PORT = "COM3"  # Set the port where the Arduino is connected
BAUD_RATE = 9600  # Set the baud rate (must match Arduino's Serial.begin value)

# Get the script's directory
script_dir = os.path.dirname(os.path.abspath(__file__))
CSV_FILE = os.path.join(script_dir, "sensor_data.csv")  # Define the CSV file path

try:
    # Open the serial connection with specified port and baud rate
    serialInst = serial.Serial(COM_PORT, BAUD_RATE, timeout=1)
    print(f"Connected to {COM_PORT}")

    # Open the CSV file in append mode
    with open(CSV_FILE, mode="a", newline="") as file:
        writer = csv.writer(file)
        
        # Write header if the file is empty
        if file.tell() == 0:
            writer.writerow(["Timestamp", "Humidity", "Temperature", "Soil Moisture"])

        humidity = None
        temperature = None
        soil_moisture = None
        counter = 0  # Counter to track sensor readings
        
        while True:
            if serialInst.in_waiting > 0:  # Check if data is available to be read
                line = serialInst.readline().decode('utf-8').strip()  # Read and decode serial input
                
                # Assign values based on reading sequence
                if counter % 3 == 0:
                    humidity = line
                elif counter % 3 == 1:
                    temperature = line
                elif counter % 3 == 2:
                    soil_moisture = line
                    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    
                    # Write data to CSV file
                    writer.writerow([timestamp, humidity, temperature, soil_moisture])
                    file.flush()  # Ensure data is written immediately
                    print(f"Logged: {timestamp}, {humidity}, {temperature}, {soil_moisture}")
                    
                    time.sleep(2.5)  # Wait 2.5 seconds before next reading
                
                counter += 1  # Increment counter

except serial.SerialException as e:
    print(f"Error: {e}")

except KeyboardInterrupt:
    print("\nClosing connection...")
    serialInst.close()  # Close the serial connection properly
