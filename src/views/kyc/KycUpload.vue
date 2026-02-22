<script setup>
import { ref } from "vue";
import api from "../../api/axios";
import { useRouter } from "vue-router";

const router = useRouter();
const loading = ref(false);
const error = ref("");

const files = ref({
  NRIC_FRONT: null,
  NRIC_BACK: null,
  SELFIE: null
});

const selectFile = (type, e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!["image/jpeg", "image/png"].includes(file.type)) {
    alert("Only JPG/PNG allowed");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("Max file size 5MB");
    return;
  }

  files.value[type] = file;
};

const submitAll = async () => {
  if (!files.value.NRIC_FRONT || !files.value.NRIC_BACK || !files.value.SELFIE) {
    error.value = "Please upload all required documents.";
    return;
  }

  try {
    loading.value = true;
    error.value = "";

    const form = new FormData();

    form.append("files", files.value.NRIC_FRONT);
    form.append("types", "NRIC_FRONT");

    form.append("files", files.value.NRIC_BACK);
    form.append("types", "NRIC_BACK");

    form.append("files", files.value.SELFIE);
    form.append("types", "SELFIE");

    // 1️⃣ Upload all documents
    await api.post("/kyc/upload", form);

    // 2️⃣ Submit KYC
    await api.post("/kyc/submit");

    // 3️⃣ Redirect to success page
    router.push("/kyc/success");

  } catch (err) {
    error.value = err.response?.data?.message || "Upload failed";
  } finally {
    loading.value = false;
  }
};

const goBack = () => router.push("/profile");
</script>

<template>
  <div class="auth-wrapper">
    <div class="card">
      <div class="header">
         <button class="back-btn" @click="goBack" aria-label="Back">
          <!-- Simple left arrow -->
          <span class="arrow">←</span>
        </button>

        <div class="header-text">
           <h2>Upload Documents</h2>
            <p class="subtitle">Provide required identification documents</p>
        </div>
      </div>
     
      <div class="form-grid">
        <div class="upload-group">
          <label>IC Front</label>
          <input type="file" @change="e=>selectFile('NRIC_FRONT', e)" />
        </div>

        <div class="upload-group">
          <label>IC Back</label>
          <input type="file" @change="e=>selectFile('NRIC_BACK', e)" />
        </div>

        <div class="upload-group">
          <label>Selfie</label>
          <input type="file" @change="e=>selectFile('SELFIE', e)" />
        </div>

      </div>

      <div v-if="error" class="error">
        {{ error }}
      </div>

      <div class="action-row">
        <button class="primary-btn" :disabled="loading" @click="submitAll">
          {{ loading ? "Uploading..." : "Submit Documents" }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>

.header{
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 16px;
  padding-bottom: 18px;
  border-bottom: 1px solid #eef1f5;
}

.form-grid{
  margin-top: 22px;
  display: grid;
  gap: 18px 24px;
}

.form-grid input {
  border: none;
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

.upload-group{
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.upload-group input {
  padding: 0;
  border-radius: 0;
}

.file-name{
  font-size: 12px;
  color: #1b4dff;
}

.error{
  margin-top: 16px;
  color: #dc2626;
}

.action-row{
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}
</style>