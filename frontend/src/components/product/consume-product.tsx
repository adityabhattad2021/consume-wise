"use client";

import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { consumeProductSchema } from "@/api_schema/product/consume";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";

interface ConsumeProductProps {
    productId: number;
}

export default function ConsumeProduct({ productId }: ConsumeProductProps) {
    const [open, setOpen] = useState(false);
    const form = useForm<z.infer<typeof consumeProductSchema>>({
        resolver: zodResolver(consumeProductSchema),
        defaultValues: {
            productId,
            quantity: '',
            duration: '1',
        },
    });
    const { toast } = useToast();

    function onValueChange(duration: number[], callBack: (val: string) => void) {
        callBack(duration[0].toString())
    }

    async function onSubmit(values: z.infer<typeof consumeProductSchema>) {
        try {
            const response = await axios.post('/api/product/consume', values)
            if (response.status === 200) {
                toast({
                    title: "Consumption logged",
                    description: "You have successfully logged your product consumption",
                    variant: "default"
                })
            } else {
                throw new Error('Failed to log consumption')
            }
        } catch (error) {
            console.log('[PRODUCT_CONSUME_ERROR]: ', error)
            toast({
                title: "Error",
                description: "An error occurred while logging your product consumption",
                variant: "destructive"
            })
        } finally {
            setOpen(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full">Consume</Button>
            </DialogTrigger>
            <DialogContent className="w-[90vw] max-w-[500px] max-h-[90vh] overflow-y-auto bg-white p-4 sm:p-6 rounded-lg">
                <DialogHeader>
                    <DialogTitle>
                        Track Consumption
                    </DialogTitle>
                    <DialogDescription>
                        Log your product usage to gain insights and improve your habits over time.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Quantity</FormLabel>
                                        <FormDescription>
                                            Number of units you want to add
                                        </FormDescription>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter quantity"
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
                            name="duration"
                            render={({ field: { value, onChange } }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Consumption Period</FormLabel>
                                        <FormDescription>
                                            Specify how many days this consumption will last or be spread over
                                        </FormDescription>
                                        <FormControl>
                                            <Slider
                                                min={1}
                                                max={30}
                                                step={1}
                                                defaultValue={[Number(value)]}
                                                onValueChange={(val) => onValueChange(val, onChange)}
                                            />
                                        </FormControl>
                                        <div className="flex justify-start items-center text-sm font-medium">
                                            <span>{value}{Number(value) === 30 ? "" : " "}{Number(value) > 1 ? (Number(value) === 30 ? "+ days" : "days") : "day"}</span>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />
                        <Button variant="outline" className="w-full">Submit</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}