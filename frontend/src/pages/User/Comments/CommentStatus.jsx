import {
    AiOutlineCheck,
    AiOutlineClose,
    AiOutlineMinus,
    AiOutlineEllipsis,
} from 'react-icons/ai'

const statusIcons = {
    other: <AiOutlineEllipsis />,
    did_not_agree: <AiOutlineClose />,
    ignored: <AiOutlineMinus />,
    bought: <AiOutlineCheck />,
}

const CommentStatus = ({ title, name }) => {
    return (
        <>
            {statusIcons[name]} {title}
        </>
    )
}

export default CommentStatus
