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

  const emp = data.find((e) => e[3] === id)
  const existingVerification = localStorage.getItem(`verified_${id}`)

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop())
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
    canvas.getContext('2d').drawImage(video, 0, 0)
    setPhoto(canvas.toDataURL('image/png'))
    stream.getTracks().forEach((t) => t.stop())
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
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY }
  }

  const startDrawing = (e) => { e.preventDefault(); setIsDrawing(true); setLastPos(getPos(e, signatureCanvasRef.current)) }

  const draw = (e) => {
    e.preventDefault()
    if (!isDrawing) return
    const canvas = signatureCanvasRef.current
    const ctx = canvas.getContext('2d')
    const pos = getPos(e, canvas)
    ctx.beginPath()
    ctx.moveTo(lastPos.x, lastPos.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = '#1a56db'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.stroke()
    setLastPos(pos)
  }

  const stopDrawing = (e) => { e.preventDefault(); setIsDrawing(false) }

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
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
    localStorage.setItem(`verified_${id}`, mergedImage)
    localStorage.setItem('merged_image', mergedImage)
    localStorage.setItem('audit_employee', JSON.stringify(emp))
    navigate('/result')
  }

  const viewExisting = () => {
    localStorage.setItem('merged_image', existingVerification)
    localStorage.setItem('audit_employee', JSON.stringify(emp))
    navigate('/result')
  }

  const reVerify = () => {
    localStorage.removeItem(`verified_${id}`)
    window.location.reload()
  }

  const card = { background: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '24px', marginBottom: '20px' }
  const label = { fontSize: '11px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }
  const btn = (bg, color = '#fff') => ({ background: bg, color, border: 'none', padding: '9px 20px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: '500' })

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f0', padding: '32px 24px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <button onClick={() => navigate('/list')} style={{ ...btn('#fff', '#555'), border: '1px solid #ccc' }}>
            Back to List
          </button>
          <button onClick={() => { logout(); navigate('/login') }} style={btn('#c0392b')}>Logout</button>
        </div>

        {emp ? (
          <div style={card}>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 4px 0' }}>{emp[0]}</h1>
            <p style={{ fontSize: '13px', color: '#1a56db', margin: '0 0 20px 0' }}>{emp[1]}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {[['City', emp[2]], ['Employee ID', emp[3]], ['Salary', emp[5]], ['Start Date', emp[4]]].map(([l, v]) => (
                <div key={l}>
                  <p style={label}>{l}</p>
                  <p style={{ fontSize: '14px', color: '#1a1a1a', margin: 0 }}>{v}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={card}><p style={{ color: '#999' }}>Loading employee data...</p></div>
        )}

        {existingVerification ? (
          <div style={card}>
            <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#2e7d32', margin: '0 0 16px 0' }}>Already Verified</h2>
            <img src={existingVerification} alt="verified" style={{ borderRadius: '6px', maxWidth: '100%', maxHeight: '280px', display: 'block', marginBottom: '16px' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={viewExisting} style={btn('#1a1a1a')}>View Result</button>
              <button onClick={reVerify} style={{ ...btn('#fff', '#555'), border: '1px solid #ccc' }}>Re-verify</button>
            </div>
          </div>
        ) : (
          <div style={card}>
            <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a', margin: '0 0 20px 0' }}>Identity Verification</h2>

            {!photo && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  style={{ borderRadius: '6px', width: '100%', maxWidth: '420px', background: '#eee', display: cameraActive ? 'block' : 'none' }}
                />
                {!cameraActive && (
                  <div style={{ width: '100%', maxWidth: '420px', height: '180px', background: '#f0f0ec', borderRadius: '6px', border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ color: '#aaa', fontSize: '13px' }}>Camera inactive</p>
                  </div>
                )}
                {!cameraActive && <button onClick={startCamera} style={btn('#1a1a1a')}>Start Camera</button>}
                {cameraActive && <button onClick={capturePhoto} style={btn('#2e7d32')}>Capture Photo</button>}
              </div>
            )}

            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {photo && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>Sign your name over the photo below</p>
                <div style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
                  <img src={photo} alt="captured" style={{ borderRadius: '6px', width: '100%', display: 'block' }} />
                  <canvas
                    ref={signatureCanvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '6px', cursor: 'crosshair', touchAction: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={clearSignature} style={{ ...btn('#fff', '#555'), border: '1px solid #ccc' }}>Clear</button>
                  <button onClick={mergeAndProceed} style={btn('#1a1a1a')}>Confirm and Continue</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Details