import Swal from 'sweetalert2'

export const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

export const alertErr = (err) => {
    // alert(`${err.response.status} ${err.response.data}`)
    alert(err)
}

export const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

export const notification = (text) => {
    Swal.fire({
        title: text,
        icon: 'success',
        showConfirmButton: false,
        position: 'top',
        timer: 1500,
        backdrop: false
    })
}