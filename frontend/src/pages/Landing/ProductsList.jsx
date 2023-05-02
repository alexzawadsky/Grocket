import { useState } from 'react'
import { useProducts } from '../../api/api'
import { ItemCard } from '../../components'
import { Pagination, Spinner } from '../../components/ui'
import { useTranslation } from 'react-i18next'

const ProductsList = () => {
    const { t } = useTranslation()
    const [page, setPage] = useState(0)

    const { isLoading, data, error } = useProducts(
        new URLSearchParams({ page: page + 1 })
    )

    if (error) return <p className="md:pl-5 md:pt-5">{error.message}</p>
    if (data?.count === 0)
        return <p className="md:pl-5 md:pt-5">{t('no_results_found')}</p>

    return (
        <>
            <ul
                className="grid grid-cols-2 gap-5 md:gap-0 lg:grid-cols-3 xl:grid-cols-4"
                aria-label="list of recently uploaded items"
            >
                {isLoading && <Spinner count={8} type="vcard" />}
                {data &&
                    data.results.map((el, key) => (
                        <li key={key}>
                            <ItemCard product={el} managable={false} />
                        </li>
                    ))}
            </ul>
            {data?.pages_count > 1 && (
                <Pagination
                    className="mx-auto mt-5 md:mx-0 md:ml-5 md:mt-2"
                    page={page}
                    pagesCount={data.pages_count}
                    setPage={setPage}
                />
            )}
        </>
    )
}

export default ProductsList
