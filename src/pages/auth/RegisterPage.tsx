import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const RegisterPage = () => {
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Đăng ký</CardTitle>
          <CardDescription>Tạo tài khoản mới</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Register form will be implemented in Phase 2</p>
        </CardContent>
      </Card>
    </div>
  );
};

