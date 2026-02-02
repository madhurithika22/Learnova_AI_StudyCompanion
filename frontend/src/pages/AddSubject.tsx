import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Calendar,
  BookOpen,
  Brain,
  Check,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Topic {
  id: string;
  name: string;
  difficulty: number | null;
}

export default function AddSubject() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [subjectName, setSubjectName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([
    { id: "1", name: "", difficulty: null },
  ]);

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const addTopic = () => {
    setTopics([...topics, { id: Date.now().toString(), name: "", difficulty: null }]);
  };

  const removeTopic = (id: string) => {
    if (topics.length > 1) {
      setTopics(topics.filter((t) => t.id !== id));
    }
  };

  const updateTopic = (id: string, updates: Partial<Topic>) => {
    setTopics(topics.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const canProceed = () => {
    if (step === 1) return subjectName.trim().length > 0;
    if (step === 2) return examDate.length > 0;
    if (step === 3) return topics.some((t) => t.name.trim().length > 0);
    return false;
  };
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("learnova_token");
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      if (!token) {
        toast({ title: "Session Expired", description: "Please log in again." });
        return navigate("/login");
      }
      const subjectResponse = await axios.post("/api/subjects", {
        name: subjectName,
        examDate: examDate,
      }, config);

      const newSubjectId = subjectResponse.data._id;

      const topicPromises = topics
        .filter((t) => t.name.trim().length > 0)
        .map((topic) =>
          axios.post("/api/subjects/topics", {
            subjectId: newSubjectId,
            name: topic.name,
            difficulty: topic.difficulty ?? 3,
          }, config)
        );

      await Promise.all(topicPromises);

      toast({
        title: "Smart Plan Created! ✨",
        description: `AI has generated an optimized schedule for ${subjectName}.`,
      });

      navigate("/subjects");
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        variant: "destructive",
        title: "Plan Creation Failed",
        description: error.response?.data?.message || "Check your authentication or data fields.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10">
      {/* Header */}
      <div className="animate-fade-in">
        <Button
          variant="ghost"
          onClick={() => navigate("/subjects")}
          className="gap-2 mb-4"
          disabled={isSubmitting}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Subjects
        </Button>

        <h1 className="text-2xl md:text-3xl font-bold">Add New Subject</h1>
        <p className="text-muted-foreground mt-1">
          Let's create a smart study plan for your upcoming exam
        </p>
      </div>

      {/* Progress */}
      <div className="space-y-2 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Step {step} of {totalSteps}</span>
          <span className="text-primary font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Indicators */}
      <div className="flex justify-center gap-8 animate-fade-in" style={{ animationDelay: "150ms" }}>
        {[
          { num: 1, label: "Subject", icon: BookOpen },
          { num: 2, label: "Exam Date", icon: Calendar },
          { num: 3, label: "Topics", icon: Brain },
        ].map(({ num, label, icon: Icon }) => (
          <div
            key={num}
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              step >= num ? "text-primary" : "text-muted-foreground"
            )}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                step > num
                  ? "bg-primary text-primary-foreground"
                  : step === num
                    ? "bg-primary/20 text-primary border-2 border-primary"
                    : "bg-muted text-muted-foreground"
              )}
            >
              {step > num ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
            </div>
            <span className="text-xs font-medium">{label}</span>
          </div>
        ))}
      </div>

      {/* Form Card */}
      <Card className="animate-scale-in" style={{ animationDelay: "200ms" }}>
        <CardHeader>
          <CardTitle>
            {step === 1 && "What subject are you studying?"}
            {step === 2 && "When is your exam?"}
            {step === 3 && "Add your topics"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Enter the name of your subject"}
            {step === 2 && "This helps us prioritize your schedule"}
            {step === 3 && "List the topics you need to cover"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Subject Name */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subjectName">Subject Name</Label>
                <Input
                  id="subjectName"
                  placeholder="e.g., Mathematics, Physics, History..."
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="text-lg"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Step 2: Exam Date */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="examDate">Exam Date</Label>
                <Input
                  id="examDate"
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="text-lg"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                The AI will create an optimized schedule based on the time remaining.
              </p>
            </div>
          )}

          {/* Step 3: Topics */}
          {step === 3 && (
            <div className="space-y-4">
              {topics.map((topic, index) => (
                <div
                  key={topic.id}
                  className="p-4 rounded-lg border border-border space-y-4 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`topic-${topic.id}`}>Topic {index + 1}</Label>
                      <Input
                        id={`topic-${topic.id}`}
                        placeholder="e.g., Calculus - Derivatives"
                        value={topic.name}
                        onChange={(e) => updateTopic(topic.id, { name: e.target.value })}
                      />
                    </div>
                    {topics.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTopic(topic.id)}
                        className="mt-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Difficulty (optional)</Label>
                      {topic.difficulty !== null && (
                        <Badge variant="outline">
                          {topic.difficulty <= 2 ? "Easy" : topic.difficulty <= 3 ? "Medium" : "Hard"}
                        </Badge>
                      )}
                    </div>
                    <Slider
                      value={[topic.difficulty ?? 3]}
                      onValueChange={([value]) => updateTopic(topic.id, { difficulty: value })}
                      min={1}
                      max={5}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Easy</span>
                      <span>Hard</span>
                    </div>
                  </div>
                </div>
              ))}

              <Button variant="outline" onClick={addTopic} className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Add Another Topic
              </Button>

              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">AI Difficulty Estimation</p>
                    <p className="text-sm text-muted-foreground">
                      If you don't set a difficulty, our AI will estimate it based on the topic name and adjust your schedule accordingly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 1 || isSubmitting}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            {step < totalSteps ? (
              <Button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canProceed()}
                className="gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                className="gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {isSubmitting ? "Generating AI Plan..." : "Create Smart Plan"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}