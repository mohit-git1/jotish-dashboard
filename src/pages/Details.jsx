import { useRef, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import useEmployeeData from '../hooks/useEmployeeData'

const Details = () => {
  const { id } = useParams()
  const { data } = useEmployeeData()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const signatureCanvasRef = useRef(null)

  const [stream, setStream] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 })

  const employee = data.find((emp) => emp[3] === id)

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stream])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
      videoRef.current.srcObject = mediaStream
      setStream(mediaStream)
      setCameraActive(true)
    } catch (err) {
      alert('Camera access denied: ' + err.message)
    }
  }

  const capturePhoto = () => {
    const canvas = canvasRef.current
    const video = videoRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/png')
    setPhoto(dataUrl)
    stream.getTracks().forEach((track) => track.stop())
    setCameraActive(false)

    setTimeout(() => {
      const sigCanvas = signatureCanvasRef.current
      sigCanvas.width = canvas.width
      sigCanvas.height = canvas.height
    }, 100)
  }

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    }
  }

  const startDrawing = (e) => {
    e.preventDefault()
    setIsDrawing(true)
    setLastPos(getPos(e, signatureCanvasRef.current))
  }

  const draw = (e) => {
    e.preventDefault()
    if (!isDrawing) return
    const canvas = signatureCanvasRef.current
    const ctx = canvas.getContext('2d')
    const pos = getPos(e, canvas)
    ctx.beginPath()
    ctx.moveTo(lastPos.x, lastPos.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = '#00ff88'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.stroke()
    setLastPos(pos)
  }

  const stopDrawing = (e) => {
    e.preventDefault()
    setIsDrawing(false)
  }

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const mergeAndProceed = () => {
    const finalCanvas = document.createElement('canvas')
    const photoCanvas = canvasRef.current
    const sigCanvas = signatureCanvasRef.current

    finalCanvas.width = photoCanvas.width
    finalCanvas.height = photoCanvas.height

    const ctx = finalCanvas.getContext('2d')
    ctx.drawImage(photoCanvas, 0, 0)
    ctx.drawImage(sigCanvas, 0, 0)

    const mergedImage = finalCanvas.toDataURL('image/png')
    localStorage.setItem('merged_image', mergedImage)
    localStorage.setItem('audit_employee', JSON.stringify(employee))
    navigate('/result')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/list')}
            className="text-gray-400 hover:text-white text-sm"
          >
            ← Back to List
          </button>
          <button
            onClick={() => { logout(); navigate('/login') }}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm"
          >
            Logout
          </button>
        </div>

        {employee ? (
          <div className="bg-gray-900 rounded-2xl p-6 mb-6">
            <h1 className="text-2xl font-bold mb-1">{employee[0]}</h1>
            <p className="text-blue-400 mb-4">{employee[1]}</p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-400">City</p>
                <p>{employee[2]}</p>
              </div>
              <div>
                <p className="text-gray-400">Employee ID</p>
                <p>{employee[3]}</p>
              </div>
              <div>
                <p className="text-gray-400">Salary</p>
                <p className="text-green-400">{employee[5]}</p>
              </div>
              <div>
                <p className="text-gray-400">Start Date</p>
                <p>{employee[4]}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-2xl p-6 mb-6">
            <p className="text-gray-400">Loading employee data...</p>
          </div>
        )}

        <div className="bg-gray-900 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Identity Verification</h2>

          {!photo && (
            <div className="flex flex-col items-center gap-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="rounded-xl w-full max-w-md bg-black"
                style={{ display: cameraActive ? 'block' : 'none' }}
              />

              {!cameraActive && (
                <div className="w-full max-w-md h-48 bg-gray-800 rounded-xl flex items-center justify-center">
                  <p className="text-gray-500 text-sm">Camera inactive</p>
                </div>
              )}

              <div className="flex gap-3">
                {!cameraActive && (
                  <button
                    onClick={startCamera}
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-sm transition-colors"
                  >
                    Start Camera
                  </button>
                )}
                {cameraActive && (
                  <button
                    onClick={capturePhoto}
                    className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg text-sm transition-colors"
                  >
                    Capture Photo
                  </button>
                )}
              </div>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />

          {photo && (
            <div className="flex flex-col items-center gap-4">
              <p className="text-gray-400 text-sm">Sign your name over the photo below</p>

              <div className="relative" style={{ width: '100%', maxWidth: '480px' }}>
                <img
                  src={photo}
                  alt="captured"
                  className="rounded-xl w-full"
                />
                <canvas
                  ref={signatureCanvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="absolute top-0 left-0 w-full h-full rounded-xl cursor-crosshair"
                  style={{ touchAction: 'none' }}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={clearSignature}
                  className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg text-sm transition-colors"
                >
                  Clear Signature
                </button>
                <button
                  onClick={mergeAndProceed}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-sm transition-colors"
                >
                  Confirm & Continue →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Details
