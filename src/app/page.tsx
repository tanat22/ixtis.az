import LoginForm from '@/components/auth/login-form';
import { Box } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Box className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter text-foreground">
            AssetRover
          </h1>
          <p className="text-muted-foreground">
            Assetlərinizi idarə etmək üçün daxil olun
          </p>
        </div>
        <LoginForm />
        <p className="mt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} AssetRover. Bütün hüquqlar qorunur.
        </p>
      </div>
    </div>
  );
}
