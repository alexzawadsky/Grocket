import { Helmet } from 'react-helmet-async'

const SEO = ({
    title = '',
    description = '',
    name = '',
    type = '',
    image = '',
}) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="application-name" content="Grocket" />
            <meta name="description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content="Grocket" />
            <meta name="og:url" content={window.location} />
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta name="twitter:url" content={window.location} />
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content={type} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
        </Helmet>
    )
}

export default SEO
