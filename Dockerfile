# Sử dụng image Node.js chính thức
FROM node:lts

# Đặt thư mục làm việc
WORKDIR /app

# Copy file package.json và package-lock.json trước để cache npm install
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ mã nguồn vào container
COPY . .

# Build NestJS (nếu dùng TypeScript)
RUN npm run build

# Mở port (mặc định 3000, có thể override bằng biến môi trường)
EXPOSE 3000

# Lệnh chạy ứng dụng
CMD ["node", "dist/main"]
