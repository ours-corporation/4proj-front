'use client';

import { useState, useEffect } from "react";
import Layout from '@/src/components/layout/Layout';
import { useJwtInformation } from "@/src/hooks/getJwtInformation";
import Loading from '@/src/components/Loading';
import { getMyInformation, getMyProfilePicture, getStorageStats, downloadGdprExport } from "@/src/api/user";
import { updateProfilePicture, deleteProfilePicture } from "@/src/api/user";
import type { StorageStats } from "@/src/interface/storage";

import UpdateUserMailForm from "@/src/components/settings/UpdateUserMailForm";
import UpdatePasswordForm from "@/src/components/settings/UpdatePasswordForm";
import StorageCard from "@/src/components/settings/StorageCard";
import Modal from "@/src/components/modal/Modal";
import InputFile from "@/src/components/input/InputFile";
import SubmitButton from "@/src/components/button/SubmitButton";
import DeleteAccountModal from "@/src/components/modal/DeleteAccount";
import { useAuth } from '@/src/hooks/useAuth';

export default function ProfilePage() {
    const userInfo = useJwtInformation();
    const loading = useAuth();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [accountCreationDate, setAccountCreationDate] = useState("");
    const [profilePicture, setProfilePicture] = useState<string>("");
    const [storageStats, setStorageStats] = useState<StorageStats | null>(null);

    const [profilePictureOpenModal, setProfilePictureOpenModal] = useState(false);
    const [deleteAccountOpenModal, setDeleteAccountOpenModal] = useState(false);
    const [exportingData, setExportingData] = useState(false);
    const [choosedProfilePicture, setChoosedProfilePicture] = useState<File[]>([]);
    const [profilePictureError, setProfilePictureError] = useState<string>("");
    const [uploadingPic, setUploadingPic] = useState(false);

    async function fetchUserProfilePic() {
        try {
            if (profilePicture) URL.revokeObjectURL(profilePicture);
            const url = await getMyProfilePicture();
            if (url) setProfilePicture(url);
        } catch (error: any) {
            if (!error?.message?.includes('404') && error?.status !== 404) console.error(error);
        }
    }

    useEffect(() => {
        getMyInformation().then(data => {
            if (data) { setEmail(data.email); setUsername(data.username); setAccountCreationDate(data.created_at); }
        }).catch(() => {});
        fetchUserProfilePic();
        getStorageStats().then(setStorageStats).catch(() => {});
        return () => { if (profilePicture) URL.revokeObjectURL(profilePicture); };
    }, []);

    const memberYear = accountCreationDate ? accountCreationDate.slice(0, 4) : new Date().getFullYear().toString();
    const initials = username ? username.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "?";

    const usedPct = storageStats?.used_percent ?? 0;
    const usedBytes = storageStats?.used_bytes ?? 0;
    const quotaBytes = storageStats?.quota_bytes ?? 30 * 1024 ** 3;

    function fmtGo(bytes: number) { return (bytes / (1024 ** 3)).toFixed(1); }

    if (loading) return <Loading />;

    return (
        <Layout currentPage="/profile">

            {/* ── Profile header card ── */}
            <div className="bg-surface dark:bg-[#111113] border border-border-subtle dark:border-white/[0.06] rounded-[20px] p-6 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">

                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-[#7c6ef8] to-[#42aff0] flex items-center justify-center">
                            {profilePicture
                                ? <img src={profilePicture} alt="avatar" className="w-full h-full object-cover" />
                                : <span className="text-2xl font-bold text-white select-none">{initials}</span>
                            }
                        </div>
                        <button
                            onClick={() => setProfilePictureOpenModal(true)}
                            className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-gradient-to-br from-[#7c6ef8] to-[#42aff0] rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(124,110,248,0.4)] hover:opacity-90 transition-opacity"
                            title="Modifier la photo de profil"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-3.5 h-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                        </button>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl font-bold text-txt-primary dark:text-[#ededed] truncate">{username || "Utilisateur"}</h1>
                        <p className="text-[13px] text-txt-secondary dark:text-[#555] mt-0.5 truncate">{email}</p>

                        <div className="flex flex-wrap items-center gap-3 mt-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7c6ef8]/10 border border-[#7c6ef8]/20 text-[12px] font-medium text-[#9b8ffa]">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                                </svg>
                                Plan Premium
                            </span>
                            <span className="text-[12px] text-txt-secondary dark:text-[#444]">Membre depuis {memberYear}</span>
                        </div>
                    </div>

                    {/* Storage mini summary */}
                    <div className="sm:text-right flex-shrink-0 w-full sm:w-auto">
                        <p className="text-[11px] text-txt-secondary dark:text-[#444] mb-1.5 uppercase tracking-wider">Stockage</p>
                        <p className="text-[22px] font-bold text-txt-primary dark:text-[#ededed]">{fmtGo(usedBytes)} <span className="text-[14px] text-txt-secondary dark:text-[#444] font-normal">/ {fmtGo(quotaBytes)} Go</span></p>
                        <div className="w-full sm:w-40 h-1.5 bg-black/[0.05] dark:bg-white/[0.05] rounded-full overflow-hidden mt-2">
                            <div className="h-full rounded-full bg-gradient-to-r from-[#7c6ef8] to-[#42aff0]" style={{ width: `${Math.min(usedPct, 100)}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Settings grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <UpdateUserMailForm />
                <UpdatePasswordForm />
                <div className="lg:col-span-2">
                    <StorageCard stats={storageStats} />
                </div>

                {/* Confidentialité */}
                <div className="lg:col-span-2 bg-surface dark:bg-[#111113] border border-border-subtle dark:border-white/[0.06] rounded-[20px] p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-[10px] bg-[#7c6ef8]/10 flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#7c6ef8" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-[15px] font-semibold text-txt-primary dark:text-[#ededed]">Confidentialité & RGPD</h2>
                            <p className="text-[12px] text-txt-secondary dark:text-[#444]">Vos droits sur vos données personnelles</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-[12px] bg-[#7c6ef8]/[0.04] border border-[#7c6ef8]/10">
                        <div>
                            <p className="text-[14px] font-medium text-txt-primary dark:text-[#ccc]">Exporter mes données</p>
                            <p className="text-[12px] text-txt-secondary dark:text-[#555] mt-0.5">Téléchargez l'intégralité de vos données personnelles au format JSON (droit à la portabilité, art. 20 RGPD).</p>
                        </div>
                        <button
                            onClick={async () => {
                                setExportingData(true);
                                try { await downloadGdprExport(); }
                                catch { }
                                finally { setExportingData(false); }
                            }}
                            disabled={exportingData}
                            className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium rounded-[10px] border border-[#7c6ef8]/40 text-[#7c6ef8] hover:bg-[#7c6ef8]/[0.08] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {exportingData ? (
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                            )}
                            {exportingData ? 'Export en cours…' : 'Exporter mes données'}
                        </button>
                    </div>
                </div>

                {/* Danger zone */}
                <div className="lg:col-span-2 bg-surface dark:bg-[#111113] border border-[#ef5350]/20 rounded-[20px] p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-[10px] bg-[#ef5350]/10 flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#ef5350" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-[15px] font-semibold text-[#ef5350]">Zone de danger</h2>
                            <p className="text-[12px] text-txt-secondary dark:text-[#444]">Actions irréversibles sur votre compte</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-[12px] bg-[#ef5350]/[0.04] border border-[#ef5350]/10">
                        <div>
                            <p className="text-[14px] font-medium text-txt-primary dark:text-[#ccc]">Supprimer le compte</p>
                            <p className="text-[12px] text-txt-secondary dark:text-[#555] mt-0.5">Tous vos fichiers, dossiers et données seront définitivement perdus.</p>
                        </div>
                        <button
                            onClick={() => setDeleteAccountOpenModal(true)}
                            className="flex-shrink-0 px-4 py-2.5 text-[13px] font-medium rounded-[10px] border border-[#ef5350]/40 text-[#ef5350] hover:bg-[#ef5350]/[0.08] transition-all"
                        >
                            Supprimer le compte
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Photo de profil modal ── */}
            <Modal size="small" title="Photo de profil" isOpen={profilePictureOpenModal} onClose={() => setProfilePictureOpenModal(false)}>
                <div className="space-y-4">
                    {profilePicture && (
                        <div className="flex items-center gap-3 p-3 rounded-[12px] bg-surface-hover dark:bg-[#0d0d0d] border border-border-subtle dark:border-white/[0.06]">
                            <img src={profilePicture} className="w-12 h-12 rounded-[10px] object-cover flex-shrink-0" alt="photo actuelle" />
                            <span className="flex-1 text-sm text-txt-secondary dark:text-[#888]">Photo actuelle</span>
                            <button
                                type="button"
                                onClick={async () => {
                                    await deleteProfilePicture();
                                    URL.revokeObjectURL(profilePicture);
                                    setProfilePicture("");
                                    setChoosedProfilePicture([]);
                                    window.dispatchEvent(new Event('profile-picture-updated'));
                                    setProfilePictureOpenModal(false);
                                }}
                                className="text-[13px] text-[#ef5350] hover:underline"
                            >
                                Retirer
                            </button>
                        </div>
                    )}

                    <InputFile
                        id="profile-pic-upload"
                        label="Nouvelle photo"
                        value={choosedProfilePicture}
                        onChange={(files) => {
                            const last = files[files.length - 1];
                            setChoosedProfilePicture(last ? [last] : []);
                        }}
                        accept="image/*"
                    />

                    {profilePictureError && (
                        <p className="text-[13px] text-[#ef5350] px-3 py-2 bg-[#ef5350]/[0.08] border border-[#ef5350]/20 rounded-[8px]">{profilePictureError}</p>
                    )}

                    <SubmitButton
                        id="save-profile-pic"
                        type="button"
                        text="Enregistrer"
                        loading={uploadingPic}
                        loadingText="Enregistrement…"
                        onClick={async () => {
                            if (!choosedProfilePicture[0]) return;
                            setUploadingPic(true);
                            try {
                                await updateProfilePicture(choosedProfilePicture[0]);
                                await fetchUserProfilePic();
                                window.dispatchEvent(new Event('profile-picture-updated'));
                                setProfilePictureOpenModal(false);
                                setChoosedProfilePicture([]);
                            } catch { setProfilePictureError("Erreur lors de l'enregistrement."); }
                            finally { setUploadingPic(false); }
                        }}
                        className="w-full py-3 rounded-[10px] bg-gradient-to-r from-[#7c6ef8] to-[#42aff0] text-white text-[14px] font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
