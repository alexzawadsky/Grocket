import React, { useState } from 'react'
import AvatarEditor from 'react-avatar-editor'

const AvatarCrop = ({ editorRef, image, setState, onSave, adjSaved }) => {

    const [avatarSize, setAvatarSize] = useState(1)

    return (
        <div className='flex flex-col gap-5'>
            <div className='border-2'>
                <AvatarEditor
                    ref={editorRef}
                    image={image}
                    width={350}
                    height={350}
                    border={0}
                    borderRadius={180}
                    color={[255, 255, 255, 0.6]} // RGBA
                    scale={avatarSize}
                    rotate={0}
                    onImageChange={() => setState(false)}
                    onPositionChange={() => setState(false)}
                />
            </div>
            <input value={avatarSize} className='w-full' type="range" min={1} max={2} step={0.01} onChange={e => {
                setAvatarSize(e.target.value)
                setState(false)
            }} />
            <p className='font-bolditalic text-accent-red'>Please adjust your avatar before submitting</p>
            <button
                onClick={onSave}
                className={
                    `${adjSaved ?
                        'text-green-700 border-green-700'
                        :
                        'text-accent-orange border-accent-orange hover:bg-accent-orange/[0.1] '}
                                    font-bold px-5 py-3 w-full rounded-xl border-2`
                }
                type='button'>
                {adjSaved ? 'Saved!' : 'Save adjustments'}
            </button>
        </div>
    )
}

export default AvatarCrop