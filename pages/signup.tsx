import { useState } from "react";
import { useRouter } from "next/router";

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (!response.ok) return setError(data.error || "Signup failed");

    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-md w-96">
        <h2 className="text-xl font-bold mb-4">Club Admin Sign-Up</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 border rounded mt-3"
          onChange={handleChange}
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded mt-4">
          Sign Up
        </button>
      </form>
    </div>
  );
}
