import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getRandomQuote } from "@/data/mockData";
import {
  BookOpen,
  Clock,
  RefreshCw,
  Calendar,
  Trophy,
  Flame,
  Zap,
  ChevronRight,
  Sparkles,
  Brain,
  Target,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  delay,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color: string;
  delay: number;
}) {
  return (
    <Card
      className="card-hover animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="p-4 md:p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl md:text-3xl font-bold">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div
            className={cn(
              "p-3 rounded-xl",
              color
            )}
          >
            <Icon className="w-5 h-5 md:w-6 md:h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SchedulePreviewCard({
  block,
  index,
}: {
  block: any;
  index: number;
}) {
  const typeStyles = {
    study: "border-l-info bg-info/5",
    revision: "border-l-warning bg-warning/5",
    break: "border-l-success bg-success/5",
    review: "border-l-primary bg-primary/5",
  };

  const typeIcons = {
    study: Brain,
    revision: RefreshCw,
    break: Clock,
    review: Target,
  };

  const Icon = typeIcons[block.type as keyof typeof typeIcons] || Brain;

  return (
    <div
      className={cn(
        "p-4 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md animate-slide-in-left",
        typeStyles[block.type as keyof typeof typeStyles]
      )}
      style={{ animationDelay: `${300 + index * 100}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <Icon className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">{block.topicName}</p>
            {block.subjectName && (
              <p className="text-sm text-muted-foreground">{block.subjectName}</p>
            )}
          </div>
        </div>
        <span className="text-sm text-muted-foreground">
          {block.startTime} - {block.endTime}
        </span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [quote, setQuote] = useState(getRandomQuote());

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["dashboard-ai-data"],
    queryFn: async () => {
      const response = await axios.get("/api/schedule/dashboard");
      return response.data;
    },
  });

  const { data: subjects = [] } = useQuery({
    queryKey: ["subjects-list"],
    queryFn: async () => {
      const response = await axios.get("/api/subjects");
      return response.data;
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setQuote(getRandomQuote());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const schedule = dashboardData?.schedule || [];
  const subjectsList = subjects || [];
  const todayTopics = schedule.filter((s: any) => s.type === "study" || s.type === "revision").length;
  const nearestExam = subjectsList.length > 0 ? subjectsList[0] : null;
  const daysUntilNearestExam = nearestExam ? getDaysRemaining(nearestExam.examDate) : 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-bold">
          {dashboardData?.greeting || "Hello"}, {user?.name?.split(" ")[0] || "Learner"}
          {new Date().getHours() >= 17 ? " 🌙" : new Date().getHours() >= 12 ? " ☀️" : " 🌅"}
        </h1>
        <p className="text-muted-foreground mt-1 animate-pulse">{quote}</p>
      </div>

      {/* XP & Level Quick Stats */}
      <div className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <Badge variant="outline" className="gap-2 px-3 py-1.5 bg-primary/10 text-primary border-primary/30">
          <Zap className="w-4 h-4" />
          <span className="font-bold">{user?.xp || 0} XP</span>
        </Badge>
        <Badge variant="outline" className="gap-2 px-3 py-1.5 bg-level/10 text-level border-level/30">
          <Trophy className="w-4 h-4" />
          <span className="font-bold">Level {user?.level || 1}</span>
        </Badge>
        <Badge variant="outline" className="gap-2 px-3 py-1.5 bg-streak/10 text-streak border-streak/30">
          <Flame className="w-4 h-4" />
          <span className="font-bold">{user?.streak || 0} Day Streak</span>
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Topics Today"
          value={todayTopics}
          subtitle="to complete"
          icon={BookOpen}
          color="bg-info/10 text-info"
          delay={0}
        />
        <StatCard
          title="Study Hours"
          value={`${todayTopics}h`}
          subtitle="scheduled"
          icon={Clock}
          color="bg-success/10 text-success"
          delay={100}
        />
        <StatCard
          title="Exam Readiness"
          value={`${dashboardData?.examReadiness || 0}%`}
          subtitle="predicted"
          icon={Target}
          color="bg-warning/10 text-warning"
          delay={200}
        />
        <StatCard
          title="Next Exam"
          value={`${daysUntilNearestExam}d`}
          subtitle={nearestExam ? `for ${nearestExam.name}` : "No exams scheduled"}
          icon={Calendar}
          color="bg-urgent/10 text-urgent"
          delay={300}
        />
      </div>

      {/* AI Focus Card */}
      <Card className="overflow-hidden animate-fade-in border-primary/20" style={{ animationDelay: "200ms" }}>
        <div className="relative bg-gradient-to-r from-primary/10 via-accent to-primary/5 p-6 md:p-8">
          <div className="absolute top-4 right-4">
            <Sparkles className="w-8 h-8 text-primary/30 animate-pulse" />
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary text-primary-foreground">
              <Brain className="w-6 h-6" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="font-semibold text-lg">AI Study Insight</h3>
                <p className="text-muted-foreground mt-1">
                  {dashboardData?.aiInsight || "Add subjects to see AI insights."}
                </p>
              </div>
              <Button onClick={() => navigate("/schedule")} className="gap-2">
                View Today's Schedule
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Today's Plan Preview */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="animate-fade-in" style={{ animationDelay: "300ms" }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Today's Plan</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/schedule")}>
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {schedule.length > 0 ? (
              schedule.slice(0, 4).map((block: any, index: number) => (
                <SchedulePreviewCard key={block.id} block={block} index={index} />
              ))
            ) : (
              <p className="text-center py-10 text-muted-foreground">No sessions scheduled yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Subject Progress */}
        <Card className="animate-fade-in" style={{ animationDelay: "400ms" }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Subject Progress</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/subjects")}>
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {subjects.length > 0 ? (
              subjects.map((subject: any, index: number) => {
                return (
                  <div
                    key={subject._id}
                    className="space-y-2 animate-slide-in-right"
                    style={{ animationDelay: `${400 + index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: subject.color }}
                        />
                        <span className="font-medium">{subject.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{subject.progress}%</span>
                      </div>
                    </div>
                    <Progress value={subject.progress} className="h-2" />
                  </div>
                );
              })
            ) : (
              <p className="text-center py-10 text-muted-foreground">Add subjects to track progress.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Emotional Intelligence Card */}
      {dashboardData?.showSpecialCard && (
        <Card className="border-warning/30 bg-warning/5 animate-fade-in" style={{ animationDelay: "500ms" }}>
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
            <div>
              <p className="font-medium">AI Coaching Note: Focus Required! 📚</p>
              <p className="text-sm text-muted-foreground">
                {dashboardData.aiInsight}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

const getDaysRemaining = (date: string) => {
  if (!date) return 0;
  const diff = new Date(date).getTime() - new Date().getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};
