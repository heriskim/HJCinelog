import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // 이미지 최대 10MB 스펙을 base64로 인코딩하면 약 13.3MB가 되므로,
    // Proxy의 기본 요청 본문 제한(10MB)보다 여유 있게 설정한다.
    proxyClientMaxBodySize: "16mb",
  },
};

export default nextConfig;
