declare const DomainName: string, CACHE_NAME: string, ROOT_URI = "APP_URL", NOTIFICATION_ICON = "APP_ICON", NOTIFICATION_BADGE = "APP_BADGE", DEFAULT_NOTIFICATION_DATA: {
    title: string;
    body: string;
    url: string;
}, 
/** Check internet connectivity */
isOnline: () => Promise<boolean>;
