<template>
  <header class="mb-5">
    <div class="header-top">
      <div class="container">
        <div class="logo">
          <a href="index.html">
            <img src="/assets/images/logo/logo.png" alt="Logo" srcset="" />
          </a>
        </div>
      </div>
    </div>
    <nav class="main-navbar">
      <div class="container">
        <ul>
          <li class="menu-item">
            <router-link :to="{name:'home'}" class='menu-link'>
              <i class="bi bi-grid-fill"></i>
              <span>Home</span>
            </router-link>
          </li>
          <li class="menu-item">
            <router-link :to="{name:'schemes'}" class='menu-link'>
              <i class="bi bi-folder-fill"></i>
              <span>Schemes</span>
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  name: "AppHeader",
};
</script>
