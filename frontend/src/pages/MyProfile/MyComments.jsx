import React from 'react'
import { NavLink } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import { BsArrowLeft } from 'react-icons/bs'
import { Comment, CommentsStats } from '../../components'

const reviewsMock = [{ "author": { "name": "Sarah", "last_name": "Johnson" }, "pub_date": "2022-12-25", "text": "I had a great experience using this service. The interface was user-friendly and the support team was quick to respond to any questions I had. Highly recommend!", "rate": 5 }, { "author": { "name": "David", "last_name": "Brown" }, "pub_date": "2022-11-12", "text": "Not happy with my experience. The website was slow and crashed multiple times while I was using it.", "rate": 2 }, { "author": { "name": "Emily", "last_name": "Jones" }, "pub_date": "2022-10-15", "text": "I was really impressed with the speed and efficiency of this service. Everything was easy to use and I had no issues with the website or support team.", "rate": 4 }, { "author": { "name": "Michael", "last_name": "Davis" }, "pub_date": "2022-09-05", "text": "This service was okay, but I had some issues with the website not working properly. The support team was helpful but it still took some time to resolve the problem.", "rate": 3 }, { "author": { "name": "Sophia", "last_name": "Wilson" }, "pub_date": "2022-08-20", "text": "I wasn't very impressed with this service. The website was difficult to navigate and the support team was slow to respond to my questions.", "rate": 1 }, { "author": { "name": "William", "last_name": "Taylor" }, "pub_date": "2022-07-10", "text": "I had a great experience with this service. The website was easy to use and the support team was always quick to respond to any questions I had.", "rate": 5 }, { "author": { "name": "Olivia", "last_name": "Smith" }, "pub_date": "2022-06-15", "text": "This service was average. I had a few issues with the website, but the support team was helpful in resolving them.", "rate": 3 }]

const MyComments = () => {

    const reviews = reviewsMock
    const isTablet = useMediaQuery({ query: '(min-width: 768px)' })

    return (
        <div className='grid gap-4'>
            {!isTablet ? <NavLink className='flex items-center gap-2' to='/profile'><BsArrowLeft />Back to profile</NavLink> : null}
            <h1 className="text-3xl font-bold">My comments</h1>
            <CommentsStats comments={reviews} />
            <div className="grid lg:grid-cols-2 gap-5">
                {reviews.map((el, key) => <Comment key={key} content={el} />)}
            </div>
        </div>
    )
}

export default MyComments