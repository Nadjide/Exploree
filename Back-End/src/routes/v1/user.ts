import { Router, Request, Response } from 'express';
import User from '../../models/User';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
      const users = await User.find();
      res.json({ users });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Error fetching users', error });
    }
  });

// Récupérer un utilisateur par ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
});

// Créer un nouvel utilisateur
router.post('/', async (req: Request, res: Response) => {
  const { username, email, password, nom, prenom, dateNaissance, telephone, image, role } = req.body;
  
  const newUser = new User({
    username,
    email,
    password,
    nom,
    prenom,
    dateNaissance,
    telephone,
    image,
    role,
    createdDate: new Date(),
    updatedDate: new Date(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json({ message: 'User created', user: savedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
});


router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User updated', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
});

// Supprimer un utilisateur par ID
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
});

export default router;