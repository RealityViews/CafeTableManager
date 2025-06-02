import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

export default function Home() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to CafeTableManager</CardTitle>
          <CardDescription>Manage your cafe tables efficiently</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {user ? (
            <>
              <p className="text-lg">Welcome back, {user.username}!</p>
              <div className="flex gap-4">
                <Button onClick={() => setLocation('/profile')}>View Profile</Button>
                <Button variant="outline" onClick={() => setLocation('/tables')}>
                  Manage Tables
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-lg">Please log in to access the table management features.</p>
              <div className="flex gap-4">
                <Button onClick={() => setLocation('/login')}>Login</Button>
                <Button variant="outline" onClick={() => setLocation('/register')}>
                  Register
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 