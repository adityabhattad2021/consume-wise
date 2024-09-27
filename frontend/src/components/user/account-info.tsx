import { ReactNode } from 'react';
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { capitalizeWords } from "@/lib/capitalize_word";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { redirect } from "next/navigation";
import {  Activity, Goal } from 'lucide-react';
import { SignOutButton } from '@/components/user/signout-button';

interface AccountInfoProps{
    userId:string
}

export async function AccountInfo({
    userId
}:AccountInfoProps) {
    
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });

    return (
        <div className="mx-auto px-4 py-8">
            <Card className="w-full mx-auto">
                <CardHeader className="flex flex-row justify-between items-center gap-3">
                    <CardTitle className="text-2xl font-bold text-wrap">Account Information</CardTitle>
                    <div className="space-x-2">
                       <SignOutButton/>
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-3 mb-10">
                    <div className="col-span-1 flex flex-col items-center">
                        <Image
                            src={user?.image || "/placeholder-avatar.png"}
                            alt="Profile Picture"
                            width={150}
                            height={150}
                            className="rounded-full shadow-lg mb-4"
                        />
                        <h2 className="text-xl font-semibold mb-2">{user?.name}</h2>
                        <p className="text-sm text-gray-600 mb-4">{user?.email}</p>
                        <div className="w-full space-y-2">
                            <InfoItem label="Age" value={`${user?.age} years`} />
                            <InfoItem label="Height" value={`${user?.height} cm`} />
                            <InfoItem label="Weight" value={`${user?.weight} kg`} />
                            <InfoItem label="Gender" value={`${capitalizeWords(user?.biologicalSex!)}`} />
                            <InfoItem label="Daily Calorie Needs" value={`${user?.dailyCalorieNeeds} kcal`} />
                            <InfoItem label="Activity Level" value={capitalizeWords(user?.activityLevel!)} />
                            <InfoItem label="Dietary Preference" value={capitalizeWords(user?.dietaryPreference!)} />
                        </div>
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        <Section
                            icon={<Activity className="w-6 h-6" />}
                            title="Health Details"
                            items={user?.healthDetails || []}
                        />
                        <Section
                            icon={<Goal className="w-6 h-6" />}
                            title="Health Goals"
                            items={user?.healthGoals || []}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}


interface InfoItemProps {
    label: string;
    value: string;
}

function InfoItem({ label, value }: InfoItemProps) {
    return (
        <div className="flex justify-between items-center bg-gray-100 rounded-md p-2">
            <span className="text-sm font-medium text-gray-600">{label}:</span>
            <span className="text-sm font-semibold">{value}</span>
        </div>
    )
}


interface SectionProps{
    icon:ReactNode;
    title:string;
    items:string[];
}

function Section({ icon, title, items }: SectionProps) {
    return (
        <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-4">
                {icon}
                <h3 className="text-lg font-semibold ml-2">{title}</h3>
            </div>
            <ul className="space-y-2">
                {items.map((item: any, index: any) => (
                    <li key={index} className="bg-white rounded-md p-2 shadow-sm">
                        {capitalizeWords(item)}
                    </li>
                ))}
            </ul>
        </div>
    )
};
