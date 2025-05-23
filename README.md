# Hệ thống Phát hiện Đám Cháy từ Video

Hệ thống phát hiện đám cháy từ video sử dụng YOLOv11 (UltraLytics) và FastAPI cho back-end, React cho front-end với hệ thống xác thực người dùng và nhiều chức năng như phân tích video, quản lý tài khoản và cài đặt. Ứng dụng này tự động phát hiện đám cháy từ video được tải lên hoặc video YouTube, với kết quả xử lý được lưu trữ trên Cloudinary.

## Tính Năng

* **Xác Thực Người Dùng**: Đăng ký, đăng nhập và quản lý phiên làm việc.
* **Đường Dẫn Bảo Vệ**: Bảo mật quyền truy cập các trang, bảo vệ dữ liệu.
* **Giao Diện Phản Hồi**: Sidebar và topbar linh hoạt tương thích mọi kích thước màn hình.
* **Quản Lý Video**: Tải lên, phân tích video và xem kết quả phát hiện đám cháy.
* **Cài Đặt Tài Khoản**: Quản lý thông tin cá nhân và tùy chỉnh cài đặt người dùng.
* **Xử Lý Video Theo Thời Gian Thực**: Phát hiện và đánh dấu vùng cháy trực tiếp.
* **Lưu Trữ Cloud**: Video và kết quả được lưu trên Cloudinary, không lưu cục bộ.

## Công Nghệ Sử Dụng

* **React**: Xây dựng giao diện người dùng.
* **React Router**: Điều hướng đa trang.
* **Material-UI & Ant Design**: Thư viện UI hiện đại, tiện dụng.
* **FastAPI**: Framework Python cho API backend hiệu năng cao.
* **YOLOv11 (UltraLytics)**: Mô hình học sâu phát hiện đám cháy.
* **PostgreSQL**: Cơ sở dữ liệu lưu trữ người dùng và thông tin video.
* **Cloudinary**: Lưu trữ và quản lý media trên đám mây.

## Yêu Cầu Hệ Thống

* Python 3.8 hoặc mới hơn
* Node.js v14+ và npm
* PostgreSQL
* Tài khoản Cloudinary
* Torch/PyTorch (hỗ trợ CUDA nếu dùng GPU)

## Hướng Dẫn Cài Đặt

### 1. Clone Repository

```bash
git clone https://github.com/sinamny/fire-detection-web.git
cd fire-detection-web
```

### 2. Cài Đặt Back-end

```bash
python -m venv .venv
# Kích hoạt môi trường ảo
# Windows:
.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

cd backend
pip install -r requirements.txt

# Cài đặt yt-dlp (tải video YouTube)
python install_ytdlp.py
```

### 3. Cấu Hình Môi Trường

* Tạo file `.env` từ `.env.example`:

```bash
# Windows:
copy .env.example .env
# Linux/Mac:
cp .env.example .env
```

* Cập nhật các thông tin cần thiết trong `.env`:

  * Thông tin database PostgreSQL
  * Thông tin Cloudinary API
  * Secret key JWT
  * Cấu hình SMTP gửi email

### 4. Chuẩn Bị Model

* Đặt model YOLOv11 (`bestyolov11-27k.pt`) vào thư mục `model/`
* Hoặc cấu hình đường dẫn `MODEL_PATH` trong `.env`

### 5. Tạo Database và Admin

```bash
alembic upgrade head   # Chạy migration

python create_admin.py # Tạo tài khoản admin (nhập email, mật khẩu)
```

### 6. Khởi Động Back-end

```bash
uvicorn app.main:app --reload
```

Mặc định: [http://localhost:8000](http://localhost:8000)

---

### 7. Cài Đặt Front-end

```bash
cd frontend
npm install
npm start
```

Mặc định: [http://localhost:3000](http://localhost:3000)

---

## Cách Sử Dụng

1. Truy cập `http://localhost:3000`
2. Đăng ký hoặc đăng nhập tài khoản
3. Tải video từ máy tính hoặc nhập link YouTube để phân tích
4. Xem kết quả phát hiện đám cháy theo thời gian thực
5. Quản lý tài khoản cá nhân và cài đặt thông báo

---

## Cấu Trúc Dự Án

```
fire-detection/
├─ backend/                     # Backend
│   ├─ app/                # Mã nguồn FastAPI
│   ├─ migrations/         # Alembic migrations
│   ├─ model/              # Model YOLOv11
│   ├─ .env                # Biến môi trường
│   └─ requirements.txt    # Thư viện backend
├─ frontend/                     # Frontend
│   ├─ public/             # Tài nguyên tĩnh
│   ├─ src/                # Mã nguồn React
│   └─ package.json        # Thư viện frontend
└─ README.md               # Tài liệu dự án
```

---

## API Endpoints Chính

* **Authentication**

  * POST `/api/v1/auth/login-email` — Đăng nhập bằng email
  * POST `/api/v1/auth/register` — Đăng ký tài khoản
  * POST `/api/v1/auth/change-password` — Đổi mật khẩu

* **Users**

  * GET `/api/v1/users/me` — Thông tin người dùng hiện tại
  * PUT `/api/v1/users/me` — Cập nhật thông tin người dùng

* **Videos**

  * GET `/api/v1/videos` — Danh sách video của người dùng
  * GET `/api/v1/videos/{video_id}` — Thông tin chi tiết video
  * DELETE `/api/v1/videos/{video_id}` — Xóa video

* **Notifications**

  * GET `/api/v1/notifications` — Danh sách thông báo
  * POST `/api/v1/notifications/settings` — Cập nhật cài đặt thông báo

* **User History**

  * GET `/api/v1/history/me` — Lịch sử hoạt động người dùng

* **WebSocket**

  * WS `/ws/videos/{video_id}` — Streaming kết quả video thời gian thực

---

## Lưu trữ Media

* Video và ảnh được lưu trực tiếp trên Cloudinary.
* Không lưu trữ cục bộ, chỉ dùng thư mục tạm khi xử lý.
* Tự động xóa file tạm sau khi hoàn tất.

