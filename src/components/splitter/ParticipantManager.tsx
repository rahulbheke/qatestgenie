import { useState } from "react";
import { Participant, genId } from "@/lib/billSplitter";
import { UserPlus, X, Users, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  participants: Participant[];
  onChange: (p: Participant[]) => void;
}

const AVATARS = ["😀", "😎", "🤓", "🧑‍💻", "👩‍🎨", "🧑‍🍳", "🦊", "🐱", "🐶", "🦄", "🌸", "⭐"];

export default function ParticipantManager({ participants, onChange }: Props) {
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [showAvatars, setShowAvatars] = useState(false);

  const addParticipant = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onChange([...participants, { id: genId(), name: trimmed, avatar: selectedAvatar }]);
    setName("");
    setSelectedAvatar(AVATARS[Math.floor(Math.random() * AVATARS.length)]);
  };

  const remove = (id: string) => onChange(participants.filter((p) => p.id !== id));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-2">
          <Users className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-bold text-heading">Who's splitting?</h3>
        <p className="text-sm text-muted-foreground">Add everyone who's part of this bill</p>
      </div>

      {/* Add form */}
      <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
        <div className="flex gap-2">
          <button
            onClick={() => setShowAvatars(!showAvatars)}
            className="h-11 w-11 shrink-0 rounded-xl bg-secondary flex items-center justify-center text-lg hover:bg-secondary/80 transition-colors border border-border"
            title="Pick avatar"
          >
            {selectedAvatar}
          </button>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addParticipant()}
            placeholder="Enter name..."
            className="flex-1 h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-shadow"
          />
          <Button
            onClick={addParticipant}
            disabled={!name.trim()}
            size="default"
            className="h-11 px-4 rounded-xl gap-1.5"
          >
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </div>

        {/* Avatar picker (collapsible) */}
        {showAvatars && (
          <div className="flex gap-2 flex-wrap p-3 rounded-xl bg-secondary/50 animate-scale-in">
            {AVATARS.map((a) => (
              <button
                key={a}
                onClick={() => { setSelectedAvatar(a); setShowAvatars(false); }}
                className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all active:scale-90 ${
                  selectedAvatar === a
                    ? "bg-primary/20 ring-2 ring-primary scale-105"
                    : "bg-card hover:bg-secondary border border-border"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Participant list */}
      {participants.length === 0 ? (
        <div className="text-center py-8 animate-fade-in">
          <Smile className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No one added yet</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Start by adding at least 2 people above</p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground px-1">
            {participants.length} {participants.length === 1 ? "person" : "people"} added
            {participants.length < 2 && " · add one more to continue"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {participants.map((p, i) => (
              <div
                key={p.id}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border group animate-fade-slide-up hover:border-primary/20 transition-colors"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <span className="text-xl">{p.avatar || "😀"}</span>
                <span className="text-sm font-medium text-foreground truncate flex-1">{p.name}</span>
                <button
                  onClick={() => remove(p.id)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all sm:opacity-0 sm:group-hover:opacity-100"
                  aria-label={`Remove ${p.name}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
