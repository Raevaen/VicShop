import { PublicClientApplication } from "@azure/msal-browser";

export const msalConfig = {
    auth: {
        clientId: "f7550b9a-d493-4363-8a04-e5ff31d81e56", 
        authority: "https://login.microsoftonline.com/e66763a0-7cd8-4cf2-972a-472c8c3cc554",
        redirectUri: window.location.origin,
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    },
};

export const loginRequest = {
    scopes: ["User.Read", "products_admin"],
};

export const msalInstance = new PublicClientApplication(msalConfig);
