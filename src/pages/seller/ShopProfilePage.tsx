import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Save, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { sellerService } from '@/services/sellerService';

interface ShopProfileForm {
  shop_name: string;
  shop_description: string;
  bank_name: string;
  bank_account_number: string;
  bank_account_name: string;
}

export default function ShopProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ShopProfileForm>();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsFetching(true);
      const data = await sellerService.getShopProfile();
      setValue('shop_name', data.shop_name || '');
      setValue('shop_description', data.shop_description || '');
      setValue('bank_name', data.bank_name || '');
      setValue('bank_account_number', data.bank_account_number || '');
      setValue('bank_account_name', data.bank_account_name || '');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Không thể tải thông tin cửa hàng');
    } finally {
      setIsFetching(false);
    }
  };

  const onSubmit = async (data: ShopProfileForm) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      await sellerService.updateShopProfile(data);
      setSuccess('Cập nhật thông tin cửa hàng thành công!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Store className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Hồ sơ cửa hàng</h1>
          <p className="text-gray-600">Cập nhật thông tin cửa hàng và tài khoản ngân hàng</p>
        </div>
      </div>

      {success && (
        <Alert className="bg-green-50 text-green-900 border-green-200">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Shop Info */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cửa hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shop_name">Tên cửa hàng</Label>
              <Input
                id="shop_name"
                {...register('shop_name')}
                placeholder="VD: Cửa hàng tài liệu ABC"
                disabled={isLoading}
              />
              {errors.shop_name && (
                <p className="text-sm text-red-500">{errors.shop_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="shop_description">Mô tả cửa hàng</Label>
              <Textarea
                id="shop_description"
                {...register('shop_description')}
                placeholder="Giới thiệu về cửa hàng của bạn..."
                rows={4}
                disabled={isLoading}
              />
              {errors.shop_description && (
                <p className="text-sm text-red-500">{errors.shop_description.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bank Info */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin ngân hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Thông tin này được sử dụng để nhận tiền khi bạn yêu cầu rút tiền
            </p>

            <div className="space-y-2">
              <Label htmlFor="bank_name">Tên ngân hàng</Label>
              <Input
                id="bank_name"
                {...register('bank_name')}
                placeholder="VD: Vietcombank, Techcombank"
                disabled={isLoading}
              />
              {errors.bank_name && (
                <p className="text-sm text-red-500">{errors.bank_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bank_account_number">Số tài khoản</Label>
              <Input
                id="bank_account_number"
                {...register('bank_account_number')}
                placeholder="0123456789"
                disabled={isLoading}
              />
              {errors.bank_account_number && (
                <p className="text-sm text-red-500">{errors.bank_account_number.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bank_account_name">Tên chủ tài khoản</Label>
              <Input
                id="bank_account_name"
                {...register('bank_account_name')}
                placeholder="NGUYEN VAN A"
                disabled={isLoading}
              />
              {errors.bank_account_name && (
                <p className="text-sm text-red-500">{errors.bank_account_name.message}</p>
              )}
              <p className="text-xs text-gray-500">
                Nhập tên chủ tài khoản viết hoa, không dấu
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
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
        </div>
      </form>
    </div>
  );
}

