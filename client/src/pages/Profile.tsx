import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

export default function Profile() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  if (!user) {
    setLocation('/login');
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium">Username</h3>
            <p className="text-lg">{user.username}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Email</h3>
            <p className="text-lg">{user.email}</p>
          </div>
          <Button variant="outline" onClick={() => setLocation('/')}>
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 