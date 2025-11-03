import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    baseURL: "https://faizan.store",
    trustedOrigins: ["https://faizan.store"]
})