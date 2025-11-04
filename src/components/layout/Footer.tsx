import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">TotNghiep0Kho</h3>
            <p className="text-sm text-muted-foreground">
              Nền tảng mua bán tài liệu học tập chất lượng cao, hỗ trợ sinh viên
              trong suốt quá trình học tập.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Liên kết</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="text-muted-foreground hover:text-foreground">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-muted-foreground hover:text-foreground">
                  Danh mục
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-lg mb-4">Hỗ trợ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/help" className="text-muted-foreground hover:text-foreground">
                  Trung tâm trợ giúp
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground">
                  Điều khoản
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">Liên hệ</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Email: support@totnghiep0kho.com</p>
              <p>Phone: +84 123 456 789</p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="hover:text-foreground">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-foreground">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-foreground">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-foreground">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2024 TotNghiep0Kho. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};



