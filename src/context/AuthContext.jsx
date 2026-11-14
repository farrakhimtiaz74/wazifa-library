import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { mergeGuestIntoAccount, setSyncUser } from '../lib/sync'

const AuthContext = createContext({ user: null, session: null, loading: true })

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session); setUser(data.session?.user || null); setLoading(false)
      if (data.session?.user) { setSyncUser(data.session.user); mergeGuestIntoAccount(data.session.user) }
    })
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, sess) => {
      setSession(sess); setUser(sess?.user || null); setSyncUser(sess?.user || null)
      if (sess?.user) await mergeGuestIntoAccount(sess.user)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const value = {
    user, session, loading,
    async signInWithGoogle() {
      if (!supabase) return { error: new Error('Supabase not configured') }
      return supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.href } })
    },
    async signInWithEmailLink(email) {
      if (!supabase) return { error: new Error('Supabase not configured') }
      return supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.href } })
    },
    async signInWithPassword(email, password) {
      if (!supabase) return { error: new Error('Supabase not configured') }
      let res = await supabase.auth.signInWithPassword({ email, password })
      if (res.error) res = await supabase.auth.signUp({ email, password })
      return res
    },
    async signOut() { if (supabase) await supabase.auth.signOut(); setUser(null); setSession(null); setSyncUser(null) }
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() { return useContext(AuthContext) }
