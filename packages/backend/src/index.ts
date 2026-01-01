import WebSocket, { WebSocketServer } from "ws";

const PORT = Number(process.env.PORT) || 8080;
const wss = new WebSocketServer({ port: PORT });

console.log(`WebSocket server started on port ${PORT}`);

export interface User {
    roomId: string;
    username: string;
}

const users = new Map<WebSocket, User>();

const rooms = new Map<string, Set<WebSocket>>();

interface Message {
    username: string;
    message: string;
}

const roomMessages = new Map<string, Message[]>();

function broadcastToRoom(roomId: string, message: string, excludeSocket?: WebSocket){
    const roomUsers = rooms.get(roomId);
    if(!roomUsers) return;
    roomUsers.forEach((socket) => {
        if(users.get(socket) !== excludeSocket && socket.readyState === WebSocket.OPEN){
            socket.send(message);
        }
    })
}

function removeUser(ws: WebSocket){
    const user = users.get(ws);
    if(user){
        users.delete(ws);
        console.log(`${user.username} disconnected from room ${user.roomId}`);
        broadcastToRoom(user.roomId, JSON.stringify({
            type: "system",
            payload: `${user.username} has left the room`
        }), ws);
    }
}

wss.on("connection", (ws) => {
    ws.on("error", console.error);

    ws.on("message", (message) => {
        let parsedMessage;
        try{
            parsedMessage = JSON.parse(message.toString());
        } catch(e){
            console.error("Invalid message format", e);
            return;
        }

        console.log(`Received message: ${parsedMessage.type}`);

        if(parsedMessage.type === "join"){
            const {roomId, username} = parsedMessage;
            
            users.set(ws, { roomId, username });

            if(!rooms.has(roomId)){
                rooms.set(roomId, new Set());
            }
            rooms.get(roomId)?.add(ws);
            console.log(`Current users: ${Array.from(users.values()).map(u => u.username).join(", ")}`);

            const existingMessages = roomMessages.get(roomId) || [];
            existingMessages.forEach(msg => {
                ws.send(JSON.stringify({
                    type: "message",
                    payload: {
                        message: msg.message,
                        username: msg.username
                    }
                }));
            });

            broadcastToRoom(roomId, JSON.stringify({
                type: "system",
                payload: `${username} has joined the room`
            }), ws);
        }

        if(parsedMessage.type === "message"){
            const curruser = users.get(ws);
            
            if(!curruser){
                ws.send(JSON.stringify({
                    type: "error",
                    payload: `You must join a room before sending messages`
                }));
                return;
            }

            if (!roomMessages.has(curruser.roomId)) {
                roomMessages.set(curruser.roomId, []);
            }
            roomMessages.get(curruser.roomId)?.push({
                username: curruser.username,
                message: parsedMessage.payload
            });

            broadcastToRoom(curruser.roomId, JSON.stringify({
                type: "message",
                payload: {
                    message: parsedMessage.payload,
                    username: curruser.username
                }
            }), ws);
        }
    });

    ws.on("close", () => {
        removeUser(ws);
    });
})