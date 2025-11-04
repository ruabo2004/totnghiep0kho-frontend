import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2, Star, Edit, Trash2, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { reviewService } from "@/services/reviewService";
import type { Review } from "@/types/models.types";

export const ReviewsPage = () => {
  const { toast } = useToast();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await reviewService.getMyReviews();
      setReviews(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải danh sách đánh giá");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa đánh giá này?")) {
      return;
    }

    setDeletingId(reviewId);

    try {
      await reviewService.deleteReview(reviewId);
      setReviews(reviews.filter((review) => review.id !== reviewId));
      toast({
        title: "Đã xóa đánh giá!",
        description: "Đánh giá đã được xóa thành công",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Lỗi!",
        description: error.response?.data?.message || "Không thể xóa đánh giá",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      pending: { variant: "secondary", label: "Chờ duyệt" },
      approved: { variant: "default", label: "Đã duyệt" },
      rejected: { variant: "destructive", label: "Bị từ chối" },
    };

    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Đánh giá của tôi</h1>
          <p className="text-muted-foreground">{reviews.length} đánh giá</p>
        </div>
      </div>

      {/* Empty State */}
      {reviews.length === 0 ? (
        <Card className="py-16">
          <CardContent className="text-center">
            <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Chưa có đánh giá nào</h3>
            <p className="text-muted-foreground mb-6">
              Hãy mua sản phẩm và để lại đánh giá của bạn
            </p>
            <Button asChild>
              <Link to="/products">Khám phá sản phẩm</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {review.product && (
                      <Link
                        to={`/products/${review.product.slug}`}
                        className="font-semibold hover:text-primary line-clamp-1"
                      >
                        {review.product.name}
                      </Link>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(review.created_at)}
                      </span>
                    </div>
                  </div>
                  {getStatusBadge(review.status)}
                </div>
              </CardHeader>
              <CardContent>
                {/* Review Content */}
                <p className="text-sm mb-4">{review.comment}</p>

                {/* Product Image */}
                {review.product && (
                  <div className="flex gap-3 mb-4">
                    <Link to={`/products/${review.product.slug}`}>
                      <img
                        src={review.product.thumbnail || "/placeholder-product.png"}
                        alt={review.product.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link
                        to={`/products/${review.product.slug}`}
                        className="text-sm font-medium hover:text-primary line-clamp-2"
                      >
                        {review.product.name}
                      </Link>
                      <p className="text-sm text-primary font-semibold mt-1">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(review.product.price)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  {review.status === "pending" && (
                    <Button size="sm" variant="outline" disabled>
                      <Edit className="h-4 w-4 mr-2" />
                      Chỉnh sửa (coming soon)
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteReview(review.id)}
                    disabled={deletingId === review.id}
                  >
                    {deletingId === review.id ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 mr-2" />
                    )}
                    Xóa
                  </Button>
                </div>

                {/* Rejection Reason */}
                {review.status === "rejected" && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertDescription className="text-xs">
                      Đánh giá này đã bị từ chối do vi phạm chính sách của chúng tôi
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};


