import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import FileUploader from '@/components/common/FileUploader';
import { sellerService, type ProductFormData as APIProductFormData } from '@/services/sellerService';
import { categoryService } from '@/services/productService';
import { productSchema, type ProductFormData } from '@/lib/validations/product';
import type { Category } from '@/types/models.types';

export default function ProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingProduct, setIsFetchingProduct] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [productFile, setProductFile] = useState<File | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      content: '',
      price: 0,
      category_id: 0,
    },
  });

  useEffect(() => {
    fetchCategories();
    if (isEdit && id) {
      fetchProduct(parseInt(id));
    }
  }, [id, isEdit]);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProduct = async (productId: number) => {
    try {
      setIsFetchingProduct(true);
      const product = await sellerService.getMyProduct(productId);
      setValue('name', product.name);
      setValue('description', product.description);
      setValue('content', product.content);
      setValue('price', product.price);
      setValue('category_id', product.category_id);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Không thể tải thông tin sản phẩm');
    } finally {
      setIsFetchingProduct(false);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const formData: APIProductFormData = {
        name: data.name,
        description: data.description,
        content: data.content,
        price: data.price,
        category_id: data.category_id,
        thumbnail,
        images,
        product_file: productFile,
        preview_file: previewFile,
      };

      if (isEdit && id) {
        await sellerService.updateProduct(parseInt(id), formData);
      } else {
        await sellerService.createProduct(formData);
      }

      navigate('/seller/products');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingProduct) {
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
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/seller/products')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </h1>
          <p className="text-gray-600">
            {isEdit ? 'Cập nhật thông tin sản phẩm' : 'Điền thông tin để thêm sản phẩm mới'}
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên sản phẩm *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="VD: Giáo trình Lập trình C++"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category_id">Danh mục *</Label>
              <select
                id="category_id"
                {...register('category_id', { valueAsNumber: true })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                disabled={isLoading}
              >
                <option value={0}>Chọn danh mục</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="text-sm text-red-500">{errors.category_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Giá bán (VNĐ) *</Label>
              <Input
                id="price"
                type="number"
                {...register('price', { valueAsNumber: true })}
                placeholder="50000"
                disabled={isLoading}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả ngắn *</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Mô tả ngắn gọn về sản phẩm..."
                rows={3}
                disabled={isLoading}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Nội dung chi tiết *</Label>
              <Textarea
                id="content"
                {...register('content')}
                placeholder="Nội dung chi tiết về sản phẩm, bao gồm những gì khách hàng sẽ nhận được..."
                rows={6}
                disabled={isLoading}
              />
              {errors.content && (
                <p className="text-sm text-red-500">{errors.content.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Hình ảnh</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FileUploader
              label="Ảnh đại diện *"
              accept="image/*"
              maxSize={5}
              value={thumbnail}
              onChange={(file) => setThumbnail(file as File)}
              preview
            />

            <FileUploader
              label="Ảnh mô tả thêm (Tối đa 5 ảnh)"
              accept="image/*"
              multiple
              maxSize={5}
              value={images}
              onChange={(files) => setImages(files as File[])}
              preview
            />
          </CardContent>
        </Card>

        {/* Files */}
        <Card>
          <CardHeader>
            <CardTitle>Tài liệu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FileUploader
              label="File sản phẩm chính * (PDF, DOC, ZIP, RAR...)"
              accept=".pdf,.doc,.docx,.zip,.rar,.ppt,.pptx,.xls,.xlsx"
              maxSize={50}
              value={productFile}
              onChange={(file) => setProductFile(file as File)}
            />

            <FileUploader
              label="File xem trước (Tùy chọn)"
              accept=".pdf,.doc,.docx"
              maxSize={10}
              value={previewFile}
              onChange={(file) => setPreviewFile(file as File)}
            />
            <p className="text-sm text-gray-600">
              File xem trước giúp khách hàng xem thử trước khi mua
            </p>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/seller/products')}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="mr-2">Đang xử lý...</span>
                <span className="animate-spin">⏳</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isEdit ? 'Cập nhật' : 'Thêm sản phẩm'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

