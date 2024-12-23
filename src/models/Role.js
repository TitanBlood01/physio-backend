import { Schema , model } from "mongoose"

export const Roles = ["user", "admin", "superAdmin"]

const roleSchema = new Schema({
    name: String
}, {
    versionKey: false
})

export default model ('Role', roleSchema);