import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, User, Lock } from "lucide-react";
import "./App.css"; // Імпортуємо CSS для стилів

// (Ця функція припускає, що Tailwind CSS встановлено і налаштовано)
// const cn = (...inputs) => inputs.filter(Boolean).join(" ");
// Схему Zod залишаємо без змін, оскільки вона не залежить від стилів
const schema = z
  .object({
    firstName: z
      .string()
      .min(2, "Ім'я має містити щонайменше 2 символи")
      .max(30, "Ім'я має містити не більше 30 символів"),
    lastName: z
      .string()
      .min(1, "Прізвище є обов'язковим")
      .max(30, "Прізвище має містити не більше 30 символів"),
    email: z
      .string()
      .email("Некоректна адреса електронної пошти")
      .min(1, "Email є обов'язковим"),
    age: z
      .number({
        message: "Вік має бути числом",
      })
      .min(18, "Вам має бути щонайменше 18 років")
      .max(60, "Вік не може перевищувати 60 років"),
    password: z.string().min(6, "Пароль має містити щонайменше 6 символів"),
    confirmPassword: z
      .string()
      .min(6, "Підтвердження пароля має містити щонайменше 6 символів"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Паролі не співпадають",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

const App = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const submitData = async (data: FormValues) => {
    setIsSubmitting(true);
    setSuccessMessage("");
    console.log("Form data before submission:", data);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Form submitted successfully:", data);
      setSuccessMessage("Форма успішно відправлена!");
      reset();
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="form-wrapper">
        <h1 className="form-title">Реєстрація</h1>
        <p className="form-description">
          Заповніть форму, щоб зареєструватися.
        </p>

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        <form onSubmit={handleSubmit(submitData)} className="form">
          <div className="input-group-row">
            <div className="input-group-col">
              <label htmlFor="firstName" className="input-label">
                Ім'я
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="firstName"
                  {...register("firstName")}
                  className={`input-field ${errors.firstName ? "error" : ""}`}
                />
              </div>
              {errors.firstName && (
                <span className="error-message">
                  {errors.firstName?.message}
                </span>
              )}
            </div>

            <div className="input-group-col">
              <label htmlFor="lastName" className="input-label">
                Прізвище
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="lastName"
                  {...register("lastName")}
                  className={`input-field ${errors.lastName ? "error" : ""}`}
                />
              </div>
              {errors.lastName && (
                <span className="error-message">
                  {errors.lastName?.message}
                </span>
              )}
            </div>
          </div>

          <div className="input-group-col">
            <label htmlFor="email" className="input-label">
              Email
            </label>
            <div style={{ position: "relative" }}>
              <div className="input-icon">
                <Mail />
              </div>
              <input
                type="email"
                id="email"
                {...register("email")}
                className={`input-field input-icon-field ${
                  errors.email ? "error" : ""
                }`}
              />
            </div>
            {errors.email && (
              <span className="error-message">{errors.email?.message}</span>
            )}
          </div>

          <div className="input-group-col">
            <label htmlFor="age" className="input-label">
              Вік
            </label>
            <div style={{ position: "relative" }}>
              <div className="input-icon">
                <User />
              </div>
              <input
                type="number"
                id="age"
                {...register("age", { valueAsNumber: true })}
                className={`input-field input-icon-field ${
                  errors.age ? "error" : ""
                }`}
              />
            </div>
            {errors.age && (
              <span className="error-message">{errors.age?.message}</span>
            )}
          </div>

          <div className="input-group-col">
            <label htmlFor="password" className="input-label">
              Пароль
            </label>
            <div style={{ position: "relative" }}>
              <div className="input-icon">
                <Lock />
              </div>
              <input
                type="password"
                id="password"
                {...register("password")}
                className={`input-field input-icon-field ${
                  errors.password ? "error" : ""
                }`}
              />
            </div>
            {errors.password && (
              <span className="error-message">{errors.password?.message}</span>
            )}
          </div>

          <div className="input-group-col">
            <label htmlFor="confirmPassword" className="input-label">
              Підтвердження пароля
            </label>
            <div style={{ position: "relative" }}>
              <div className="input-icon">
                <Lock />
              </div>
              <input
                type="password"
                id="confirmPassword"
                {...register("confirmPassword")}
                className={`input-field input-icon-field ${
                  errors.confirmPassword ? "error" : ""
                }`}
              />
            </div>
            {errors.confirmPassword && (
              <span className="error-message">
                {errors.confirmPassword?.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Відправка..." : "Відправити"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
