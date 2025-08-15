# CÀI ĐẶT MÔI TRƯỜNG

## Yêu cầu hệ thống

-   Node.js (khuyến nghị phiên bản mới nhất)
-   Bun (https://bun.sh/)
-   SQL Server (hoặc kết nối tới database từ xa)

---

## Thiết lập môi trường DEVELOPMENT

### 1. SUPPLIERFE (Frontend)

-   Di chuyển vào thư mục `SupplierFE`:

    ```bash
    cd SupplierFE
    ```

-   Cài đặt thư viện:

    ```bash
    bun install
    ```

-   Chuẩn bị file `.env`:

    -   Tạo file `.env` dựa trên mẫu `.env.example` hoặc điền đầy đủ các biến môi trường cần thiết.
    -   Nếu có script tạo file env, chạy:
        ```bash
        bun run env
        ```

-   Khởi động dự án FE:
    ```bash
    bun run dev
    ```

---

### 2. SUPPLIERBE (Backend)

-   Di chuyển vào thư mục `SupplierBE`:

    ```bash
    cd SupplierBE
    ```

-   Cài đặt thư viện:

    ```bash
    bun install
    ```

-   Chuẩn bị file `.env` theo `.env.example`:

    -   Đảm bảo các biến kết nối database (SQL_HOST, SQL_PORT, SQL_USERNAME, SQL_PASSWORD, SQL_DB) đã được điền đầy đủ.

-   Khởi động dự án BE:
    ```bash
    bun run dev
    ```

---

## Thiết lập môi trường PRODUCTION

-   Thiết lập file `.env` cho cả `SupplierFE` và `SupplierBE` y trên phần Development

-   Di chuyển vào thư mục `/SupplierBE`

```bash
cd SupplierBE
```

-   Build FE: Chạy lệnh

```bash
bun run build:fe
```

-   Sau khi build xong, chạy production

```bash
bun start
```

## Lưu ý

-   Nếu gặp lỗi kết nối database, kiểm tra lại file `.env` và cấu hình trong `src/sql/config.ts`.
-   Đảm bảo đã cài đặt Bun và Node đúng phiên bản.
-   Nếu gặp lỗi về entity TypeORM, kiểm tra lại các entity đã được import và khai báo trong cấu hình DataSource.

---
