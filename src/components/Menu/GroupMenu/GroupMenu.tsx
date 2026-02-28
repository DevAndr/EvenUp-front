import {type FC} from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import * as React from "react";
import {EllipsisVertical} from "lucide-react";
import {toast} from "sonner"

const OPTION_IDS = {
    JOIN: 'join'
}

const BOT_NAME = 'name_bot'

interface Props {
    idGroup?: string
}

export const GroupMenu: FC<Props> = ({idGroup}) => {
    const groupHandler = async (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        const idOptionMenu = target.getAttribute('itemID') as string;

        switch (idOptionMenu) {
            case OPTION_IDS.JOIN: {
                const nameBot = import.meta.env.VITE_NAME_BOT ?? BOT_NAME;
                const inviteLink = `https://t.me/${nameBot}?start=${idGroup}`;

                try {
                    await navigator.clipboard.writeText(inviteLink);
                    toast.info('Ссылка на группу скопирована');
                } catch (err) {
                    console.error('Ошибка копирования:', err);
                }
                break;
            }
            default:
        }
    }

    return <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon"
                    className="w-9 h-9 rounded-[12px] bg-[#1a1a1a] border border-[#2a2a2a] text-zinc-400 hover:text-zinc-100 hover:bg-[#242424] shrink-0">
                <EllipsisVertical/>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="start">
            <DropdownMenuGroup onClick={groupHandler}>
                <DropdownMenuItem itemID={OPTION_IDS.JOIN}>
                    Пригласить в группу
                </DropdownMenuItem>
            </DropdownMenuGroup>
        </DropdownMenuContent>
    </DropdownMenu>
}