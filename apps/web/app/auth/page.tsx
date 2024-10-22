import { Suspense } from "react";
import Signin from "@/components/signin";

const SigninPage = async () => {
  return <Suspense> <Signin /> </Suspense>;
};

export default SigninPage;
