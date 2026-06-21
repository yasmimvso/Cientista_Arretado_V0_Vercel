"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Shield, MapPin, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading, isAuthenticated, geoLocation, requestGeoLocation } = useAuth()

  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [codigo2FA, setCodigo2FA] = useState("")
  const [error, setError] = useState("")
  const [geoStatus, setGeoStatus] = useState<"pending" | "granted" | "denied">("pending")

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    const checkGeo = async () => {
      const granted = await requestGeoLocation()
      setGeoStatus(granted ? "granted" : "denied")
    }
    checkGeo()
  }, [requestGeoLocation])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !senha || !codigo2FA) {
      setError("Preencha todos os campos.")
      return
    }

    if (geoStatus !== "granted") {
      setError("Acesso não autorizado para esta localização.")
      return
    }

    const result = await login(email, senha, codigo2FA)
    
    if (!result.success && result.error) {
      setError(result.error)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary/5 to-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo e título */}
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <Shield className="size-8" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Sistema Integrado de Inteligência
            </h1>
            <p className="text-sm text-muted-foreground">
              Acesso restrito por delegacia e perfil.
            </p>
          </div>
        </div>

        {/* Card de login */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg">Acesso ao Sistema</CardTitle>
            <CardDescription>
              Insira suas credenciais para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Status de geolocalização */}
              <div className="flex items-center gap-2 rounded-lg border p-3">
                <MapPin className={`size-4 ${
                  geoStatus === "granted" 
                    ? "text-emerald-600" 
                    : geoStatus === "denied" 
                      ? "text-destructive" 
                      : "text-muted-foreground"
                }`} />
                <span className="flex-1 text-sm">
                  {geoStatus === "granted" && "Localização verificada"}
                  {geoStatus === "denied" && "Localização não autorizada"}
                  {geoStatus === "pending" && "Verificando localização..."}
                </span>
                {geoStatus === "granted" && (
                  <CheckCircle2 className="size-4 text-emerald-600" />
                )}
                {geoStatus === "pending" && (
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                )}
                {geoStatus === "denied" && (
                  <Badge variant="destructive" className="text-xs">Bloqueado</Badge>
                )}
              </div>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Usuário</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu.email@pc.pe.gov.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    disabled={isLoading}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="senha">Senha</FieldLabel>
                  <Input
                    id="senha"
                    type="password"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="codigo2fa">Código do autenticador</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon>
                      <Shield className="size-4" />
                    </InputGroupAddon>
                    <InputGroupInput
                      id="codigo2fa"
                      type="text"
                      inputMode="numeric"
                      pattern="\d{6}"
                      maxLength={6}
                      placeholder="000000"
                      value={codigo2FA}
                      onChange={(e) => setCodigo2FA(e.target.value.replace(/\D/g, ""))}
                      autoComplete="one-time-code"
                      disabled={isLoading}
                      className="text-center tracking-[0.5em] font-mono"
                    />
                  </InputGroup>
                </Field>
              </FieldGroup>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || geoStatus !== "granted"}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Validando credenciais...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-muted-foreground hover:text-primary hover:underline"
                  onClick={() => alert("Funcionalidade em desenvolvimento.")}
                >
                  Esqueci minha senha
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Rodapé de segurança */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Este sistema é monitorado. Acessos são registrados com IP, localização e dispositivo.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Polícia Civil de Pernambuco - Acesso restrito a servidores autorizados.
          </p>
        </div>

        {/* Dica para demo */}
        <Card className="border-dashed bg-muted/50">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Demo: Use qualquer e-mail cadastrado
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Ex: carlos.mendes@pc.pe.gov.br | Senha: qualquer | 2FA: 123456
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
