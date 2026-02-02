import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Trophy, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Helper for days calculation (matching backend logic)
const getDaysRemaining = (date: string) => {
  const diff = new Date(date).getTime() - new Date().getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

function SubjectCard({ subject, index }: { subject: any; index: number }) {
  const navigate = useNavigate();
  const daysLeft = getDaysRemaining(subject.examDate);
  
  // Calculate topic stats from the backend array
  const topics = subject.topics || [];
  const totalTopics = topics.length;
  const completedTopics = topics.filter((t: any) => t.status === "revised").length;
  const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <Card
      className="card-hover cursor-pointer animate-fade-in overflow-hidden group"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={() => navigate(`/subjects/${subject._id}`)}
    >
      <div className="h-2" style={{ backgroundColor: subject.color || "#8B5CF6" }} />

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{subject.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {totalTopics} topics • {completedTopics} completed
            </p>
          </div>
          <Badge
            variant={daysLeft <= 3 ? "destructive" : daysLeft <= 7 ? "secondary" : "outline"}
            className={cn(
              "font-semibold",
              daysLeft <= 3 && "animate-pulse"
            )}
          >
            {daysLeft} days left
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                className="text-muted/30"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke={subject.color || "#8B5CF6"}
                strokeWidth="6"
                strokeDasharray={`${(progress / 100) * 176} 176`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold">{progress}%</span>
            </div>
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>Exam: {new Date(subject.examDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Trophy className="w-4 h-4 text-primary" />
              <span className="font-medium text-primary">{subject.xpEarned || 0} XP</span>
            </div>
          </div>
        </div>

        {/* Topic Status Indicators */}
        <div className="flex items-center gap-2">
          {topics.slice(0, 10).map((topic: any) => (
            <div
              key={topic._id}
              className={cn(
                "w-2 h-2 rounded-full",
                topic.status === "revised" && "bg-success",
                topic.status === "learning" && "bg-warning",
                topic.status === "new" && "bg-muted"
              )}
              title={`${topic.name} - ${topic.status}`}
            />
          ))}
          {totalTopics > 10 && <span className="text-[10px] text-muted-foreground">+{totalTopics - 10}</span>}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-sm text-muted-foreground">View topics</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function Subjects() {
  const navigate = useNavigate();

  const { data: subjects = [], isLoading } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const response = await axios.get("/api/subjects");
      return response.data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Fetching your subjects...</p>
      </div>
    );
  }

  const totalRevised = subjects.reduce((acc: number, s: any) => 
    acc + (s.topics?.filter((t: any) => t.status === "revised").length || 0), 0
  );
  
  const totalXP = subjects.reduce((acc: number, s: any) => acc + (s.xpEarned || 0), 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Subjects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your subjects and track progress
          </p>
        </div>
        <Button onClick={() => navigate("/subjects/add")} className="gap-2">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Subject</span>
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{subjects.length}</div>
          <div className="text-sm text-muted-foreground">Active Subjects</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-success">{totalRevised}</div>
          <div className="text-sm text-muted-foreground">Topics Revised</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-xp">{totalXP}</div>
          <div className="text-sm text-muted-foreground">Total XP</div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject: any, index: number) => (
          <SubjectCard key={subject._id} subject={subject} index={index} />
        ))}

        <Card
          className="card-hover cursor-pointer border-dashed border-2 flex items-center justify-center min-h-[280px] animate-fade-in"
          style={{ animationDelay: `${subjects.length * 100}ms` }}
          onClick={() => navigate("/subjects/add")}
        >
          <div className="text-center p-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold">Add New Subject</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Create a smart study plan
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}