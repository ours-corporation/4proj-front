'use client';

import { useEffect } from 'react';
import { useSocket } from '@/src/context/SocketContext';
import type { ServerToClientEvents } from '@/src/types/socket-events';

export function useSocketEvent<E extends keyof ServerToClientEvents>(
    event: E,
    handler: ServerToClientEvents[E]
) {
    const socket = useSocket();

    useEffect(() => {
        if (!socket) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (socket as any).on(event, handler);
        return () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (socket as any).off(event, handler);
        };
    }, [socket, event, handler]);
}
