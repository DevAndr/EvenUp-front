import {type FC, useState} from "react";
import {Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet.tsx";
import {EMOJIS} from "@/const";

interface EmojiPickerSheetProps { value: string; onChange: (e: string) => void }

export const EmojiPickerSheet: FC<EmojiPickerSheetProps> = ({ value, onChange }: EmojiPickerSheetProps) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="w-16 h-16 rounded-[20px] bg-[#1a1a1a] border-2 border-[#2a2a2a] text-3xl flex items-center justify-center shrink-0 transition-colors hover:border-indigo-500/50 active:scale-95"
            >
                {value}
            </button>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent side="bottom" className="bg-[#161616] border-t border-[#2a2a2a] rounded-t-3xl pb-10">
                    <SheetHeader className="mb-4">
                        <SheetTitle className="text-zinc-100 text-lg font-bold">Выбери иконку</SheetTitle>
                    </SheetHeader>
                    <div className="grid grid-cols-4 gap-3">
                        {EMOJIS.map(emoji => (
                            <button
                                key={emoji}
                                onClick={() => { onChange(emoji); setOpen(false); }}
                                className={`h-14 rounded-2xl text-2xl flex items-center justify-center transition-all ${
                                    value === emoji
                                        ? "bg-indigo-500/20 border border-indigo-500/40"
                                        : "bg-[#1e1e1e] border border-transparent hover:border-zinc-700"
                                }`}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}