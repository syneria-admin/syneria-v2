const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2]; // Récupère l'email tapé dans la commande
  
  if (!email) {
    console.log("❌ Erreur : Veuillez fournir un email.");
    console.log("Exemple : node promote.js mon-email@syneria.ca");
    process.exit(1);
  }
  
  try {
    const user = await prisma.user.update({
      where: { email: email },
      data: { role: 'ADMIN' }
    });
    console.log(`✅ Succès absolu ! L'utilisateur ${user.email} a été promu ADMINISTRATEUR.`);
  } catch (err) {
    console.log(`❌ Erreur : L'utilisateur avec l'email "${email}" est introuvable.`);
  }
}

main().finally(() => prisma.$disconnect());
