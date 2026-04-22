// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import TaskCard from '../components/TaskCard'
import AddTaskForm from '../components/AddTaskForm'
import { getTasks } from '../services/taskService'
import { useAuth } from '../hooks/useAuth'

export default function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const data = await getTasks()
      setTasks(data)
    } catch (err) {
      setError('Failed to load tasks. Please refresh.')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = (newTask) => {
    setTasks(prev => [newTask, ...prev])
  }

  const handleUpdate = (updatedTask) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t))
  }

  const handleDelete = (deletedId) => {
    setTasks(prev => prev.filter(t => t.id !== deletedId))
  }

  const pendingTasks = tasks.filter(t => !t.is_completed)
  const completedTasks = tasks.filter(t => t.is_completed)

  const userName = user?.user_metadata?.full_name?.split(' ')[0] || 'there'

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Good day, {userName}! 👋
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            You have{' '}
            <span className="font-semibold text-indigo-600">{pendingTasks.length}</span>
            {' '}pending task{pendingTasks.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total', value: tasks.length, color: 'bg-indigo-50 text-indigo-700' },
            { label: 'Pending', value: pendingTasks.length, color: 'bg-amber-50 text-amber-700' },
            { label: 'Done', value: completedTasks.length, color: 'bg-green-50 text-green-700' },
          ].map(stat => (
            <div key={stat.label} className={`${stat.color} rounded-xl px-4 py-3 text-center`}>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs font-medium mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Add Task */}
        <div className="mb-8">
          <AddTaskForm onAdd={handleAdd} />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Pending Tasks */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-base font-bold text-gray-700">Pending</h2>
                <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {pendingTasks.length}
                </span>
              </div>

              {pendingTasks.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <p className="text-4xl mb-2">🎉</p>
                  <p className="text-sm font-medium">All caught up! Add a new task above.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdate={handleUpdate}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-base font-bold text-gray-700">Completed</h2>
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {completedTasks.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {completedTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdate={handleUpdate}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}