export function SkeletonCard() {
    return (
        <div className="bg-[#161616] border border-[#242424] rounded-2xl p-4 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-[14px] bg-[#242424]" />
                <div className="flex-1">
                    <div className="h-4 bg-[#242424] rounded-md w-3/4 mb-2" />
                    <div className="h-3 bg-[#242424] rounded-md w-1/3" />
                </div>
            </div>
            <div className="h-3 bg-[#242424] rounded-md w-1/2" />
        </div>
    );
}
