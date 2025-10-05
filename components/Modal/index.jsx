import { useRouter } from 'next/router';

const Modal = ({ children }) => {
  const router = useRouter();

  const handleCloseModal = () => {
    router.back(); // 返回上一個路由，這裡假設模態關閉後返回上一個頁面
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={handleCloseModal}>&times;</span>
        {children}
      </div>
    </div>
  );
};

export default Modal;
