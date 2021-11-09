import { model, Schema, Document } from 'mongoose'
import bcrypt from 'bcrypt'

export interface IUser extends Document {
    username: string,
    password: string,
    comparePassword: (password: string) => Promise<boolean>
}

const User = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

User.pre<IUser>('save', async function(next){
    if(!this.isModified('password')) return next()
    //nuevo usuario
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt)
    this.password = hash;
    next();
})

User.methods.comparePassword = async function(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password)
}

export default model<IUser>('User', User);