import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'

interface User {
  email: string
  name: string
  picture: string
  sub: string // Google user ID
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credential: string) => Promise<void>
  logout: () => void
  developmentLogin: () => void
  isDevelopment: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Add your Google Client ID here
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

// Define authorized emails (you can move this to an env variable later)
const AUTHORIZED_EMAILS = [
  'rajeev@theideasandbox.com',
  'theideasandboxpodcast@gmail.com',
  'apexrisesolutions7@gmail.com',
  'shay999.in@gmail.com',
  // Add more editors' emails here as needed:
  // 'editor2@example.com',
]

// Development mode check
const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Development bypass function
  const developmentLogin = () => {
    const devUser: User = {
      email: 'theideasandboxpodcast@gmail.com',
      name: 'Dev User',
      picture: 'https://via.placeholder.com/40',
      sub: 'dev-user-123'
    }
    setUser(devUser)
    localStorage.setItem('admin-user', JSON.stringify(devUser))
    console.log('🚀 Development mode: Auto-logged in as admin')
  }

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('admin-user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else if (isDevelopment) {
      // Auto-login in development mode
      developmentLogin()
    }
    setIsLoading(false)
  }, [])

  const login = async (credential: string) => {
    try {
      // Decode the JWT token from Google
      const base64Url = credential.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      
      const googleUser = JSON.parse(jsonPayload)
      
      // Check if user is authorized
      if (!AUTHORIZED_EMAILS.includes(googleUser.email)) {
        throw new Error('Unauthorized email address')
      }
      
      const userData: User = {
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
        sub: googleUser.sub
      }
      
      setUser(userData)
      localStorage.setItem('admin-user', JSON.stringify(userData))
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('admin-user')
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthContext.Provider value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        developmentLogin,
        isDevelopment
      }}>
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}