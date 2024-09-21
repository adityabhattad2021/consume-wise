import { auth } from "@/auth";
import OnboardingForm from "@/components/user/onboarding-form";
import { redirect } from "next/navigation";

export default async function OnboardingPage(){
    const session = await auth()
    if(!session){
        redirect("/")
    }
    if(session.user.isOnboarded){
        redirect('/profile')
    }

    return (
        <div className="h-screen w-screen flex justify-center items-center">
            <OnboardingForm />
        </div>
    )
}