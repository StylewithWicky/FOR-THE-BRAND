import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { authSchema, AuthValues } from "../lib/auth-schema";
import { authStyles as s } from "./AuthForm.styles"; // Imported as 's' for brevity

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AuthValues>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (data: AuthValues) => {
    await new Promise((res) => setTimeout(res, 2000));
    console.log("Auth Success:", data);
  };

  return (
    <div className={s.container}>
      <div className={s.header}>
        <h1 className={s.title}>{isLogin ? "Welcome back" : "Create account"}</h1>
        <p className={s.subtitle}>Enter your details below</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
        {!isLogin && (
          <div className={s.inputWrapper}>
            <input {...register("username")} placeholder="Username" className={s.input} />
            {errors.username && <p className={s.errorText}>{errors.username.message}</p>}
          </div>
        )}

        <div className={s.inputWrapper}>
          <input {...register("email")} type="email" placeholder="name@example.com" className={s.input} />
          {errors.email && <p className={s.errorText}>{errors.email.message}</p>}
        </div>

        <div className={s.inputWrapper}>
          <input {...register("password")} type={showPassword ? "text" : "password"} placeholder="••••••••" className={s.input} />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-zinc-400">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {errors.password && <p className={s.errorText}>{errors.password.message}</p>}
        </div>

        <button disabled={isSubmitting} className={s.button({ isLoading: isSubmitting })}>
          {isSubmitting && <Loader2 className="animate-spin" size={18} />}
          {isLogin ? "Sign In" : "Sign Up"}
        </button>
      </form>

      <button onClick={() => setIsLogin(!isLogin)} className={s.button({ intent: "ghost" })}>
        {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
      </button>
    </div>
  );
}