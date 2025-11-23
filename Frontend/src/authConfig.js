import { PublicClientApplication } from "@azure/msal-browser";

export const msalConfig = {
    auth: {
        clientId: "YOUR_CLIENT_ID", // Placeholder
        authority: "https://login.microsoftonline.com/YOUR_TENANT_ID", // Placeholder
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
