import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { capitalizeWords } from "@/lib/capitalize_word";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { redirect } from "next/navigation";
import { AIAnalysis, AnalysisRecommendation } from "@/lib/analyze";
import { ArrowRight, Utensils } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import SelectDate from "@/components/user/select-date";
import { Consumption } from "@prisma/client";


interface ConsumptionAnalysisProps {
    date: string;
}

export default async function ConsumptionAnalysis({
    date
}: ConsumptionAnalysisProps) {

    const session = await auth();
    if (!session) {
        redirect("/");
    }

    const consumptionDetails = await prisma.consumption.findMany({
        where: {
            userId: session.user.id,
            createdAt: {
                gte: date ? new Date(new Date(date).setHours(0, 0, 0, 0)) : undefined,
                lte: date ? new Date(new Date(date).setHours(23, 59, 59, 999)) : undefined
            }
        },
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    imageUrl: true,
                    venderName: true,
                }
            }
        }
    })


    const analysis = await prisma.weeklyConsumptionAnalysis.findFirst({
        where: {
            userId: session.user.id,
            createdAt: date ? new Date(date) : undefined,
        }
    })

    const allAnalysis = await prisma.weeklyConsumptionAnalysis.findMany({
        where: {
            userId: session.user.id,
        },
        select: {
            createdAt: true
        }
    })
    const availableDates = allAnalysis.map((analysis) => analysis.createdAt);

    const aiAnalysis = analysis ? JSON.parse(analysis.aiAnalysis as string) as AIAnalysis : null;

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-lg md:text-2xl font-bold mb-4 sm:mb-0">Daily Consumption Analysis</h1>
                <SelectDate availableDates={availableDates} />
            </div>
            {
                aiAnalysis ? (
                    <>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <StatCard
                                        icon={<Utensils className="h-8 w-8 text-blue-500" />}
                                        title="Total Products"
                                        value={consumptionDetails.length.toString()}
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Analysis Summary</h3>
                                    <p className="text-gray-700">{aiAnalysis.analysisSummary}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Consumed Products Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">Consumed Products</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {consumptionDetails.map((consumption) => (
                                        <ProductCard key={consumption.id} consumption={consumption} />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recommendations Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">Recommendations</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {aiAnalysis.recommendations.map((recommendation, index) => (
                                        <RecommendationCard key={index} recommendation={recommendation} />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </>
                ) : (
                    <div className="flex justify-center items-center">
                        <p className="text-lg text-gray-500">No analysis available for this date, check back later!</p>
                    </div>
                )
            }
        </div>
    )
}




const StatCard = ({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) => (
    <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-4">
        {icon}
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-xl font-semibold">{value}</p>
        </div>
    </div>
);

type ConsumptionWithProduct = Partial<Consumption> & {
    product: {
        id: number;
        name: string;
        imageUrl: string[];
        venderName: string;
    }
}

const ProductCard = ({ consumption }: { consumption: ConsumptionWithProduct }) => (
    <div className="bg-white p-4 rounded-lg shadow">
        <Link href={`/products/${consumption.product.id}`}>
            <div className="flex items-center space-x-4">
                <Image
                    src={consumption.product.imageUrl[0] || ''}
                    alt={consumption.product.name}
                    width={80}
                    height={80}
                    className="rounded-md"
                />
                <div>
                    <h3 className="font-semibold">{consumption.product.name}</h3>
                    <p className="text-sm text-gray-500">{capitalizeWords(consumption.product.venderName)}</p>
                    <Badge variant="secondary" className="mt-2">Qty: {consumption.quantity}</Badge>
                </div>
            </div>
        </Link>
    </div>
);

const RecommendationCard = ({ recommendation }: { recommendation: AnalysisRecommendation }) => (
    <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-2 mb-2">
            <ArrowRight className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold">{recommendation.type}</h3>
        </div>
        <p className="text-gray-700 mb-2">{recommendation.description}</p>
        <p className="text-sm text-gray-500">{recommendation.reason}</p>
    </div>
);