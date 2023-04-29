import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import AvatarEditor from 'react-avatar-editor'
import { saveImage } from '../../utils'
import { AiOutlineRotateLeft, AiOutlineRotateRight } from 'react-icons/ai'
import useScreen from '../../hooks/useScreen'
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
        <div className="flex h-fit max-w-full flex-col gap-2">
            <h2 className="text-xl font-bold">{t('photos')}</h2>
            <div className="rounded-xl border p-5 shadow-sm dark:border-2 dark:border-zinc-600">
                <div className="mx-auto flex w-fit flex-col gap-3">
                    <input
                        className="hidden w-fit text-sm file:mr-3 file:h-10 file:rounded-lg file:border-none file:bg-slate-100 file:px-3 file:font-bold file:outline-none hover:file:bg-slate-200"
                        ref={imageInputRef}
                        type="file"
                        onChange={(e) => setCurrentImage(e.target.files[0])}
                    />
                    <Button
                        type="button"
                        onClick={() =>
                            imageInputRef && imageInputRef.current.click()
                        }
                        color="slate-100"
                        darkColor="zinc-600"
                        onHoverDarkColor="zinc-700"
                        onHoverColor="slate-200"
                        border={false}
                        width="fit"
                        height={8}
                        px={5}
                        className="whitespace-nowrap !rounded-full"
                    >
                        {t('browse')}
                    </Button>
                    <AvatarEditor
                        ref={editorRef}
                        image={currentImage}
                        width={editorWidth}
                        height={Math.ceil((editorWidth / 4) * 3)}
                        border={20}
                        className="mx-auto border-2 dark:border-zinc-600"
                        color={[
                            255,
                            255,
                            255,
                            document
                                .querySelector('html')
                                .classList.contains('dark') && !currentImage
                                ? 0.1
                                : 0.6,
                        ]}
                        scale={imageSize}
                        rotate={imageRotation}
                    />
                    <div className="flex w-full items-center gap-1 rounded-lg border p-1 shadow-sm dark:border-2 dark:border-zinc-600">
                        <Button
                            onClick={() =>
                                setImageRotation(
                                    (prevRotation) => prevRotation - 90
                                )
                            }
                            type="button"
                            className="rounded-md p-2 text-xl"
                            onHoverColor="slate-100"
                            onHoverDarkColor="zinc-600"
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
                            className="h-1 w-full grow appearance-none rounded-md bg-gray-300 focus:outline-none focus:ring-0 focus:ring-blue-500 dark:bg-zinc-600"
                            type="range"
                        />
                        <Button
                            onClick={() =>
                                setImageRotation(
                                    (prevRotation) => prevRotation + 90
                                )
                            }
                            type="button"
                            onHoverColor="slate-100"
                            onHoverDarkColor="zinc-600"
                            className="rounded-md p-2 text-xl"
                            border={false}
                        >
                            <AiOutlineRotateRight />
                        </Button>
                    </div>
                    <Button
                        onClick={() => {
                            saveImage(
                                editorRef,
                                images,
                                setImages,
                                setCurrentImage,
                                imageInputRef,
                                setImageUploading
                            )
                        }}
                        height={10}
                        px={5}
                        style="outline"
                        color="accent-orange"
                        type="button"
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
