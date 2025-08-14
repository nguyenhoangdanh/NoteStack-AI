import { useNavigate } from "react-router-dom"
import { RegisterForm } from "@/components/auth/RegisterForm"
import { PublicOnlyGuard } from "@/components/auth/AuthGuard"

export default function RegisterPage() {
  const navigate = useNavigate()

  const handleRegisterSuccess = () => {
    navigate("/notes", { replace: true })
  }

  const handleSwitchToLogin = () => {
    navigate("/login")
  }

  return (
    <PublicOnlyGuard>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">AI Notes</h1>
            <p className="text-muted-foreground mt-2">
              Create your account and start organizing your thoughts
            </p>
          </div>
          
          <RegisterForm
            onSuccess={handleRegisterSuccess}
            onSwitchToLogin={handleSwitchToLogin}
          />
        </div>
      </div>
    </PublicOnlyGuard>
  )
}
