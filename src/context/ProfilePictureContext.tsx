'use client';

import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { getMyProfilePicture } from '@/src/api/user';

interface ProfilePictureContextValue {
    profilePicture: string;
    refresh: () => void;
}

const ProfilePictureContext = createContext<ProfilePictureContextValue>({
    profilePicture: "",
    refresh: () => {},
});

export function ProfilePictureProvider({ children }: { children: React.ReactNode }) {
    const [profilePicture, setProfilePicture] = useState("");
    const currentUrl = useRef("");

    async function fetchPicture() {
        try {
            const url = await getMyProfilePicture();
            if (currentUrl.current) URL.revokeObjectURL(currentUrl.current);
            currentUrl.current = url ?? "";
            setProfilePicture(url ?? "");
        } catch {
            setProfilePicture("");
        }
    }

    useEffect(() => {
        fetchPicture();
        window.addEventListener('profile-picture-updated', fetchPicture);
        return () => {
            window.removeEventListener('profile-picture-updated', fetchPicture);
            if (currentUrl.current) URL.revokeObjectURL(currentUrl.current);
        };
    }, []);

    return (
        <ProfilePictureContext.Provider value={{ profilePicture, refresh: fetchPicture }}>
            {children}
        </ProfilePictureContext.Provider>
    );
}

export function useProfilePicture() {
    return useContext(ProfilePictureContext);
}
