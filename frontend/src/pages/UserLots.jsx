import React from 'react'

export const userLotsLoader = ({ request, params }) => {
    console.log(params.userId)
    return []
}

const UserLots = () => {
    return (
        <div>UserLots</div>
    )
}

export default UserLots