import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { supabase } from "./supabaseDB"
import { enablePushNotifications } from "./pushNotifications"

export default function NotifBar({open, func}) {

    const [announcements, setAnnouncements] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(()=>{
        enablePushNotifications().catch((error) => {
            console.error("Push notification setup failed:", error)
        })
    },[])

    useEffect(() => {
        if (!open) return

        async function fetchAnnouncements() {
            setLoading(true)
            setError("")

            const { data, error } = await supabase
                .from("Announcement")
                .select(`
                    announcementID,
                    title,
                    description,
                    created_at,
                    Category(categoryName)
                `)
                .eq("status", "ACTIVE")
                .order("created_at", { ascending: false })
                .limit(10)

            if (error) {
                console.error("Error fetching announcements:", error)
                setError("Could not load announcements.")
            } else {
                setAnnouncements(data ?? [])
            }

            setLoading(false)
        }

        fetchAnnouncements()
    }, [open])

    return createPortal (
        <div className={`bg-black/50  backdrop-blur-sm inset-0 fixed items-center justify-center h-screen w-screen ${open? 'pointer-events-auto':'pointer-events-none opacity-0'} `}>

            
            {/* this is the notif panel */}
            <div key={open? 'open' : 'close'} className= 'absolute h-full sm:w-100 w-full bg-gray-200 ml-auto inset-0 animate-right pr-4 animate-slideIn'>

                <div className="mt-5 flex justify-center">
                    <span className="font-bold">Push Notification</span>
                    
                </div>

                {/* this is the top X button */}
                <div className='w-full flex p-5'>
                    {/* <i className=' ml-auto fas fa-x text-primary-green text-2xl cursor-pointer'></i> */}
                    <i className=' ml-auto fas fa-x text-primary-green text-xl cursor-pointer'
                    // onClick={()=>{setNotifBar(false)}}></i>
                    onClick={func}></i>
                </div>


                {/* this is the content */}
                {loading && (
                    <div className="p-5 -mt-0.5 inset-ring-2 inset-ring-gray-300">
                        <p className="text-gray-500">Loading announcements...</p>
                    </div>
                )}

                {!loading && error && (
                    <div className="p-5 -mt-0.5 inset-ring-2 inset-ring-gray-300">
                        <p className="text-error-text">{error}</p>
                    </div>
                )}

                {!loading && !error && announcements.length === 0 && (
                    <div className="p-5 -mt-0.5 inset-ring-2 inset-ring-gray-300">
                        <p className="text-gray-500">No announcements yet.</p>
                    </div>
                )}

                {!loading && !error && announcements.map((announcement) => (
                    <div
                        key={announcement.announcementID}
                        className="p-5 -mt-0.5 inset-ring-2 inset-ring-gray-300 flex"
                    >
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <h1 className="font-bold underline truncate">{announcement.title}</h1>
                                {announcement.Category?.categoryName && (
                                    <span className="text-xs bg-primary-blue text-white rounded-md px-2 py-1 shrink-0">
                                        {announcement.Category.categoryName}
                                    </span>
                                )}
                            </div>
                            <p className="line-clamp-2 text-sm text-gray-700">{announcement.description}</p>
                        </div>
                    </div>
                ))}
                
            </div>
            
        </div>,
        document.body
    )
}
