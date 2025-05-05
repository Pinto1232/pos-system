import { NextResponse } from 'next/server';

// Define the backend API URL
const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000';

export async function POST(request: Request) {
  try {
    console.log('Proxying POST request to backend for user customization update');
    
    // Get the request body
    const customizationData = await request.json();
    
    // Forward the request to the backend API
    const response = await fetch(`${BACKEND_API_URL}/api/UserCustomization`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customizationData),
    });

    if (!response.ok) {
      console.warn(`Backend API returned status: ${response.status}`);
      return NextResponse.json(
        { error: 'Failed to update user customization in backend' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Successfully updated user customization in backend');
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying request to backend:', error);
    return NextResponse.json(
      { error: 'Failed to connect to backend service' },
      { status: 500 }
    );
  }
}
