import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export interface ChatMessage {
    type: "system" | "message" | "error" | "join";
    username: string;
    payload: any;
}

export const Dashboard = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const wsRef = useRef<WebSocket | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const navigate = useNavigate();

    const { roomId, username } = location.state || {};

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!roomId || !username) {
            navigate('/');
            return;
        };

        const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8081';
        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;
        ws.onopen = () => {
            ws.send(JSON.stringify({
                type: "join",
                roomId: roomId,
                username: username
            }));
        }
        ws.onmessage = (e) => {
            const parsed = JSON.parse(e.data);
            setMessages(prevMessages => [...prevMessages, parsed]);
        }

        return () => {
            ws.close();
        }
    }, [roomId, username])

    function handleMessage(e: React.FormEvent) {
        e.preventDefault();
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                type: "message",
                payload: inputRef.current?.value || ''
            }));
            if (inputRef.current) {
                inputRef.current.value = '';
            }
        }
    }

    function handleClose() {
        if (wsRef.current) {
            wsRef.current.close();
        }
        navigate('/');
    }

    return (
        <div className="bg-gray-800 min-h-screen font-doto flex justify-center items-center">
            <div className="w-1/2 flex flex-col shadow-[0_0_25px_15px_rgba(0,0,0,0.1)] rounded-2xl p-8">    
                <div className="flex flex-col space-y-2 h-96 overflow-y-auto mb-4 p-2 rounded-xl text-white">
                    {messages.map((msg, index) => (
                        msg.type === "system" ? (
                            <div key={index} className="flex justify-center">{msg.payload}</div>
                        ) : (
                            <div key={index} className={`flex ${msg.payload.username !== username ? 'text-green-400' : 'text-blue-400'}`}>
                                <span className="font-bold">{msg.payload.username}: {msg.payload.message}</span>
                            </div>
                        )
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <form className="grid grid-cols-5 gap-4 mt-4 text-white" onSubmit={handleMessage}>
                    <input ref={inputRef} type="text" className="col-span-4 p-2 border border-white text-white rounded-xl" placeholder="Type your message..." />
                    <button type="submit" className="col-span-1 px-4 py-2 bg-blue-500 rounded-xl">Send</button>
                </form>
                <div className="flex justify-center">
                    <button onClick={handleClose} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-xl w-1/4">Disconnect</button>
                </div>
            </div>
        </div>
    )
}