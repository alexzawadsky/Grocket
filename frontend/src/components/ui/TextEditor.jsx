import React from 'react'
import { Editor } from '@tinymce/tinymce-react'

const TextEditor = ({ text, setText }) => {
    return (
        <div className='border-2 border-slate-500 rounded-xl'>
            <Editor
                apiKey={import.meta.env.VITE_TEXT_API_KEY}
                initialValue={text}
                init={{
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