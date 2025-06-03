# Sử dụng một image Node.js làm base
FROM node:lts

# Đặt thư mục làm việc trong container
WORKDIR /app

# Copy package.json và package-lock.json (hoặc yarn.lock)
# để cài đặt dependencies
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ mã nguồn ứng dụng
COPY . .

# Build ứng dụng NestJS (nếu sử dụng TypeScript)
RUN npm run build

# Mở port mà ứng dụng NestJS lắng nghe
# Sử dụng biến môi trường PORT từ .env (qua docker-compose)
EXPOSE ${PORT:-3000}

# Lệnh để chạy ứng dụng khi container khởi động
# Thay đổi nếu điểm vào ứng dụng của bạn khác
CMD [ "node", "dist/main" ]