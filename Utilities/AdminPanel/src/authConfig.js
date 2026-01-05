import { PublicClientApplication } from "@azure/msal-browser";

export const msalConfig = {
    auth: {
        // TODO: change msal login authority as it must be different from the Frontend one
        clientId: "54468cdb-3861-473d-aafc-de17f496bd4c", 
        authority: "https://login.microsoftonline.com/e66763a0-7cd8-4cf2-972a-472c8c3cc554",
        redirectUri: window.location.origin,
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    },
};

export const loginRequest = {
    scopes: ["User.Read", "products.admin"],
};

export const msalInstance = new PublicClientApplication(msalConfig);
