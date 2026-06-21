import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { NeutralBox } from "./DisplayBox"

export default function Settings({open, func, logout}) {

    const [showPanel, setShowPanel] = useState(open)
    const [pushLoading, setPushLoading] = useState(false)
    const [pushEnabled, setPushEnabled] = useState(false)

    const [LogOutmsg, setLogOutmsg] = useState()

    useEffect(() => {
        if (open) {
            setShowPanel(true)
            return
        }

        const timer = setTimeout(() => {
            setShowPanel(false)
        }, 300)

        return () => clearTimeout(timer)
    }, [open])

    async function enableDarkMode(params) {
        
    }

    async function disableDarkMode(params) {
        
    }

    async function handlePushToggle() {
        setPushLoading(true)
        // setPushMessage("Turning Notifications On")

        try {
            if (pushEnabled) {
                await disableDarkMode()
                setPushEnabled(false)
                // setPushMessage("Push notifications are off.")
            } else {
                await enableDarkMode()
                setPushEnabled(true)
                // setPushMessage("Turning Notifications On")
            }
        } catch (error) {
            console.error("Push notification toggle failed:", error)
            // setPushMessage(error.message || "Could not update push notifications.")
        } finally {
            setPushLoading(false)
            // setPushMessage("")
        }
    }

    if (!showPanel) return null

    return createPortal(
        <div className={`bg-black/50 backdrop-blur-sm inset-0 fixed items-center justify-center h-screen w-screen ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>

            {/* panel slides in from the left */}
            <div className={`absolute h-full w-full -left-full sm:-left-100 sm:w-100 bg-gray-200 inset-0 ${open ? 'animate-slideOut' : 'animate-slideIn'}`}>

                {/* X button */}
                <div className='w-full flex p-5'>
                    <i className='ml-auto fas fa-x text-primary-green text-xl cursor-pointer'
                    onClick={func}></i>
                </div>

                {/* Settings content */}
                <div className=" rounded-md bg-white p-4 shadow-sm">
                    <h2 className="font-bold text-primary-blue text-center mb-4">Settings</h2>

                    {/* Dark mode toggle */}
                    {/* <div className="flex items-center justify-between gap-4 pb-5">
                        <div className="flex w-full">
                            <h3 className="font-semibold content-center text-gray-700 mr-auto">Dark Mode</h3>
                            
                            <button
                                type="button"
                                onClick={handlePushToggle}
                                disabled={pushLoading}
                                className={`relative h-7 w-14 rounded-full transition-colors disabled:opacity-60 ${pushEnabled ? "bg-primary-green" : "bg-gray-400"}`}
                                aria-pressed={pushEnabled}
                                aria-label="Toggle push notifications"
                            >
                                <span className={`absolute left-0 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${pushEnabled ? "translate-x-7" : "translate-x-1"}`}></span>
                            </button>
                        </div>
                    </div> */}


                    <div className="flex items-center justify-between gap-4 pb-3 pt-4 border-t border-gray-500">
                        <h3 className="font-semibold text-md text-gray-700">Log Out</h3>
                        <button 
                        onClick={()=>setLogOutmsg("Logout?")}
                        type="button" className="p-1.5 pr-2.5 pl-2.5 bg-red-800 rounded-lg hover:bg-red-600 text-white">Log Out</button>
                    </div>
                    
                    {/* <div className="flex items-center justify-between gap-4 pb-5 pt-5 border-t border-gray-500">
                        <h3 className="font-semibold text-gray-700">Log Out</h3>
                        <button 
                        onClick={console.log('helo')}
                        type="button" className="p-1.5 pr-2.5 pl-2.5 bg-gray-500 rounded-lg hover:bg-gray-800 text-white">Log Out</button>
                    </div> */}
                </div>

            </div>
            
            {LogOutmsg && <NeutralBox message={LogOutmsg} Yes={logout} No={()=>setLogOutmsg(null)} /> }

        </div>,
        document.body
    )
}