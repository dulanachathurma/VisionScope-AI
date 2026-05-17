"""
VisionScope AI - Flask Backend
Handles image upload and real-time webcam frame detection
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from detector import detect_parts, detect_from_base64
import os
import base64

app = Flask(__name__)
CORS(app)  # Allow frontend to call backend

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.route('/')
def home():
    """Health check endpoint"""
    return jsonify({
        "message": "VisionScope AI Backend Running",
        "version": "1.0.0",
        "status": "active"
    })


@app.route('/detect', methods=['POST'])
def detect():
    """
    Detect body parts from an uploaded image file.
    Accepts: multipart/form-data with 'image' field
    Returns: JSON with detections array
    """
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files['image']

    if file.filename == '':
        return jsonify({"error": "Empty filename"}), 400

    # Save uploaded file
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    # Run AI detection
    results = detect_parts(filepath)

    return jsonify(results)


@app.route('/detect-frame', methods=['POST'])
def detect_frame():
    """
    Detect body parts from a webcam frame (base64 encoded).
    Accepts: JSON with 'frame' field (base64 string)
    Returns: JSON with detections array
    """
    data = request.get_json()

    if not data or 'frame' not in data:
        return jsonify({"error": "No frame data received"}), 400

    # Decode base64 image from frontend
    frame_data = data['frame']

    # Remove the data URL prefix if present (e.g., "data:image/jpeg;base64,")
    if ',' in frame_data:
        frame_data = frame_data.split(',')[1]

    results = detect_from_base64(frame_data)

    return jsonify(results)


@app.route('/health', methods=['GET'])
def health():
    """Simple health check"""
    return jsonify({"status": "ok", "message": "VisionScope AI is alive"})


if __name__ == '__main__':
    print("🚀 VisionScope AI Backend Starting...")
    print("📡 API running at http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
