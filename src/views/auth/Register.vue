<script setup>
import { ref } from "vue";
import api from "../../api/axios";

const form = ref({
  email: "",
  password: "",
  confirmPassword: "",
  phoneNumber: ""
});

const error = ref("");
const loading = ref(false);

const validate = () => {
  if (!form.value.email) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email))
    return "Invalid email format";

  if (!form.value.password) return "Password is required";
  if (form.value.password.length < 6)
    return "Password must be at least 6 characters";

  if (form.value.password !== form.value.confirmPassword)
    return "Passwords do not match";

  if (!/^[0-9]{9,15}$/.test(form.value.phoneNumber))
    return "Phone number must be 9-15 digits";

  return "";
};

const submit = async () => {
  error.value = validate();
  if (error.value) return;

  try {
    loading.value = true;

    const res = await api.post("/auth/register", form.value);
    alert(res.data.message);
  } catch (err) {
    error.value = err.response?.data?.message || "Registration failed";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="auth-wrapper">
    <div class="card">
      <h2>Create Account</h2>
      <p class="subtitle">Register to start your verification</p>

      <input v-model="form.email" placeholder="Email" />
      <input v-model="form.password" type="password" placeholder="Password" />
      <input v-model="form.confirmPassword" type="password" placeholder="Confirm Password" />
      <input v-model="form.phoneNumber" placeholder="Phone Number" />

      <button class="primary-btn" @click="submit">
        Register
      </button>
    </div>
  </div>
</template>