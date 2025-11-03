import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    baseURL: "https://www.faizan.store",
    trustedOrigins: ["https://www.faizan.store"]
})