'use client';

import React, {useEffect, useState} from 'react';
import { useAuth } from '@/src/hooks/useAuth';
import Loading from '@/src/components/Loading';
import Layout from '@/src/components/Layout';
import Error from "@/src/components/Error";
import {useJwtInformation} from "@/src/hooks/getJwtInformation";
import GlobalCard from "@/src/components/card/GlobalCard";
import { getMyInformation } from "@/src/api/user";
import ShowRecentFile from "@/src/components/dashboard/ShowRecentFIle";


export default function Dashboard() {
    const userInfo = useJwtInformation();
    const [ error, setError ] = useState<boolean>(false);
    //--------protection de vérification d'authentification---------
    const loading = useAuth();
    //--------------------------------------------------------------

    //--------Space information (to be replaced with API data)---------
    const [current, setCurrent] = useState(0);
    const [total, setTotal] = useState(0);
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        async function fetchUserData() {
            try {
                const data = await getMyInformation();
                if (data) {
                    const usedGB = data.used_bytes / (1024 ** 3);
                    const totalGB = data.quota ? data.quota.quota_bytes / (1024 ** 3) : 0;
                    setCurrent(parseFloat(usedGB.toFixed(2)));
                    setTotal(parseFloat(totalGB.toFixed(2)));
                    const percent = totalGB > 0 ? (usedGB / totalGB) * 100 : 0;
                    setPercentage(parseFloat(percent.toFixed(2)));
                } else {
                    setError(true);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }

        fetchUserData();
    }, []);

    if (loading) return <Loading />;
    if (error) { return <Error errorMsg="Une erreur est survenue lors du chargement des informations utilisateur." />; }

    return (
        <Layout currentPage="/dashboard">
            <h1 className="text-3xl font-bold text-txt-primary dark:text-dark-txt-primary mb-2">
                Bonjour, {userInfo ? userInfo.username : 'Utilisateur'} !
            </h1>
            <p className="text-txt-secondary dark:text-dark-txt-secondary mb-8">Retrouvez vos fichiers récents et dossiers partagés.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <GlobalCard
                    svgIcon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#5E81F4]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"/>
                        </svg>
                    }
                >
                    <div className="mb-6">
                        <h3 className="text-txt-primary dark:text-dark-txt-primary font-medium text-md mb-1">Espace Utilisé</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-txt-primary dark:text-dark-txt-primary tracking-tight">{current} GB</span>
                            <span className="text-txt-secondary dark:text-dark-txt-secondary text-lg font-medium">/ {total} GB</span>
                        </div>
                    </div>

                    <div className="w-full bg-main-bg dark:bg-dark-main-bg rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-action dark:bg-dark-action h-full rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${percentage}%` }}
                        ></div>
                    </div>
                </GlobalCard>
            </div>
            <h1 className="text-xl font-bold text-txt-secondary dark:text-dark-txt-primary mb-2 mt-8">
                Fichiers Récents
                <ShowRecentFile />
            </h1>
        </Layout>
    );
}