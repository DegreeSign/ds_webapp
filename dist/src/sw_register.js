"use strict";
if ('serviceWorker' in navigator) {
    const serviceWorker = navigator.serviceWorker;
    serviceWorker?.getRegistrations?.()?.then((registrations) => {
        for (let registration of registrations)
            registration.unregister();
        serviceWorker.register(`/sw.js?updated=TIME_UPDATED`);
    });
}
;
