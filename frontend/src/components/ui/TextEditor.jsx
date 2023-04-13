import React from 'react'
import { Editor } from '@tinymce/tinymce-react'

const TextEditor = ({ text, setText }) => {

    const darkStyle = document.querySelector('html').classList.contains('dark') ? {
        skin: 'oxide-dark',
        content_css: 'dark',
    } : {}

    return (
        <div className='border dark:border-2 border-slate-500 dark:border-zinc-600 rounded-lg'>
            <Editor
                apiKey={import.meta.env.VITE_TEXT_API_KEY}
                initialValue={text}
                init={{
                    ...darkStyle,
                    branding: false,
                    height: 300,
                    menubar: false,
                    statusbar: false,
                    toolbar:
                        "bold italic underline strikethrough",
                    image_advtab: true
                }}
                onChange={(e) => setText(e.target.getContent())}
            />
        </div>
    )
}

export default TextEditor