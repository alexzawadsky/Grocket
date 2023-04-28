import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import Input from './Input'
import useInput from '../../hooks/useInput'
import useScreen from '../../hooks/useScreen'

const AddressField = ({ setAddress }) => {
    const { t } = useTranslation()
    const address = useInput('')
    const { isMinTablet } = useScreen()

    useEffect(() => {
        const autocompleteObject = new google.maps.places.Autocomplete(
            document.getElementById('address'),
            { language: 'en' }
        )
        const handleAddress = () => {
            const place = autocompleteObject.getPlace()
            const data = {
                latitude: place?.geometry?.location.lat(),
                longitude: place?.geometry?.location.lng(),
                country_code: place?.address_components?.find((el) =>
                    el?.types.includes('country')
                )?.short_name,
                city: place?.address_components?.find((el) =>
                    el?.types.includes('locality')
                )?.long_name,
                full: place?.formatted_address,
                short: place?.name,
            }
            setAddress(data)
        }
        autocompleteObject.addListener('place_changed', handleAddress)
    }, [])

    return (
        <Input
            split={isMinTablet}
            instance={address}
            title={t('address')}
            must
            type="text"
            id="address"
            className="grocket-input"
        />
    )
}

export default AddressField
