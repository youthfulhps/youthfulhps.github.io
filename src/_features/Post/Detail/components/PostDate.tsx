import React from 'react';

type PostDateProps = {
  date: string;
};

function PostDate({ date }: PostDateProps) {
  return <p className="text-right text-xs italic mb-10">{date}</p>;
}

export default PostDate;
