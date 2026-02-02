import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, Brain, Calendar, Trophy, 
  Plus, CheckCircle2, Circle, Loader2 
} from "lucide-react";

export default function SubjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [newSubTopic, setNewSubTopic] = useState<{ [key: string]: string }>({});

  // 1. Fetch Subject & Topics
  const { data: subject, isLoading } = useQuery({
    queryKey: ["subject", id],
    queryFn: async () => {
      const res = await axios.get(`/api/subjects/${id}`);
      return res.data;
    },
  });

  // 2. Mutation to Toggle Sub-topic or Mark Topic as Done
  const toggleMutation = useMutation({
    mutationFn: async ({ topicId, subTopicId }: { topicId: string, subTopicId?: string }) => {
      return axios.patch(`/api/subjects/topics/${topicId}/toggle`, { subTopicId });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["subject", id] }),
  });

  // 3. Mutation to Add Sub-topic
  const addSubTopicMutation = useMutation({
    mutationFn: async ({ topicId, name }: { topicId: string, name: string }) => {
      return axios.post(`/api/subjects/topics/${topicId}/subtopics`, { name });
    },
    onSuccess: () => {
      setNewSubTopic({});
      queryClient.invalidateQueries({ queryKey: ["subject", id] });
    },
  });

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  const topics = subject?.topics || [];
  const completedTopics = topics.filter((t: any) => t.status === "revised").length;
  const progress = topics.length > 0 ? Math.round((completedTopics / topics.length) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header & Overall Progress */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div className="space-y-2">
          <Button variant="ghost" onClick={() => navigate("/subjects")} className="pl-0"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
          <h1 className="text-4xl font-bold tracking-tight">{subject.name}</h1>
          <p className="text-muted-foreground">Exam on {new Date(subject.examDate).toLocaleDateString()}</p>
        </div>
        <div className="w-full md:w-72 space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Overall Mastery</span>
            <span className="text-primary">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3 shadow-inner" />
        </div>
      </div>

      {/* Grid: Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6 flex items-center gap-4">
            <Trophy className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">XP Earned</p>
              <p className="text-2xl font-bold">{subject.xpEarned || 0}</p>
            </div>
          </CardContent>
        </Card>
        {/* ... More stat cards for Revision count, etc. */}
      </div>

      {/* Topics & Sub-topics List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2"><Brain className="h-6 w-6 text-primary" /> Study Modules</h2>
        {topics.map((topic: any) => (
          <Card key={topic._id} className={topic.status === "revised" ? "border-success/50 bg-success/5" : ""}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                {topic.status === "revised" ? <CheckCircle2 className="text-success h-6 w-6" /> : <Circle className="text-muted-foreground h-6 w-6" />}
                <CardTitle className="text-xl">{topic.name}</CardTitle>
                <Badge variant="secondary">Difficulty: {topic.difficulty}</Badge>
              </div>
              <Button 
                variant={topic.status === "revised" ? "outline" : "default"}
                onClick={() => toggleMutation.mutate({ topicId: topic._id })}
              >
                {topic.status === "revised" ? "Completed" : "Mark as Done"}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Sub-topics Section */}
              <div className="pl-9 space-y-3">
                {topic.subTopics?.map((sub: any) => (
                  <div key={sub._id} className="flex items-center gap-3 group">
                    <Checkbox 
                      checked={sub.completed} 
                      onCheckedChange={() => toggleMutation.mutate({ topicId: topic._id, subTopicId: sub._id })}
                    />
                    <span className={sub.completed ? "line-through text-muted-foreground" : ""}>{sub.name}</span>
                  </div>
                ))}
                
                {/* Add Sub-topic Input */}
                <div className="flex items-center gap-2 pt-2">
                  <Input 
                    placeholder="Add sub-topic..." 
                    className="h-8 text-sm max-w-xs"
                    value={newSubTopic[topic._id] || ""}
                    onChange={(e) => setNewSubTopic({ ...newSubTopic, [topic._id]: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && addSubTopicMutation.mutate({ topicId: topic._id, name: newSubTopic[topic._id] })}
                  />
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => addSubTopicMutation.mutate({ topicId: topic._id, name: newSubTopic[topic._id] })}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}