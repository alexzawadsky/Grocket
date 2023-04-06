import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'

const AddressField = ({ setAddress, split }) => {

    const { t } = useTranslation()

    useEffect(() => {
        const autocompleteObject = new google.maps.places.Autocomplete(document.getElementById('address'), { language: 'en' })
        const handleAddress = () => {
            const place = autocompleteObject.getPlace()
            console.log(place)
            const data = {
                latitude: place?.geometry?.location.lat(),
                longitude: place?.geometry?.location.lng(),
                country_code: place?.address_components?.find(el => el?.types.includes('country'))?.short_name,
                city: place?.address_components?.find(el => el?.types.includes('locality'))?.long_name,
                full: place?.formatted_address,
                short: place?.name
            }
            console.log(data)
            setAddress(data)
        }
        autocompleteObject.addListener('place_changed', handleAddress)
    }, [])




    if (split) {
        return (
            <>
                <label
                    for='address'
                    className='h-10 flex items-center after:content-["*"] after:text-accent-red after:pl-1'
                >
                    {t('address')}
                </label>
                <input
                    type="text"
                    id='address'
                    className='grocket-input'
                />
            </>
        )
    }
    return (
        <div>
            <label
                for='address'
                className='flex items-center after:content-["*"] after:text-accent-red after:pl-1'
            >
                {t('address')}
            </label>
            <input
                type="text"
                id='address'
                className='grocket-input'
            />
        </div>
    )
}

export default AddressField