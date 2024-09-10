import { getProduct } from '@/lib/products'
import { redirect } from 'next/navigation'
import { ProductDetails } from '@/components/product-details'

export default async function ProductDetailsPage({
    params
}:{
    params:{
        id:string
    }
}) {
  const product = await getProduct(Number(params.id));
  if(!product){
    redirect("/")
  }

  return (
    <ProductDetails
      product={product}
    />
  )
}