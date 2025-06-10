import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthContext } from "@/contexts/AuthContext";
import { login } from "@/stores/features/authFeature";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export function Login() {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const authContext = useAuthContext();
  const token = localStorage.getItem("ACCESS_TOKEN");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (token && auth.user) {
  //     const role = auth.user.role.name;
  //     if (role === "Admin") navigate("/admin/dashboard");
  //   }
  // }, [auth.user, token, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const resultAction = await dispatch(login(formData));
      if (login.fulfilled.match(resultAction)) {
        const responseData = resultAction.payload.data;

        const { token, user } = responseData;
        toast.success("Logged in.");
        authContext.setToken(token);
        authContext.setUser(user);
        navigate("/dashboard");

      } else {
        toast.error(resultAction.payload || "An error occurred");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "An error occurred");
    }
    setIsLoading(false);
  };
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder=""
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Login"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden bg-muted lg:block">
        <img
          src="Login.png"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover "
        />
      </div>
    </div>
  );
}
