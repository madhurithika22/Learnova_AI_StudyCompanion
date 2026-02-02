import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@/contexts/UserContext";
import { badges as allBadges } from "@/data/mockData";
import {
  Trophy,
  Flame,
  Zap,
  Star,
  Lock,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

function BadgeCard({
  badge,
  index,
}: {
  badge: typeof allBadges[0];
  index: number;
}) {
  return (
    <Card
      className={cn(
        "card-hover animate-scale-in overflow-hidden",
        !badge.unlocked && "opacity-60"
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-6 text-center relative">
        {!badge.unlocked && (
          <div className="absolute top-3 right-3">
            <Lock className="w-4 h-4 text-muted-foreground" />
          </div>
        )}

        <div
          className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 transition-all duration-300",
            badge.unlocked
              ? "bg-primary/20 animate-float"
              : "bg-muted grayscale"
          )}
        >
          {badge.icon}
        </div>

        <h3 className="font-semibold">{badge.name}</h3>
        <p className="text-sm text-muted-foreground mt-1">{badge.description}</p>

        {badge.unlocked && badge.unlockedAt && (
          <Badge variant="outline" className="mt-3 text-xs">
            Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}

function ConfettiPiece({ delay }: { delay: number }) {
  const colors = ["#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#f472b6"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const left = Math.random() * 100;
  const rotation = Math.random() * 360;

  return (
    <div
      className="absolute w-2 h-2 rounded-sm animate-confetti"
      style={{
        left: `${left}%`,
        top: "50%",
        backgroundColor: color,
        transform: `rotate(${rotation}deg)`,
        animationDelay: `${delay}ms`,
      }}
    />
  );
}

export default function Rewards() {
  const { user } = useUser();
  const [showConfetti, setShowConfetti] = useState(false);

  const xpProgress = user ? (user.xp % 500) / 5 : 0;
  const xpToNextLevel = user ? 500 - (user.xp % 500) : 500;

  const badgesWithStatus = allBadges.map(badge => ({
    ...badge,
    unlocked: user?.badges?.includes(badge.id) || false,
    unlockedAt: undefined
  }));

  const unlockedBadges = badgesWithStatus.filter((b) => b.unlocked).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-bold">Rewards</h1>
        <p className="text-muted-foreground mt-1">
          Track your progress and unlock achievements
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid md:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
        {/* XP Card */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
          <CardContent className="p-6 relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-primary text-primary-foreground">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total XP</p>
                <p className="text-3xl font-bold">{user?.xp || 0}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to Level {(user?.level || 0) + 1}</span>
                <span className="font-medium">{xpToNextLevel} XP left</span>
              </div>
              <Progress value={xpProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Level Card */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-level/20 to-transparent" />
          <CardContent className="p-6 relative">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-level text-level-foreground">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Level</p>
                <p className="text-3xl font-bold">{user?.level || 1}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Keep studying to level up and unlock new rewards!
            </p>
          </CardContent>
        </Card>

        {/* Streak Card */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-streak/20 to-transparent" />
          <CardContent className="p-6 relative">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-streak text-streak-foreground">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Day Streak</p>
                <p className="text-3xl font-bold">{user?.streak || 0}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              {user?.streak || 0} days of consistent studying! 🔥
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Badges Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div>
            <h2 className="text-xl font-semibold">Badges</h2>
            <p className="text-sm text-muted-foreground">
              {unlockedBadges} of {allBadges.length} unlocked
            </p>
          </div>
          <Badge variant="outline" className="gap-1">
            <Star className="w-4 h-4 text-warning fill-warning" />
            {unlockedBadges} earned
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative">
          {showConfetti && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 30 }).map((_, i) => (
                <ConfettiPiece key={i} delay={i * 50} />
              ))}
            </div>
          )}

          {badgesWithStatus.map((badge, index) => (
            <BadgeCard key={badge.id} badge={badge} index={index} />
          ))}
        </div>
      </div>

      {/* Motivation Card */}
      <Card className="border-primary/20 bg-primary/5 animate-fade-in" style={{ animationDelay: "500ms" }}>
        <CardContent className="p-6 flex items-start gap-4">
          <div className="p-3 rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold">Keep Going!</h3>
            <p className="text-muted-foreground mt-1">
              You're making great progress! Complete today's study plan to maintain your streak
              and earn bonus XP. Every topic you master brings you closer to your goals.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
