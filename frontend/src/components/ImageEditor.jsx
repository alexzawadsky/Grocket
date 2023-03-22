import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import AvatarEditor from 'react-avatar-editor'
import { saveImage } from '../utils'
import { AiOutlineRotateLeft, AiOutlineRotateRight } from 'react-icons/ai'
import useScreen from '../hooks/useScreen'

const ImageEditor = ({ images, setImages }) => {

    const { t } = useTranslation()
    const editorRef = useRef()
    const imageInputRef = useRef()
    const { minTabletW } = useScreen()
    let referenceWidth = 360
    if (window.innerWidth < minTabletW) {
        referenceWidth = 1400
    }

    const editorWidth = referenceWidth * (window.innerWidth / 1920)
    const [currentImage, setCurrentImage] = useState()
    const [imageSize, setImageSize] = useState(1)
    const [imageRotation, setImageRotation] = useState(0)
    const [imageUploading, setImageUploading] = useState(false)

    return (
        <div className='flex flex-col gap-2 h-fit'>
            <h2 className="text-xl font-bold">{t('photos')}</h2>
            <input ref={imageInputRef} type="file" onChange={(e) => setCurrentImage(e.target.files[0])} />
            <div className='h-fit'>
                <div className='flex flex-col items-center w-full mx-auto'>
                    <AvatarEditor
                        ref={editorRef}
                        image={currentImage}
                        width={editorWidth}
                        height={Math.ceil(editorWidth / 4 * 3)}
                        border={20}
                        className='border-2'
                        color={[255, 255, 255, 0.6]}
                        scale={imageSize}
                        rotate={imageRotation}
                    />
                    <div className="flex gap-2 w-full px-2 pt-2">
                        <button
                            onClick={() => setImageRotation(prevRotation => prevRotation - 90)}
                            type='button'
                            className='p-2 text-xl text-accent-orange'
                        >
                            <AiOutlineRotateLeft />
                        </button>
                        <input
                            min={1}
                            max={2}
                            step={0.01}
                            value={imageSize}
                            onChange={(e) => setImageSize(e.target.value)}
                            className='grow'
                            type="range"
                        />
                        <button
                            onClick={() => setImageRotation(prevRotation => prevRotation + 90)}
                            type='button'
                            className='p-2 text-xl text-accent-orange'
                        >
                            <AiOutlineRotateRight />
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-5 mt-3">
                    <button
                        onClick={() => { saveImage(editorRef, images, setImages, setCurrentImage, imageInputRef, setImageUploading) }}
                        className='button-outline-orange'
                        type='button'
                        disabled={imageUploading || !currentImage}
                    >
                        {t('save_image')}
                    </button>
                    {imageUploading && `${t('loading')}...`}
                </div>
            </div>
        </div>
    )
}

export default ImageEditor