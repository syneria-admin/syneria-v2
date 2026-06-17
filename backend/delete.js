const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2]; // L'email que tu vas taper dans la commande
  
  if (!email) {
    console.log("❌ Erreur : Tu dois préciser l'email du compte à supprimer.");
    console.log("👉 Exemple : node delete.js faux-client@gmail.com");
    process.exit(1);
  }

  try {
    console.log(`🔍 Recherche du compte : ${email}...`);

    // 1. On supprime d'abord toutes les commandes liées à cet utilisateur (Obligatoire)
    const deletedOrders = await prisma.order.deleteMany({
      where: { user: { email: email } }
    });

    // 2. On supprime le compte utilisateur
    const deletedUser = await prisma.user.delete({
      where: { email: email }
    });

    console.log(`✅ Succès !`);
    console.log(`- Compte ${deletedUser.email} supprimé.`);
    console.log(`- ${deletedOrders.count} commande(s) associée(s) supprimée(s).`);
    
  } catch (error) {
    console.error(`❌ Impossible de supprimer. Cet email n'existe peut-être pas dans la base.`);
  }
}

main().finally(() => prisma.$disconnect());
