// src/services/taskService.js
import { supabase } from './supabaseClient'

// Get all tasks for the logged-in user
export async function getTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// Add a new task
export async function addTask(title, description) {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('tasks')
    .insert([{ title, description, user_id: user.id }])
    .select()
  if (error) throw error
  return data[0]
}

// Update a task (title, description, or completion)
export async function updateTask(id, updates) {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
  if (error) throw error
  return data[0]
}

// Delete a task
export async function deleteTask(id) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// Toggle completion
export async function toggleTask(id, currentStatus) {
  return updateTask(id, { is_completed: !currentStatus })
}