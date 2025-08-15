# Trước khi đọc

-   Hãy cài đặt những môi trường cần thiết trong [INSTALLATION.md](./INSTALLATION.md) để tiếp tục
-   Ngôn ngữ lập trình chủ đạo là `Typescript`

# SUPPLIERFE (Frontend)

## NHỮNG THƯ VIỆN ĐƯỢC SỬ DỤNG

-   [Vite - ReactJS](https://vite.dev/guide/): Framework Javascript cho lập trình website
-   [Mantine.dev](https://mantine.dev/): Thư viện đa dạng hooks và components hỗ trợ validate form, triển khai UI dễ dàng và nhanh chóng (Dùng nhiều nhất)
-   [Ant.design](https://ant.design/): Thư viện với nhiều components đẹp, đa dạng, cải thiện trải nghiệm người dùng (chỉ dùng khi Mantine không có component hỗ trợ)
-   [@tanstack-query](https://tanstack.com/router/latest/docs/framework/react/routing/routing-concepts): Quản lý Router cho dự án

## CẤU TRÚC THƯ MỤC

-   **public/**: Tài nguyên tĩnh (ảnh, font, robots.txt...)
-   **/assets/**: Ảnh, font, logo
-   **/components/**: Các component React dùng lại nhiều nơi
-   **/pages/**: Các trang chính của ứng dụng
-   **/layouts/**: Layout tổng thể, header, main layout
-   **/hooks/**: Custom hooks cho logic
-   **/utils/**: Hàm tiện ích, xử lý
-   **/config/**: Cấu hình axios, chart,...
-   **/constants/**: Các giá trị cố định
-   **/interfaces/**: Định nghĩa kiểu dữ liệu (TypeScript)
-   **/routes/**: Định nghĩa các route React
-   **/contexts/**: React context cho state toàn cục
-   **/providers/**: Provider cho context, query, v.v.

---

# SUPPLIERBE (Backend)

## NHỮNG THƯ VIỆN ĐƯỢC SỬ DỤNG

-   [ElysiaJS](https://elysiajs.com/): Framework của BUN, tương tự với ExpressJS nhưng với sự tối ưu hóa của BUN nên các request được gọi và thực hiện nhanh hơn, nhiều plugins tích hợp giúp cảu thiện tối đa bảo mật và hiệu năng
-   [TypeORM](https://typeorm.io/docs/entity/entities): Thư viện giúp thực hiện các truy vấn với SQL, mySQL,... một cách dễ dàng, dễ bảo trì

## CẤU TRÚC THƯ MỤC

-   **FEBuild/**: Build FE để serve từ BE (nếu có)
-   **public/**: Tài nguyên tĩnh
-   **/controllers/**: Xử lý logic cho các API endpoint
-   **/models/**: Định nghĩa các entity, bảng dữ liệu
-   **/routes/**: Định nghĩa các route cho API
-   **/services/**: Các service như gửi mail, xử lý nghiệp vụ
-   **/middlewares/**: Middleware xác thực, kiểm tra request
-   **/sql/**: Cấu hình kết nối database
-   **/templates/**: Template email, file xuất
-   **/utils/**: Hàm tiện ích cho BE
-   **/constants/**: Các giá trị cố định, config
-   **/interfaces/**: Định nghĩa kiểu dữ liệu

---
