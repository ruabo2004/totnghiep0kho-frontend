import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const SellerDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Sản phẩm</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0đ</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Lượt xem</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

