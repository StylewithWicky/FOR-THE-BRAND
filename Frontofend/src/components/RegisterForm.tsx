import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { registerSchema, RegisterValues } from "../lib/auth-schema";
import { s } from "../styles/Auth.styles"; // Consistent with your other files

export default function RegisterForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterValues) => {
    await new Promise((res) => setTimeout(res, 2000));
    console.log("Registered User:", data);
  };

  return (
    <div className={s.container}>
      <div className={s.header}>
        <h1 className={s.title}>Create Account</h1>
        <p className={s.subtitle}>Join the platform to get started</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
        <div className={s.inputWrapper}>
          <input {...register("username")} placeholder="Username" className={s.input} />
          {errors.username && <p className={s.errorText}>{errors.username.message}</p>}
        </div>

        <div className={s.inputWrapper}>
          <input {...register("email")} type="email" placeholder="Email" className={s.input} />
          {errors.email && <p className={s.errorText}>{errors.email.message}</p>}
        </div>

        {/* Password Group */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={s.inputWrapper}>
            <input {...register("password")} type="password" placeholder="Password" className={s.input} />
            {errors.password && <p className={s.errorText}>{errors.password.message}</p>}
          </div>
          <div className={s.inputWrapper}>
            <input {...register("confirmPassword")} type="password" placeholder="Confirm" className={s.input} />
            {errors.confirmPassword && <p className={s.errorText}>{errors.confirmPassword.message}</p>}
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <input {...register("acceptTerms")} type="checkbox" id="terms" className="w-4 h-4" />
            <label htmlFor="terms" className="text-sm text-zinc-500 text-pretty">
              I agree to the Terms of Service
            </label>
          </div>
          {errors.acceptTerms && <p className={s.errorText}>{errors.acceptTerms.message}</p>}
        </div>

        <button disabled={isSubmitting} className={s.button({ isLoading: isSubmitting })}>
          {isSubmitting && <Loader2 className="animate-spin" size={18} />}
          Get Started
        </button>
      </form>
    </div>
  );
}