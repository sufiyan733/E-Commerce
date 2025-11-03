import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    baseURL: "http://www.faizan.store",
    trustedOrigins: ["http://www.faizan.store"]
})