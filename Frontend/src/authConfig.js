import { PublicClientApplication } from "@azure/msal-browser";

export const msalConfig = {
    auth: {
        clientId: "54468cdb-3861-473d-aafc-de17f496bd4c",
        authority: "https://salentech.b2clogin.com/salentech.onmicrosoft.com/B2C_1_susi",
        knownAuthorities: ["salentech.b2clogin.com"],
        redirectUri: "http://localhost:5173",
        navigateToLoginRequestUrl: false,
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    },
};

export const loginRequest = {
    scopes: ["https://salentech.onmicrosoft.com/54468cdb-3861-473d-aafc-de17f496bd4c/access_as_user"],
};

export const msalInstance = new PublicClientApplication(msalConfig);
