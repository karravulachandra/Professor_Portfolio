import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'

const ChatBox = ({ chatHistory, onNewQuestion, isProcessing, setIsProcessing }) => {
  const [question, setQuestion] = useState('')
  const [streamingAnswer, setStreamingAnswer] = useState('')
  const [streamingSources, setStreamingSources] = useState([])
  const [useStreaming, setUseStreaming] = useState(true)
  const chatContainerRef = useRef(null)

  // Scroll to bottom when chat history updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatHistory, streamingAnswer])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!question.trim() || isProcessing) return

    setIsProcessing(true)

    if (useStreaming) {
      await handleStreamingQuestion()
    } else {
      await handleRegularQuestion()
    }
  }

  const handleRegularQuestion = async () => {
    try {
      const formData = new FormData()
      formData.append('question', question)

      const response = await axios.post('/api/ask', formData)

      onNewQuestion(question, response.data.answer, response.data.sources)
      setQuestion('')
    } catch (error) {
      console.error('Error asking question:', error)
      onNewQuestion(
        question,
        `Error: ${error.response?.data?.detail || 'Failed to get answer'}`,
        []
      )
    } finally {
      setIsProcessing(false)
    }
  }

  const handleStreamingQuestion = async () => {
    try {
      const formData = new FormData()
      formData.append('question', question)

      // Reset streaming state
      setStreamingAnswer('')
      setStreamingSources([])

      // Add question to chat history with empty answer
      const questionObj = { question, answer: '', sources: [] }
      onNewQuestion(question, '', [])

      // Create EventSource for streaming
      const eventSource = new EventSource(`/api/ask/stream?question=${encodeURIComponent(question)}`)

      eventSource.onmessage = (event) => {
        if (event.data === '[DONE]') {
          eventSource.close()
          setIsProcessing(false)

          // Update chat history with final answer
          onNewQuestion(question, streamingAnswer, streamingSources)
          setQuestion('')
          return
        }

        try {
          const data = JSON.parse(event.data)

          if (data.answer_chunk) {
            setStreamingAnswer(prev => prev + data.answer_chunk)
          } else if (Array.isArray(data)) {
            // First message contains sources
            setStreamingSources(data)
          } else if (data.error) {
            console.error('Streaming error:', data.error)
            setStreamingAnswer('Error: ' + data.error)
            eventSource.close()
            setIsProcessing(false)
          }
        } catch (error) {
          console.error('Error parsing stream data:', error)
        }
      }

      eventSource.onerror = (error) => {
        console.error('EventSource error:', error)
        eventSource.close()
        setIsProcessing(false)
        setStreamingAnswer(prev => prev + '\n\nError: Connection lost')
      }
    } catch (error) {
      console.error('Error setting up streaming:', error)
      setIsProcessing(false)
    }
  }

  const renderSources = (sources) => {
    if (!sources || sources.length === 0) return null

    return (
      <div className="mt-2 pt-2 border-t border-gray-600">
        <h4 className="text-sm font-medium mb-1">Sources:</h4>
        <div className="space-y-2 text-sm">
          {sources.map((source, index) => (
            <div key={index} className="source-highlight">
              <div className="text-xs font-medium text-blue-300 mb-1">
                {source.metadata.source_reference || (
                  <>
                    {source.metadata.filename || (source.metadata.source &&
                      `Document: ${source.metadata.source.split('/').pop()}`
                    ) || 'Unknown source'}
                    {source.metadata.page !== undefined && ` (Page ${source.metadata.page})`}
                    {source.metadata.paragraph && ` Paragraph ${source.metadata.paragraph}`}
                    {source.metadata.headings && source.metadata.headings.length > 0 &&
                      ` Section: ${source.metadata.headings.join(' > ')}`
                    }
                  </>
                )}
              </div>
              <div className="text-sm">{source.content}</div>

              {/* Show additional metadata if available */}
              {(source.metadata.chunk_id || source.metadata.start_index) && (
                <div className="text-xs text-gray-400 mt-1">
                  {source.metadata.chunk_id &&
                    `Chunk: ${source.metadata.chunk_id}/${source.metadata.total_chunks || '?'}`
                  }
                  {source.metadata.start_index &&
                    ` Position: ${source.metadata.start_index}-${source.metadata.start_index + source.content.length}`
                  }
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto space-y-4 mb-4"
      >
        {chatHistory.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            <p>No conversation yet. Ask a question about your documents!</p>
          </div>
        ) : (
          chatHistory.map((chat, index) => (
            <div key={index} className="space-y-2">
              <div className="bg-blue-800 p-3 rounded-lg">
                <p className="font-medium">You:</p>
                <p>{chat.question}</p>
              </div>

              <div className="bg-gray-800 p-3 rounded-lg">
                <p className="font-medium">Assistant:</p>
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown>{chat.answer || streamingAnswer}</ReactMarkdown>
                </div>
                {renderSources(chat.sources || streamingSources)}
              </div>
            </div>
          ))
        )}

        {isProcessing && streamingAnswer && (
          <div className="bg-gray-800 p-3 rounded-lg">
            <p className="font-medium">Assistant:</p>
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown>{streamingAnswer}</ReactMarkdown>
            </div>
            {renderSources(streamingSources)}
          </div>
        )}
      </div>

      <div className="border-t border-gray-600 pt-4">
        <div className="flex items-center justify-end mb-2">
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={useStreaming}
              onChange={() => setUseStreaming(!useStreaming)}
              className="mr-2"
            />
            Enable streaming responses
          </label>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about your documents..."
            disabled={isProcessing}
            className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!question.trim() || isProcessing}
            className={`px-4 py-2 rounded-lg ${
              !question.trim() || isProcessing
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isProcessing ? 'Processing...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatBox
