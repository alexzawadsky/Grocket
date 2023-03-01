import React from 'react'

const AddressField = ({ setAddress, split }) => {

    const aucompleteObject = new google.maps.places.Autocomplete(document.getElementById('address'))
    const handleAddress = () => {
        console.log(aucompleteObject.getPlace())
    }
    aucompleteObject.addListener('place_changed', handleAddress)



    if (split) {
        return (
            <>
                <label for='address'>Address</label>
                <input
                    type="text"
                    id='address'
                    className='grocket-input'
                />
            </>
        )
    }
    return (
        <div>not yet</div>
    )
}

export default AddressField