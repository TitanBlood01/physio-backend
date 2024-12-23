import mongoose, { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = new Schema({
    teamMember: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "team",
        required: false
    },
    password: {
        type: String,
        required: true
    },
    roles: [{
        type: Schema.Types.ObjectId,
        ref: "Role",
    }],
},
{
    timestamps: true,
    versionKey: false
});

userSchema.statics.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}
userSchema.statics.comparePassword = async (password, receivedPassword) => {
    return bcrypt.compare(password, receivedPassword)
}

export default model("User", userSchema);