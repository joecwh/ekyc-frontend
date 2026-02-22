<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/authStore";
import api from "../../api/axios";

const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

const router = useRouter();
const auth = useAuthStore();

const validate = () => {
  if (!email.value) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))
    return "Invalid email format";
  if (!password.value) return "Password is required";
  return "";
};

const login = async () => {
  error.value = validate();
  if (error.value) return;

  try {
    loading.value = true;
    const res = await api.post("/auth/login", {
      email: email.value.trim(),
      password: password.value
    });

    auth.login(res.data.token);
    router.push("/profile");
  } catch (err) {
    error.value = err.response?.data?.message || "Login failed";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="auth-wrapper">
    <div class="card">
      <h2>Sign In</h2>
      <p class="subtitle">Secure access to your account</p>

      <input v-model="email" placeholder="Email Address" />
      <input v-model="password" type="password" placeholder="Password" />

      <button class="primary-btn" @click="login">
        Login
      </button>
      <p v-if="error" style="color:red;font-size:13px;">{{ error }}</p>
    </div>
  </div>
</template>