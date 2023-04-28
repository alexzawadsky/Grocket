import React, { useState } from 'react'
import AvatarEditor from 'react-avatar-editor'
import { useTranslation } from 'react-i18next'

const AvatarCrop = ({ editorRef, image, setState, onSave, adjSaved }) => {
    const { t } = useTranslation()
    const [avatarSize, setAvatarSize] = useState(1)

    return (
        <div className="flex max-w-full flex-col items-center gap-3">
            <AvatarEditor
                ref={editorRef}
                image={image}
                width={300}
                height={300}
                border={0}
                className="border-2"
                borderRadius={180}
                color={[255, 255, 255, 0.6]} // RGBA
                scale={avatarSize}
                rotate={0}
                onImageChange={() => setState(false)}
                onPositionChange={() => setState(false)}
            />
            <input
                value={avatarSize}
                className="w-full"
                type="range"
                min={1}
                max={2}
                step={0.01}
                onChange={(e) => {
                    setAvatarSize(e.target.value)
                    setState(false)
                }}
            />
            <p className="font-bolditalic text-accent-red">
                {t('please_save_adj')}
            </p>
            <button
                onClick={onSave}
                className={
                    adjSaved ? 'button-outline-green' : 'button-outline-orange'
                }
                type="button"
            >
                {adjSaved ? t('saved') : t('save_adj')}
            </button>
        </div>
    )
}

export default AvatarCrop
