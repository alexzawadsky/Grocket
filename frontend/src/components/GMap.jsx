import { useEffect } from "react"

const GMap = ({ address }) => {

    const initMap = () => {
        const coords = { lat: address?.lat || 0, lng: address?.lng || 0 }
        const map = new google.maps.Map(document.getElementById("g-map"), {
            zoom: address ? 14 : 1,
            center: coords,
        })
        if (address) {
            const marker = new google.maps.Marker({
                position: coords,
                map: map,
            })
        }
    }

    useEffect(() => {
        function initMap() {
            const coords = { lat: address?.lat || 0, lng: address?.lng || 0 }
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
                const marker = new google.maps.Marker({
                    position: coords,
                    map: map,
                })
            }
        }

        initMap()
    }, [address])

    return (
        <div className="w-full">
            <p className="pb-2">{address?.full_address}</p>
            <div id="g-map" className="w-full h-64 md:h-72 xl:h-96 overflow-hidden rounded-xl"></div >
        </div>
    )
}

export default GMap