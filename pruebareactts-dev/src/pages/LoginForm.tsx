import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../components/Input";
import { FormField } from "../components/FormField";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { useNavigate } from "react-router";
import { URLS } from "../navigation/CONTANTS";
import { LoginRequest } from "../models/dto/LoginRequest";
import { AuthService } from "../services/AuthService";
import { Container } from "../components/Container";
import { useAuth } from "../hooks/useAuth";
import { GuestMenu } from "../components/GuestMenu";

type Inputs = {
    username: string;
    password: string;
};

export const LoginForm = () => {
    const navigate = useNavigate();
    const { doLogin } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        const login: LoginRequest = {
            username: data.username,
            password: data.password,
        };

        new AuthService()
            .login(login.username, login.password)
            .then((response) => {
                console.log("Login successful", response);
                doLogin({
                    access_token: response.access,
                    refresh_token: response.refresh,
                    user: response.usuario, // usuario con rol completo
                });
                navigate(URLS.HOME);
            })
            .catch((error) => {
                console.error("Login failed", error);
                alert("Credenciales incorrectas o usuario sin rol.");
            });
    };

    return (
        <>
            <GuestMenu />
            <Container>
                <Card title="Iniciar sesión" className="mx-5 my-5">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormField>
                            <label htmlFor="username">Usuario:</label>
                            <Input
                                type="text"
                                id="username"
                                {...register("username", { required: true })}
                            />
                            {errors.username && <span>Este campo es requerido</span>}
                        </FormField>
                        <FormField>
                            <label htmlFor="password">Contraseña:</label>
                            <Input
                                type="password"
                                id="password"
                                {...register("password", { required: true })}
                            />
                            {errors.password && <span>Este campo es requerido</span>}
                        </FormField>
                        <Button type="submit" title="Ingresar" />
                    </form>
                </Card>
            </Container>
        </>
    );
};
