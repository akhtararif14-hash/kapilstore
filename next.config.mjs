/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["next-auth", "nodemailer"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
