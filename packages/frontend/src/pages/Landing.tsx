import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export const Landing = () => {
    const usernameRef = useRef<HTMLInputElement>(null);
    const roomIdRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        if (usernameRef.current && roomIdRef.current) {
            navigate('/chat', {
                state: {
                    roomId: roomIdRef.current.value,
                    username: usernameRef.current.value
                }
            });
        } else {
            alert("Please enter both username and room ID");
        }
    };

    return (
        <div className="bg-gray-800 min-h-screen flex items-center justify-center font-doto">
            <form className="flex flex-col items-center justify-center gap-2">
                <h1 className="text-6xl mb-12 font-extrabold text-amber-300">Join a Room</h1>
                <input
                    type="text"
                    placeholder="Username"
                    className="w-1/2 px-4 py-2 mb-4 border rounded-xl border-white text-white"
                    ref={usernameRef}
                />
                <input
                    type="text"
                    placeholder="Room ID"
                    className="w-1/2 px-4 py-2 mb-4 border border-white text-white rounded-xl"
                    ref={roomIdRef}
                />
                <div className="flex gap-6 w-1/2">
                    <button
                        type="submit"
                        onClick={handleJoin}
                        className="w-1/2 p-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600"
                    >Create</button>
                    <button
                        onClick={handleJoin}
                        className="w-1/2 p-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600"
                    >Join</button>
                </div>
            </form>
        </div>
    );
};
