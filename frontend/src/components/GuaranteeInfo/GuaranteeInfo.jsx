import { FaMoneyCheckAlt, FaCheckCircle } from "react-icons/fa";

const GuaranteeInfo = () => {
  const items = [
    { icon: <FaMoneyCheckAlt />, text: "ক্যাশ অন ডেলিভারি" },
    { icon: <FaCheckCircle />, text: "১০০% অরিজিনাল প্রোডাক্ট" },
  ];

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-md shadow-md">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2 text-gray-700">
          <div className="text-blue-500 text-xl">{item.icon}</div>
          <span className="text-sm md:text-base font-medium">{item.text}</span>
        </div>
      ))}
    </div>
  );
};

export default GuaranteeInfo;
