import { useContext, useEffect } from 'react'
import Flag from './Flag'
import cn from 'classnames'
import ThemeContext from '../../contexts/ThemeContext'

const GMap = ({ address }) => {
    const { isDark } = useContext(ThemeContext)
    useEffect(() => {
        const initMap = () => {
            const coords = {
                lat: address?.latitude || 0,
                lng: address?.longitude || 0,
            }
            const map = new google.maps.Map(document.getElementById('g-map'), {
                zoom: address ? 16 : 1,
                center: coords,
                zoomControl: true,
                mapTypeControl: false,
                scaleControl: true,
                streetViewControl: false,
                rotateControl: true,
                fullscreenControl: false,
                styles: isDark && [
                    {
                        elementType: 'geometry',
                        stylers: [{ color: '#242f3e' }],
                    },
                    {
                        elementType: 'labels.text.stroke',
                        stylers: [{ color: '#242f3e' }],
                    },
                    {
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#746855' }],
                    },
                    {
                        featureType: 'administrative.locality',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#d59563' }],
                    },
                    {
                        featureType: 'poi',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#d59563' }],
                    },
                    {
                        featureType: 'poi.park',
                        elementType: 'geometry',
                        stylers: [{ color: '#263c3f' }],
                    },
                    {
                        featureType: 'poi.park',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#6b9a76' }],
                    },
                    {
                        featureType: 'road',
                        elementType: 'geometry',
                        stylers: [{ color: '#38414e' }],
                    },
                    {
                        featureType: 'road',
                        elementType: 'geometry.stroke',
                        stylers: [{ color: '#212a37' }],
                    },
                    {
                        featureType: 'road',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#9ca5b3' }],
                    },
                    {
                        featureType: 'road.highway',
                        elementType: 'geometry',
                        stylers: [{ color: '#746855' }],
                    },
                    {
                        featureType: 'road.highway',
                        elementType: 'geometry.stroke',
                        stylers: [{ color: '#1f2835' }],
                    },
                    {
                        featureType: 'road.highway',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#f3d19c' }],
                    },
                    {
                        featureType: 'transit',
                        elementType: 'geometry',
                        stylers: [{ color: '#2f3948' }],
                    },
                    {
                        featureType: 'transit.station',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#d59563' }],
                    },
                    {
                        featureType: 'water',
                        elementType: 'geometry',
                        stylers: [{ color: '#17263c' }],
                    },
                    {
                        featureType: 'water',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#515c6d' }],
                    },
                    {
                        featureType: 'water',
                        elementType: 'labels.text.stroke',
                        stylers: [{ color: '#17263c' }],
                    },
                ],
            })
            if (address) {
                new google.maps.Marker({
                    position: coords,
                    map: map,
                })
            }
        }

        initMap()
    }, [address, isDark])

    return (
        <div className="w-full" aria-label="product address and map">
            <p className="flex items-center gap-2 pb-2">
                {address?.full}
                {address?.country_code && (
                    <Flag size={5} country={address?.country_code} />
                )}
            </p>
            <div
                id="g-map"
                className="h-64 w-full overflow-hidden rounded-xl md:h-72 xl:h-96"
                aria-label="google map"
            ></div>
        </div>
    )
}

export default GMap
