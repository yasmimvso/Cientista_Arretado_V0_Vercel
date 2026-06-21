"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { usuarios, delegacias, type Usuario, type Delegacia } from "./data"

interface GeoLocation {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: Date
}

interface AuditInfo {
  ip: string
  host: string
  redePublica: boolean
  dispositivo: string
  browser: string
  dataHora: Date
  geolocalizacao: GeoLocation | null
  resultado2FA: "sucesso" | "falha" | "pendente"
}

interface AuthContextType {
  usuario: Usuario | null
  delegacia: Delegacia | null
  isAuthenticated: boolean
  isLoading: boolean
  geoLocation: GeoLocation | null
  auditInfo: AuditInfo | null
  login: (email: string, senha: string, codigo2FA: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  requestGeoLocation: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [delegacia, setDelegacia] = useState<Delegacia | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [geoLocation, setGeoLocation] = useState<GeoLocation | null>(null)
  const [auditInfo, setAuditInfo] = useState<AuditInfo | null>(null)

  const requestGeoLocation = useCallback(async (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(false)
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeoLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(position.timestamp)
          })
          resolve(true)
        },
        () => {
          resolve(false)
        },
        { enableHighAccuracy: true, timeout: 10000 }
      )
    })
  }, [])

  const login = useCallback(async (
    email: string, 
    senha: string, 
    codigo2FA: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    // Simular delay de validação
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Validação mock - aceita qualquer usuário cadastrado
    const user = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase())
    
    if (!user) {
      setIsLoading(false)
      return { success: false, error: "Usuário ou senha inválidos." }
    }

    // Validar 2FA (aceita qualquer código de 6 dígitos para demo)
    if (!/^\d{6}$/.test(codigo2FA)) {
      setIsLoading(false)
      return { success: false, error: "Código de autenticação inválido." }
    }

    // Verificar geolocalização
    if (!geoLocation) {
      setIsLoading(false)
      return { success: false, error: "Acesso não autorizado para esta localização." }
    }

    // Encontrar delegacia do usuário
    const userDelegacia = delegacias.find(d => d.nome === user.delegacia)

    // Criar informações de auditoria
    const audit: AuditInfo = {
      ip: "189.45.123.78",
      host: "pc-delegacia-01.pc.pe.gov.br",
      redePublica: false,
      dispositivo: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? "Mobile" : "Desktop",
      browser: navigator.userAgent.includes("Chrome") ? "Chrome" : 
               navigator.userAgent.includes("Firefox") ? "Firefox" : 
               navigator.userAgent.includes("Safari") ? "Safari" : "Outro",
      dataHora: new Date(),
      geolocalizacao: geoLocation,
      resultado2FA: "sucesso"
    }

    setUsuario(user)
    setDelegacia(userDelegacia || null)
    setAuditInfo(audit)
    setIsLoading(false)

    return { success: true }
  }, [geoLocation])

  const logout = useCallback(() => {
    setUsuario(null)
    setDelegacia(null)
    setAuditInfo(null)
  }, [])

  return (
    <AuthContext.Provider value={{
      usuario,
      delegacia,
      isAuthenticated: !!usuario,
      isLoading,
      geoLocation,
      auditInfo,
      login,
      logout,
      requestGeoLocation
    }}>
      {children}
    </AuthContext.Provider>
  )
}
