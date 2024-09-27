"use client";
import { capitalizeWords } from "@/lib/capitalize_word";
import { CheckIcon, Plus, X } from "lucide-react";
import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HealthDetail, HealthGoal } from "@prisma/client";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

interface SectionProps {
    icon: ReactNode;
    title: string;
    sectionKey: string;
    items: string[];
}

const sectionFormSchema = z.object({
    key: z.string(),
    value: z.string().min(1, 'Please select atleast one option')
})

const SectionOptions = {
    'healthDetails': Object.values(HealthDetail),
    'healthGoals': Object.values(HealthGoal)
}

export function CustomSection({ icon, title, items, sectionKey }: SectionProps) {

    const [isInputVisible, setInputVisible] = useState(false);
    const options = SectionOptions[sectionKey as keyof typeof SectionOptions] || []
    const form = useForm<z.infer<typeof sectionFormSchema>>({
        resolver: zodResolver(sectionFormSchema),
        defaultValues: {
            key: sectionKey,
            value: ''
        }
    })
    const { toast } = useToast();

    async function onSubmit(values: z.infer<typeof sectionFormSchema>) {
        const updatedField = Array.from(new Set([...items, values.value]))
        await submitFn(values.key, updatedField)
    }

    async function onDelete(value: string) {
        const updatedField = items.filter((item) => item !== value)
        await submitFn(sectionKey, updatedField)
    }

    async function submitFn(key: string, value: string[]) {
        try {
            const response = await axios.post('api/user/update', {
                [key]: value
            });
            if (response.status === 200) {
                toast({
                    title: "Success",
                    description: "Field updated successfully",
                    variant: "default"
                })
            }
        } catch (err) {
            console.log(`[ERROR_WHILE_UPDATING (${sectionKey})]: `, err);
            toast({
                title: "Internal Server Error",
                description: "Failed to update the field",
                variant: "destructive"
            })
        } finally {
            setInputVisible(false);
        }
    }

    return (
        <div className="bg-gray-50 rounded-lg p-4">
            <div className="w-full flex flex-row justify-between p-4">
                <div className="flex items-center">
                    {icon}
                    <h3 className="text-lg font-semibold ml-2">{title}</h3>
                </div>
                <div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setInputVisible(!isInputVisible)}
                    >
                        <Plus size={20} />
                    </Button>
                </div>
            </div>
            <ul className="space-y-2">
                {items.map((item: any, index: any) => (
                    <li key={index} className="bg-white rounded-md p-2 shadow-sm flex flex-row justify-between items-center">
                        {capitalizeWords(item)}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(item)}
                        >
                            <X size={16} />
                        </Button>
                    </li>
                ))}
            </ul>
            <div className={`mt-2 transition-all duration-300 ease-in-out ${isInputVisible ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex space-x-2">
                        <FormField
                            control={form.control}
                            name="value"
                            render={({ field }) => {
                                return (
                                    <FormItem className="flex-1" >
                                        <Select onValueChange={field.onChange} defaultValue={field.value} >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select an Option" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    options.map((option) => {
                                                        return (
                                                            <SelectItem key={option} value={option}>
                                                                {capitalizeWords(option)}
                                                            </SelectItem>
                                                        )
                                                    })
                                                }
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            type="submit"
                        >
                            <CheckIcon size={20} />
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
};