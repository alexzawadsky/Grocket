import { useTranslation } from "react-i18next"
import { useContext, useState } from "react"
import { BsReply, BsTrash } from "react-icons/bs"
import useInput from "../../../hooks/useInput"
import { Button, Input, PublishTime } from "../../../components/ui"
import { ReadMore } from '../../../components'
import AuthContext from "../../../contexts/AuthProvider"
import { useAddReply, useDeleteCommentReply } from "../../../api/api"

const CommentReply = ({ commentId, seller, reply }) => {

    const { t } = useTranslation()
    const [formExpanded, setFormExpanded] = useState(false)
    const [expanded, setExpanded] = useState(false)
    const text = useInput('', {})
    const { user } = useContext(AuthContext)
    const addReplyMutation = useAddReply()
    const deleteReplyMutation = useDeleteCommentReply()

    if (!reply && seller?.id === user?.user_id) return formExpanded ?
        <div className="grid gap-2 shadow p-4 rounded-lg mt-4 border dark:border-2 dark:border-zinc-600">
            <Input
                instance={text}
                autoRef
                large
                must
                title={t('text')}
                ariaLabel='comment text'
            />
            <div className="flex gap-2">
                <Button
                    disabled={text.value === '' || addReplyMutation.isLoading}
                    onClick={() => addReplyMutation.mutate({
                        commentId,
                        text: text.value
                    })}
                    height={10}
                    style='fill'
                    color='accent-orange'
                    px={3}
                >
                    {t('upload')}
                </Button>
                <Button
                    onClick={() => {
                        setFormExpanded(false)
                        text.setValue('')
                    }}
                    height={10}
                    style='outline'
                    color='accent-orange'
                    px={3}
                >
                    {t('cancel')}
                </Button>
            </div>

        </div >
        :
        <Button
            className="text-blue-500 dark:text-blue-300 flex items-center gap-2 hover:text-accent-orange w-fit mt-2"
            border={false}
            onClick={() => setFormExpanded(true)}
        >
            <BsReply /> {t('reply')}
        </Button>

    return reply &&
        <>
            <Button
                className="text-blue-500 dark:text-blue-300 hover:text-accent-orange w-fit"
                border={false}
                onClick={() => setExpanded(prevState => !prevState)}
            >
                {expanded ? t('hide_reply') : t('show_reply')}
            </Button>
            {expanded && <div className="grid gap-1 border-l-2 ml-3 pl-3 mt-2 dark:border-l-zinc-400">
                <div className="flex items-center justify-between">
                    <p className='font-bold text-lg' aria-label='seller name'>{reply?.user?.first_name} {reply?.user?.last_name}</p>
                    {reply?.user?.id === user?.user_id &&
                        <Button
                            border={false}
                            className="text-accent-red dark:text-red-600"
                            onClick={() => deleteReplyMutation.mutate(reply?.id)}
                        >
                            <BsTrash />
                        </Button>}
                </div>
                <p className='text-sm text-primary-300 dark:text-slate-400' aria-label='reply date and time'><PublishTime pubDate={reply?.pub_date} /></p>
                <ReadMore text={reply?.text} limit={100} />
            </div>
            }
        </>
}

export default CommentReply