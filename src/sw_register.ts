if ('serviceWorker' in navigator) {
    const serviceWorker: any = navigator.serviceWorker;
    serviceWorker?.getRegistrations?.()?.then((registrations: any) => {
        for (let registration of registrations)
            registration.unregister();
        serviceWorker.register(`/sw.js?updated=TIME_UPDATED`);
    });
};