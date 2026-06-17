const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Démarrage du grand nettoyage...");

  try {
    // 1. On supprime d'abord TOUTES les commandes 
    // (Obligatoire avant de supprimer les utilisateurs à cause des relations)
    const deletedOrders = await prisma.order.deleteMany({});
    console.log(`✅ ${deletedOrders.count} commandes supprimées.`);

    // 2. On supprime TOUS les utilisateurs, SAUF ceux qui ont le rôle ADMIN
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        role: {
          not: 'ADMIN'
        }
      }
    });
    console.log(`✅ ${deletedUsers.count} comptes clients (tests) supprimés.`);

    console.log("✨ Base de données parfaitement propre ! Ton compte Admin est intact.");
  } catch (error) {
    console.error("❌ Erreur pendant le nettoyage :", error);
  }
}

main().finally(() => prisma.$disconnect());
