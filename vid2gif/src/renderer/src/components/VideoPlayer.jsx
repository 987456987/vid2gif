import { useRef, useState, useEffect } from 'react'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import '../assets/rc-custom.css'

const VideoPlayer = () => {
  const videoRef = useRef(null)
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('loadedmetadata', () => {
        setDuration(videoRef.current.duration)
        setEndTime(videoRef.current.duration)
      })
    }
  }, [])

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      const videoURL = URL.createObjectURL(file)
      videoRef.current.src = videoURL
      videoRef.current.load()
      videoRef.current.play()
    }
  }

  const handleSliderChange = (values) => {
    setStartTime(values[0])
    setEndTime(values[1])
  }

  const handlePlayRange = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = startTime
      videoRef.current.play()
    }
  }

  useEffect(() => {
    const handleTimeUpdate = () => {
      if (videoRef.current) {
        if (videoRef.current.currentTime >= endTime) {
          videoRef.current.pause()
        }
      }
    }

    videoRef.current.addEventListener('timeupdate', handleTimeUpdate)

    return () => {
      videoRef.current.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [endTime])

  return (
    <div className='outer-container'>
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
    </div>
  )
}

export default VideoPlayer
