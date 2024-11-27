import { MongoClient } from "mongodb";


const uri = "mongodb+srv://nadjide:HfMSyJiJA577kESl@voyagex.9awaz.mongodb.net/?retryWrites=true&w=majority&appName=VoyageX";

// Liste des collections à créer
const collections = [
  "User",
  "Promoteur",
  "Activite",
  "Restaurant",
  "Budget",
  "Reservation",
  "Contenu",
  "UserContenuInteraction",
  "Commentaire",
  "Like",
];

async function createCollections() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("VoyageX");

    for (const collectionName of collections) {
      const exists = await db.listCollections({ name: collectionName }).hasNext();
      if (!exists) {
        await db.createCollection(collectionName);
        console.log(`Collection "${collectionName}" créée avec succès.`);
      } else {
        console.log(`Collection "${collectionName}" existe déjà.`);
      }
    }
  } catch (error) {
    console.error("Erreur lors de la création des collections :", error);
  } finally {
    await client.close();
    console.log("Connexion fermée.");
  }
}

createCollections();