import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser } from "@/contexts/UserContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  User,
  Mail,
  Clock,
  Moon,
  Sun,
  LogOut,
  Save,
  Bell,
  Shield,
  Camera,
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useUser();
  const { theme, toggleTheme } = useTheme();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    startTime: user?.studyPreferences?.startTime || "17:00",
    endTime: user?.studyPreferences?.endTime || "22:00",
    breakDuration: user?.studyPreferences?.breakDuration?.toString() || "30",
    lunchTime: user?.studyPreferences?.lunchTime || "19:00",
  });

  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    streakReminder: true,
    examReminder: true,
    motivational: true,
  });

  const handleSave = () => {
    updateUser({
      name: formData.name,
      email: formData.email,
      studyPreferences: {
        startTime: formData.startTime,
        endTime: formData.endTime,
        breakDuration: parseInt(formData.breakDuration),
        lunchTime: formData.lunchTime,
      },
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile Card */}
      <Card className="animate-fade-in" style={{ animationDelay: "100ms" }}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-primary-foreground">
                <Camera className="w-3 h-3" />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
              <p className="text-sm text-primary mt-1">
                Level {user?.level} • {user?.xp} XP
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Info */}
      <Card className="animate-fade-in" style={{ animationDelay: "150ms" }}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Study Preferences */}
      <Card className="animate-fade-in" style={{ animationDelay: "200ms" }}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Study Preferences
          </CardTitle>
          <CardDescription>
            Set your study schedule and the AI will optimize around it
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Study Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Study End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lunchTime">Break Time</Label>
              <Input
                id="lunchTime"
                type="time"
                value={formData.lunchTime}
                onChange={(e) => setFormData({ ...formData, lunchTime: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="breakDuration">Break Duration</Label>
              <Select
                value={formData.breakDuration}
                onValueChange={(value) => setFormData({ ...formData, breakDuration: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="animate-fade-in" style={{ animationDelay: "250ms" }}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            {theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark themes
              </p>
            </div>
            <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="animate-fade-in" style={{ animationDelay: "300ms" }}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "dailyReminder", label: "Daily Study Reminders", desc: "Get reminded to start studying" },
            { key: "streakReminder", label: "Streak Reminders", desc: "Don't break your streak" },
            { key: "examReminder", label: "Exam Reminders", desc: "Notifications before exams" },
            { key: "motivational", label: "Motivational Messages", desc: "Encouraging popups while studying" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{label}</p>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
              <Switch
                checked={notifications[key as keyof typeof notifications]}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, [key]: checked })
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "350ms" }}>
        <Button onClick={handleSave} className="flex-1 gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
        <Button variant="outline" onClick={handleLogout} className="flex-1 gap-2 text-destructive hover:text-destructive">
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
