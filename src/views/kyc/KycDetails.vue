<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../../api/axios";

const router = useRouter();
const error = ref("");
const isLoaded = ref(false);
const loading = ref(false);

const form = ref({
  firstName: "",
  lastName: "",
  idNumber: "",
  dob: "",
  nationality: "",
  occupation: "",
  isPep: false,
  addresses: [
    {
      addressType: "RESIDENTIAL",
      addressLine1: "",
      addressLine2: "",
      city: "",
      postcode: "",
      state: "",
      country: ""
    }
  ]
});

onMounted(async () => {
  try {
    const res = await api.get("/users/profile");

    const profile = res.data;

    form.value = {
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      idNumber: profile.idNumber || "",
      dob: profile.dob || "",
      nationality: profile.nationality || "",
      occupation: profile.occupation || "",
      isPep: profile.isPep || false,
      addresses: profile.addresses?.length
        ? profile.addresses
        : [
            {
              addressType: "RESIDENTIAL",
              addressLine1: "",
              addressLine2: "",
              city: "",
              postcode: "",
              state: "",
              country: ""
            }
          ]
    };

  } catch (e) {
    console.error(e);
  } finally {
    isLoaded.value = true;
  }
});

const goBack = () => router.push("/profile");

const validate = () => {
  if (!form.value.firstName) return "First name required";
  if (!form.value.lastName) return "Last name required";
  if (!form.value.idNumber) return "IC Number required";
  if (!form.value.dob) return "Date of birth required";
  if (!form.value.nationality) return "Nationality required";

  const addr = form.value.addresses[0];
  if (!addr.addressLine1) return "Address Line 1 required";
  if (!addr.city) return "City required";
  if (!addr.postcode) return "Postcode required";
  if (!addr.state) return "State required";
  if (!addr.country) return "Country required";

  return "";
};

const save = async () => {
  error.value = validate();
  if (error.value) return;

  try {
    loading.value = true;
    await api.put("/users/profile", form.value);
    router.push("/kyc/upload");
  } catch (err) {
    error.value = err.response?.data?.message || "KYC submission failed";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div v-if="isLoaded" class="kyc-wrapper">
    <div class="kyc-card">

      <div class="header">
         <button class="back-btn" @click="goBack" aria-label="Back">
          <!-- Simple left arrow -->
          <span class="arrow">←</span>
        </button>

        <div class="header-text">
          <h2>KYC Information</h2>
          <p class="subtitle">Complete your identity verification</p>
        </div>
      </div>

      <div class="form-grid">

        <div class="field">
          <label>First Name</label>
          <input v-model="form.firstName" />
        </div>

        <div class="field">
          <label>Last Name</label>
          <input v-model="form.lastName" />
        </div>

        <div class="field">
          <label>ID Number</label>
          <input v-model="form.idNumber" />
        </div>

        <div class="field">
          <label>Date of Birth</label>
          <input type="date" v-model="form.dob" />
        </div>

        <div class="field">
          <label>Nationality</label>
          <input v-model="form.nationality" />
        </div>

        <div class="field">
          <label>Occupation</label>
          <input v-model="form.occupation" />
        </div>

      </div>

      <!-- PEP -->
      <div class="pep-section">
        <label>Politically Exposed Person (PEP)</label>
        <input type="checkbox" v-model="form.isPep" />
      </div>

      <!-- Address -->
      <div class="section">
        <h3>Residential Address</h3>

        <div v-for="(addr, index) in form.addresses" :key="index" class="address-card">

          <input v-model="addr.addressLine1" placeholder="Address Line 1" />
          <input v-model="addr.addressLine2" placeholder="Address Line 2" />
          <input v-model="addr.city" placeholder="City" />
          <input v-model="addr.state" placeholder="State" />
          <input v-model="addr.postcode" placeholder="Postcode" />
          <input v-model="addr.country" placeholder="Country" />

        </div>
      </div>

      <div v-if="error" class="error">
        {{ error }}
      </div>

      <div class="action-row">
        <button class="primary-btn" :disabled="loading" @click="save">
          {{ loading ? "Processing..." : "Next" }}
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.kyc-wrapper{
  min-height: calc(100vh - 60px);
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f4f6f9;
  padding: 40px 16px;
}

.kyc-card{
  width: 760px;
  background: white;
  border-radius: 18px;
  padding: 36px;
  box-shadow: 0 14px 40px rgba(0,0,0,0.06);
}

.header{
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 16px;
  padding-bottom: 18px;
  border-bottom: 1px solid #eef1f5;
}

.back-btn{
  width: 42px;
  height: 42px;
  border-radius: 999px;
  border: 1px solid #e6e9ef;
  background: #fff;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: 0.2s ease;
}
.back-btn:hover{
  background: #f3f4f6;
}
.arrow{
  font-size: 18px;
  line-height: 1;
  color: #111827;
}

.header-text h2{
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #111827;
}

.subtitle{
  margin: 4px 0 0;
  font-size: 13px;
  color: #6b7280;
}

.form-grid{
  margin-top: 22px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px 24px;
}

.field label{
  font-size: 12px;
  color: #6b7280;
  display: block;
  margin-bottom: 6px;
}

input{
  width: stretch;
  height: 40px;
  border-radius: 10px;
  border: 1px solid #e6e9ef;
  padding: 0 12px;
}

.section{
  margin-top: 26px;
}

.address-card{
  background: #fafbff;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #eef1f5;
  display: grid;
  gap: 10px;
}

.pep-section{
    display: flex;
    margin: 20px 0;
    font-size: 14px;
}

.pep-section input{
    width: 10%;
    height: 20px;
    margin: 0;
}

.error{
  margin-top: 16px;
  color: #dc2626;
  font-size: 13px;
}

.action-row{
  margin-top: 28px;
  display: flex;
  justify-content: flex-end;
}

.primary-btn{
  height: 42px;
  padding: 0 22px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  background: #1b4dff;
  color: white;
  cursor: pointer;
}
</style>