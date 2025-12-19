import { PublicClientApplication } from "@azure/msal-browser";

export const msalConfig = {
    auth: {
        clientId: "54468cdb-3861-473d-aafc-de17f496bd4c", 
        authority: "https://login.microsoftonline.com/e66763a0-7cd8-4cf2-972a-472c8c3cc554",
        redirectUri: "http://localhost:5173",
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    },
};

export const loginRequest = {
    scopes: ["User.Read"],
};

export const msalInstance = new PublicClientApplication(msalConfig);
