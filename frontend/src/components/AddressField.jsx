import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'

const AddressField = ({ setAddress, split }) => {

    const { t } = useTranslation()

    useEffect(() => {
        const autocompleteObject = new google.maps.places.Autocomplete(document.getElementById('address'))
        // autocomleteObject
        const handleAddress = () => {
            const place = autocompleteObject.getPlace()
            setAddress({
                lat: place?.geometry?.location.lat(),
                lng: place?.geometry?.location.lng(),
                fullAddress: place?.formatted_address
            })
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