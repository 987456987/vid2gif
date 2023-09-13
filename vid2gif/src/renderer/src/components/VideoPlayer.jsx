/* eslint-disable prettier/prettier */
import { useRef } from 'react'

const VideoPlayer = () => {
  const videoRef = useRef(null)

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      const videoURL = URL.createObjectURL(file)
      videoRef.current.src = videoURL
      videoRef.current.load()
      videoRef.current.play()
    }
  }

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleFileSelect} />
      <video ref={videoRef} controls style={{ width: '100%', height: 'auto' }} />
    </div>
  )
}

export default VideoPlayer
