<script setup>
import { computed } from "vue";
import { useAuthStore } from "../stores/authStore";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

const isLoggedIn = computed(() => auth.isAuthenticated);

const goHome = () => {
  if (isLoggedIn.value) {
    router.push("/profile");
  } else {
    router.push("/login");
  }
};

const logout = () => {
  auth.logout(); 
  router.push("/login");
};
</script>

<template>
  <nav class="navbar">
    <div class="nav-left">
      <span class="brand" @click="goHome">
        eKYC Portal
      </span>
    </div>

    <div class="nav-right">
      <template v-if="!isLoggedIn">
        <router-link to="/login">Login</router-link>
        <router-link to="/register">Register</router-link>
      </template>

      <template v-else>
        <button class="logout-btn" @click="logout">
          Logout
        </button>
      </template>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  height: 60px;
  background: white;
  border-bottom: 1px solid #e6e9ef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
}

.brand {
  font-weight: 600;
  font-size: 16px;
  color: #1b4dff;
  cursor: pointer;
}

.nav-right a {
  margin-left: 20px;
  text-decoration: none;
  color: #374151;
  font-weight: 500;
}

.logout-btn {
  background: transparent;
  border: none;
  font-weight: 500;
  cursor: pointer;
  color: #dc2626;
}
</style>