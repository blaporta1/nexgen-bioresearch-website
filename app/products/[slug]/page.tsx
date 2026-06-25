import { notFound } from 'next/navigation'
import { getProductBySlug, getRelatedProducts, PRODUCTS } from '@/lib/products'
import ProductPageClient from './ProductPageClient'

export function generateStaticParams() {
  return PRODUCTS.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) return {}
  return {
    title: `${product.name} | NexGen BioResearch`,
    description: `${product.purity} purity ${product.shortName} — ISO 17025 verified research compound. For in-vitro laboratory use only.`,
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) notFound()

  const related = getRelatedProducts(product, 3)

  return <ProductPageClient product={product} related={related} />
}
