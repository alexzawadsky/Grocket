import { useEffect } from "react"
import Flag from "./Flag"
import cn from 'classnames'

const GMap = ({ address }) => {

    useEffect(() => {
        const initMap = () => {
            const coords = { lat: address?.latitude || 0, lng: address?.longitude || 0 }
            const map = new google.maps.Map(document.getElementById("g-map"), {
                zoom: address ? 16 : 1,
                center: coords,
                zoomControl: true,
                mapTypeControl: false,
                scaleControl: true,
                streetViewControl: false,
                rotateControl: true,
                fullscreenControl: false

            })
            if (address) {
                new google.maps.Marker({
                    position: coords,
                    map: map,
                })
            }
        }

        initMap()
    }, [address])

    return (
        <div className="w-full">
            <p className="pb-2 flex items-center gap-2">
                {address?.full}
                {address?.country_code && <Flag size={5} country={address?.country_code} />}
            </p>
            <div id="g-map" className="w-full h-64 md:h-72 xl:h-96 overflow-hidden rounded-xl"></div >
        </div>
    )
}

export default GMap