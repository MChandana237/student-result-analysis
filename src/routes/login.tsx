import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GraduationCap, Lock, Mail, ShieldCheck, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth, type UserRole } from "@/context/AuthContext";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — EduMetric" },
      { name: "description", content: "Sign in to access your academic dashboard and result analytics." },
    ],
  }),
  component: LoginPage,
});

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

type LoginValues = z.infer<typeof loginSchema>;

function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user, loading } = useAuth();
  const [role, setRole] = useState<UserRole>("student");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: true },
  });

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      navigate({ to: user.role === "admin" ? "/admin/dashboard" : "/student/dashboard" });
    }
  }, [loading, isAuthenticated, user, navigate]);

  const onSubmit = async (values: LoginValues) => {
    setSubmitting(true);
    try {
      const u = await login(values.email, values.password, role);
      toast.success(`Welcome back, ${u.name.split(" ")[0]}!`);
      navigate({ to: u.role === "admin" ? "/admin/dashboard" : "/student/dashboard" });
    } catch {
      toast.error("Unable to sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--gradient-subtle)] px-4 py-10">
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary-glow/20 blur-3xl" />

      <div className="relative grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl border bg-card shadow-[var(--shadow-elevated)] md:grid-cols-2">
        <div className="relative hidden flex-col justify-between bg-[var(--gradient-primary)] p-10 text-primary-foreground md:flex">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="text-lg font-semibold">EduMetric</span>
            </div>
            <h2 className="mt-12 text-3xl font-semibold leading-tight">
              Smarter insights into every student's academic journey.
            </h2>
            <p className="mt-4 text-sm text-white/80">
              SGPA & CGPA analytics, performance trends, and faculty tools — all in one elegant
              dashboard.
            </p>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-4 w-4" />
              Secure role-based access
            </div>
            <div className="flex items-center gap-3">
              <UserIcon className="h-4 w-4" />
              Admin & student modules
            </div>
          </div>
        </div>

        <div className="p-8 md:p-10">
          <div className="mb-6 flex items-center gap-2 md:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="font-semibold">EduMetric</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Access your dashboard with your institutional account.
          </p>

          <Tabs value={role} onValueChange={(v) => setRole(v as UserRole)} className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@university.edu"
                  className="pl-9"
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <Checkbox id="remember" defaultChecked {...register("remember")} />
                <span>Remember me</span>
              </label>
              <button type="button" className="text-xs font-medium text-primary hover:underline">
                Forgot password?
              </button>
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Signing in…" : `Sign in as ${role}`}
            </Button>

            <Card className="border-dashed bg-muted/40">
              <CardContent className="p-3 text-xs text-muted-foreground">
                <p className="font-medium text-foreground">Demo credentials</p>
                <p>Use any email & password (min 6 chars). Pick a role above.</p>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}
