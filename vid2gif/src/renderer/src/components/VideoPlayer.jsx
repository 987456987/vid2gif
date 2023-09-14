import React, { useRef, useState, useEffect } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

function VideoPlayer() {
  const videoRef = useRef(null);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [sampleInterval, setSampleInterval] = useState(100); // Adjust this as needed
  const [capturedFrames, setCapturedFrames] = useState([]);
  
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('loadedmetadata', () => {
        setDuration(videoRef.current.duration);
        setEndTime(videoRef.current.duration);
      });
    }
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const videoURL = URL.createObjectURL(file);
      videoRef.current.src = videoURL;
      videoRef.current.load();
      videoRef.current.play();
    }
  };

  const handleSliderChange = (values) => {
    setStartTime(values[0]);
    setEndTime(values[1]);
  };

  const handlePlayRange = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
      videoRef.current.play();
    }
  };

  const captureFrames = () => {
    let currentTime = startTime;
    const frames = [];

    const captureFrame = () => {
      if (videoRef.current && currentTime <= endTime) {
        videoRef.current.currentTime = currentTime;
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        frames.push(dataUrl);
        currentTime += sampleInterval / 1000; // Convert ms to seconds

        setTimeout(captureFrame, sampleInterval);
      } else {
        setCapturedFrames(frames);
      }
    };

    captureFrame();
  };

  return (
    <div className="outer-container">
      <input type="file" accept="video/*" onChange={handleFileSelect} />

      <video ref={videoRef} controls style={{ width: '100%', height: 'auto' }}>
        <source src="" type="video/mp4" />
      </video>

      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <span>Start Time: {startTime.toFixed(1)}</span>
        <span style={{ marginLeft: '10px', marginRight: '10px' }}>|</span>
        <span>End Time: {endTime.toFixed(1)}</span>
      </div>

      <Slider
        range
        min={0}
        max={duration}
        step={0.1}
        value={[startTime, endTime]}
        onChange={handleSliderChange}
      />
    
      <button onClick={handlePlayRange}>Play Range</button>
      <button onClick={captureFrames}>Capture Frames</button>

      {/* Display the captured frames */}
      {capturedFrames.length > 0 && (
        <div>
          <h2>Captured Frames:</h2>
          {capturedFrames.map((frame, index) => (
            <img
              key={index}
              src={frame}
              alt={`Frame ${index}`}
              style={{ maxWidth: '200px', maxHeight: '200px' }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;
