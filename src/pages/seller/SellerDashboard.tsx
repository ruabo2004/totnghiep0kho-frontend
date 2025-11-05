import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  DollarSign,
  ShoppingCart,
  Eye,
  TrendingUp,
  AlertCircle,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { sellerService, type SellerStats } from '@/services/sellerService';
import { formatCurrency } from '@/utils/format';

export const SellerDashboard = () => {
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await sellerService.getStats();
      setStats(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải thống kê');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Chào mừng trở lại, quản lý cửa hàng của bạn</p>
        </div>
        <Link to="/seller/products/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Thêm sản phẩm mới
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Tổng sản phẩm
            </CardTitle>
            <Package className="w-4 h-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_products || 0}</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="default" className="text-xs">
                {stats?.active_products || 0} Hoạt động
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {stats?.pending_products || 0} Chờ duyệt
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Doanh thu
            </CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats?.total_revenue || 0)}
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Số dư khả dụng: {formatCurrency(stats?.commission_balance || 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Đơn hàng
            </CardTitle>
            <ShoppingCart className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_orders || 0}</div>
            <div className="flex items-center text-xs text-green-600 mt-2">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>Tổng đơn hàng thành công</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Lượt xem
            </CardTitle>
            <Eye className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_views || 0}</div>
            <p className="text-xs text-gray-600 mt-2">Tổng lượt xem sản phẩm</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link to="/seller/products">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Quản lý sản phẩm</span>
                <ArrowRight className="w-5 h-5" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Xem, thêm, sửa, xóa sản phẩm của bạn
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link to="/seller/orders">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Đơn hàng</span>
                <ArrowRight className="w-5 h-5" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Xem danh sách đơn hàng của bạn
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link to="/seller/commissions">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Hoa hồng</span>
                <ArrowRight className="w-5 h-5" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Theo dõi hoa hồng từ bán hàng
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link to="/seller/withdrawals">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Rút tiền</span>
                <ArrowRight className="w-5 h-5" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Yêu cầu rút tiền về tài khoản ngân hàng
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link to="/seller/profile">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Hồ sơ cửa hàng</span>
                <ArrowRight className="w-5 h-5" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Cập nhật thông tin cửa hàng
              </p>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Tips */}
      {stats?.pending_products && stats.pending_products > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Bạn có {stats.pending_products} sản phẩm đang chờ duyệt. Vui lòng chờ admin phê duyệt.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};



