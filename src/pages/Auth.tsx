import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Mail, Lock, User } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast({ title: "Google sign-in failed", description: String(result.error), variant: "destructive" });
      }
      if (result.redirected) return;
      navigate("/");
    } catch (err: any) {
      toast({ title: "Google sign-in failed", description: err.message, variant: "destructive" });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({ title: "Login failed", description: error.message, variant: "destructive" });
      } else {
        navigate("/");
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) {
        toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
      } else if (data.session) {
        toast({ title: "Welcome to Hidden Gems! 💎" });
        navigate("/");
      } else {
        toast({ title: "Check your email!", description: "We sent you a confirmation link." });
      }
    }
    setLoading(false);
  };

  const inputClass =
    "w-full rounded-xl bg-secondary px-4 py-3 pl-11 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 glass-card px-4 py-3">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <button onClick={() => navigate("/")} className="rounded-full p-1.5 hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-semibold">{isLogin ? "Log In" : "Sign Up"}</h1>
        </div>
      </header>

      <main className="mx-auto flex max-w-lg flex-1 flex-col justify-center px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-foreground">
            {isLogin ? "Welcome back!" : "Join Hidden Gems"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLogin ? "Log in to continue exploring" : "Start discovering unique places"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full name"
                className={inputClass}
                required
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className={inputClass}
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={inputClass}
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full gem-gradient rounded-full py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? "Please wait..." : isLogin ? "Log In" : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-semibold text-primary hover:underline"
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </p>
      </main>
    </div>
  );
};

export default Auth;
