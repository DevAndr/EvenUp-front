import type {FC} from "react";

interface StepIndicatorProps { current: number; total: number }

export const StepIndicator: FC<StepIndicatorProps> = ({ current, total }: StepIndicatorProps) => {
    return (
        <div className="flex items-center gap-1.5">
            {Array.from({ length: total }).map((_, i) => (
                <div
                    key={i}
                    className={`h-[3px] rounded-full transition-all duration-300 ${i <= current ? "bg-indigo-500" : "bg-zinc-800"} ${i === current ? "w-6" : "w-2"}`}
                />
            ))}
        </div>
    );
}