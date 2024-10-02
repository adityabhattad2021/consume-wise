'use client';

import { useEffect } from "react";


interface RootLayoutClientProps{
    children: React.ReactNode;
}


export default function RootLayoutClient({children}: RootLayoutClientProps){

    useEffect(()=>{
        if('serviceWorker' in navigator){
            navigator.serviceWorker.register('/sw.js').then((registration)=>{
                console.log('Service Worker registration successful with scope: ', registration.scope);
            }).catch((err)=>{
                console.log('Service Worker registration failed: ', err);
            });
        }
    },[])

    return(
        <>
            {children}
        </>
    )
}