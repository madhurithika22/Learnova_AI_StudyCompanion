import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Sparkles } from "lucide-react";

export function AuthLayout() {
  const { isAuthenticated } = useUser();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex gradient-bg relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Left side - Branding (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12 relative">
        <div className="max-w-md space-y-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg glow-primary">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Lernova</h1>
              <p className="text-muted-foreground">Smart learning, perfectly timed</p>
            </div>
          </div>

          <div className="space-y-4 pt-8">
            <div className="glass rounded-2xl p-6 card-hover">
              <h3 className="font-semibold text-lg mb-2">🎯 AI-Powered Scheduling</h3>
              <p className="text-muted-foreground text-sm">
                Get personalized study plans based on your exams, topic difficulty, and availability.
              </p>
            </div>
            <div className="glass rounded-2xl p-6 card-hover">
              <h3 className="font-semibold text-lg mb-2">🎮 Gamified Learning</h3>
              <p className="text-muted-foreground text-sm">
                Earn XP, unlock badges, and maintain streaks to stay motivated.
              </p>
            </div>
            <div className="glass rounded-2xl p-6 card-hover">
              <h3 className="font-semibold text-lg mb-2">💜 Kind Motivation</h3>
              <p className="text-muted-foreground text-sm">
                Empathetic reminders that understand your needs and keep you on track.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md animate-scale-in">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg">
              <Sparkles className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Lernova</h1>
              <p className="text-xs text-muted-foreground">Smart learning, perfectly timed</p>
            </div>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}
