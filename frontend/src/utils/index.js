import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

export const alertErr = (err) => {
    // Swal.fire({
    //     title: `Error ${err.status}`,
    //     text: err.response.message,
    //     icon: 'error',
    //     timer: 1500,
    //     showConfirmButton: false,
    //     position: 'top',
    //     backdrop: false
    // })
}

export const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

export const notification = (text) => {

    toast.success(text, { duration: 1500 })
}

export const info = (text) => {
    toast(text, { duration: 2000 })
}

export const confirm = (text, onConfirm, onConfirmText, onDenyText) => {
    // Swal.fire({
    //     title: text,
    //     icon: 'warning',
    //     position: 'top',
    //     backdrop: null,
    //     confirmButtonColor: '#dc2626',
    //     showCancelButton: true,
    //     confirmButtonText: 'Delete',
    // }).then((result) => {
    //     if (result.isConfirmed) {
    //         onConfirm()
    //     }
    // })
}

export const saveImage = (editorRef, images, setImages, setCurrentImage, imageInputRef, setUploading) => {
    try {
        setUploading(true)
        const img = new Image()
        img.src = editorRef.current.getImage().toDataURL()
        img.onload = () => {
            const canvas = document.createElement("canvas")
            canvas.width = 800
            canvas.height = 600
            const ctx = canvas.getContext("2d")
            ctx.drawImage(img, 0, 0, 800, 600)
            const newImage = {
                is_main: images.length > 0 ? false : true,
                image: canvas.toDataURL("image/png")
            }
            setImages(prevImages => [...prevImages, newImage])
            imageInputRef.current.value = null
            setCurrentImage(null)
        }
        setUploading(false)
    } catch (e) {
        setUploading(false)
        alert(e)
    }
}

export const getLastRoute = () => {
    const currentPath = window.location.pathname
    const lastRoute = currentPath.substring(0, currentPath.lastIndexOf('/'))
    return lastRoute
}