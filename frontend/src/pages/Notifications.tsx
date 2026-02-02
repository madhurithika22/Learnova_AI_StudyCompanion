import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Calendar, BookOpen, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

export default function Notifications() {
    const { data: notifications, isLoading } = useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const response = await axios.get("/api/notifications");
            return response.data;
        },
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Loading notifications...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between animate-fade-in">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Notifications</h1>
                    <p className="text-muted-foreground mt-1">
                        Stay updated with your study schedule and exams
                    </p>
                </div>
                <Badge variant="outline" className="gap-2">
                    <Bell className="w-4 h-4" />
                    {notifications?.length || 0} New
                </Badge>
            </div>

            <Card className="animate-fade-in" style={{ animationDelay: "100ms" }}>
                <CardHeader>
                    <CardTitle>Recent Updates</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[500px] pr-4">
                        <div className="space-y-4">
                            {notifications?.length > 0 ? (
                                notifications.map((notification: any, index: number) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border/50 hover:bg-accent/50 transition-colors"
                                    >
                                        <div className={`p-2 rounded-full ring-1 ring-border ${notification.type === 'exam' ? 'bg-destructive/10 text-destructive' :
                                                notification.type === 'study' ? 'bg-primary/10 text-primary' :
                                                    'bg-muted text-muted-foreground'
                                            }`}>
                                            {notification.type === 'exam' ? <AlertCircle className="w-5 h-5" /> :
                                                notification.type === 'study' ? <BookOpen className="w-5 h-5" /> :
                                                    <Bell className="w-5 h-5" />}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <p className="font-medium">{notification.title}</p>
                                                <span className="text-xs text-muted-foreground">
                                                    {notification.date ? format(new Date(notification.date), "MMM d, h:mm a") : "Just now"}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{notification.message}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-muted-foreground">
                                    <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>No new notifications</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}
