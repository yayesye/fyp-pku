import { createPortal } from "react-dom"
import { Link } from "react-router-dom"


export function ErrorBox ({onDismiss, message}) {
    return createPortal(
        // this the background blur
        <div className=" bg-black/50 backdrop-blur-sm inset-0 fixed flex items-center z-50 justify-center h-screen w-screen">

            {/* this the small box */}
            <div className=" min-w-[40vw] bg-error-bg rounded-xl animate-pop flex flex-col shadow-2xl ">
                
                <div className="content-center p-4 rounded-t-xl">
                    <h1 className="font-bold text-center text-lg text-error-text ">Something went wrong</h1>
                </div>
                <div className="p-5 h-full flex flex-col bg-white rounded-b-xl ">
                    <div>
                        <h1 className=" wrap-break-word text-error-text">{message || 'NULL' }</h1>
                    </div>
                        <div onClick={onDismiss} className="flex ml-auto mt-4 p-2 min-w-22 max-w-35 justify-center rounded-xl bg-error-text text-white text-center cursor-pointer">
                        <h1>Dismiss</h1>
                    </div>
                </div>
                
            </div>
        </div>,
        document.body
    )
}




export function GoodBox ({onDismiss, message}) {
    return(
        // this the background blur
        <div className=" bg-black/50 backdrop-blur-sm inset-0 fixed flex items-center justify-center h-screen w-screen">

            {/* this the small box */}
            <div className=" min-w-[40vw] bg-white rounded-xl animate-pop flex flex-col shadow-2xl ">
                
                <div className="content-center bg-good-bg p-4 rounded-t-xl">
                    <h1 className="font-bold text-center text-lg text-good-text">Success</h1>
                </div>
                <div className="p-5 h-full flex flex-col">
                    <div>
                        <h1 className=" wrap-break-word text-good-text font-bold ">{message || 'NULL' }</h1>
                    </div>
                        <div onClick={onDismiss} className="flex ml-auto mt-4 p-2 min-w-22 max-w-35 justify-center rounded-xl bg-good-text text-white text-center cursor-pointer">
                        <h1>Continue</h1>
                    </div>
                </div>
                
            </div>
        </div>
    )
}




export function NotFound () {
    return(
        // this the background blur
        <div className=" bg-black/50 backdrop-blur-sm inset-0 fixed flex items-center justify-center h-screen w-screen">

            {/* this the small box */}
            <div className=" min-w-[50vw] bg-white animate-pop flex flex-col shadow-2xl "> 
                
                <div className="content-center bg-error-bg p-4 ">
                    <h1 className="font-bold text-center text-lg text-error-text ">Not Found</h1>
                </div>
                <div className="p-5 h-full flex flex-col ">
                    <div>
                        <h1 className=" wrap-break-word text-error-text"> Page Not Found </h1>
                    </div>


                    <Link to={-1} className="flex ml-auto mt-4 p-2 min-w-25  justify-center rounded-xl bg-error-text text-white text-center cursor-pointer">
                        <h1 className=" text-white">Continue</h1>
                    </Link>
                </div>
                
            </div>
        </div>
    )
}


