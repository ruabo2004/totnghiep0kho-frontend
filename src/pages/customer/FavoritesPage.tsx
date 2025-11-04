import { useState, useEffect } from "react";
import { Loader2, Heart, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProductCard } from "@/components/product/ProductCard";
import { useToast } from "@/hooks/use-toast";
import { favoriteService } from "@/services/favoriteService";
import { cartService } from "@/services/cartService";
import type { Favorite } from "@/types/models.types";

export const FavoritesPage = () => {
  const { toast } = useToast();

  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await favoriteService.getFavorites();
      setFavorites(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải danh sách yêu thích");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavorite = async (favoriteId: number, productName: string) => {
    setRemovingId(favoriteId);

    try {
      await favoriteService.removeFavorite(favoriteId);
      setFavorites(favorites.filter((fav) => fav.id !== favoriteId));
      toast({
        title: "Đã xóa khỏi yêu thích!",
        description: `${productName} đã được xóa khỏi danh sách yêu thích`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Lỗi!",
        description: error.response?.data?.message || "Không thể xóa khỏi yêu thích",
      });
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = async (favoriteId: number, productId: number) => {
    try {
      await cartService.addToCart(productId);
      
      await favoriteService.removeFavorite(favoriteId);
      setFavorites(favorites.filter((fav) => fav.id !== favoriteId));
      
      toast({
        title: "Đã thêm vào giỏ hàng!",
        description: "Sản phẩm đã được thêm vào giỏ hàng và xóa khỏi yêu thích",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Lỗi!",
        description: error.response?.data?.message || "Không thể thêm vào giỏ hàng",
      });
    }
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
      <div className="flex items-center gap-3 mb-6">
        <Heart className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Danh sách yêu thích</h1>
          <p className="text-muted-foreground">
            {favorites.length} sản phẩm yêu thích
          </p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <Card className="py-16">
          <CardContent className="text-center">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Chưa có sản phẩm yêu thích
            </h3>
            <p className="text-muted-foreground mb-6">
              Hãy thêm sản phẩm vào danh sách yêu thích để dễ dàng theo dõi
            </p>
            <Button asChild>
              <a href="/products">Khám phá sản phẩm</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((favorite) => (
            <div key={favorite.id} className="relative">
              {favorite.product && (
                <>
                  <ProductCard
                    product={favorite.product}
                    onAddToCart={() =>
                      handleAddToCart(favorite.id, favorite.product_id)
                    }
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 z-10"
                    onClick={() =>
                      handleRemoveFavorite(favorite.id, favorite.product!.name)
                    }
                    disabled={removingId === favorite.id}
                  >
                    {removingId === favorite.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

