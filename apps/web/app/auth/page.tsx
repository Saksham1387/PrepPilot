import { Suspense } from "react";
import Signin from "../../Components/signin";
import Example from "@/components/signin1";

const SigninPage = async () => {
  return <Suspense> <Example /> </Suspense>;
};

export default SigninPage;
