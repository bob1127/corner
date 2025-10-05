import { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/router";

export const CartIcon = ({ fill = "black", size, height, width, ...props }) => (
  <svg
    fill={fill}
    height={size || height || 24}
    viewBox="0 0 24 24"
    width={size || width || 24}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3 3h2l3.6 9.59A2 2 0 0 0 10.5 14H17a2 2 0 0 0 1.9-1.42L21 7H6"
      stroke={fill}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
    <circle cx="9" cy="19" r="1" stroke={fill} strokeWidth={1.5} />
    <circle cx="17" cy="19" r="1" stroke={fill} strokeWidth={1.5} />
  </svg>
);

export const FacebookIcon = ({
  fill = "black",
  size,
  height,
  width,
  ...props
}) => (
  <svg
    fill={fill}
    height={size || height || 24}
    viewBox="0 0 24 24"
    width={size || width || 24}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M22 12.07C22 6.52 17.52 2 12 2S2 6.52 2 12.07c0 4.99 3.64 9.12 8.39 9.93v-7.02H8.07v-2.91h2.32v-2.22c0-2.3 1.39-3.56 3.48-3.56.99 0 2.02.18 2.02.18v2.2H14.9c-1.26 0-1.65.79-1.65 1.6v1.8h2.81l-.45 2.91h-2.36v7.02C18.36 21.2 22 17.06 22 12.07Z"
      stroke={fill}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
  </svg>
);

export const InstagramIcon = ({
  fill = "black",
  size,
  height,
  width,
  ...props
}) => (
  <svg
    fill="none"
    height={size || height || 24}
    width={size || width || 24}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      x="2"
      y="2"
      width="20"
      height="20"
      rx="5"
      stroke={fill}
      strokeWidth={1.5}
    />
    <circle cx="12" cy="12" r="4" stroke={fill} strokeWidth={1.5} />
    <circle cx="18" cy="6" r="1.5" fill={fill} />
  </svg>
);

export const LineIcon = ({ fill = "black", size, height, width, ...props }) => (
  <svg
    fill="none"
    height={size || height || 24}
    width={size || width || 24}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3 11.5c0 4.69 4.7 8.5 10 8.5 1.5 0 2.92-.24 4.18-.66.39-.13.83-.07 1.14.21l2.22 1.99c.58.52 1.5.11 1.5-.67v-3.37c0-.33.2-.62.49-.77C23.21 15.44 24 13.58 24 11.5 24 6.81 19.3 3 14 3S3 6.81 3 11.5Z"
      stroke={fill}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const UserIcon = ({ fill = "black", size, height, width, ...props }) => (
  <svg
    fill={fill}
    height={size || height || 24}
    viewBox="0 0 24 24"
    width={size || width || 24}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="12" cy="8" r="4" stroke={fill} strokeWidth={1.5} />
    <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" stroke={fill} strokeWidth={1.5} />
  </svg>
);

export default function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      fetch("https://starislandbaby.com/test/wp-json/wp/v2/users/me", {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.code) setUserInfo(data);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserInfo(null);
    setToken(null);
    router.push("/"); // 可選擇保留在當前頁面或導向首頁
  };

  return (
    <div className="flex gap-4 items-center">
      <a
        href="https://www.facebook.com/profile.php?id=61569146001285"
        target="_blank"
        rel="noreferrer"
      >
        <Button
          isIconOnly
          aria-label="Facebook"
          color="warning"
          variant="faded"
        >
          <FacebookIcon />
        </Button>
      </a>
      <a
        href="https://www.instagram.com/starisland_baby2022?igsh=MXVkeWExOXBsdWx1NQ%3D%3D&utm_source=qr"
        target="_blank"
        rel="noreferrer"
      >
        <Button
          isIconOnly
          aria-label="Instagram"
          color="primary"
          variant="faded"
        >
          <InstagramIcon />
        </Button>
      </a>
      <a
        href="https://line.me/R/ti/p/@391huuts"
        target="_blank"
        rel="noreferrer"
      >
        <Button isIconOnly aria-label="LINE" color="success" variant="faded">
          <LineIcon />
        </Button>
      </a>

      <Link href="/Cart">
        <Button isIconOnly aria-label="Cart" color="danger" variant="faded">
          <CartIcon />
        </Button>
      </Link>

      {userInfo ? (
        <div className="flex  items-center gap-2 text-gray-800">
          <Link
            href="/account"
            className=" px-3 py-2 flex   flex-row text-[.8rem] text-gray-800 font-medium"
          >
            歡迎， {userInfo.name}
          </Link>

          <Button
            onClick={handleLogout}
            className="text-gray-800 !bg-transparent hover:bg-gray-200"
            variant="light"
            size="sm"
          >
            登出
          </Button>
        </div>
      ) : (
        <Link href="/login">
          <Button
            isIconOnly
            className="w-full px-1"
            aria-label="Login"
            color="secondary"
            variant="faded"
          >
            登入會員
          </Button>
        </Link>
      )}
    </div>
  );
}
