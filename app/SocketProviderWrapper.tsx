'use client';

import { SocketProvider } from '@/src/context/SocketContext';

export default function SocketProviderWrapper({ children }: { children: React.ReactNode }) {
    return <SocketProvider>{children}</SocketProvider>;
}
