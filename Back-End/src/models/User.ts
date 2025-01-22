import { Schema, model, Types } from 'mongoose';

interface IUser {
  username: string;
  email: string;
  password: string;
  nom: string;
  prenom: string;
  dateNaissance: Date;
  telephone: string;
  image?: string;
  role: string;
  createdDate: Date;
  updatedDate: Date;
}

const userSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  dateNaissance: { type: Date, required: true },
  telephone: { type: String, required: true },
  image: { type: String },
  role: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
}, { timestamps: true });

const User = model<IUser>('User', userSchema, 'User');

export default User;