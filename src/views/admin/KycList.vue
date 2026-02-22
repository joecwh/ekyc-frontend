<script setup>
import { ref, onMounted } from "vue";
import api from "@/api/axios";
import { useRouter } from "vue-router";

const router = useRouter();
const kycs = ref([]);

onMounted(async () => {
  kycs.value = (await api.get("/admin/kyc")).data;
});

const goReview = (userId) => {
  router.push(`/admin/kyc/${userId}`);
};
</script>

<template>
  <div class="page-wrapper">
    <div class="card">
      <h2>KYC Submissions</h2>

      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Status</th>
            <th>Submitted At</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="k in kycs" :key="k.userId">
            <td>{{ k.email }}</td>
            <td>{{ k.kycStatus }}</td>
            <td>{{ k.submittedAt }}</td>
            <td>
              <button @click="goReview(k.userId)">
                Review
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>