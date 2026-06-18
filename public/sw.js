self.addEventListener("push", event => {
    const data = event.data?.json() ?? {}

    event.waitUntil(
        self.registration.showNotification(data.title ?? "New Announcement", {
            body: data.body ?? "A new announcement was posted.",
            icon: "/favicon.ico",
            data: {
                url: data.url ?? "/"
            }
        })
    )
})

self.addEventListener("notificationclick", event => {
    event.notification.close()

    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    )
})