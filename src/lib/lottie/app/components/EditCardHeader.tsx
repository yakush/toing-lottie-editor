import React from "react";

type Props = {
  children?: React.ReactNode;
};

export default function EditCardHeader({ children }: Props) {
  return <div>{children} </div>;
}
