import React, { useEffect, useState } from 'react'
import { YMaps, Map, Placemark } from "react-yandex-maps";



const YMap = ({ adress }) => {

    const [coords, setCoords] = useState()

    useEffect(() => {
        fetch(`http://api.positionstack.com/v1/forward?access_key=3c05685b91c48cae10feae5aeb7effc5&query=${adress}`)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                const lan = data.data[0].latitude
                const long = data.data[0].longitude
                setCoords([lan, long])
            })
    }, [])

    const mapState = {
        center: coords,
        zoom: 15
    }

    return (
        <div className='w-full'>
            {coords ? (
                <YMaps>
                    <Map width={'100%'} defaultState={mapState}>
                        <Placemark defaultGeometry={coords} properties={{
                            balloonContentBody: 'Product adress'
                        }} />
                    </Map>
                </YMaps>
            ) : null}

        </div >

    )
}

export default YMap