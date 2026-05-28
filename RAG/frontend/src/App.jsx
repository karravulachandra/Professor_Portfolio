import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import FileUpload from './components/FileUpload'
import ChatBox from './components/ChatBox'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { AuthProvider, useAuth } from './context/AuthContext'

// Main dashboard component
const Dashboard = () => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(null)
  const [chatHistory, setChatHistory] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const { currentUser, logout } = useAuth()

  const handleUploadSuccess = (message) => {
    setUploadStatus({ type: 'success', message })
    setIsUploading(false)
  }

  const handleUploadError = (message) => {
    setUploadStatus({ type: 'error', message })
    setIsUploading(false)
  }

  const handleNewQuestion = (question, answer, sources) => {
    setChatHistory([...chatHistory, { question, answer, sources }])
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Local RAG Assistant</h1>
            <p className="text-sm opacity-75">Powered by local LLM and embeddings</p>
          </div>
          <div className="flex items-center space-x-4">
            {currentUser && (
              <>
                <span className="text-sm">
                  Welcome, <span className="font-semibold">{currentUser.username}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row gap-4 p-4 overflow-hidden">
        <div className="w-full md:w-1/3 bg-gray-700 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Document Upload</h2>
          <FileUpload
            onUploadStart={() => setIsUploading(true)}
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
            isUploading={isUploading}
          />

          {uploadStatus && (
            <div className={`mt-4 p-3 rounded ${
              uploadStatus.type === 'success' ? 'bg-green-800' : 'bg-red-800'
            }`}>
              {uploadStatus.message}
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Instructions</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm opacity-75">
              <li>Upload documents (PDF, DOCX, TXT, etc.)</li>
              <li>Wait for processing to complete</li>
              <li>Ask questions about your documents</li>
              <li>View answers with detailed source references</li>
            </ol>
          </div>
        </div>

        <div className="w-full md:w-2/3 bg-gray-700 rounded-lg p-4 flex flex-col overflow-hidden">
          <h2 className="text-xl font-semibold mb-4">Chat</h2>
          <ChatBox
            chatHistory={chatHistory}
            onNewQuestion={handleNewQuestion}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />
        </div>
      </main>

      <footer className="bg-gray-800 text-white p-2 text-center text-sm opacity-75">
        Local RAG Assistant - Powered by llama-cpp-python, FAISS, and LangChain
      </footer>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
