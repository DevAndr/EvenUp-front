import type {FC} from "react";
import {Button} from "@/components/ui/button.tsx";

interface EmptyStateProps {
    onCreateGroup: () => void;
}

export const EmptyState: FC<EmptyStateProps > = ({ onCreateGroup }: EmptyStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-3">
            <div className="text-5xl">🤝</div>
            <div className="font-bold text-xl text-zinc-200">Нет активных групп</div>
            <div className="text-sm text-zinc-600 max-w-[240px] leading-relaxed">
                Создай группу и скинь ссылку друзьям — они присоединятся одним кликом
            </div>
            <Button onClick={onCreateGroup} className="mt-2 bg-indigo-500 hover:bg-indigo-600 rounded-2xl px-7 font-bold">
                Создать группу
            </Button>
        </div>
    );
}

