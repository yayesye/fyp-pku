import { createPortal } from "react-dom"

export default function NotifBar({open, func}) {

    return createPortal (
        <div className={`bg-black/50  backdrop-blur-sm inset-0 fixed items-center justify-center h-screen w-screen ${open? 'pointer-events-auto':'pointer-events-none opacity-0'} `}>

            
            {/* this is the notif panel */}
            <div key={open? 'open' : 'close'} className= {`absolute h-full w-100 bg-gray-200 ml-auto inset-0 animate-right pr-4 ${open? 'animate-slideIn' : 'animate-slideOut' } `} >

                {console.log('key: ', open? 'open':'close')}

                {/* this is the top X button */}
                <div className='w-full flex p-5'>
                    {/* <i className=' ml-auto fas fa-x text-primary-green text-2xl cursor-pointer'></i> */}
                    <i className=' ml-auto fas fa-x text-primary-green text-xl cursor-pointer'
                    // onClick={()=>{setNotifBar(false)}}></i>
                    onClick={func}></i>
                </div>


                {/* this is the content */}
                <div className="p-5 mt-[-2px] inset-ring-2 inset-ring-gray-300 flex ">
                    <div>
                        <h1 className="font-bold underline">Title</h1>
                        <p>Content</p>
                    </div>
                    <div className=" content-center ml-auto">
                        <i className="fas fa-check cursor-pointer" title="Mark As Read"></i>
                    </div>
                </div>
                <div className="p-5 mt-[-2px] inset-ring-2 inset-ring-gray-300 flex ">
                    <div>
                        <h1 className="font-bold underline">Title</h1>
                        <p>Content</p>
                    </div>
                    <div className=" content-center ml-auto">
                        <i className="fas fa-check cursor-pointer" title="Mark As Read"></i>
                    </div>
                </div>
                
            </div>
            
        </div>,
        document.body
    )
}