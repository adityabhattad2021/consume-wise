import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { capitalizeWords } from "@/lib/capitalize_word";
import Image from "next/image";
import { Activity, Goal } from 'lucide-react';
import { SignOutButton } from '@/components/user/signout-button';
import { CustomSection as Section } from '@/components/user/section';
import UpdateProfileDialog from "./update-profile-dialog";
import { unstable_cache } from 'next/cache';
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic'

interface AccountInfoProps {
    userId: string
}

const getUser = unstable_cache(
    async (userId: string) => {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        return user
    },
    ['user-fn'],
    {
        tags:['user']
    }
)

export async function AccountInfo({
    userId
}: AccountInfoProps) {


    const user = await getUser(userId);
    if (!user) {
        redirect("/");
    }

    return (
        <div className="mx-auto py-8">
            <Card className="w-full mx-auto">
                <CardHeader className="flex flex-row justify-between items-center gap-3">
                    <CardTitle className="text-lg md:text-2xl font-bold text-wrap">Account Information</CardTitle>
                    <div className="space-x-2">
                        <SignOutButton />
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
                        <div className="flex justify-end w-full space-y-2">
                            <UpdateProfileDialog
                                user={user}
                            />
                        </div>
                        <div className="w-full space-y-2">
                            <InfoItem label="Age" value={`${user?.age} years`} />
                            <InfoItem label="Height" value={`${user?.height} cm`} />
                            <InfoItem label="Weight" value={`${user?.weight} kg`} />
                            <InfoItem label="Gender" value={`${capitalizeWords(user?.biologicalSex || '')}`} />
                            <InfoItem label="Daily Calorie Needs" value={`${user?.dailyCalorieNeeds} kcal`} />
                            <InfoItem label="Activity Level" value={capitalizeWords(user?.activityLevel || '')} />
                            <InfoItem label="Dietary Preference" value={capitalizeWords(user?.dietaryPreference || '')} />
                        </div>
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        <Section
                            icon={<Activity className="w-6 h-6" />}
                            title="Health Details"
                            sectionKey="healthDetails"
                            items={user?.healthDetails || []}
                        />
                        <Section
                            icon={<Goal className="w-6 h-6" />}
                            title="Health Goals"
                            sectionKey="healthGoals"
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



