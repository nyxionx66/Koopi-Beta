/**
 * Script to initialize the promo configuration in Firestore
 * Run this once to set up the early access promo
 * 
 * Usage: node scripts/initPromo.js
 */

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin
// Note: This uses the same project as the client app
const firebaseConfig = {
  apiKey: "AIzaSyDcBmNXdT_cdiBEDQhAfsOKhNH17EpfIWQ",
  authDomain: "guru-ee9f7.firebaseapp.com",
  projectId: "guru-ee9f7",
  storageBucket: "guru-ee9f7.firebasestorage.app",
  messagingSenderId: "455506336446",
  appId: "1:455506336446:web:cfa2b805aa97065a491cef",
};

// Initialize the app
const app = initializeApp({
  projectId: firebaseConfig.projectId,
});

const db = getFirestore(app);

async function initializePromo() {
  try {
    console.log('🚀 Initializing promo configuration...');
    
    const promoRef = db.collection('promoConfig').doc('earlyAccess');
    
    // Check if it already exists
    const doc = await promoRef.get();
    
    if (doc.exists) {
      const data = doc.data();
      console.log('✅ Promo config already exists:');
      console.log(`   Total Spots: ${data.totalSpots}`);
      console.log(`   Used Spots: ${data.usedSpots}`);
      console.log(`   Remaining: ${data.totalSpots - data.usedSpots}`);
      console.log(`   Active: ${data.isActive}`);
      
      // Ask if user wants to reset
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      readline.question('\nDo you want to reset it? (yes/no): ', async (answer) => {
        if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
          await promoRef.set({
            totalSpots: 100,
            usedSpots: 0,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          console.log('✅ Promo config reset successfully!');
        } else {
          console.log('ℹ️  Keeping existing configuration.');
        }
        readline.close();
        process.exit(0);
      });
    } else {
      // Create new promo config
      await promoRef.set({
        totalSpots: 100,
        usedSpots: 0,
        isActive: true,
        createdAt: new Date(),
      });
      
      console.log('✅ Promo config created successfully!');
      console.log('   Total Spots: 100');
      console.log('   Used Spots: 0');
      console.log('   Active: true');
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Error initializing promo:', error);
    process.exit(1);
  }
}

initializePromo();
