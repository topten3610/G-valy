/* eslint-disable react/prop-types */
import { CgClose } from "react-icons/cg";

const DisplayImage = ({ imgUrl, onClose }) => {
  return (
    <div className="fixed bottom-0 h-full w-full   top-0 right-0  left-0 flex justify-center items-center">
      <div className="bg-white h-[90%]  w-[90%] p-4 shadow-lg rounded-2xl  max-w-5xl mx-auto ">
        <div
          className="w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer"
          onClick={onClose}
        >
          <CgClose />
        </div>

        <div className="flex h-[90%]  w-[90%] justify-center items-center p-4 ">
          <img
            src={imgUrl}
            alt={imgUrl}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default DisplayImage;
