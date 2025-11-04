import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, User, Mail, Phone, Lock, Save, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";
import { profileSchema, changePasswordSchema, type ProfileFormData, type ChangePasswordFormData } from "@/lib/validations/auth";

export const ProfilePage = () => {
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const { user, fetchUser } = useAuth();
  const { toast } = useToast();

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    setValue: setProfileValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  useEffect(() => {
    if (user) {
      setProfileValue("name", user.name);
      setProfileValue("email", user.email);
      setProfileValue("phone", user.phone || "");
    }
  }, [user, setProfileValue]);

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsUpdatingProfile(true);

    try {
      await api.put("/user/profile", data);
      await fetchUser();
      toast({
        title: "Thành công!",
        description: "Thông tin cá nhân đã được cập nhật",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Lỗi!",
        description: error.response?.data?.message || "Không thể cập nhật thông tin",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const onPasswordSubmit = async (data: ChangePasswordFormData) => {
    setIsChangingPassword(true);

    try {
      await api.put("/user/password", data);
      resetPasswordForm();
      toast({
        title: "Thành công!",
        description: "Mật khẩu đã được thay đổi",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Lỗi!",
        description: error.response?.data?.message || "Không thể thay đổi mật khẩu",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Đang tải thông tin người dùng...</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Thông tin cá nhân</h1>
          <p className="text-muted-foreground">
            Quản lý thông tin tài khoản và bảo mật
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              Thông tin cá nhân
            </TabsTrigger>
            <TabsTrigger value="password">
              <Lock className="mr-2 h-4 w-4" />
              Đổi mật khẩu
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
                <CardDescription>
                  Cập nhật thông tin tài khoản của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      <User className="inline mr-2 h-4 w-4" />
                      Họ và tên
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Nguyễn Văn A"
                      {...registerProfile("name")}
                      disabled={isUpdatingProfile}
                    />
                    {profileErrors.name && (
                      <p className="text-sm text-destructive">
                        {profileErrors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      <Mail className="inline mr-2 h-4 w-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      {...registerProfile("email")}
                      disabled={isUpdatingProfile}
                    />
                    {profileErrors.email && (
                      <p className="text-sm text-destructive">
                        {profileErrors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      <Phone className="inline mr-2 h-4 w-4" />
                      Số điện thoại
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0123456789"
                      {...registerProfile("phone")}
                      disabled={isUpdatingProfile}
                    />
                    {profileErrors.phone && (
                      <p className="text-sm text-destructive">
                        {profileErrors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="rounded-lg border p-4 bg-muted/50">
                    <h4 className="font-medium mb-2">Thông tin tài khoản</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Vai trò: <span className="font-medium text-foreground">{user.role}</span></p>
                      <p>Ngày tạo: <span className="font-medium text-foreground">
                        {new Date(user.created_at).toLocaleDateString("vi-VN")}
                      </span></p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="w-full sm:w-auto"
                  >
                    {isUpdatingProfile ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Lưu thay đổi
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Đổi mật khẩu</CardTitle>
                <CardDescription>
                  Cập nhật mật khẩu để bảo mật tài khoản
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="current_password">Mật khẩu hiện tại</Label>
                    <Input
                      id="current_password"
                      type="password"
                      placeholder="••••••••"
                      {...registerPassword("current_password")}
                      disabled={isChangingPassword}
                    />
                    {passwordErrors.current_password && (
                      <p className="text-sm text-destructive">
                        {passwordErrors.current_password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Mật khẩu mới</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      {...registerPassword("password")}
                      disabled={isChangingPassword}
                    />
                    {passwordErrors.password && (
                      <p className="text-sm text-destructive">
                        {passwordErrors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password_confirmation">
                      Xác nhận mật khẩu mới
                    </Label>
                    <Input
                      id="password_confirmation"
                      type="password"
                      placeholder="••••••••"
                      {...registerPassword("password_confirmation")}
                      disabled={isChangingPassword}
                    />
                    {passwordErrors.password_confirmation && (
                      <p className="text-sm text-destructive">
                        {passwordErrors.password_confirmation.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isChangingPassword}
                    className="w-full sm:w-auto"
                  >
                    {isChangingPassword ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang thay đổi...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Đổi mật khẩu
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};


