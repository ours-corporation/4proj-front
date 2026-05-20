'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents } from '@/src/types/socket-events';
import { refreshToken } from '@/src/api/auth';

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

const SocketContext = createContext<AppSocket | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const socketRef = useRef<AppSocket | null>(null);
    const [, forceRender] = useState(0);

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
        const token = localStorage.getItem('accessToken');

        if (!token) return;

        const socket: AppSocket = io(apiUrl, {
            auth: { token },
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
        });

        socket.on('connect_error', async (err) => {
            if (err.message === 'Invalid or expired token' || err.message === 'Authentication required') {
                try {
                    const res = await refreshToken();
                    if (!res.ok) return;
                    const data = await res.json();
                    if (data.accessToken) {
                        localStorage.setItem('accessToken', data.accessToken);
                        (socket.auth as Record<string, string>).token = data.accessToken;
                        socket.connect();
                    }
                } catch {
                    // silently ignore — user will be redirected by useAuth
                }
            }
        });

        socketRef.current = socket;
        forceRender(n => n + 1);

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, []);

    return (
        <SocketContext.Provider value={socketRef.current}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket(): AppSocket | null {
    return useContext(SocketContext);
}
