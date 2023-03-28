import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import AvatarEditor from 'react-avatar-editor'
import { saveImage } from '../utils'
import { AiOutlineRotateLeft, AiOutlineRotateRight } from 'react-icons/ai'
import useScreen from '../hooks/useScreen'
import { BsFolder } from 'react-icons/bs'

const ImageEditor = ({ images, setImages }) => {

    const { t } = useTranslation()
    const editorRef = useRef()
    const imageInputRef = useRef()
    const { minTabletW } = useScreen()
    let referenceWidth = 330
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
            <div className='rounded-xl border shadow-sm p-5'>


                <div className='flex flex-col w-full mx-auto gap-2'>

                    <button
                        type='button'
                        onClick={() => imageInputRef.current && imageInputRef.current.click()}
                        className='h-10 hover:bg-slate-200 px-5 flex items-center gap-2 font-bold border border-slate-500 rounded-xl w-fit'
                    >
                        <BsFolder />{t('browse')}
                    </button>
                    <input className='hidden' ref={imageInputRef} type="file" onChange={(e) => setCurrentImage(e.target.files[0])} />
                    <div className='mx-auto my-3'>
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
                    </div>
                    <div className="flex gap-1 w-full p-1 border shadow-sm rounded-lg items-center">
                        <button
                            onClick={() => setImageRotation(prevRotation => prevRotation - 90)}
                            type='button'
                            className='p-2 text-xl hover:bg-slate-100  rounded-md'
                        >
                            <AiOutlineRotateLeft />
                        </button>
                        <input
                            min={1}
                            max={2}
                            step={0.01}
                            value={imageSize}
                            onChange={(e) => setImageSize(e.target.value)}
                            className='grow appearance-none w-full h-1 rounded-md bg-gray-300 focus:outline-none focus:ring-0 focus:ring-blue-500'
                            type="range"
                        />
                        <button
                            onClick={() => setImageRotation(prevRotation => prevRotation + 90)}
                            type='button'
                            className='p-2 text-xl hover:bg-slate-100 rounded-md'
                        >
                            <AiOutlineRotateRight />
                        </button>
                    </div>
                    <div className="flex items-center gap-5 mt-3">
                        <button
                            onClick={() => { saveImage(editorRef, images, setImages, setCurrentImage, imageInputRef, setImageUploading) }}
                            className='button-outline-orange !h-10'
                            type='button'
                            disabled={imageUploading || !currentImage}
                        >
                            {t('save_image')}
                        </button>
                        {imageUploading && `${t('loading')}...`}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImageEditor