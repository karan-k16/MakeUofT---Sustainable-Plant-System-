import serial  # Serial communication with Arduino
import cv2
import numpy as np
import pandas as pd
import time
import csv
from flask import Flask, Response, jsonify, request
from flask_cors import CORS
from datetime import datetime
from sklearn.linear_model import LinearRegression

# Define the COM port and baud rate
COM_PORT = "COM3"  # Set the port where the Arduino is connected
BAUD_RATE = 9600  # Must match Arduino's Serial.begin value

app = Flask(__name__)
CORS(app)

cap = cv2.VideoCapture(0)
csv_file = "plant_growth_log.csv"
recording = False  
depth_cm = 50  # Assumed depth value, updated via User

# HSV Ranges for Color Detection
LOWER_TOP_MARKER = np.array([0, 120, 70])   # RED
UPPER_TOP_MARKER = np.array([10, 255, 255])
LOWER_BOTTOM_MARKER = np.array([90, 50, 50])  # BLUE
UPPER_BOTTOM_MARKER = np.array([130, 255, 255])

# Initialize CSV File
def initialize_csv():
    with open(csv_file, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["Timestamp", "Plant Height (cm)"])

initialize_csv()

# Function to detect color markers
def detect_marker(frame, lower_bound, upper_bound):
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    mask = cv2.inRange(hsv, lower_bound, upper_bound)
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    if contours:
        largest_marker = max(contours, key=cv2.contourArea)
        x, y, w, h = cv2.boundingRect(largest_marker)
        return x + w // 2, y + h // 2
    return None

# Function to log height to CSV
def log_to_csv(height_cm):
    if not recording:
        return
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open(csv_file, 'a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([timestamp, height_cm])
    print(f"Logged: {timestamp}, Height: {height_cm:.2f} cm")

# Serial communication setup
try:
    serialInst = serial.Serial(COM_PORT, BAUD_RATE, timeout=1)
    print(f"Connected to {COM_PORT}")
    humidity, temperature, soil_moisture = None, None, None
    counter = 0  # Counter to track sensor readings
except serial.SerialException as e:
    print(f"Error: {e}")
    serialInst = None

# Function to generate video frames
def generate_frames():
    last_height = None
    height_threshold = 0.5  # Minimum change required to log
    update_interval = 10  # Seconds between logs
    last_update_time = time.time()

    while True:
        success, frame = cap.read()
        if not success:
            break

        frame = cv2.flip(frame, 1)

        if recording:
            top_marker = detect_marker(frame, LOWER_TOP_MARKER, UPPER_TOP_MARKER)
            bottom_marker = detect_marker(frame, LOWER_BOTTOM_MARKER, UPPER_BOTTOM_MARKER)

            if top_marker and bottom_marker:
                top_x, top_y = top_marker
                bottom_x, bottom_y = bottom_marker
                plant_height_px = abs(bottom_y - top_y)
                cm_per_pixel = depth_cm / 500
                plant_height_cm = plant_height_px * cm_per_pixel

                current_time = time.time()
                if last_height is None or (abs(plant_height_cm - last_height) > height_threshold and 
                                           current_time - last_update_time > update_interval):
                    last_height = plant_height_cm
                    last_update_time = current_time
                    log_to_csv(plant_height_cm)

                cv2.circle(frame, (top_x, top_y), 10, (0, 0, 255), -1)
                cv2.circle(frame, (bottom_x, bottom_y), 10, (255, 0, 0), -1)
                cv2.line(frame, (top_x, top_y), (bottom_x, bottom_y), (0, 255, 0), 2)
                cv2.putText(frame, f"Height: {plant_height_cm:.2f} cm", 
                            (top_x, top_y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)

        _, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

# API Endpoints
@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/start_recording', methods=['POST'])
def start_recording():
    global recording
    recording = True
    return jsonify({"message": "Recording started."})

@app.route('/stop_recording', methods=['POST'])
def stop_recording():
    global recording
    recording = False
    return jsonify({"message": "Recording stopped."})

@app.route('/set_depth', methods=['POST'])
def set_depth():
    global depth_cm
    try:
        data = request.json
        depth_cm = float(data.get("depth", 50))
        return jsonify({"message": f"Depth set to {depth_cm} cm"})
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/clear_data', methods=['POST'])
def clear_data():
    global recording
    recording = False
    initialize_csv()
    return jsonify({"message": "Data cleared."})

@app.route('/growth_data')

@app.route('/growth_data')
def growth_data():
    try:
        df = pd.read_csv(csv_file)

        # Required columns for height tracking
        required_columns = ["Timestamp", "Plant Height (cm)"]

        # Ensure only necessary columns exist
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            print(f"Missing columns: {missing_columns}")
            for col in missing_columns:
                df[col] = None  # Add missing columns with empty values
            df.to_csv(csv_file, index=False)  # Save the corrected CSV
            return jsonify({"error": "CSV file was missing required columns. Fixed automatically, please reload."})

        if df.empty or len(df) < 2:
            return jsonify({"days": [], "height": [], "final_day": None})

        df["Timestamp"] = pd.to_datetime(df["Timestamp"])
        df["Days"] = (df["Timestamp"] - df["Timestamp"].min()).dt.total_seconds() / 86400

        return jsonify({
            "days": df["Days"].tolist(),
            "height": df["Plant Height (cm)"].tolist(),
        })
    except Exception as e:
        return jsonify({"error": str(e)})


if __name__ == "__main__":
    app.run(debug=True)