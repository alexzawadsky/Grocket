export const toBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        return reader.result
    };
}

export const fromBase64 = (file) => {

}