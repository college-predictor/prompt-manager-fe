import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('sessionId'); // or whatever the backend sets
  console.log("Auth Cookies:", authCookie)
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome to your Dashboard</h1>
      <p>This is a protected route.</p>
    </div>
  );
}
