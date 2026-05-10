import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { authSchema, AuthValues } from "../lib/auth-schema";
import { s } from "../styles/Auth.styles"; // Consistent with your other files

interface AuthFormProps {
  onSuccess: (data: AuthValues) => void;
  buttonText?: string; // Optional: Override the default "Sign In"
}

export default function AuthForm({ onSuccess, buttonText }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AuthValues>({
    resolver: zodResolver(authSchema),
  });

  return (
    <div className={s.container}>
      <div className={s.header}>
        <h1 className={s.title}>{isLogin ? "Welcome back" : "Create account"}</h1>
        <p className={s.subtitle}>Enter your details to proceed</p>
      </div>

      <form onSubmit={handleSubmit(onSuccess)} className={s.form}>
        {!isLogin && (
          <div className={s.inputWrapper}>
            <input 
              {...register("username" as any)} 
              placeholder="Username" 
              className={s.input} 
            />
            {errors.username && <p className={s.errorText}>{errors.username.message}</p>}
          </div>
        )}

        <div className={s.inputWrapper}>
          <input 
            {...register("email")} 
            type="email" 
            placeholder="name@example.com" 
            className={s.input} 
          />
          {errors.email && <p className={s.errorText}>{errors.email.message}</p>}
        </div>

        <div className={s.inputWrapper}>
          <input 
            {...register("password")} 
            type={showPassword ? "text" : "password"} 
            placeholder="••••••••" 
            className={s.input} 
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)} 
            className="absolute right-4 top-4 text-zinc-500 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {errors.password && <p className={s.errorText}>{errors.password.message}</p>}
        </div>

        <button 
          disabled={isSubmitting} 
          className={s.button({ isLoading: isSubmitting, intent: "primary" })}
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            buttonText || (isLogin ? "Sign In" : "Sign Up")
          )}
        </button>
      </form>

      <button 
        type="button"
        onClick={() => setIsLogin(!isLogin)} 
        className={s.button({ intent: "ghost" })}
      >
        {isLogin ? "New to YOLO? Create Account" : "Back to Login"}
      </button>
    </div>
  );
}