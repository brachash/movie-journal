import mongoose, { Schema, Document } from 'mongoose';

/**
 * Interface for User document
 */
export interface IUser extends Document {
  email: string;
  password: string;
}

/**
 * Mongoose schema for User
 * @field email - User's email (unique, required)
 * @field password - Hashed password (required)
 */
const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default mongoose.model<IUser>('User', UserSchema);