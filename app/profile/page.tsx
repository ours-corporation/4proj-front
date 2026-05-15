'use client';

import { useState, useEffect, useRef} from "react";
import Layout from '@/src/components/layout/Layout';
import {useJwtInformation} from "@/src/hooks/getJwtInformation";
import Loading from '@/src/components/Loading';
import { getMyInformation, getMyProfilePicture, getStorageStats } from "@/src/api/user";
import type { StorageStats } from "@/src/interface/storage";

import UpdateUserMailForm from "@/src/components/settings/UpdateUserMailForm";
import UpdatePasswordForm from "@/src/components/settings/UpdatePasswordForm";
import StorageCard from "@/src/components/settings/StorageCard";

import Modal from "@/src/components/modal/Modal"
import InputFile from "@/src/components/input/InputFile";
import SubmitButton from "@/src/components/button/SubmitButton";

import {updateProfilePicture, deleteProfilePicture} from "@/src/api/user";
import DeleteAccountModal from "@/src/components/modal/DeleteAccount";

import { useAuth } from '@/src/hooks/useAuth';


export default function SettingsPage() {

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const userInfo = useJwtInformation();

    const loading = useAuth();

    const [profilePictureOpenModal, setProfilePictureOpenModal] = useState(false);
    const [deleteAccountOpenModal, setDeleteAccountOpenModal] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [accountCreationDate, setAccountCreationDate] = useState("");
    const [error, setError] = useState("");

    const [ uploadProgress, setUploadProgress ] = useState<number>(0);

    const [ ProfilePictureError, setProfilePictureError ] = useState<string>("");
    const [storageStats, setStorageStats] = useState<StorageStats | null>(null);

    const [choosedProfilePicture, setChoosedProfilePicture] = useState<File[]>([]);
    //sélection du fichier pour la pp
    const [profilePicture, setProfilePicture] = useState<string>("");


    

     async function fetchUserProfilePic(){
        try{
            // suppresion de la potentiel url précédente
            if (profilePicture) {
                URL.revokeObjectURL(profilePicture);
            }
            const url = await getMyProfilePicture();
            if (url) {
                setProfilePicture(url);
            }
        } catch (error: any) {
            // 404 = pas de photo, c'est normal, on ignore
            if (error?.message?.includes('404') || error?.status === 404) {
                return;
            }
            console.error(error);
        }
    }

     useEffect(() => {
        async function fetchUserData() {
            try {
                const data = await getMyInformation();
                if (data) {
                    const email = data.email;
                    setEmail(email);
                    const username = data.username;
                    setUsername(username);
                    const date = data.created_at;
                    setAccountCreationDate(date);

                } else {
                    setProfilePictureError("les informations n'ont pas réussi à être récupéré");
                }
            } catch (error) {
                console.log(error);
            }
        }

        fetchUserData();
        fetchUserProfilePic();
        getStorageStats().then(setStorageStats).catch(console.error);

        return () => {
            if (profilePicture) {
                URL.revokeObjectURL(profilePicture);
            }
        };
    }, []);


    const memberYear = accountCreationDate ? accountCreationDate.slice(0, 4) : "2025";

    if (loading) return <Loading />;

    return (
        <Layout currentPage="/settings">
            <main>
                <h1 className='text-3xl font-bold text-txt-primary dark:text-dark-txt-primary mb-6'>
                    Paramètres du compte
                </h1>
            </main>

            <section className="grid grid-cols-1 md:grid-cols-[30%_70%] gap-6 pr-6">

                {/* Carte profil */}
                <div className="w-full bg-surface dark:bg-dark-surface p-6 rounded-[30px] shadow-xl text-txt-primary dark:text-dark-txt-primary font-sans">
                    {/* Avatar avec initiales */}
                  <div className="flex flex-col items-center mb-6">
    
                    <div className="relative h-25 w-25 mb-4">
                        <div className="h-25 w-25 bg-main-bg dark:bg-dark-main-bg rounded-2xl flex items-center justify-center overflow-hidden">
                            {!profilePicture
                                ? <span className="text-2xl font-bold text-txt-primary dark:text-dark-txt-primary select-none">
                                    {username ? username.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) : "?"}
                                </span>
                                : <img className="w-full h-full object-cover rounded-2xl" src={profilePicture} />
                            }
                        </div>

                        {/* Bouton en badge overlay */}
                        <button
                            onClick={() => setProfilePictureOpenModal(true)}
                            className="absolute -bottom-2 -right-2 w-7 h-7 bg-action dark:bg-dark-action rounded-full flex items-center justify-center shadow-md hover:opacity-90 transition-opacity"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                        </button>
                    </div>

                    {/* Ces éléments ne changent pas */}
                    <h2 className="text-xl font-bold text-txt-primary dark:text-dark-txt-primary text-center leading-tight">
                        {username || "Utilisateur"}
                    </h2>
                    <p className="text-sm text-txt-primary/60 dark:text-dark-txt-primary/60 mt-1">
                        Membre depuis {memberYear}
                    </p>
                </div>

                    {/* Séparateur */}
                    <div className="h-[2px] bg-gray-200 dark:bg-white/10 rounded-full mb-4" />

                    {/* Badge plan */}
                    <div className="flex items-center gap-2 px-3 py-2 bg-main-bg dark:bg-dark-main-bg rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 shrink-0 text-[#7c6ef8] dark:text-[#9b8ffa]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                        </svg>
                        <div>
                            <p className="text-xs font-semibold text-txt-primary dark:text-dark-txt-primary">Plan Premium</p>
                            <p className="text-xs text-txt-primary/60 dark:text-dark-txt-primary/60">30 Go de stockage</p>
                        </div>
                    </div>
                </div>

                <UpdateUserMailForm />

                {/* Carte stockage */}
                <StorageCard stats={storageStats} />

                <UpdatePasswordForm />

                {/* Zone de danger */}
                <div className="w-full bg-surface dark:bg-dark-surface p-6 rounded-[30px] shadow-xl font-sans border border-red-200 dark:border-red-900 md:col-start-2">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-semibold text-red-600 dark:text-red-400 mb-1">Supprimer le compte</p>
                            <p className="text-sm text-txt-primary/60 dark:text-dark-txt-primary/60">
                                Action irréversible — tous vos fichiers et données seront perdus.
                            </p>
                        </div>
                        <button
                            onClick={() => setDeleteAccountOpenModal(true)}
                            className="shrink-0 px-4 py-2 text-sm font-medium rounded-xl border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                        >
                            Supprimer le compte
                        </button>
                    </div>
                </div>
            </section>

             <Modal
                size="small"
                title="modifier l'image de profile"
                isOpen={profilePictureOpenModal}
                onClose={() => {  setProfilePictureOpenModal(false); }}
            >
                <div className="space-y-4">
                    {profilePicture && (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-main-bg dark:bg-dark-main-bg">
                            <img src={profilePicture} className="w-12 h-12 rounded-xl object-cover shrink-0" alt="photo actuelle" />
                            <span className="flex-1 text-sm text-txt-primary dark:text-dark-txt-primary">Photo actuelle</span>
                            <button
                                type="button"
                                onClick={async () => {
                                    await deleteProfilePicture();
                                    URL.revokeObjectURL(profilePicture);
                                    setProfilePicture("");
                                    window.dispatchEvent(new Event('profile-picture-updated'));
                                }}
                                className="text-xs font-medium text-error dark:text-dark-error hover:underline"
                            >
                                Retirer
                            </button>
                        </div>
                    )}

                    <InputFile
                        id="file-upload"
                        label="Sélectionner une image de profil"
                        value={choosedProfilePicture}
                        onChange={(files) => {
                            const last = files[files.length - 1];
                            setChoosedProfilePicture(last ? [last] : []);
                        }}
                        accept="image/*"
                    />

                    {ProfilePictureError &&
                        <p className="text-error dark:text-dark-error text-sm">{ProfilePictureError}</p>
                    }

                    <SubmitButton
                        id="add-file-button"
                        type="button"
                        text="Enregistrer l'image"
                        onClick={async () => {
                            if (!choosedProfilePicture[0]) return;
                            await updateProfilePicture(choosedProfilePicture[0]);
                            await fetchUserProfilePic();
                            window.dispatchEvent(new Event('profile-picture-updated'));
                            setProfilePictureOpenModal(false);
                        }}
                    />
                </div>
            </Modal>

            <DeleteAccountModal
                isOpen={deleteAccountOpenModal}
                email={email}
                closeModal={() => setDeleteAccountOpenModal(false)}
            />
        </Layout>
    );

}
