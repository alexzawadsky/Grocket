import { useTranslation } from "react-i18next"
import { useContext, useState } from "react"
import { BsReply, BsTrash } from "react-icons/bs"
import useInput from "../../hooks/useInput"
import { Input, PublishTime, ReadMore } from "../../components"
import AuthContext from "../../contexts/AuthProvider"
import { useAddReply, useDeleteCommentReply } from "../../api/api"

const CommentReply = ({ commentId, seller, reply }) => {

    const { t } = useTranslation()
    const [formExpanded, setFormExpanded] = useState(false)
    const [expanded, setExpanded] = useState(false)
    const text = useInput('', {})
    const { user } = useContext(AuthContext)
    const addReplyMutation = useAddReply()
    const deleteReplyMutation = useDeleteCommentReply()

    if (!reply && seller?.id === user?.user_id) return formExpanded ?
        <div className="grid gap-2 shadow p-4 rounded-xl mt-4 ">
            <Input
                instance={text}
                autoRef
                large
                must
                title={t('text')}
            />
            <div className="flex gap-2">
                <button
                    disabled={text.value === '' || addReplyMutation.isLoading}
                    onClick={() => addReplyMutation.mutate({
                        commentId,
                        text: text.value
                    })}
                    className='button-fill-orange'
                >
                    {t('upload')}
                </button>
                <button
                    className="button-outline-orange"
                    onClick={() => {
                        setFormExpanded(false)
                        text.setValue('')
                    }}
                >
                    {t('cancel')}
                </button>
            </div>

        </div >
        :
        <button
            className="text-blue-500 flex items-center gap-2 hover:text-accent-orange w-fit mt-2"
            onClick={() => setFormExpanded(true)}
        >
            <BsReply /> {t('reply')}
        </button>

    return reply &&
        <>
            <button
                className="text-blue-500 hover:text-accent-orange w-fit"
                onClick={() => setExpanded(prevState => !prevState)}
            >
                {expanded ? t('hide_reply') : t('show_reply')}
            </button>
            {expanded && <div className="grid gap-1 border-l-2 ml-3 pl-3 mt-2">
                <div className="flex items-center justify-between">
                    <p className='font-bold text-lg'>{reply?.user?.first_name} {reply?.user?.last_name}</p>
                    {reply?.user?.id === user?.user_id &&
                        <button
                            className="text-accent-red"
                            onClick={() => deleteReplyMutation.mutate(reply?.id)}
                        >
                            <BsTrash />
                        </button>}
                </div>

                <p className='text-sm text-primary-300'><PublishTime pubDate={reply?.pub_date} /></p>
                <ReadMore text={reply?.text} limit={100} />
            </div>
            }
        </>
}

export default CommentReply