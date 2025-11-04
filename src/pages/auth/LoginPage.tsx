import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const LoginPage = () => {
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Đăng nhập</CardTitle>
          <CardDescription>Đăng nhập vào tài khoản của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Login form will be implemented in Phase 2</p>
        </CardContent>
      </Card>
    </div>
  );
};

