import React from "react";

type Props = {
  children?: React.ReactNode;
};

export default function BuilderCardHeader({ children }: Props) {
  return <div>{children} </div>;
}
