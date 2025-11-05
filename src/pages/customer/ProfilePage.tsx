import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, Save, Lock, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/authService';
import {
  updateProfileSchema,
  changePasswordSchema,
  type UpdateProfileFormData,
  type ChangePasswordFormData,
} from '@/lib/validations/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ProfilePage() {
  const { user, fetchUser } = useAuth();
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    setValue: setProfileValue,
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name,
      phone: user?.phone || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileValue('avatar', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmitProfile = async (data: UpdateProfileFormData) => {
    try {
      setIsLoadingProfile(true);
      setProfileError(null);
      setProfileSuccess(null);

      await authService.updateProfile(data);
      await fetchUser();

      setProfileSuccess('Cập nhật thông tin thành công!');
      setAvatarPreview(null);

      setTimeout(() => setProfileSuccess(null), 3000);
    } catch (err: any) {
      setProfileError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const onSubmitPassword = async (data: ChangePasswordFormData) => {
    try {
      setIsLoadingPassword(true);
      setPasswordError(null);
      setPasswordSuccess(null);

      await authService.changePassword(data);

      setPasswordSuccess('Đổi mật khẩu thành công!');
      resetPasswordForm();

      setTimeout(() => setPasswordSuccess(null), 3000);
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoadingPassword(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Đang tải...</p>
      </div>
    );
  }

  const avatarUrl = avatarPreview || user.avatar || '';
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Thông tin cá nhân</h1>
        <p className="text-gray-600">Quản lý thông tin tài khoản của bạn</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">
            <UserIcon className="w-4 h-4 mr-2" />
            Thông tin cá nhân
          </TabsTrigger>
          <TabsTrigger value="password">
            <Lock className="w-4 h-4 mr-2" />
            Đổi mật khẩu
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Cập nhật thông tin</CardTitle>
              <CardDescription>
                Cập nhật ảnh đại diện và thông tin cá nhân của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-6">
                {profileSuccess && (
                  <Alert className="bg-green-50 text-green-900 border-green-200">
                    <AlertDescription>{profileSuccess}</AlertDescription>
                  </Alert>
                )}

                {profileError && (
                  <Alert variant="destructive">
                    <AlertDescription>{profileError}</AlertDescription>
                  </Alert>
                )}

                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={avatarUrl} alt={user.name} />
                      <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                    </Avatar>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    Click vào biểu tượng camera để thay đổi ảnh đại diện
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Họ và tên</Label>
                  <Input
                    id="name"
                    {...registerProfile('name')}
                    disabled={isLoadingProfile}
                  />
                  {profileErrors.name && (
                    <p className="text-sm text-red-500">{profileErrors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user.email} disabled className="bg-gray-50" />
                  <p className="text-xs text-gray-500">Email không thể thay đổi</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    {...registerProfile('phone')}
                    disabled={isLoadingProfile}
                  />
                  {profileErrors.phone && (
                    <p className="text-sm text-red-500">{profileErrors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Vai trò</Label>
                  <Input
                    value={
                      user.role === 'admin'
                        ? 'Quản trị viên'
                        : user.role === 'seller'
                        ? 'Người bán'
                        : 'Khách hàng'
                    }
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <Button type="submit" disabled={isLoadingProfile} className="w-full">
                  {isLoadingProfile ? (
                    <>
                      <span className="mr-2">Đang lưu...</span>
                      <span className="animate-spin">⏳</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
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
                Cập nhật mật khẩu để bảo mật tài khoản của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-6">
                {passwordSuccess && (
                  <Alert className="bg-green-50 text-green-900 border-green-200">
                    <AlertDescription>{passwordSuccess}</AlertDescription>
                  </Alert>
                )}

                {passwordError && (
                  <Alert variant="destructive">
                    <AlertDescription>{passwordError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="current_password">Mật khẩu hiện tại</Label>
                  <Input
                    id="current_password"
                    type="password"
                    {...registerPassword('current_password')}
                    disabled={isLoadingPassword}
                  />
                  {passwordErrors.current_password && (
                    <p className="text-sm text-red-500">
                      {passwordErrors.current_password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu mới</Label>
                  <Input
                    id="password"
                    type="password"
                    {...registerPassword('password')}
                    disabled={isLoadingPassword}
                  />
                  {passwordErrors.password && (
                    <p className="text-sm text-red-500">{passwordErrors.password.message}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password_confirmation">Xác nhận mật khẩu mới</Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    {...registerPassword('password_confirmation')}
                    disabled={isLoadingPassword}
                  />
                  {passwordErrors.password_confirmation && (
                    <p className="text-sm text-red-500">
                      {passwordErrors.password_confirmation.message}
                    </p>
                  )}
                </div>

                <Button type="submit" disabled={isLoadingPassword} className="w-full">
                  {isLoadingPassword ? (
                    <>
                      <span className="mr-2">Đang xử lý...</span>
                      <span className="animate-spin">⏳</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
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
  );
}
