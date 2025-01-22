import { Router, Request, Response } from 'express';
import Restaurant from '../../models/Restaurant';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
      console.log("Fetching all restaurants...");
      const restaurants = await Restaurant.find();
      console.log('Fetched restaurants:', restaurants);
    
      if (restaurants.length === 0) {
        return res.status(404).json({ message: 'No restaurants found' });
      }
      
      res.json({ restaurants });
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      res.status(500).json({ message: 'Error fetching restaurants', error });
    }
  });

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json({ restaurant });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurant', error });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const { nomRestaurant, adresse, typeCuisine, bio, prixMoyen, latitude, longitude, promoteurId } = req.body;

  const newRestaurant = new Restaurant({
    nomRestaurant,
    adresse,
    typeCuisine,
    bio,
    prixMoyen,
    latitude,
    longitude,
    promoteurId,
  });

  try {
    const savedRestaurant = await newRestaurant.save();
    res.status(201).json({ message: 'Restaurant created', restaurant: savedRestaurant });
  } catch (error) {
    res.status(500).json({ message: 'Error creating restaurant', error });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRestaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json({ message: 'Restaurant updated', restaurant: updatedRestaurant });
  } catch (error) {
    res.status(500).json({ message: 'Error updating restaurant', error });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!deletedRestaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json({ message: 'Restaurant deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting restaurant', error });
  }
});

export default router;