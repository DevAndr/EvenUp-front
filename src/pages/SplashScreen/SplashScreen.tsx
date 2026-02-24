import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {Button} from "@/components/ui/button.tsx";
import {Spinner} from "@/components/ui/spinner.tsx";
import axios from "axios";
import {saveToken} from "@/utils";

type AuthStatus = "loading" | "authenticating" | "success" | "error";

interface TelegramWebApp {
    initData: string;
    initDataUnsafe: {
        user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
        };
    };
    ready: () => void;
    expand: () => void;
}

declare global {
    interface Window {
        Telegram?: { WebApp: TelegramWebApp };
    }
}

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3030";

async function authViaTelegram(initData: string): Promise<string> {
    const res = await axios.post<{ token: string }>(
        `${API_URL}/auth/telegram`,
        null,
        { headers: { Authorization: `TgWebApp ${initData}` } }
    );
    return res.data.token;
}


export const SplashScreen = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState<AuthStatus>("loading");
    const [errorMsg, setErrorMsg] = useState<string>("");

    useEffect(() => {
        const tg = window.Telegram?.WebApp;

        if (!tg) {
            if (import.meta.env.DEV) {
                setStatus("authenticating");
                setTimeout(() => {
                    saveToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbW0wYmxyOHYwMDAwcXQzOW9pdWplYWM0IiwiaWF0IjoxNzcxOTUxOTY0LCJleHAiOjE3NzI1NTY3NjR9.wAjEThElUSoHnCANi8OMo7xce4UAAfnQoMDJBkCqafA");
                    setStatus("success");
                    setTimeout(() => navigate("/app/home"), 300);
                }, 500);
            } else {
                setStatus("error");
                setErrorMsg("Открой приложение через Telegram");
            }
            return;
        }

        tg.ready();
        tg.expand();

        const initData = tg.initData;
        if (!initData) {
            setStatus("error");
            setErrorMsg("Не удалось получить данные Telegram");
            return;
        }

        setStatus("authenticating");

        authViaTelegram(initData)
            .then((token) => {
                saveToken(token);
                setStatus("success");
                setTimeout(() => navigate("/app/home"), 300);
            })
            .catch((err) => {
                setStatus("error");
                const msg =
                    err?.response?.data?.message ??
                    "Не удалось авторизоваться. Попробуй ещё раз.";
                setErrorMsg(msg);
            });
    }, [navigate]);

    if (status !== "error") {
        return (
            <div className="min-h-screen w-full bg-[#0f0f0f] flex items-center justify-center font-[Manrope,sans-serif] flex-col">
                <Spinner />
                <p className="text-sm text-zinc-400 mt-2">{status}</p>
            </div>
        );
    }


    return (
        <div className="min-h-screen w-full bg-[#0f0f0f] flex flex-col items-center justify-center gap-4 font-[Manrope,sans-serif] px-6 pt-safe pb-safe">
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-5 py-4 text-center max-w-[280px]">
                <p className="text-sm text-red-400 leading-relaxed">{errorMsg}</p>
            </div>
            <Button
                onClick={() => window.location.reload()}
                className="bg-indigo-500 hover:bg-indigo-600 active:scale-95 transition-all rounded-2xl px-8 py-3.5 text-[15px] font-bold text-white"
            >
                Попробовать снова
            </Button>
        </div>
    );
}