const
    DomainName = self.location.origin?.split(`.`)?.[0],
    CACHE_NAME = `cache_${DomainName}`,
    ROOT_URI = `APP_URL`,
    NOTIFICATION_ICON = `APP_ICON`,
    NOTIFICATION_BADGE = `APP_BADGE`,
    DEFAULT_NOTIFICATION_DATA = {
        title: `New Notification`,
        body: `You have a new notification!`,
        url: `NOTIFICATION_URI`
    },
    /** Check internet connectivity */
    isOnline = async (): Promise<boolean> => {
        try {
            // Attempt to fetch a small resource to check connectivity
            await fetch(`REFERENCE_FILE`, {
                method: `HEAD`,
                mode: `no-cors`,
                cache: `no-store`
            });
            return true;
        } catch {
            return false;
        };
    };

// Install event: No pre-caching, just activate immediately
(self as unknown as ServiceWorkerGlobalScope).addEventListener(`install`, (event: ExtendableEvent) => {
    event.waitUntil(
        (self as unknown as ServiceWorkerGlobalScope).skipWaiting()
    );
});

// Activate event: Clean up old caches
(self as unknown as ServiceWorkerGlobalScope).addEventListener(`activate`, (event: ExtendableEvent) => {
    event.waitUntil(
        caches.keys().then(cacheNames =>
            Promise.all(
                cacheNames.map(name => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                    return null;
                })
            )
        ).then(() =>
            (self as unknown as ServiceWorkerGlobalScope)
                ?.clients
                ?.claim()
        )
    );
});

// Fetch event: Use network when online, cache visited pages, serve cache when offline
(self as unknown as ServiceWorkerGlobalScope).addEventListener(`fetch`, (event: FetchEvent) => {
    event.respondWith(
        isOnline().then(online => {
            if (online) {
                // When online, always fetch from network
                return fetch(event.request)
                    .then(networkResponse => {
                        // Cache GET requests with valid responses
                        if (event.request.method === `GET` && networkResponse.ok) {
                            return caches.open(CACHE_NAME).then(cache => {
                                cache.put(event.request, networkResponse.clone());
                                return networkResponse;
                            });
                        }
                        return networkResponse;
                    })
                    .catch(error => {
                        // Network failed, try cache
                        if (event.request.method === `GET`) {
                            return caches.match(event.request).then(cachedResponse => {
                                if (cachedResponse) {
                                    return cachedResponse;
                                }
                                return new Response(`Network unavailable and no cached response found`, {
                                    status: 503,
                                    statusText: `Service Unavailable`
                                });
                            });
                        }
                        return new Response(`Network unavailable`, {
                            status: 503,
                            statusText: `Service Unavailable`
                        });
                    });
            } else {
                // When offline, serve from cache for GET requests
                if (event.request.method === `GET`) {
                    return caches.match(event.request).then(cachedResponse => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                        return new Response(`Offline and no cached response found`, {
                            status: 503,
                            statusText: `Service Unavailable`
                        });
                    });
                }
                return new Response(`Offline and non-GET request`, {
                    status: 503,
                    statusText: `Service Unavailable`
                });
            }
        })
    );
});

// Notification click: Open or focus window
(self as unknown as ServiceWorkerGlobalScope).addEventListener(`notificationclick`, (event: NotificationEvent) => {
    event.notification.close();
    const url = new URL(ROOT_URI, self.location.origin).href;
    event.waitUntil(
        (self as unknown as ServiceWorkerGlobalScope)
            ?.clients
            ?.matchAll({ type: `window`, includeUncontrolled: true }) // @ts-ignore
            ?.then(clients => {
                for (const client of clients) {
                    if (client.url === url && `focus` in client)
                        return client.focus();
                }; // @ts-ignore
                if ((self as unknown as ServiceWorkerGlobalScope)?.clients.openWindow)
                    return (self as unknown as ServiceWorkerGlobalScope).clients.openWindow(url);
            })
    );
});

// Notification close: Log event
(self as unknown as ServiceWorkerGlobalScope).addEventListener(`notificationclose`, (event: NotificationEvent) => {
    console.log(`Notification closed:`, event.notification);
});

// Push event: Show notification
(self as unknown as ServiceWorkerGlobalScope).addEventListener(`push`, (event: PushEvent) => {
    let data = DEFAULT_NOTIFICATION_DATA;
    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            console.warn(`Invalid push data, using default: ${e}`);
        };
    };
    const options: NotificationOptions = {
        body: data.body,
        icon: NOTIFICATION_ICON,
        badge: NOTIFICATION_BADGE,
        data: { url: new URL(data.url || ROOT_URI, self.location.origin).href }
    };
    event.waitUntil(
        (self as unknown as ServiceWorkerGlobalScope).registration.showNotification(data.title, options)
    );
});