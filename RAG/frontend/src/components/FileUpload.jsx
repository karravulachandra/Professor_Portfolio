import { useState, useRef, useEffect } from 'react'
import axios from 'axios'

const FileUpload = ({ onUploadStart, onUploadSuccess, onUploadError, isUploading }) => {
  const [files, setFiles] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [supportedFormats, setSupportedFormats] = useState([])
  const fileInputRef = useRef(null)

  // Fetch supported formats from the backend
  useEffect(() => {
    const fetchSupportedFormats = async () => {
      try {
        // Try to upload an empty file to get the error with supported formats
        const formData = new FormData()
        await axios.post('/api/upload', formData)
      } catch (error) {
        if (error.response?.data?.supported_formats) {
          setSupportedFormats(error.response.data.supported_formats)
        } else {
          // Default supported formats if we can't get them from the API
          setSupportedFormats(['.pdf', '.txt', '.docx', '.doc', '.md', '.html', '.csv', '.xlsx', '.xls'])
        }
      }
    }

    fetchSupportedFormats()
  }, [])

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    validateAndSetFiles(selectedFiles)
  }

  const validateAndSetFiles = (selectedFiles) => {
    // Filter for supported file types
    const validFiles = selectedFiles.filter(file => {
      const extension = '.' + file.name.split('.').pop().toLowerCase()
      return supportedFormats.includes(extension)
    })

    if (validFiles.length !== selectedFiles.length) {
      onUploadError(
        `${selectedFiles.length - validFiles.length} files were rejected. ` +
        `Supported formats: ${supportedFormats.join(', ')}`
      )
    }

    setFiles(validFiles)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files.length > 0) {
      validateAndSetFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      onUploadError('Please select at least one PDF file')
      return
    }

    onUploadStart()

    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      onUploadSuccess(response.data.message)
      setFiles([])
    } catch (error) {
      console.error('Upload error:', error)
      onUploadError(error.response?.data?.detail || 'Error uploading files')
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={`file-drop-area ${isDragging ? 'active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept={supportedFormats.join(',')}
          className="hidden"
        />
        <p>Drag & drop documents here or click to browse</p>
        <p className="text-xs mt-2 text-gray-400">
          Supported formats: {supportedFormats.join(', ')}
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Selected Files ({files.length})</h3>
          <ul className="text-sm space-y-1 max-h-40 overflow-y-auto">
            {files.map((file, index) => (
              <li key={index} className="truncate">
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={files.length === 0 || isUploading}
        className={`w-full py-2 px-4 rounded ${
          files.length === 0 || isUploading
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isUploading ? 'Uploading...' : 'Upload Files'}
      </button>
    </div>
  )
}

export default FileUpload
