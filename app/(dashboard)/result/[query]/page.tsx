import ProductCard from '@/components/custom ui/ProductCard'
import { getSearchedProducts } from '@/lib/actions/actions'

interface SearchPageProps {
  params: { query: string }
}

const SearchPage = async ({ params }: SearchPageProps) => {
  const decodedQuery = decodeURIComponent(params.query)

  const searchedProducts = await getSearchedProducts(decodedQuery)

  return (
    <div className='px-4 py-6 max-w-7xl mx-auto'>
      <h1 className='text-2xl font-bold text-right mb-4'>
        תוצאות חיפוש עבור: {decodedQuery}
      </h1>

      {searchedProducts.length === 0 ? (
        <p className='text-right text-gray-500'>לא נמצאו תוצאות</p>
      ) : (
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {searchedProducts.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export const dynamic = 'force-dynamic'
export default SearchPage
