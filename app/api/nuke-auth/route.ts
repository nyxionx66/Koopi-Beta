import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Simple authentication check
    if (email !== 'admin@gmail.com' || password !== 'admin321') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const listUsersResult = await admin.auth().listUsers(1000);
    const uids = listUsersResult.users.map((userRecord) => userRecord.uid);
    
    if (uids.length > 0) {
      await admin.auth().deleteUsers(uids);
    }

    return NextResponse.json({ success: true, message: 'All users have been deleted.' });
  } catch (error) {
    console.error('Error deleting users:', error);
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}