import { model, Schema } from "mongoose"
import { IAuthProvider, IsActive, IsBlocked,  IUser, Role } from "./user.interfaces"



const authProviderSchema = new Schema<IAuthProvider>({
    provider : {type : String, required: true},
    providerId: {type : String, required : true}
}, {
    versionKey : false,
    _id: false
})



const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.RIDER
    },
    phone: { type: String },
    picture: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean,  default:false },
    isActive: {
         type: String,
        enum: Object.values(IsActive),
        default: IsActive.ACTIVE,
        },
    isBlocked: { type: String,
        enum: Object.values(IsBlocked),
         default: IsBlocked.UNBLOCKED },    
    isVerified: { type: Boolean, default: false },
    auths: [authProviderSchema]

}, {
    timestamps: true,
    versionKey: false
})


export const User = model<IUser>("User", userSchema)