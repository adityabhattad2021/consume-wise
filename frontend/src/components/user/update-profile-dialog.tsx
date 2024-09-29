"use client";
import { updateUserSchema } from "@/api_schema/user/update";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { ActivityLevel, BiologicalSex, DietaryPreference, User } from "@prisma/client";
import { capitalizeWords } from "@/lib/capitalize_word";

interface UpdateProfileDialogProps {
    user: User
}

export default function UpdateProfileDialog({ user }: UpdateProfileDialogProps) {
    const form = useForm<z.infer<typeof updateUserSchema>>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            biologicalSex: user.biologicalSex || undefined,
            age: user.age?.toString() || undefined,
            weight: user.weight?.toString() || undefined,
            height: user.height?.toString() || undefined,
            healthDetails: user.healthDetails,
            activityLevel: user.activityLevel || undefined,
            dietaryPreference: (user.dietaryPreference as "EGGITARIAN" | "VEGETARIAN" | "VEGAN" | undefined) || undefined,
            nutritionKnowledge: user.nutritionKnowledge?.toString() || "",
            healthGoals: user.healthGoals || [],
        },
    })
    const [open, setOpen] = useState(false)
    const { toast } = useToast();

    async function onSubmit(values: z.infer<typeof updateUserSchema>) {
        try {
            await axios.post('/api/user/update', values)
            toast({
                title: "Profile updated",
                description: "Your profile has been updated.",
            })
        } catch (err) {
            console.log('update profile failed.')
            toast({
                title: "Profile update failed",
                description: "Please try again.",
            })
        } finally {
            setOpen(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="mb-4">Edit Profile</Button>
            </DialogTrigger>
            <DialogContent className="w-[90vw] max-w-[500px] max-h-[90vh] overflow-y-auto bg-white p-4 sm:p-6">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="mb-6 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="biologicalSex"
                                    render={({ field }) => {
                                        return (
                                            <FormItem className='flex-1'>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
                                                <Select
                                                    name="biologicalSex"
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="w-full p-3 py-6 border border-gray-300 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                                            <SelectValue placeholder="Select Gender"  />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {Object.values(BiologicalSex).map((option) => (
                                                            <SelectItem key={option} value={option}>
                                                                {capitalizeWords(option)}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>

                                        )
                                    }}
                                />
                                <FormField
                                    control={form.control}
                                    name="age"
                                    render={({ field }) => {
                                        return (
                                            <FormItem className='flex-1'>
                                                <FormLabel className="block text-xs font-medium text-gray-700 mb-1">Age</FormLabel>
                                                <FormControl>
                                                    <Input

                                                        placeholder='Enter your age here'
                                                        className="w-full p-3 py-6 border border-gray-300 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                        {...field}
                                                        value={field.value || ''}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )
                                    }}
                                />
                                <FormField
                                    control={form.control}
                                    name='weight'
                                    render={({ field }) => {
                                        return (
                                            <FormItem className='flex-1'>
                                                <FormLabel className="block text-xs font-medium text-gray-700 mb-1">Weight (Kg)</FormLabel>
                                                <FormControl>
                                                    <Input

                                                        placeholder='Enter your weight'
                                                        {...field}
                                                        value={field.value || ''}
                                                        className="w-full p-3 py-6 border border-gray-300 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )
                                    }}
                                />

                                {/* Height */}
                                <FormField
                                    control={form.control}
                                    name='height'
                                    render={({ field }) => {
                                        return (
                                            <FormItem className='flex-1'>
                                                <FormLabel className="block text-xs font-medium text-gray-700 mb-1">Height (cm)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder='Enter your height here'
                                                        className="w-full p-3 py-6 border border-gray-300 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                        {...field}
                                                        value={field.value || ''}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )
                                    }}
                                />
                                <FormField
                                    control={form.control}
                                    name="activityLevel"
                                    render={({ field }) => (
                                        <FormItem className='mb-3'>
                                            <FormLabel className="block text-xs font-medium text-gray-700 mb-1">Regular Activity Level</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full p-3 py-6 border border-gray-300 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                                        <SelectValue placeholder="Select Activity Level" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Object.values(ActivityLevel).map((option) => (
                                                        <SelectItem key={option} value={option}>
                                                            {capitalizeWords(option)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="dietaryPreference"
                                    render={({ field }) => (
                                        <FormItem className='mb-3'>
                                            <FormLabel className="block text-xs font-medium text-gray-700 mb-1">Dietary Preference</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full p-3 py-6 border border-gray-300 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                                        <SelectValue placeholder="Select Dietary Preference" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Object.values(DietaryPreference).map((option) => (
                                                        <SelectItem key={option} value={option}>
                                                            {capitalizeWords(option)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="nutritionKnowledge"
                                    render={({ field }) => {
                                        return (
                                            <FormItem className='mb-3'>
                                                <FormLabel className="block text-xs font-medium text-gray-700 mb-1">Nutrition Knowledge</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value ? field.value.toString() : ''}>
                                                    <FormControl>
                                                        <SelectTrigger className="w-full p-3 py-6 border border-gray-300 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                                            <SelectValue placeholder="Select Nutrition Knowledge Level" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {[1, 2, 3].map((option) => (
                                                            <SelectItem key={option} value={option.toString() || ''}>
                                                                {option}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )
                                    }}
                                />
                            </div>
                            <Button type="submit" className="w-full sm:w-auto">Save changes</Button>
                        </form>
                    </Form>
            </DialogContent>
        </Dialog >
    )
}