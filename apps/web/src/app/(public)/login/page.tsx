import { redirectIfAuthenticated } from "@/app/lib/auth/util";
import AuthForm from "@/components/auth/AuthForm";

const LoginPage = async () => {
  await redirectIfAuthenticated();
  return <AuthForm mode="login" />;
};

export default LoginPage;
