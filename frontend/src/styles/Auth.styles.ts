import { cva } from "class-variance-authority";

export const s = {
  page: "min-h-screen w-full bg-black flex flex-col items-center justify-center p-6",
  container: "w-full max-w-md p-10 bg-[#0D0D0D] border border-white/10 rounded-[2.5rem] shadow-[0_0_80px_-20px_rgba(26,115,232,0.2)]",
  header: "text-center mb-10",
  title: "text-4xl font-extrabold tracking-tight bg-gradient-to-r from-[#1A73E8] via-[#FF6B00] to-[#FF6B00] bg-clip-text text-transparent pb-2",
  subtitle: "text-zinc-500 text-xs font-bold tracking-[0.2em] uppercase opacity-70",
  form: "space-y-6",
  inputWrapper: "relative group",
  input: "w-full p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-white transition-all focus:border-[#FF6B00] focus:outline-none",
  errorText: "text-[10px] text-red-500 font-bold mt-2 ml-3 uppercase animate-pulse",
  button: cva(
    "w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 uppercase tracking-[0.1em] text-[11px]",
    {
      variants: {
        intent: {
          primary: "bg-gradient-to-r from-[#1A73E8] to-[#FF6B00] text-white hover:scale-[1.02]",
          ghost: "bg-transparent text-zinc-500 hover:text-white mt-4",
        },
        isLoading: { true: "opacity-50 cursor-not-allowed" },
      },
      defaultVariants: { intent: "primary" },
    }
  ),
};