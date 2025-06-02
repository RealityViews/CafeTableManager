import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-lg mb-8">Page not found</p>
      <Button onClick={() => setLocation('/')}>Go Home</Button>
    </div>
  );
} 