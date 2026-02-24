import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Check } from "lucide-react";
import type { CreateGroupPayload, SplitType } from "@/types/types.ts";
import {AddMemberRow} from "@/components/Rows/AddMemberRow.tsx";
import {QUICK_GROUPS, SPLIT_TYPES} from "@/const";
import {SplitTypeCard} from "@/components/Cards/SplitTypeCard.tsx";
import {StepIndicator} from "@/components/Step/StepIndicator.tsx";
import {EmojiPickerSheet} from "@/components/Emoji/EmojiPickerSheet.tsx";
import {MemberChip} from "@/components/Chips/MemberChip.tsx";

// const createGroup = (data: CreateGroupPayload): Promise<{ id: string }> =>
//   axios.post("/api/groups", data).then(r => r.data);

export default function CreateGroupPage() {
    const navigate = useNavigate();

    const [step, setStep]               = useState<number>(0);
    const [emoji, setEmoji]             = useState<string>("✈️");
    const [name, setName]               = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [members, setMembers]         = useState<string[]>([]);
    const [splitType, setSplitType]     = useState<SplitType>("EQUAL");
    const [nameError, setNameError]     = useState<string>("");

    // const mutation = useMutation<{ id: string }, Error, CreateGroupPayload>({
    //   mutationFn: createGroup,
    //   onSuccess: (data) => navigate(`/group/${data.id}`),
    // });

    const addMember = (memberName: string): void => {
        if (members.find(m => m.toLowerCase() === memberName.toLowerCase())) return;
        setMembers(prev => [...prev, memberName]);
    };

    const removeMember = (memberName: string): void =>
        setMembers(prev => prev.filter(m => m !== memberName));

    const handleNext = (): void => {
        if (step === 0 && name.trim().length < 2) {
            setNameError("Минимум 2 символа");
            return;
        }
        setNameError("");
        setStep(s => s + 1);
    };

    const handleBack = () => (step === 0 ? navigate(-1) : setStep(s => s - 1));

    const handleCreate = (): void => {
        const payload: CreateGroupPayload = { emoji, name, description, members, splitType };
        console.log("Create:", payload);
        // mutation.mutate(payload);
        navigate("/group/new-id");
    };

    const canProceed: boolean = step === 0 ? name.trim().length >= 2 : true;

    return (
        <div className="min-h-screen bg-[#0f0f0f] px-4 pt-4 pb-28 max-w-[480px] mx-auto font-[Manrope,sans-serif]">
            <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .slide-up { animation: slideUp 0.25s ease forwards; }
        input::placeholder { color: #3f3f46; }
      `}</style>

            {/* Header */}
            <div className="flex items-center justify-between mb-7 pt-1">
                <Button
                    variant="ghost" size="icon" onClick={handleBack}
                    className="w-9 h-9 rounded-[12px] bg-[#1a1a1a] border border-[#2a2a2a] text-zinc-400 hover:text-zinc-100 hover:bg-[#242424]"
                >
                    <ChevronLeft size={20} />
                </Button>
                <StepIndicator current={step} total={3} />
                <div className="w-9" />
            </div>

            {/* ── Step 0: Название ── */}
            {step === 0 && (
                <div className="slide-up">
                    <h2 className="text-[26px] font-extrabold text-zinc-100 tracking-tight mb-1">Новая группа</h2>
                    <p className="text-sm text-zinc-600 mb-6">Дай название и выбери иконку</p>

                    <div className="flex items-center gap-3 mb-5">
                        <EmojiPickerSheet value={emoji} onChange={setEmoji} />
                        <div className="flex-1">
                            <Input
                                value={name}
                                onChange={e => { setName(e.target.value); setNameError(""); }}
                                placeholder="Название группы"
                                maxLength={40}
                                autoFocus
                                className={`bg-[#161616] border text-zinc-100 text-[17px] font-bold placeholder:text-zinc-700 rounded-2xl h-14 focus-visible:ring-indigo-500/40 ${
                                    nameError ? "border-red-500" : name.length > 0 ? "border-indigo-500" : "border-[#242424]"
                                }`}
                            />
                            {nameError && <p className="text-xs text-red-400 mt-1.5 ml-1">{nameError}</p>}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wider block mb-2">
                            Описание (необязательно)
                        </label>
                        <Input
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Например: поездка на море в июле"
                            maxLength={100}
                            className="bg-[#161616] border-[#242424] text-zinc-100 placeholder:text-zinc-700 rounded-2xl focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500"
                        />
                    </div>

                    <div>
                        <p className="text-[11px] font-semibold text-zinc-700 uppercase tracking-wider mb-3">Быстрый старт</p>
                        <div className="flex flex-wrap gap-2">
                            {QUICK_GROUPS.map(ex => (
                                <button
                                    key={ex.name}
                                    onClick={() => { setName(ex.name); setEmoji(ex.emoji); setNameError(""); }}
                                    className="bg-[#161616] border border-[#242424] rounded-full px-4 py-2 text-[13px] text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 transition-all"
                                >
                                    {ex.emoji} {ex.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Step 1: Участники ── */}
            {step === 1 && (
                <div className="slide-up">
                    <h2 className="text-[26px] font-extrabold text-zinc-100 tracking-tight mb-1">Участники</h2>
                    <p className="text-sm text-zinc-600 mb-6">Добавь имена — они присоединятся по ссылке</p>

                    <AddMemberRow onAdd={addMember} />

                    <div className="flex flex-wrap gap-2 mt-4">
                        <MemberChip name="Вы" isYou onRemove={() => {}} />
                        {members.map(m => (
                            <MemberChip key={m} name={m} onRemove={removeMember} />
                        ))}
                    </div>

                    {members.length === 0 ? (
                        <div className="mt-6 bg-indigo-500/[0.07] border border-indigo-500/15 rounded-2xl p-4 text-[13px] text-zinc-500 leading-relaxed">
                            💡 Можно добавить участников потом — просто отправь им ссылку на группу
                        </div>
                    ) : (
                        <p className="text-center text-xs text-zinc-600 mt-5">
                            {members.length + 1} {members.length + 1 < 5 ? "участника" : "участников"} в группе
                        </p>
                    )}
                </div>
            )}

            {/* ── Step 2: Настройки ── */}
            {step === 2 && (
                <div className="slide-up">
                    <h2 className="text-[26px] font-extrabold text-zinc-100 tracking-tight mb-1">Настройки</h2>
                    <p className="text-sm text-zinc-600 mb-6">Как будем делить расходы?</p>

                    <label className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wider block mb-3">
                        Тип разделения
                    </label>
                    <div className="flex gap-2.5 mb-7">
                        {SPLIT_TYPES.map(t => (
                            <SplitTypeCard key={t.id} type={t} selected={splitType === t.id} onClick={setSplitType} />
                        ))}
                    </div>

                    <div>
                        <p className="text-[11px] font-semibold text-zinc-700 uppercase tracking-wider mb-3">Предпросмотр</p>
                        <div className="bg-[#161616] border border-[#242424] rounded-2xl p-5 text-center">
                            <div className="text-4xl mb-2">{emoji}</div>
                            <div className="font-extrabold text-lg text-zinc-100">{name}</div>
                            {description && <div className="text-sm text-zinc-600 mt-1">{description}</div>}
                            <div className="text-xs text-zinc-600 mt-3">
                                {members.length + 1} {members.length + 1 < 5 ? "участника" : "участников"} · {splitType === "EQUAL" ? "поровну" : "по-разному"}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom bar */}
            <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto px-4 pb-7 pt-8 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/90 to-transparent">
                <Button
                    onClick={step < 2 ? handleNext : handleCreate}
                    disabled={!canProceed}
                    className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-30 rounded-2xl h-14 text-[16px] font-bold shadow-[0_4px_24px_rgba(99,102,241,0.35)] tracking-tight"
                >
                    {step < 2
                        ? <><span>Далее</span><ChevronLeft size={18} className="rotate-180 ml-1" /></>
                        : <><Check size={18} className="mr-1.5" />Создать группу</>
                    }
                </Button>
            </div>
        </div>
    );
}