import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { sellerService, type CommissionHistory } from '@/services/sellerService';
import { formatCurrency, formatDate } from '@/utils/format';

export default function CommissionsPage() {
  const [commissions, setCommissions] = useState<CommissionHistory[]>([]);
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [commissionsData, balanceData] = await Promise.all([
        sellerService.getCommissions(),
        sellerService.getCommissionBalance(),
      ]);
      setCommissions(commissionsData.data);
      setBalance(balanceData.balance || 0);
    } catch (error) {
      console.error('Failed to fetch commissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'paid' ? (
      <Badge variant="default">Đã trả</Badge>
    ) : (
      <Badge variant="secondary">Chờ xử lý</Badge>
    );
  };

  const totalEarned = commissions
    .filter((c) => c.status === 'paid')
    .reduce((sum, c) => sum + c.commission_amount, 0);

  if (isLoading) {
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Hoa hồng</h1>
        <p className="text-gray-600">Theo dõi hoa hồng từ bán hàng</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Số dư khả dụng
            </CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(balance)}
            </div>
            <p className="text-xs text-gray-600 mt-2">Có thể rút về tài khoản</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Tổng đã nhận
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalEarned)}</div>
            <p className="text-xs text-gray-600 mt-2">Tổng hoa hồng đã được trả</p>
          </CardContent>
        </Card>
      </div>

      {/* Commission History */}
      {commissions.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-600">Chưa có hoa hồng nào</p>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn</TableHead>
                <TableHead>Tổng đơn</TableHead>
                <TableHead>Tỷ lệ HH</TableHead>
                <TableHead>Hoa hồng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commissions.map((commission) => (
                <TableRow key={commission.id}>
                  <TableCell className="font-medium">
                    {commission.order?.order_code || `#${commission.order_id}`}
                  </TableCell>
                  <TableCell>{formatCurrency(commission.amount)}</TableCell>
                  <TableCell>{commission.commission_rate}%</TableCell>
                  <TableCell className="font-semibold text-green-600">
                    {formatCurrency(commission.commission_amount)}
                  </TableCell>
                  <TableCell>{getStatusBadge(commission.status)}</TableCell>
                  <TableCell>{formatDate(commission.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}

