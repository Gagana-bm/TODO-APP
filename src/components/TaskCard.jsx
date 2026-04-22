// src/components/TaskCard.jsx
import { useState } from 'react'
import { updateTask, deleteTask, toggleTask } from '../services/taskService'

export default function TaskCard({ task, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDesc, setEditDesc] = useState(task.description || '')
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    const updated = await toggleTask(task.id, task.is_completed)
    onUpdate(updated)
    setLoading(false)
  }

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) return
    setLoading(true)
    const updated = await updateTask(task.id, {
      title: editTitle.trim(),
      description: editDesc.trim()
    })
    onUpdate(updated)
    setIsEditing(false)
    setLoading(false)
  }

  const handleDelete = async () => {
    setLoading(true)
    await deleteTask(task.id)
    onDelete(task.id)
    setLoading(false)
  }

  return (
    <div className={`bg-white rounded-xl border shadow-sm p-4 transition-all duration-200 hover:shadow-md
      ${task.is_completed ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>

      {isEditing ? (
        /* Edit Mode */
        <div className="space-y-3">
          <input
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Task title"
          />
          <textarea
            value={editDesc}
            onChange={e => setEditDesc(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            placeholder="Description (optional)"
            rows={2}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-1.5 rounded-lg transition-colors duration-200 font-medium"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-4 py-1.5 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* View Mode */
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={handleToggle}
            disabled={loading}
            className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors duration-200
              ${task.is_completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-indigo-500'}`}
          >
            {task.is_completed && (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold text-gray-800 leading-snug
              ${task.is_completed ? 'line-through text-gray-400' : ''}`}>
              {task.title}
            </p>
            {task.description && (
              <p className={`text-xs mt-1 text-gray-500 leading-relaxed
                ${task.is_completed ? 'line-through' : ''}`}>
                {task.description}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1.5">
              {new Date(task.created_at).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              })}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-1 flex-shrink-0">
            {!task.is_completed && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                title="Edit"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            <button
              onClick={handleDelete}
              disabled={loading}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
              title="Delete"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}