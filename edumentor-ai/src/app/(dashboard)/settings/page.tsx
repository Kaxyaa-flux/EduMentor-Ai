"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { User, Key, Settings, Camera, Check, X, Eye, EyeOff, Trash2, Save } from "lucide-react"
import { fileToBase64 } from "@/lib/utils"

type Tab = "profile" | "ai-config" | "preferences"

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const [activeTab, setActiveTab] = useState<Tab>("profile")

  // ─── Profile State ───
  const [name, setName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ─── Groq State ───
  const [groqKey, setGroqKey] = useState("")
  const [showKey, setShowKey] = useState(false)
  const [maskedKey, setMaskedKey] = useState<string | null>(null)
  const [hasKey, setHasKey] = useState(false)
  const [groqSaving, setGroqSaving] = useState(false)
  const [groqMsg, setGroqMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // ─── Preferences State ───
  const [skillLevel, setSkillLevel] = useState("Beginner")
  const [learningGoal, setLearningGoal] = useState("")
  const [dailyMinutes, setDailyMinutes] = useState("")
  const [prefSaving, setPrefSaving] = useState(false)
  const [prefMsg, setPrefMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Load profile on mount
  useEffect(() => {
    fetch("/api/settings/profile")
      .then(r => r.json())
      .then(data => {
        setName(data.name || "")
        setAvatarUrl(data.avatarUrl || null)
        if (data.preferences) {
          setSkillLevel(data.preferences.skillLevel || "Beginner")
          setLearningGoal(data.preferences.learningGoal || "")
          setDailyMinutes(data.preferences.dailyStudyMinutes?.toString() || "")
        }
      })

    fetch("/api/settings/groq")
      .then(r => r.json())
      .then(data => {
        setHasKey(data.hasKey)
        setMaskedKey(data.maskedKey)
      })
  }, [])

  // Handle avatar file pick
  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 500 * 1024) {
      setProfileMsg({ type: "error", text: "Image too large. Max 500KB." })
      return
    }

    const base64 = await fileToBase64(file)
    setAvatarPreview(base64)
  }

  // Save profile
  async function handleProfileSave() {
    setProfileSaving(true)
    setProfileMsg(null)

    const res = await fetch("/api/settings/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        avatarUrl: avatarPreview ?? avatarUrl,
      })
    })

    const data = await res.json()
    setProfileSaving(false)

    if (!res.ok) {
      setProfileMsg({ type: "error", text: data.error })
      return
    }

    // Update NextAuth session in real time
    await update({ name: data.name, image: data.avatarUrl })
    setAvatarUrl(data.avatarUrl)
    setAvatarPreview(null)
    setProfileMsg({ type: "success", text: "Profile updated successfully." })
  }

  // Save Groq key
  async function handleGroqSave() {
    setGroqSaving(true)
    setGroqMsg(null)

    const res = await fetch("/api/settings/groq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groqApiKey: groqKey })
    })

    const data = await res.json()
    setGroqSaving(false)

    if (!res.ok) {
      setGroqMsg({ type: "error", text: data.error })
      return
    }

    setHasKey(true)
    setGroqKey("")
    setGroqMsg({ type: "success", text: data.message })

    // Refresh masked key
    fetch("/api/settings/groq").then(r => r.json()).then(d => setMaskedKey(d.maskedKey))
  }

  // Remove Groq key
  async function handleGroqDelete() {
    const res = await fetch("/api/settings/groq", { method: "DELETE" })
    if (res.ok) {
      setHasKey(false)
      setMaskedKey(null)
      setGroqMsg({ type: "success", text: "Groq API key removed." })
    }
  }

  // Save preferences
  async function handlePrefSave() {
    setPrefSaving(true)
    setPrefMsg(null)

    const res = await fetch("/api/settings/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        skillLevel,
        learningGoal,
        dailyStudyMinutes: dailyMinutes ? parseInt(dailyMinutes) : null,
      })
    })

    const data = await res.json()
    setPrefSaving(false)

    if (!res.ok) {
      setPrefMsg({ type: "error", text: data.error })
      return
    }

    setPrefMsg({ type: "success", text: "Preferences saved." })
  }

  const currentAvatar = avatarPreview || avatarUrl

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
      <p className="text-slate-400 text-sm mb-8">Manage your profile, AI configuration, and preferences</p>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-[#111827] border border-[#1F2937] rounded-xl p-1">
        {[
          { id: "profile", label: "Profile", icon: User },
          { id: "ai-config", label: "AI Config", icon: Key },
          { id: "preferences", label: "Preferences", icon: Settings },
        ].map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* ─── PROFILE TAB ─── */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          {/* Avatar */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6">
            <p className="text-sm font-medium text-white mb-4">Profile Picture</p>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="h-20 w-20 rounded-full border-2 border-[#1F2937] overflow-hidden bg-[#6366F1]/10 flex items-center justify-center">
                  {currentAvatar ? (
                    <img src={currentAvatar} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-8 w-8 text-[#6366F1]" />
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-[#10B981] flex items-center justify-center cursor-pointer hover:bg-[#059669] transition-colors"
                >
                  <Camera className="h-3.5 w-3.5 text-white" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <div>
                <p className="text-sm text-white font-medium">{name || session?.user?.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{session?.user?.email}</p>
                <p className="text-xs text-slate-600 mt-2">JPG, PNG or GIF — max 500KB</p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6">
            <label className="text-sm font-medium text-white block mb-3">Display Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-xl bg-[#0A0F1E] border border-[#1F2937] text-white placeholder:text-slate-600 focus:outline-none focus:border-[#10B981]/50 transition-colors text-sm"
            />
          </div>

          {/* Message */}
          {profileMsg && (
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${
              profileMsg.type === "success"
                ? "bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981]"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}>
              {profileMsg.type === "success" ? <Check className="h-4 w-4 shrink-0" /> : <X className="h-4 w-4 shrink-0" />}
              {profileMsg.text}
            </div>
          )}

          <button
            onClick={handleProfileSave}
            disabled={profileSaving}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-sm transition-colors disabled:opacity-60 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            {profileSaving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      )}

      {/* ─── AI CONFIG TAB ─── */}
      {activeTab === "ai-config" && (
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-white">Groq API Key</p>
              {hasKey && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 font-medium">
                  Active
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Add your own Groq key to use your personal quota. Get one free at{" "}
              <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="text-[#10B981] hover:underline">
                console.groq.com
              </a>
            </p>

            {/* Current key display */}
            {hasKey && maskedKey && (
              <div className="flex items-center gap-3 mb-4 px-4 py-3 bg-[#0A0F1E] border border-[#1F2937] rounded-xl">
                <Key className="h-4 w-4 text-[#10B981] shrink-0" />
                <span className="text-sm text-slate-400 font-mono flex-1">{maskedKey}</span>
                <button
                  onClick={handleGroqDelete}
                  className="text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                  title="Remove key"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* New key input */}
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={groqKey}
                onChange={e => setGroqKey(e.target.value)}
                placeholder={hasKey ? "Enter new key to replace..." : "gsk_..."}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-[#0A0F1E] border border-[#1F2937] text-white placeholder:text-slate-600 focus:outline-none focus:border-[#10B981]/50 transition-colors text-sm font-mono"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {groqMsg && (
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${
              groqMsg.type === "success"
                ? "bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981]"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}>
              {groqMsg.type === "success" ? <Check className="h-4 w-4 shrink-0" /> : <X className="h-4 w-4 shrink-0" />}
              {groqMsg.text}
            </div>
          )}

          <button
            onClick={handleGroqSave}
            disabled={groqSaving || !groqKey.startsWith("gsk_")}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-sm transition-colors disabled:opacity-60 cursor-pointer"
          >
            <Key className="h-4 w-4" />
            {groqSaving ? "Verifying key..." : "Save & Verify Key"}
          </button>

          <div className="px-4 py-3 bg-[#6366F1]/5 border border-[#6366F1]/20 rounded-xl">
            <p className="text-xs text-slate-400">
              Your key is verified with Groq before saving. It is stored encrypted and never exposed in the UI. All your tutoring sessions will use this key instead of the shared server key.
            </p>
          </div>
        </div>
      )}

      {/* ─── PREFERENCES TAB ─── */}
      {activeTab === "preferences" && (
        <div className="space-y-6">
          {/* Skill Level */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6">
            <label className="text-sm font-medium text-white block mb-3">Skill Level</label>
            <div className="grid grid-cols-3 gap-3">
              {["Beginner", "Intermediate", "Advanced"].map(level => (
                <button
                  key={level}
                  onClick={() => setSkillLevel(level)}
                  className={`py-3 rounded-xl text-sm font-medium transition-all cursor-pointer border ${
                    skillLevel === level
                      ? "bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]"
                      : "border-[#1F2937] text-slate-400 hover:text-white hover:border-[#374151]"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Learning Goal */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6">
            <label className="text-sm font-medium text-white block mb-3">Learning Goal</label>
            <textarea
              value={learningGoal}
              onChange={e => setLearningGoal(e.target.value)}
              placeholder="e.g. Get a job as a Python developer, build web apps, learn data science..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-[#0A0F1E] border border-[#1F2937] text-white placeholder:text-slate-600 focus:outline-none focus:border-[#10B981]/50 transition-colors text-sm resize-none"
            />
          </div>

          {/* Daily Study Time */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6">
            <label className="text-sm font-medium text-white block mb-3">Daily Study Time (minutes)</label>
            <div className="grid grid-cols-4 gap-3 mb-3">
              {["15", "30", "60", "90"].map(min => (
                <button
                  key={min}
                  onClick={() => setDailyMinutes(min)}
                  className={`py-3 rounded-xl text-sm font-medium transition-all cursor-pointer border ${
                    dailyMinutes === min
                      ? "bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]"
                      : "border-[#1F2937] text-slate-400 hover:text-white hover:border-[#374151]"
                  }`}
                >
                  {min}m
                </button>
              ))}
            </div>
            <input
              type="number"
              value={dailyMinutes}
              onChange={e => setDailyMinutes(e.target.value)}
              placeholder="Or enter custom minutes..."
              className="w-full px-4 py-3 rounded-xl bg-[#0A0F1E] border border-[#1F2937] text-white placeholder:text-slate-600 focus:outline-none focus:border-[#10B981]/50 transition-colors text-sm"
            />
          </div>

          {prefMsg && (
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${
              prefMsg.type === "success"
                ? "bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981]"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}>
              {prefMsg.type === "success" ? <Check className="h-4 w-4 shrink-0" /> : <X className="h-4 w-4 shrink-0" />}
              {prefMsg.text}
            </div>
          )}

          <button
            onClick={handlePrefSave}
            disabled={prefSaving}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-sm transition-colors disabled:opacity-60 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            {prefSaving ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      )}
    </div>
  )
}
