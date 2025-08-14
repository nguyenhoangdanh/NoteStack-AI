import { useNavigate } from "react-router-dom"
import { LoginForm } from "@/components/auth/LoginForm"
import { PublicOnlyGuard } from "@/components/auth/AuthGuard"

export default function LoginPage() {
  const navigate = useNavigate()

  const handleLoginSuccess = () => {
    navigate("/notes", { replace: true })
  }

  const handleSwitchToRegister = () => {
    navigate("/register")
  }

  return (
    <PublicOnlyGuard>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">AI Notes</h1>
            <p className="text-muted-foreground mt-2">
              Your intelligent note-taking companion
            </p>
          </div>
          
          <LoginForm
            onSuccess={handleLoginSuccess}
            onSwitchToRegister={handleSwitchToRegister}
          />
        </div>
      </div>
    </PublicOnlyGuard>
  )
}
