import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { sellerService, type SellerWithdrawal, type WithdrawalRequest } from '@/services/sellerService';
import { formatCurrency, formatDate } from '@/utils/format';

export default function WithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<SellerWithdrawal[]>([]);
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<WithdrawalRequest>({
    amount: 0,
    bank_name: '',
    bank_account_number: '',
    bank_account_name: '',
    note: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [withdrawalsData, balanceData] = await Promise.all([
        sellerService.getWithdrawals(),
        sellerService.getCommissionBalance(),
      ]);
      setWithdrawals(withdrawalsData.data);
      setBalance(balanceData.balance || 0);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.amount > balance) {
      setError('Số tiền rút không được vượt quá số dư khả dụng');
      return;
    }

    if (formData.amount < 100000) {
      setError('Số tiền rút tối thiểu là 100,000đ');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await sellerService.createWithdrawal(formData);
      await fetchData();
      setDialogOpen(false);
      setFormData({
        amount: 0,
        bank_name: '',
        bank_account_number: '',
        bank_account_name: '',
        note: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tạo yêu cầu rút tiền');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default">Đã duyệt</Badge>;
      case 'pending':
        return <Badge variant="secondary">Chờ duyệt</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Bị từ chối</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Rút tiền</h1>
          <p className="text-gray-600">Quản lý yêu cầu rút tiền của bạn</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} disabled={balance < 100000}>
          <Plus className="w-4 h-4 mr-2" />
          Tạo yêu cầu rút tiền
        </Button>
      </div>

      {/* Balance */}
      <Card className="p-6">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Số dư khả dụng</p>
          <p className="text-4xl font-bold text-green-600">
            {formatCurrency(balance)}
          </p>
          <p className="text-xs text-gray-500 mt-2">Số tiền rút tối thiểu: 100,000đ</p>
        </div>
      </Card>

      {/* Withdrawals Table */}
      {withdrawals.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-600">Chưa có yêu cầu rút tiền nào</p>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Số tiền</TableHead>
                <TableHead>Ngân hàng</TableHead>
                <TableHead>Số tài khoản</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Ghi chú</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawals.map((withdrawal) => (
                <TableRow key={withdrawal.id}>
                  <TableCell className="font-semibold text-green-600">
                    {formatCurrency(withdrawal.amount)}
                  </TableCell>
                  <TableCell>{withdrawal.bank_name}</TableCell>
                  <TableCell>{withdrawal.bank_account_number}</TableCell>
                  <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
                  <TableCell>{formatDate(withdrawal.created_at)}</TableCell>
                  <TableCell>
                    {withdrawal.admin_note && (
                      <p className="text-sm text-gray-600">{withdrawal.admin_note}</p>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Create Withdrawal Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tạo yêu cầu rút tiền</DialogTitle>
            <DialogDescription>
              Nhập thông tin tài khoản ngân hàng để nhận tiền
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="amount">Số tiền rút (VNĐ) *</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount || ''}
                onChange={(e) =>
                  setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })
                }
                placeholder="100000"
                min={100000}
                max={balance}
                required
              />
              <p className="text-xs text-gray-500">
                Số dư: {formatCurrency(balance)}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bank_name">Tên ngân hàng *</Label>
              <Input
                id="bank_name"
                value={formData.bank_name}
                onChange={(e) =>
                  setFormData({ ...formData, bank_name: e.target.value })
                }
                placeholder="VD: Vietcombank"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bank_account_number">Số tài khoản *</Label>
              <Input
                id="bank_account_number"
                value={formData.bank_account_number}
                onChange={(e) =>
                  setFormData({ ...formData, bank_account_number: e.target.value })
                }
                placeholder="0123456789"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bank_account_name">Tên chủ tài khoản *</Label>
              <Input
                id="bank_account_name"
                value={formData.bank_account_name}
                onChange={(e) =>
                  setFormData({ ...formData, bank_account_name: e.target.value })
                }
                placeholder="NGUYEN VAN A"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Ghi chú (Tùy chọn)</Label>
              <Input
                id="note"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder="Ghi chú thêm..."
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Đang xử lý...' : 'Tạo yêu cầu'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

