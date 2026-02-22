import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/authStore";

import Login from "../views/auth/Login.vue";
import Register from "../views/auth/Register.vue";
import Profile from "../views/dashboard/Profile.vue";
import ProfileDetails from "../views/dashboard/ProfileDetails.vue";
import KycDetails from "../views/kyc/KycDetails.vue";
import KycUpload from "../views/kyc/KycUpload.vue";
import KycSuccess from "../views/kyc/KycSuccess.vue";

const routes = [
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/profile", component: Profile, meta:{requiresAuth:true}},
  { path: "/profile/details", component: ProfileDetails, meta:{requiresAuth:true}},
  { path: "/kyc/details", component: KycDetails, meta:{requiresAuth:true}},
  { path: "/kyc/upload", component: KycUpload, meta:{requiresAuth:true}},
  { path: "/kyc/success", component: KycSuccess, meta:{requiresAuth:true}},
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});

export default router;