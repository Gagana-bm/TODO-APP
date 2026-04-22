// src/components/AddTaskForm.jsx
import { useState } from 'react'
import { addTask } from '../services/taskService'

export default function AddTaskForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Task title is required.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const newTask = await addTask(title.trim(), description.trim())
      onAdd(newTask)
      setTitle('')
      setDescription('')
      setIsExpanded(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-dashed border-indigo-300 p-4 hover:border-indigo-500 transition-colors duration-200">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-indigo-300 flex-shrink-0" />
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="Add a new task..."
            className="flex-1 text-sm text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
          />
          <button
            type="submit"
            disabled={loading || !title.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm px-4 py-1.5 rounded-lg transition-colors duration-200 font-medium flex-shrink-0"
          >
            {loading ? '...' : 'Add'}
          </button>
        </div>

        {isExpanded && (
          <div className="pl-8">
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add a description (optional)"
              rows={2}
              className="w-full text-xs text-gray-600 placeholder-gray-400 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </div>
        )}

        {error && (
          <p className="text-xs text-red-500 pl-8">{error}</p>
        )}
      </form>
    </div>
  )
}