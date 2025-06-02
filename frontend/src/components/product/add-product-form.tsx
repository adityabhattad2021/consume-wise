"use client"

import { addProductSchema } from "@/api_schema/product/add";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { AlertCircle, Loader2 } from "lucide-react";

export default function AddProductForm() {

    const form = useForm<z.infer<typeof addProductSchema>>({
        resolver: zodResolver(addProductSchema),
        defaultValues: {
            url: '',
        },
    });
    const isLoading = form.formState.isSubmitting;
    const { toast } = useToast();

    async function onSubmit(values: z.infer<typeof addProductSchema>) {
        try {
            const response = await axios.post('/api/product/add', values);
            toast({
                title: "Success",
                description: response.data.message,
                variant: "default"
            })
            // eslint-disable-next-line
        } catch (error: any) {
            toast({
                title: "Error",
                description: 'Something went wrong, please try again later.',
                variant: "destructive"
            })
        }
    }

    return (
        <div className="absolute top-0 left-0 right-0 min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-8">
                <h1 className="text-3xl font-bold text-green-600 mb-6">Add a BigBasket Product</h1>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                This is an initial prototype and only works with bigbasket.com. We&apos;re working on automatically adding new products regularly.
                            </p>
                            <p className="text-sm text-yellow-700 mt-2">
                                Due to service limitations, requests are rate-limited to 1 per 3 hours. Please be patient.
                            </p>
                        </div>
                    </div>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg font-semibold text-gray-700">Product URL</FormLabel>
                                    <FormDescription className="text-sm text-gray-500">
                                        Enter the URL of the BigBasket product you want to add
                                    </FormDescription>
                                    <FormControl>
                                        <Input
                                            placeholder="https://www.bigbasket.com/product/..."
                                            className="w-full p-3 border border-gray-300 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            {...field}
                                            value={field.value || ''}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Product"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}