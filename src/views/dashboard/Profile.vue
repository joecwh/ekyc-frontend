<script setup>
import { ref, onMounted, computed } from "vue";
import api from "../../api/axios";
import { useRouter } from "vue-router";

const profile = ref(null);
const router = useRouter();

onMounted(async () => {
  profile.value = (await api.get("/users")).data;
});

const goDetails = () => {
  router.push("/profile/details");
};

const goKyc = () => {
  router.push("/kyc/details");
};

const canEditKyc = computed(() =>
  profile.value &&
  (profile.value.kycStatus === "DRAFT" ||
   profile.value.kycStatus === "RETRY")
);
</script>

<template>
  <div class="page-wrapper">
    <div class="dashboard-card" v-if="profile">
      <h2>User Overview</h2>
      <p class="subtitle">Account summary</p>

      <div class="info-grid">
        <div>
          <label>Email</label>
          <div>{{ profile.email }}</div>
        </div>

        <div>
          <label>Account Status</label>
          <span class="badge success">
            {{ profile.accountStatus }}
          </span>
        </div>

        <div>
          <label>KYC Status</label>
          <span
            class="badge"
            :class="{
              warning: profile.kycStatus === 'DRAFT' || profile.kycStatus === 'RETRY',
              info: profile.kycStatus === 'SUBMITTED',
              success: profile.kycStatus === 'APPROVED',
              error: profile.kycStatus === 'REJECTED'
            }"
          >
            {{ profile.kycStatus }}
          </span>
        </div>
      </div>

      <div class="button-group">
        <button class="outline-btn" @click="goDetails">
          View Details
        </button>

        <button
          class="primary-btn"
          :disabled="!canEditKyc"
          @click="goKyc"
        >
          Submit / Continue KYC
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-wrapper {
  min-height: calc(100vh - 60px);
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f4f6f9;
}

.dashboard-card {
  width: 520px;
  background: white;
  padding: 40px;
  border-radius: 16px;
  border: 1px solid #e6e9ef;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

.info-grid {
  margin-top: 20px;
  display: grid;
  gap: 20px;
}

label {
  font-size: 13px;
  color: #6b7280;
}

.button-group {
  margin-top: 30px;
  display: flex;
  gap: 15px;
}

.badge {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.warning {
  background: #fef3c7;
  color: #92400e;
}

.success {
  background: #dcfce7;
  color: #166534;
}

.error {
  background: #fee2e2;
  color: #991b1b;
}

.info {
  background: #dbeafe;
  color: #1e40af;
}
</style>