import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Lock, User, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface UserProps {
  username?: string;
  password?: string;
}

interface LoginFormProps {
  onLogin: (user: UserProps) => void;
  switchToSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, switchToSignup }) => {
    const {login}  = useAuth()
  const [formData, setFormData] = useState<Partial<UserProps>>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<UserProps>>({});
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof UserProps]) {
      setErrors({ ...errors, [name]: "" });
    }
    if (error) {
      setError("");
    }
  };

  const validateForm = () => {
    const newErrors: Partial<UserProps> = {};
    
    if (!formData.username?.trim()) {
      newErrors.username = "Username is required";
    }
    
    if (!formData.password?.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate API call
       await login(formData.username, formData.password);
      onLogin(isLogin)
    } catch (err: any) {
      setError("Invalid username or password");
      setError(err.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Card className="w-full max-w-md shadow-2xl bg-slate-800 border-slate-700">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-white">Welcome back</CardTitle>
          <CardDescription className="text-center text-slate-400">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="username" className="text-slate-200">
              Username <span className="text-red-400">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                value={formData.username || ""}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className={`pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 ${errors.username ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                disabled={isLoading}
              />
            </div>
            {errors.username && (
              <p className="text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.username}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-slate-200">
                Password <span className="text-red-400">*</span>
              </Label>
              <Button 
                variant="link" 
                className="h-auto p-0 text-xs text-blue-400 hover:text-blue-300"
                onClick={() => alert("Password reset feature")}
              >
                Forgot password?
              </Button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password || ""}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className={`pl-10 pr-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-300"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.password}
              </p>
            )}
          </div>

          <Button 
            onClick={handleSubmit} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-slate-400">
            Don't have an account?{" "}
            <Button 
              variant="link" 
              onClick={switchToSignup} 
              className="h-auto p-0 text-blue-400 hover:text-blue-300 font-semibold"
            >
              Sign up
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;