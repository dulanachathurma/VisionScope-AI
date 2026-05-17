
# VisionScope AI 👁️

**Real-Time Human Body Part Detection using Python, Flask, MediaPipe & React**


<img width="1307" height="690" alt="VisionScope" src="https://github.com/user-attachments/assets/4b8e332c-7346-442e-9a13-789971b9ef7a" />


> An internship-level full-stack AI computer vision project by **Dulana Chathurma**.

---

## 🚀 Features

- **Live Webcam Detection** — real-time body part detection via webcam stream
- **Image Upload Analysis** — drag-and-drop photo upload with AI analysis
- **Bounding Boxes** — colored boxes drawn around each detected part
- **Confidence Scores** — percentage confidence for each detection
- **12+ Parts Detected** — Face, Eyes, Nose, Mouth, Ears, Hands, Fingers
- **Annotated Image Download** — save the analyzed image
- **Detection History** — track recent scans
- **Responsive Design** — works on desktop and mobile
- **Dark Futuristic UI** — glassmorphism, gradients, smooth animations

---

## 🛠️ Tech Stack

| Layer      | Technology               |
|------------|--------------------------|
| Frontend   | React 18 + Vite          |
| Styling    | Tailwind CSS             |
| Animation  | Framer Motion            |
| Icons      | Lucide React             |
| HTTP       | Axios                    |
| Routing    | React Router v6          |
| Backend    | Python Flask             |
| AI/CV      | MediaPipe + OpenCV       |
| CORS       | flask-cors               |

---

## 📁 Project Structure

```
visionscope-ai/
├── backend/
│   ├── app.py           # Flask server with /detect and /detect-frame routes
│   ├── detector.py      # MediaPipe AI detection logic
│   ├── requirements.txt # Python dependencies
│   └── uploads/         # Temporary uploaded files
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Top navigation bar
│   │   │   ├── Footer.jsx          # Footer with copyright
│   │   │   ├── DetectionCard.jsx   # Individual detection result card
│   │   │   ├── ParticleField.jsx   # Canvas particle animation
│   │   │   ├── AnimatedCounter.jsx # Number counter animation
│   │   │   └── Scanline.jsx        # Ambient scanline effect
│   │   ├── pages/
│   │   │   ├── Home.jsx            # Landing page with hero & stats
│   │   │   ├── LiveDetection.jsx   # Webcam detection page
│   │   │   ├── UploadDetection.jsx # Image upload page
│   │   │   └── About.jsx           # Project info page
│   │   ├── hooks/
│   │   │   └── useDetectionHistory.js
│   │   ├── utils/
│   │   │   └── api.js              # Axios API helpers
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

---

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/visionscope-ai.git
cd visionscope-ai
```

### 2. Start the Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

The backend will run at **http://localhost:5000**

### 3. Start the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at **http://localhost:3000**

---

## 🧠 How the AI Works

1. **Input**: User provides an image (upload or webcam frame)
2. **Preprocessing**: OpenCV reads and converts to RGB
3. **Face Mesh**: MediaPipe detects 478 facial landmarks
4. **Hand Tracking**: MediaPipe detects 21 hand landmarks per hand
5. **Region Mapping**: Landmark groups are mapped to named body parts
6. **Bounding Boxes**: OpenCV draws colored boxes on detected regions
7. **Response**: Annotated image + JSON detections returned to frontend
8. **Display**: React renders detection cards with confidence bars

### Detection Capabilities

| Part         | Method              | Confidence Range |
|--------------|---------------------|-----------------|
| Face         | Face Mesh           | 94-99%          |
| Left/Right Eye | Face Mesh landmarks | 90-97%        |
| Nose         | Face Mesh landmarks | 92-98%          |
| Mouth        | Face Mesh landmarks | 89-96%          |
| Left/Right Ear | Face Mesh landmarks | 78-91%        |
| Left/Right Hand | Hand Tracking   | 88-97%          |
| Fingers (5)  | Hand Tracking       | 82-94%          |

---

## 📡 API Endpoints

### `POST /detect`
Upload an image file for detection.
- **Body**: `multipart/form-data` with `image` field
- **Returns**: `{ detections: [...], annotated_image: "data:image/jpeg;base64,...", total: N }`

### `POST /detect-frame`
Send a base64 webcam frame for detection.
- **Body**: `{ "frame": "data:image/jpeg;base64,..." }`
- **Returns**: Same as above

### `GET /health`
Check backend status.
- **Returns**: `{ "status": "ok" }`

---

## 🔮 Future Improvements

- [ ] YOLOv8 integration for faster detection
- [ ] Full body pose estimation
- [ ] Emotion detection
- [ ] Age & gender classification
- [ ] Multi-person detection
- [ ] Video file upload support
- [ ] Mobile app (React Native)
- [ ] Cloud deployment (AWS / GCP)

---

## 👤 Author

**Dulana Chathurma**

---

## 📄 License

© 2026 Dulana Chathurma. All Rights Reserved.
