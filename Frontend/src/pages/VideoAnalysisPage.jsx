import { useRef, useState } from "react";
import axios from "axios";

export default function VideoAnalysisPage() {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunks = useRef([]);

  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🎥 START
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    videoRef.current.srcObject = stream;

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      chunks.current.push(e.data);
    };

    mediaRecorder.onstop = sendToBackend;

    chunks.current = [];
    mediaRecorder.start();
    setRecording(true);
  };

  // 🛑 STOP
  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  // 📤 SEND VIDEO
  const sendToBackend = async () => {
    setLoading(true);

    const blob = new Blob(chunks.current, { type: "video/webm" });
    const formData = new FormData();
    formData.append("video", blob);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/video-upload",
        formData
      );

      console.log("🔥 AI Extracted Data:", res.data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🎥 Video + Audio Analyzer</h2>

      <video ref={videoRef} autoPlay muted width="400" />

      <div style={{ marginTop: 10 }}>
        {!recording ? (
          <button onClick={startRecording}>Start Recording</button>
        ) : (
          <button onClick={stopRecording}>Stop Recording</button>
        )}
      </div>

      {loading && <p>⏳ Processing...</p>}
    </div>
  );
}