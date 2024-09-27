import { auth } from "@/auth";
import Skeleton from "@/components/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountInfo } from "@/components/user/account-info";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function ProfilePage() {

    const session = await auth();
    if(!session?.user){
        redirect("/")
    }

    return (
        <div className="mx-auto px-10 md:px-24 py-8 pt-36">
            <div className="w-full flex flex-col justify-start gap-3">
                <h1 className="text-4xl font-bold">
                    Your Profile
                </h1>
                <p className="text-lg text-muted-foreground">
                    Accurate information helps us provide better recommendations and product analysis.
                </p>
            </div>
            <Tabs className="space-y-6 mt-6" defaultValue={"accountInfo"}>
                <TabsList className="w-full grid grid-cols-2 gap-2" >
                    <TabsTrigger value="accountInfo">Account Information</TabsTrigger>
                    <TabsTrigger value="consumptionAnalysis">
                        Consumption Analysis
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="accountInfo">
                    <Suspense fallback={<AccountInfoSkeleton/>}>
                        <AccountInfo userId={session.user.id!} />
                    </Suspense>
                </TabsContent>
                <TabsContent value="consumptionAnalysis">
                    TODO
                </TabsContent>
            </Tabs>
        </div>
    )
}


function AccountInfoSkeleton() {
    return (
        <div className="mx-auto px-4 py-8">
            <Card className="w-full mx-auto">
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle className="text-2xl font-bold">Account Information</CardTitle>
                        <div className="rounded-md w-24 h-8 animate-pulse" />
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8 my-10">
                    <div className="col-span-1 flex flex-col items-center">
                        <div className="rounded-full mb-4 w-36 h-36" />
                        <h2 className="text-xl font-semibold mb-2 w-32 h-6" />
                        <p className="text-sm  mb-4 w-48 h-4" />
                        <div className="w-full space-y-2">
                    
                            {Array.from({ length: 7 }).map((_, index) => (
                                <div key={index} className="flex justify-between items-center bg-gray-200 rounded-md p-2 animate-pulse">
                                    <span className="text-sm font-medium w-24 h-4" />
                                    <span className="text-sm font-semibold w-16 h-4" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-6">
                    
                        <SectionSkeleton title="Health Details" />
                        <SectionSkeleton title="Health Goals" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function SectionSkeleton({ title }: { title: string }) {
    return (
        <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-4">
                <div className= "rounded-full w-6 h-6" />
                <h3 className="text-lg font-semibold ml-2 w-32 h-6" >{title}</h3>
            </div>
            <ul className="space-y-2">
                {Array.from({ length: 3 }).map((_, index) => (
                    <li key={index} className="bg-gray-200 rounded-md p-2 shadow-sm animate-pulse">
                        <div className= "w-full h-4" />
                    </li>
                ))}
            </ul>
        </div>
    );
}
