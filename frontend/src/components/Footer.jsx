const Footer = () => {
    return (
        <footer className='w-full bg-accent-orange mt-5'>
            <div className="container mx-auto p-5 text-white flex">
                <p className="my-auto font-bold">© Grocket, {new Date().getFullYear()}</p>
            </div>
        </footer>
    )
}

export default Footer