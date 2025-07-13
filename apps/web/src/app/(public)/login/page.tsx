import { redirectIfAuthenticated } from "@/utils/auth";
import AuthForm from "@/components/auth/AuthForm";

const LoginPage = async () => {
  await redirectIfAuthenticated();
  return <AuthForm mode="login" />;
};

export default LoginPage;
