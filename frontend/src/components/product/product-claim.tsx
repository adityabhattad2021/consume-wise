import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getProductClaims } from "@/lib/products";
import { Check, Info } from "lucide-react";

interface ProductClaimProps{
    productId:number
}

export default async function ProductClaim({
    productId
}:ProductClaimProps) {
    const claims = await getProductClaims(productId);
    if(!claims){
        return null;
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl font-bold">Product Claims</CardTitle>
                <CardDescription>
                    This is generated based on the product&apos;s claims in the image.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {claims.map((claim, index) => (
                    <div key={index} className="mb-6 p-4 bg-gray-100 rounded-lg">
                        <p className="font-medium mb-2">{claim.claim}</p>
                        <div className="flex items-center mb-2">
                            <Badge variant={claim.verificationStatus === 'Verified' ? 'default' : 'secondary'}>
                                {claim.verificationStatus === 'Verified' ? <Check className="w-4 h-4 mr-1" /> : <Info className="w-4 h-4 mr-1" />}
                                {claim.verificationStatus}
                            </Badge>
                        </div>
                        <p className="text-sm mb-1"><strong>Explanation:</strong> {claim.explanation}</p>
                        <p className="text-sm"><strong>Source:</strong> {claim.source}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}