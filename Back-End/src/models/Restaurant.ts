import { Schema, model, Types } from 'mongoose';

interface IRestaurant {
  nomRestaurant: string;
  adresse: string;
  typeCuisine: string;
  bio: string;
  prixMoyen: number;
  image: string;
  latitude: number;
  longitude: number;
  promoteurId: Types.ObjectId;
}

const restaurantSchema: Schema = new Schema({
  nomRestaurant: { type: String, required: true },
  adresse: { type: String, required: true },
  typeCuisine: { type: String, required: true },
  bio: { type: String, required: true },
  prixMoyen: { type: Number, required: true },
  image: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  promoteurId: { type: Types.ObjectId, ref: 'Promoteur', required: true }
}, { timestamps: true });

const Restaurant = model<IRestaurant>('Restaurant', restaurantSchema, 'Restaurant');

export default Restaurant;