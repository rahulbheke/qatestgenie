import { useState } from "react";
import { Participant, genId } from "@/lib/billSplitter";
import { UserPlus, X, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  participants: Participant[];
  onChange: (p: Participant[]) => void;
}

const AVATARS = ["😀", "😎", "🤓", "🧑‍💻", "👩‍🎨", "🧑‍🍳", "🦊", "🐱", "🐶", "🦄", "🌸", "⭐"];

export default function ParticipantManager({ participants, onChange }: Props) {
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);

  const addParticipant = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onChange([...participants, { id: genId(), name: trimmed, avatar: selectedAvatar }]);
    setName("");
    setSelectedAvatar(AVATARS[Math.floor(Math.random() * AVATARS.length)]);
  };

  const remove = (id: string) => onChange(participants.filter((p) => p.id !== id));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Users className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-heading">Participants</h3>
        <span className="text-xs text-muted-foreground ml-auto">{participants.length} added</span>
      </div>

      {/* Avatar picker */}
      <div className="flex gap-1.5 flex-wrap">
        {AVATARS.map((a) => (
          <button
            key={a}
            onClick={() => setSelectedAvatar(a)}
            className={`w-8 h-8 rounded-lg text-base flex items-center justify-center transition-all ${
              selectedAvatar === a
                ? "bg-primary/20 ring-2 ring-primary scale-110"
                : "bg-secondary hover:bg-secondary/80"
            }`}
          >
            {a}
          </button>
        ))}
      </div>

      {/* Add form */}
      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addParticipant()}
          placeholder="Enter name..."
          className="flex-1 h-10 rounded-lg border border-input bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
        />
        <Button onClick={addParticipant} disabled={!name.trim()} size="default" className="gap-1.5">
          <UserPlus className="h-3.5 w-3.5" />
          Add
        </Button>
      </div>

      {/* List */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {participants.map((p, i) => (
          <div
            key={p.id}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/60 border border-border group animate-fade-slide-up"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <span className="text-lg">{p.avatar || "😀"}</span>
            <span className="text-sm font-medium text-foreground truncate flex-1">{p.name}</span>
            <button
              onClick={() => remove(p.id)}
              className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-muted-foreground hover:text-destructive transition-all"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
