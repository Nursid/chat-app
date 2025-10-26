import React, { use, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Lock, User, Mail, UserCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface UserProps {
  username: string;
  name: string;
  email: string;
  password: string;
}

interface SignupFormProps {
  switchToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ switchToLogin }) => {
  const {signup} = useAuth()
  const [form, setForm] = useState<UserProps>({ 
    username: "", 
    name: "", 
    email: "", 
    password: "" 
  });
  const [errors, setErrors] = useState<Partial<UserProps>>({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof UserProps]) {
      setErrors({ ...errors, [name]: "" });
    }
    if (serverError) {
      setServerError("");
    }
  };

  const validateForm = () => {
    const newErrors: Partial<UserProps> = {};
    
    if (!form.username.trim()) {
      newErrors.username = "Username is required";
    } else if (form.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
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
    setServerError("");

    try {
      // Simulate API call
        await signup(form);
      // Mock signup logic
      console.log("Signup successful:", form);
      alert("Account created successfully!");
      switchToLogin();
    } catch (err: any) {
      setServerError(err.message || "An error occurred during signup");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const fieldConfig = [
    { name: "username", label: "Username", icon: User, type: "text", placeholder: "Choose a username" },
    { name: "name", label: "Full Name", icon: UserCircle, type: "text", placeholder: "Enter your full name" },
    { name: "email", label: "Email", icon: Mail, type: "email", placeholder: "Enter your email" },
    { name: "password", label: "Password", icon: Lock, type: "password", placeholder: "Create a password" }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Card className="w-full max-w-md shadow-2xl bg-slate-800 border-slate-700">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-white">Create an account</CardTitle>
          <CardDescription className="text-center text-slate-400">
            Enter your information to get started
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {serverError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          {fieldConfig.map((field) => {
            const Icon = field.icon;
            const isPassword = field.name === "password";
            
            return (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name} className="text-slate-200">
                  {field.label} <span className="text-red-400">*</span>
                </Label>
                <div className="relative">
                  <Icon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id={field.name}
                    name={field.name}
                    type={isPassword ? (showPassword ? "text" : "password") : field.type}
                    placeholder={field.placeholder}
                    value={form[field.name as keyof UserProps]}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className={`pl-10 ${isPassword ? 'pr-10' : ''} bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 ${errors[field.name as keyof UserProps] ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    disabled={isLoading}
                  />
                  {isPassword && (
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
                  )}
                </div>
                {errors[field.name as keyof UserProps] && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors[field.name as keyof UserProps]}
                  </p>
                )}
              </div>
            );
          })}

          <Button 
            onClick={handleSubmit} 
            className="w-full mt-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-slate-400">
            Already have an account?{" "}
            <Button 
              variant="link" 
              onClick={switchToLogin} 
              className="h-auto p-0 text-blue-400 hover:text-blue-300 font-semibold"
              disabled={isLoading}
            >
              Sign in
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignupForm;