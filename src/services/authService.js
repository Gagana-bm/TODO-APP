// src/services/authService.js
import { supabase } from './supabaseClient'

// Sign up new user
export async function signUp(email, password, fullName) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName }  // store name in user metadata
    }
  })
  if (error) throw error
  return data
}

// Log in existing user
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  if (error) throw error
  return data
}

// Log out
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Get currently logged-in user
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}