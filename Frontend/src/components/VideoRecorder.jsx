import { useState, useRef } from "react";
import axios from "axios";

export default function VideoRecorder({ setOverviewData }) {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunks = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    videoRef.current.srcObject = stream;

    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (e) => {
      chunks.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = sendVideo;

    chunks.current = [];
    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const sendVideo = async () => {
    setLoading(true);

    const blob = new Blob(chunks.current, { type: "video/webm" });
    const formData = new FormData();
    formData.append("video", blob);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/video-upload",
        formData
      );

      console.log("AI Output:", res.data);

      setOverviewData(res.data.extracted);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="p-4">
      <h2>🎥 Speak with Camera</h2>

      <video ref={videoRef} autoPlay muted width="300" />

      {!recording ? (
        <button onClick={startRecording}>Start</button>
      ) : (
        <button onClick={stopRecording}>Stop</button>
      )}

      {loading && <p>🔄 Processing video + audio...</p>}
    </div>
  );
}