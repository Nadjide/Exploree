import { PrismaClient } from '@prisma/client';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient
const app = express()

app.use(cors());

app.use(express.json())

const v1Router = express.Router();


/********************************************************************************
    Hateoas
 ********************************************************************************/

v1Router.get('/', async (req, res) => {
    res.json(
        {
            Links:
                [
                    {
                        User:
                            [
                                {
                                    rel: "user Login", method: "POST", title: 'User Login', href: 'http://127.0.0.1:8000/v1/user/login'
                                },
                                { rel: "user Sign up", method: "POST", title: 'User Sign Up', href: 'http://127.0.0.1:8000/v1/user/signup' }
                            ]
                    },
                    {
                        Restaurant:

                            [
                                { rel: "GET All Restaurant", method: "GET", href: 'http://127.0.0.1:8000/v1/restaurant' },
                                { rel: "GET One Restaurant", method: "GET", href: 'http://127.0.0.1:8000/v1/restaurant:id' },
                                { rel: "create Restaurant", method: "POST", title: 'Create Restaurant', href: 'http://127.0.0.1:8000/v1/restaurant' },
                                { rel: "delete Restaurant", method: "DELETE", title: 'DELETE Restaurant', href: 'http://127.0.0.1:8000/v1/restaurant' },
                                { rel: "modifier Restaurant", method: "PUT", title: 'Modifier Restaurant', href: 'http://127.0.0.1:8000/v1/restaurant' }
                            ]
                    },
                    {
                        Activité:
                            [
                                { rel: "GET ALL Activité", method: "GET", href: 'http://127.0.0.1:8000/v1/activite' },
                                { rel: "GET One Activité", method: "GET", href: 'http://127.0.0.1:8000/v1/activite:id' },
                                { rel: "create Activite", method: "POST", title: 'Create Activite', href: 'http://127.0.0.1:8000/v1/activite' },
                                { rel: "delete Activite", method: "DELETE", title: 'DELETE Activite', href: 'http://127.0.0.1:8000/v1/activite' },
                                { rel: "modifier Activite", method: "PUT", title: 'Modifier Activite', href: 'http://127.0.0.1:8000/v1/activite' }
                            ]
                    },

                    {
                        Reservation:
                            [
                                { rel: "Put Reservation", method: "PUT", href: 'http://127.0.0.1:8000/v1/reservation' },
                                { rel: "GET Reservation", method: "GET", href: 'http://127.0.0.1:8000/v1//user/:userId/reservations' },
                                { rel: "MODIFIER Reservation", method: "PUT", title: 'PUT Activite', href: 'http://127.0.0.1:8000/v1/reservation/:reservationId' },
                                { rel: "DELETE Reservation", method: "DELETE", title: 'DELETE Activite', href: 'http://127.0.0.1:8000/v1/reservation/:reservationId' },
                            ]
                    },
                    {
                        Search:
                            [
                                { rel: "Search", method: "GET", href: 'http://127.0.0.1:8000/v1/search' },
                                { rel: "Search Restaurant", method: "GET", href: 'http://127.0.0.1:8000/v1/search/restaurant' },
                                { rel: "Search Activité", method: "GET", href: 'http://127.0.0.1:8000/v1/search/activite' },

                            ]
                    },
                ]
        })
})


/********************************************************************************
    User
 ********************************************************************************/

v1Router.post('/user/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });

    if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: 'Login successfull', user: user });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

v1Router.post('/user/signup', async (req, res) => {
    const { email, password, username, nom, prenom, dateNaissance, telephone } = req.body;
    const existingUser = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });
    if (existingUser) {
        res.status(400).json({ message: 'Email déjà existante' });
    } else {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
                username: username,
                nom: nom,
                prenom: prenom,
                dateNaissance: dateNaissance,
                telephone: telephone,
            },
        });
        res.status(201).json({ message: 'User created', user: user });
    }
});

v1Router.get('/user/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

/********************************************************************************
    Restaurant
 ********************************************************************************/

v1Router.get('/restaurant/search', async (req, res) => {
    const nomRestaurant = req.query.nomRestaurant as string;
    const adresse = req.query.adresse as string;

    // Vérifie si au moins un des paramètres est présent
    if (!nomRestaurant && !adresse) {
        res.status(400).json({ error: 'Paramètres manquants' });
        return;
    }

    try {
        const restaurants = await prisma.restaurant.findMany({
            where: {
                OR: [
                    {
                        nomRestaurant: {
                            contains: nomRestaurant,
                        },
                    },
                    {
                        adresse: {
                            contains: adresse,
                        },
                    },
                ],
            },
        });

        if (restaurants.length === 0) {
            // Aucun restaurant correspondant trouvé, renvoyer un message d'erreur avec un tableau vide
            res.status(404).json({ error: 'Aucun restaurant correspondant trouvé', restaurants: [] });
        } else {
            // Des restaurants correspondants ont été trouvés, renvoyer la liste
            res.status(200).json(restaurants);
        }
    } catch (error) {
        console.error('Erreur lors de la recherche des restaurants :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});



v1Router.get('/restaurant', async (req, res) => {
    const { id, nomRestaurant, adresse, typeCuisine, bio, prixMoyen, image, promoteurId } = req.body;
    const user = await prisma.restaurant.findMany({
        where: {
            id: id,
            nomRestaurant: nomRestaurant,
            adresse: adresse,
            typeCuisine: typeCuisine,
            bio: bio,
            prixMoyen: prixMoyen,
            image: image,
            promoteurId: promoteurId
        }
    })

    res.status(200).json(user);
})

v1Router.get('/restaurant/:id', async (req, res) => {
    const restaurantId = parseInt(req.params.id, 10);

    if (isNaN(restaurantId)) {
        return res.status(400).json({ error: 'ID de restaurant invalide' });
    }

    try {
        const restaurant = await prisma.restaurant.findUnique({
            where: {
                id: String(restaurantId),
            },
        });

        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant non trouvé' });
        }

        res.status(200).json(restaurant);
    } catch (error) {
        console.error('Erreur lors de la recherche du restaurant par ID :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

v1Router.delete('/restaurant/:id', async (req, res) => {
    const restaurantId = parseInt(req.params.id, 10);

    if (isNaN(restaurantId)) {
        return res.status(400).json({ error: 'ID de restaurant invalide' });
    }

    try {
        const restaurant = await prisma.restaurant.findUnique({
            where: {
                id: String(restaurantId),
            },
        });

        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant non trouvé' });
        }

        await prisma.restaurant.delete({
            where: {
                id: String(restaurantId),
            },
        });

        res.status(204).json({ message: 'Restaurant supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression du restaurant par ID :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

v1Router.post('/restaurant', async (req, res) => {
    const {
        id,
        nomRestaurant,
        adresse,
        typeCuisine,
        bio,
        prixMoyen,
        image,
        latitude,
        longitude,
        promoteurId
    } = req.body;

    try {
        const restaurant = await prisma.restaurant.create({
            data: {
                id,
                nomRestaurant,
                adresse,
                typeCuisine,
                bio,
                prixMoyen,
                image,
                latitude,
                longitude,
                promoteurId
            }
        });

        res.status(201).json(restaurant);
    } catch (error) {
        console.error('Erreur lors de la création du restaurant :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

v1Router.put('/restaurant/:id', async (req, res) => {
    const restaurantId = parseInt(req.params.id); // Convertir l'ID en nombre entier
    const {
        nomRestaurant,
        adresse,
        typeCuisine,
        bio,
        prixMoyen,
        image
    } = req.body;

    try {
        // Vérifie si le restaurant existe
        const existingRestaurant = await prisma.restaurant.findUnique({
            where: {
                id: String(restaurantId)
            }
        })
    } catch (error) {
        console.error('Erreur lors de la mise à jour du restaurant :', error);
        res.status(404).json({ error: 'Restaurant non trouvé' });
    }


    //On précise à typescript le type attendu en utiilisant une interface sinon il ne nous laisse pas utiliser les champs de restaurant
    interface UpdateData {
        nomRestaurant?: string;
        adresse?: string;
        typeCuisine?: string;
        bio?: string;
        prixMoyen?: number;
        image?: string;
    }

    try {
        // Vérifier si le restaurant existe
        const existingRestaurant = await prisma.restaurant.findUnique({
            where: {
                id: String(restaurantId)
            }
        });

        if (!existingRestaurant) {
            // Si le restaurant n'existe pas, renvoyer une réponse avec un code 404 (Not Found)
            res.status(404).json({ error: 'Restaurant non trouvé' });
            return;
        }

        // Construire les données de mise à jour en fonction des champs fournis
        const updateData: UpdateData = {};

        if (nomRestaurant !== undefined) {
            updateData.nomRestaurant = nomRestaurant;
        }

        if (adresse !== undefined) {
            updateData.adresse = adresse;
        }

        if (typeCuisine !== undefined) {
            updateData.typeCuisine = typeCuisine;
        }

        if (bio !== undefined) {
            updateData.bio = bio;
        }

        if (prixMoyen !== undefined) {
            updateData.prixMoyen = prixMoyen;
        }

        if (image !== undefined) {
            updateData.image = image;
        }

        // Mettre à jour le restaurant avec les données fournies
        const updatedRestaurant = await prisma.restaurant.update({
            where: {
                id: String(restaurantId)
            },
            data: updateData
        });

        res.status(201).json(updatedRestaurant);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du restaurant :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});


/********************************************************************************
    Activite
 ********************************************************************************/

v1Router.get('/activite/search', async (req, res) => {
    const titreAct = req.query.titreAct as string;
    const adresse = req.query.adresse as string;

    // Vérifie si au moins un des paramètres est présent
    if (!titreAct && !adresse) {
        res.status(400).json({ error: 'Paramètres manquants' });
        return;
    }

    try {
        const activite = await prisma.activite.findMany({
            where: {
                OR: [
                    {
                        titreAct: {
                            contains: titreAct,
                        },
                    },
                    {
                        adresse: {
                            contains: adresse,
                        },
                    },
                ],
            },
        });

        if (activite.length === 0) {
            res.status(404).json({ error: 'Aucune activité correspondant trouvé', activite: [] });
        } else {
            res.status(200).json(activite);
        }
    } catch (error) {
        console.error('Erreur lors de la recherche des activités :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

v1Router.get('/activite', async (req, res) => {
    const { id, titreAct, typeActivite, description, adresse, date, image } = req.body;
    const user = await prisma.activite.findMany({
        where: {
            id: id,
            titreAct: titreAct,
            typeActivite: typeActivite,
            description: description,
            adresse: adresse,
            date: date,
            image: image
        }
    })
    res.status(200).json(user);
})

v1Router.get('/activite/:id', async (req, res) => {
    const activiteId = parseInt(req.params.id, 10);

    if (isNaN(activiteId)) {
        return res.status(400).json({ error: 'ID de restaurant invalide' });
    }

    try {
        const activite = await prisma.activite.findUnique({
            where: {
                id: String(activiteId),
            },
        });

        if (!activite) {
            return res.status(404).json({ error: 'Restaurant non trouvé' });
        }

        res.status(200).json(activite);
    } catch (error) {
        console.error('Erreur lors de la recherche du restaurant par ID :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

v1Router.delete('/activite/:id', async (req, res) => {
    const activiteId = parseInt(req.params.id, 10);

    if (isNaN(activiteId)) {
        return res.status(400).json({ error: 'ID de restaurant invalide' });
    }

    try {
        const activite = await prisma.activite.findUnique({
            where: {
                id: String(activiteId),
            },
        });

        if (!activite) {
            return res.status(404).json({ error: 'Activité non trouvé' });
        }

        await prisma.activite.delete({
            where: {
                id: String(activiteId),
            },
        });

        res.status(204).json({ message: 'Activité supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l activite par ID :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

v1Router.post('/activite', async (req, res) => {
    const {
        id,
        titreAct,
        typeActivite,
        description,
        adresse,
        date,
        image,
        latitude,
        longitude,
        promoteurId
    } = req.body;

    try {
        const activite = await prisma.activite.create({
            data: {
                id,
                titreAct,
                typeActivite,
                description,
                adresse,
                date,
                image,
                latitude,
                longitude,
                promoteurId
            }
        });

        res.status(201).json(activite);
    } catch (error) {
        console.error('Erreur lors de la création du activite :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

v1Router.put('/activite/:id', async (req, res) => {
    const activiteId = parseInt(req.params.id); // Convertir l'ID en nombre entier
    const {
        id,
        titreAct,
        typeActivite,
        description,
        adresse,
        date,
        image
    } = req.body;

    try {
        // Vérifie si le restaurant existe
        const existingRestaurant = await prisma.restaurant.findUnique({
            where: {
                id: id
            }
        })
    } catch (error) {
        console.error('Erreur lors de la mise à jour du restaurant :', error);
        res.status(404).json({ error: 'Restaurant non trouvé' });
    }


    //On précise à typescript le type attendu en utiilisant une interface sinon il ne nous laisse pas utiliser les champs de activite
    interface UpdateData {
        titreAct?: string;
        typeActivite?: string;
        description?: string;
        adresse?: string;
        date?: Date;
        image?: string;
    }

    try {
        // Vérifier si l'activité existe
        const existingActivite = await prisma.activite.findUnique({
            where: {
                id: String(activiteId)
            }
        });

        if (!existingActivite) {
            // Si le restaurant n'existe pas, renvoyer une réponse avec un code 404 (Not Found)
            res.status(404).json({ error: 'Activité non trouvé' });
            return;
        }

        // Construire les données de mise à jour en fonction des champs fournis
        const updateData: UpdateData = {};

        if (titreAct !== undefined) {
            updateData.titreAct = titreAct;
        }

        if (typeActivite !== undefined) {
            updateData.typeActivite = typeActivite;
        }

        if (description !== undefined) {
            updateData.description = description;
        }

        if (adresse !== undefined) {
            updateData.adresse = adresse;
        }

        if (image !== undefined) {
            updateData.image = image;
        }

        // Mettre à jour le restaurant avec les données fournies
        const updatedActivite = await prisma.activite.update({
            where: {
                id: String(activiteId)
            },
            data: updateData
        });

        res.status(201).json(updatedActivite);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l activité :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});



v1Router.post('/reservation', async (req, res) => {
    const { userId, activiteId, restaurantId, dateHeure, nombrePersonnes, statut } = req.body;
    try {
        const reservation = await prisma.reservation.create({
            data: {
                userId,
                activiteId,
                restaurantId,
                dateHeure,
                nombrePersonnes,
                statut
            }
        });
        res.status(201).json(reservation);
    } catch (error) {
        res.status(400).json({ message: 'Erreur création de reservation', error: error });
        console.log(req.body);
    }
});

v1Router.get('/user/:userId/reservations', async (req, res) => {
    const { userId } = req.params;
    const reservations = await prisma.reservation.findMany({
        where: {
            userId: String(userId)
        }
    })
    res.status(200).json(reservations)
})

v1Router.put('/reservation/:reservationId', async (req, res) => {
    const { reservationId } = req.params;
    const { statut } = req.body;
    const reservation = await prisma.reservation.update({
        where: {
            id: reservationId
        },
        data: {
            statut: statut
        }
    })
    res.status(201).json(reservation)
})

v1Router.delete('/reservation/:reservationId', async (req, res) => {
    const { reservationId } = req.params;
    const reservation = await prisma.reservation.delete({
        where: {
            id: reservationId
        }
    })
    res.status(204).json(reservation)
})

v1Router.get('/search', async (req, res) => {
    const { search } = req.query;
    try {
        const restaurants = await prisma.restaurant.findMany({
            where: {
                OR: [
                    {
                        nomRestaurant: {
                            contains: String(search)
                        }
                    },
                    {
                        adresse: {
                            contains: String(search)
                        }
                    },
                    {
                        typeCuisine: {
                            contains: String(search)
                        }
                    },
                    {
                        bio: {
                            contains: String(search)
                        }
                    },
                ]
            }
        })
        const activites = await prisma.activite.findMany({
            where: {
                OR: [
                    {
                        titreAct: {
                            contains: String(search)
                        }
                    },
                    {
                        typeActivite: {
                            contains: String(search)
                        }
                    },
                    {
                        description: {
                            contains: String(search)
                        }
                    },
                    {
                        adresse: {
                            contains: String(search)
                        }
                    },
                ]
            }
        })
        res.status(200).json({ restaurants: restaurants, activites: activites });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error searching', error: error });
    }
})

v1Router.get('/promoteur/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const promoteur = await prisma.promoteur.findUnique({
            where: {
                id: String(id)
            },
            include: {
                activites: true,
                restaurants: true,
                contenus: true
            }
        })
        res.status(200).json(promoteur);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error searching', error: error });
    }
})

v1Router.get('/restaurants', async (req, res) => {
    const { promoteurId } = req.query;

    if (!promoteurId) {
        return res.status(400).json({ error: 'promoteurId is required' });
    }

    try {
        const restaurants = await prisma.restaurant.findMany({
            where: {
                promoteurId: String(promoteurId)
            }
        });

        res.status(200).json(restaurants);
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.use('/v1', v1Router);

app.listen(8000, () => console.log('Server ready at: http://127.0.0.1:8000'))
