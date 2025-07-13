import { redirectIfAuthenticated } from "@/app/lib/auth/util";
import AuthForm from "@/components/auth/AuthForm";

const SignupPage = async () => {
  await redirectIfAuthenticated();
  return <AuthForm mode="signup" />;
};

export default SignupPage;
