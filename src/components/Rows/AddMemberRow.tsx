import {type FC, useState} from "react";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Plus} from "lucide-react";

interface AddMemberRowProps { onAdd: (name: string) => void }

export const AddMemberRow: FC<AddMemberRowProps> = ({ onAdd }) => {
    const [value, setValue] = useState("");
    const valid = value.trim().length >= 2;

    const handleAdd = (): void => {
        if (!valid) return;
        onAdd(value.trim());
        setValue("");
    };

    return (
        <div className="flex gap-2">
            <Input
                value={value}
                onChange={e => setValue(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAdd()}
                placeholder="Имя участника..."
                maxLength={30}
                className="bg-[#1a1a1a] border-[#2a2a2a] text-zinc-100 placeholder:text-zinc-700 rounded-2xl focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500"
            />
            <Button
                onClick={handleAdd}
                disabled={!valid}
                className="rounded-2xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-30 px-4 shrink-0"
            >
                <Plus size={18} />
            </Button>
        </div>
    );
}