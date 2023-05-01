import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useProduct } from '../../api/api'
import { Price, Spinner, Title } from '../../components/ui'
import { useTranslation } from 'react-i18next'
import { BsArrowLeft } from 'react-icons/bs'

const Chat = () => {
    const { productId } = useParams()
    const { isLoading, data, error } = useProduct(productId)
    const { t } = useTranslation()

    if (isLoading) return <Spinner />
    if (error) return error.message

    return (
        <div className="grid gap-3">
            <Link
                to={`/products/${productId}`}
                className="flex items-center gap-2"
            >
                <BsArrowLeft />
                {t('product_page')}
            </Link>
            <Title text={t('messenger_in_progress')} color="accent-red" />
            <div className="flex items-center gap-2">
                <img className="w-16 rounded-lg" src={data?.images[0]?.image} />
                <h2 className="text-lg font-bold">{data?.name}</h2>
                -
                <Price price={data?.price} />
            </div>
            <Link className="text-md font-bold" to={`/users/${data?.user?.id}`}>
                {data?.user?.first_name} {data?.user?.last_name}
            </Link>
            <ul>
                <li>
                    <a
                        className="hover:text-accent-orange"
                        href={`tel:${data?.user?.phone}`}
                    >
                        {t('call')} {data?.user?.phone}
                    </a>
                </li>
                <li>
                    <a
                        className="hover:text-accent-orange"
                        href={`mailto:${data?.user?.email}`}
                    >
                        {t('send_message')} {data?.user?.email}
                    </a>
                </li>
            </ul>
        </div>
    )
}

export default Chat
