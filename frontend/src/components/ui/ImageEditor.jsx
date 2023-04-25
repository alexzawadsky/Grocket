import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import AvatarEditor from 'react-avatar-editor'
import { saveImage } from '../../utils'
import { AiOutlineRotateLeft, AiOutlineRotateRight } from 'react-icons/ai'
import useScreen from '../../hooks/useScreen'
import { BsFolder } from 'react-icons/bs'
import Button from './Button'

const ImageEditor = ({ images, setImages }) => {

    const { t } = useTranslation()
    const editorRef = useRef()
    const imageInputRef = useRef()
    const { minTabletW } = useScreen()
    let referenceWidth = 1250
    if (window.innerWidth >= minTabletW) {
        referenceWidth = 320
    }
    const editorWidth = referenceWidth * (window.innerWidth / 1920)
    const [currentImage, setCurrentImage] = useState()
    const [imageSize, setImageSize] = useState(1)
    const [imageRotation, setImageRotation] = useState(0)
    const [imageUploading, setImageUploading] = useState(false)

    return (
        <div className='flex flex-col gap-2 h-fit max-w-full'>
            <h2 className="text-xl font-bold">{t('photos')}</h2>
            <div className='rounded-xl border dark:border-2 dark:border-zinc-600 shadow-sm p-5'>
                <div className='flex flex-col w-fit mx-auto gap-3'>
                    <input
                        className='text-sm hidden file:bg-slate-100 hover:file:bg-slate-200 file:rounded-lg file:outline-none file:px-3 file:h-10 file:mr-3 file:border-none file:font-bold w-fit'
                        ref={imageInputRef}
                        type="file"
                        onChange={(e) => setCurrentImage(e.target.files[0])}
                    />
                    <Button
                        type='button'
                        onClick={() => imageInputRef && imageInputRef.current.click()}
                        color='slate-100'
                        darkColor='zinc-600'
                        onHoverDarkColor='zinc-700'
                        onHoverColor='slate-200'
                        border={false}
                        width='fit'
                        height={8}
                        px={5}
                        className='whitespace-nowrap !rounded-full'
                    >
                        {t('browse')}
                    </Button>
                    <AvatarEditor
                        ref={editorRef}
                        image={currentImage}
                        width={editorWidth}
                        height={Math.ceil(editorWidth / 4 * 3)}
                        border={20}
                        className='border-2 dark:border-zinc-600 mx-auto'
                        color={[255, 255, 255, document.querySelector('html').classList.contains('dark') && !currentImage ? 0.1 : 0.6]}
                        scale={imageSize}
                        rotate={imageRotation}
                    />
                    <div className="flex gap-1 w-full p-1 border dark:border-2 dark:border-zinc-600 shadow-sm rounded-lg items-center">
                        <Button
                            onClick={() => setImageRotation(prevRotation => prevRotation - 90)}
                            type='button'
                            className='p-2 text-xl rounded-md'
                            onHoverColor='slate-100'
                            onHoverDarkColor='zinc-600'
                            border={false}
                        >
                            <AiOutlineRotateLeft />
                        </Button>
                        <input
                            min={1}
                            max={2}
                            step={0.01}
                            value={imageSize}
                            onChange={(e) => setImageSize(e.target.value)}
                            className='grow appearance-none w-full h-1 rounded-md bg-gray-300 dark:bg-zinc-600 focus:outline-none focus:ring-0 focus:ring-blue-500'
                            type="range"
                        />
                        <Button
                            onClick={() => setImageRotation(prevRotation => prevRotation + 90)}
                            type='button'
                            onHoverColor='slate-100'
                            onHoverDarkColor='zinc-600'
                            className='p-2 text-xl rounded-md'
                            border={false}
                        >
                            <AiOutlineRotateRight />
                        </Button>
                    </div>
                    <Button
                        onClick={() => { saveImage(editorRef, images, setImages, setCurrentImage, imageInputRef, setImageUploading) }}
                        height={10}
                        px={5}
                        style='outline'
                        color='accent-orange'
                        type='button'
                        disabled={imageUploading || !currentImage}
                    >
                        {t('save_image')}
                    </Button>
                    {imageUploading && `${t('loading')}...`}
                </div>
            </div>
        </div>
    )
}

export default ImageEditor