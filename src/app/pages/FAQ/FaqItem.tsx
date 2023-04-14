import React, { FC, useState } from 'react';

type Props = {
  question: string;
  answer: string;
};

const FaqItem: FC<Props> = ({ question, answer }) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="bg-dark-800 rounded-md px-[20px] text-xs font-normal">
      <div className="py-[20px]">
        <button
          className="block w-full text-left"
          onClick={() => {
            setCollapsed((prev) => !prev);
          }}
          dangerouslySetInnerHTML={{ __html: question }}
        ></button>
      </div>
      {collapsed && (
        <>
          <hr className="h-px bg-dark-600" />
          <div className="py-[20px]" dangerouslySetInnerHTML={{ __html: answer }}></div>
        </>
      )}
    </div>
  );
};

export default FaqItem;
