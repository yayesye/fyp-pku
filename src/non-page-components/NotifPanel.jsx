import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { supabase } from "./supabaseDB"
import { enablePushNotifications } from "./pushNotifications"

export default function NotifBar({open, func}) {

    const [announcements, setAnnouncements] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [pushEnabled, setPushEnabled] = useState(false)
    const [pushLoading, setPushLoading] = useState(false)
    const [pushMessage, setPushMessage] = useState("")
    const [showPanel, setShowPanel] = useState(open)

    useEffect(()=>{
        async function checkPushStatus() {
            if (!("serviceWorker" in navigator) || !("PushManager" in window)) return

            const registration = await navigator.serviceWorker.ready
            const subscription = await registration.pushManager.getSubscription()

            setPushEnabled(Boolean(subscription))
        }

        checkPushStatus().catch((error) => {
            console.error("Push notification status check failed:", error)
        })
    },[])

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

    async function disablePushNotifications() {
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) return

        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()

        if (subscription) {
            await subscription.unsubscribe()
        }

        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            await supabase.from("PushNotifSubscriptions").delete().eq("userID", user.id)
        }
    }

    async function handlePushToggle() {
        setPushLoading(true)
        setPushMessage("Turning Notifications On")

        try {
            if (pushEnabled) {
                await disablePushNotifications()
                setPushEnabled(false)
                // setPushMessage("Push notifications are off.")
            } else {
                await enablePushNotifications()
                setPushEnabled(true)
                // setPushMessage("Turning Notifications On")
            }
        } catch (error) {
            console.error("Push notification toggle failed:", error)
            setPushMessage(error.message || "Could not update push notifications.")
        } finally {
            setPushLoading(false)
            setPushMessage("")
        }
    }

    if (!showPanel) return null

    return createPortal (
        <div className={`bg-black/50  backdrop-blur-sm inset-0 fixed items-center justify-center h-screen w-screen ${open? 'pointer-events-auto':'pointer-events-none'} `}>

            
            {/* this is the notif panel */}
            <div className= {`absolute h-full sm:w-100 w-full bg-gray-200 ml-auto inset-0 sm:pr-4 ${open ? 'animate-slideIn' : 'animate-slideOut'}`}>

                <div className="mx-5 mb-5 mt-5 rounded-md bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="font-bold text-primary-blue">Push Notification</h2>
                            <p className="text-sm text-gray-500">{pushEnabled ? "On" : "Off"}</p>
                        </div>

                        <button
                            type="button"
                            onClick={handlePushToggle}
                            disabled={pushLoading}
                            className={`relative h-8 w-14 rounded-full transition-colors disabled:opacity-60 ${pushEnabled ? "bg-primary-green" : "bg-gray-400"}`}
                            aria-pressed={pushEnabled}
                            aria-label="Toggle push notifications"
                        >
                            <span className={`absolute left-0 top-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${pushEnabled ? "translate-x-7" : "translate-x-1"}`}></span>
                        </button>
                    </div>
                    {pushMessage && <p className="mt-3 text-sm text-gray-600">{pushMessage}</p>}
                </div>


                {/* this is the top X button */}
                <div className='w-full flex p-5'>
                    <i className='ml-auto fas fa-x text-primary-green text-xl cursor-pointer'
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
