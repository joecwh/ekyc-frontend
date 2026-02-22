<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goHome = () => {
  router.push("/profile");
};
</script>

<template>
  <div class="success-wrapper">
    <div class="success-card">

      <div class="icon">
        ✓
      </div>

      <h2>KYC Submitted Successfully</h2>

      <p>
        Your documents have been submitted and are now under review.
        You will be notified once the verification process is completed.
      </p>

      <button class="home-btn" @click="goHome">
        Back to Home
      </button>

    </div>
  </div>
</template>

<style scoped>
.success-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eef2ff, #f8fafc);
  padding: 20px;
}

.success-card {
  background: #ffffff;
  padding: 48px 40px;
  border-radius: 18px;
  max-width: 420px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
}

.icon {
  width: 70px;
  height: 70px;
  margin: 0 auto 24px;
  border-radius: 50%;
  background: #16a34a;
  color: white;
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

h2 {
  margin-bottom: 14px;
  font-size: 22px;
  font-weight: 700;
  color: #111827;
}

p {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 28px;
}

.home-btn {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: #1b4dff;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}

.home-btn:hover {
  background: #153edb;
}
</style>