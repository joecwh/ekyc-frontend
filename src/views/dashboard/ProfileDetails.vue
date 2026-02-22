<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import api from "../../api/axios";

const router = useRouter();
const loading = ref(false);
const form = ref(null);

onMounted(async () => {
  const res = await api.get("/users/profile");

  form.value = {
    ...res.data,
    addresses: res.data.addresses || []
  };
});

const goBack = () => router.push("/profile");

/* Group addresses by type */
const addressGroups = computed(() => {
  const groups = {
    RESIDENTIAL: [],
    MAILING: [],
    BUSINESS: []
  };

  const list = form.value?.addresses || [];
  for (const a of list) {
    const key = (a.addressType || "").toUpperCase();
    if (groups[key]) groups[key].push(a);
  }
  return groups;
});

const typeLabel = (type) => {
  switch (type) {
    case "RESIDENTIAL": return "Residential Address";
    case "MAILING": return "Mailing Address";
    case "BUSINESS": return "Business Address";
    default: return type;
  }
};

/* Add new address */
const addAddress = (type) => {
  form.value.addresses.push({
    addressType: type,
    addressLine1: "",
    addressLine2: "",
    city: "",
    postcode: "",
    state: "",
    country: ""
  });
};

/* Remove address */
const removeAddress = (index) => {
  form.value.addresses.splice(index, 1);
};

const canEdit = computed(() =>
  form.value &&
  (form.value.kycStatus === "DRAFT" ||
   form.value.kycStatus === "RETRY")
);

/* Save */
const save = async () => {
  try {
    loading.value = true;
    await api.put("/users/profile", form.value);
    router.push("/profile");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="page-wrapper">
    <div class="details-card" v-if="form">

      <!-- Header -->
      <div class="header">
        <button class="back-btn" @click="goBack" aria-label="Back">
          <!-- Simple left arrow -->
          <span class="arrow">←</span>
        </button>

        <div class="header-text">
          <h2>Profile Details</h2>
          <p class="subtitle">Your KYC profile information</p>
        </div>

      </div>

      <!-- Profile info -->
    <div class="section">
        <h3 class="section-title">Personal Information</h3>

        <div class="info-grid">

            <div class="field">
            <label>First Name</label>
            <input v-model="form.firstName" :disabled="!canEdit" />
            </div>

            <div class="field">
            <label>Last Name</label>
            <input v-model="form.lastName" :disabled="!canEdit" />
            </div>

            <div class="field">
            <label>ID Number</label>
            <input v-model="form.idNumber" :disabled="!canEdit" />
            </div>

            <div class="field">
            <label>Date of Birth</label>
            <input type="date" v-model="form.dob" :disabled="!canEdit" />
            </div>

            <div class="field">
            <label>Nationality</label>
            <input v-model="form.nationality" :disabled="!canEdit" />
            </div>

            <div class="field">
            <label>Occupation</label>
            <input v-model="form.occupation" :disabled="!canEdit" />
            </div>

        </div>
    </div>

      <!-- Addresses -->
    <div class="section">
        <h3 class="section-title">Addresses</h3>

        <div class="address-groups">

            <div class="address-group" v-for="type in ['RESIDENTIAL','MAILING','BUSINESS']" :key="type">

            <div class="group-header">
                <div class="group-title">
                {{ typeLabel(type) }}
                </div>

                <button
                  class="add-btn"
                  @click="addAddress(type)"
                  :disabled="!canEdit"
                >
                + Add
                </button>
            </div>

            <div v-if="addressGroups[type].length" class="address-list">

                <div
                v-for="(addr, idx) in addressGroups[type]"
                :key="type + '-' + idx"
                class="address-card"
                >
                <input v-model="addr.addressLine1" placeholder="Address Line 1" />
                <input v-model="addr.addressLine2" placeholder="Address Line 2" />
                <input v-model="addr.city" placeholder="City" />
                <input v-model="addr.state" placeholder="State" />
                <input v-model="addr.postcode" placeholder="Postcode" />
                <input v-model="addr.country" placeholder="Country" />

                <button
                  class="remove-btn"
                  @click="removeAddress(form.addresses.indexOf(addr))"
                  :disabled="!canEdit"
                >
                  Remove
                </button>
                </div>

            </div>

            <div v-else class="empty">
                No {{ typeLabel(type).toLowerCase() }} added.
            </div>

            </div>
        </div>
    </div>

    <div class="action-row">
        <button
          class="primary-btn"
          :disabled="loading || !canEdit"
          @click="save"
        >
          {{ loading ? "Saving..." : "Save Changes" }}
        </button>
    </div>

    </div>
  </div>
</template>

<style scoped>
.page-wrapper{
  min-height: calc(100vh - 60px);
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f4f6f9;
  padding: 40px 16px;
}

.details-card{
  width: 860px;
  background: #fff;
  border-radius: 18px;
  border: 1px solid #e6e9ef;
  box-shadow: 0 12px 32px rgba(0,0,0,0.06);
  padding: 34px 34px 28px;
}

/* Header */
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

.header-actions{
  display: flex;
  justify-content: flex-end;
}

/* Reuse your existing button classes if you have global ones.
   If not, these will style locally for this page. */
.primary-btn{
  height: 40px;
  padding: 0 16px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  background: #1b4dff;
  color: #fff;
  transition: 0.2s ease;
}
.primary-btn:hover{ background: #153ecc; }

/* Sections */
.section{
  margin-top: 22px;
}
.section-title{
  margin: 0 0 14px;
  font-size: 16px;
  font-weight: 700;
  color: #111827;
}

input {
  width: stretch;
  height: 38px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid #e6e9ef;
  margin-bottom: 8px;
}

.add-btn {
  background: transparent;
  border: none;
  color: #1b4dff;
  font-weight: 600;
  cursor: pointer;
}

.remove-btn {
  margin-top: 6px;
  background: #fee2e2;
  border: none;
  color: #b91c1c;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
}

.action-row {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
}

/* Info grid */
.info-grid{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 22px;
}
.field{
  padding: 14px 14px;
  border: 1px solid #eef1f5;
  border-radius: 12px;
  background: #fff;
}
.field label{
  display: block;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 6px;
}
.value{
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

/* Address groups */
.address-groups{
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}

.address-group{
  border: 1px solid #eef1f5;
  border-radius: 14px;
  background: #fbfcfe;
  padding: 14px;
}

.group-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.group-title{
  font-weight: 700;
  color: #111827;
  font-size: 14px;
}
.type-pill{
  font-size: 12px;
  font-weight: 700;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(27, 77, 255, 0.10);
  color: #1b4dff;
  border: 1px solid rgba(27, 77, 255, 0.18);
}

.address-list{
  display: grid;
  gap: 10px;
}

.address-card{
  background: #fff;
  border: 1px solid #e6e9ef;
  border-radius: 12px;
  padding: 14px;
}
.addr-line1{
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
}
.addr-line2{
  color: #374151;
  margin-bottom: 6px;
}
.addr-line3, .addr-line4{
  color: #6b7280;
  font-size: 13px;
}

.empty{
  padding: 12px;
  border-radius: 12px;
  border: 1px dashed #d7dce4;
  color: #6b7280;
  font-size: 13px;
  background: #fff;
}

/* Responsive */
@media (max-width: 860px){
  .details-card{ width: 100%; }
  .info-grid{ grid-template-columns: 1fr; }
  .header{ grid-template-columns: auto 1fr; }
  .header-actions{ grid-column: 1 / -1; justify-content: flex-start; }
}
</style>