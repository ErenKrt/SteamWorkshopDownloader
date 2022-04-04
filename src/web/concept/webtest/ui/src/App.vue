<template>
  <div id="main" class="layout">
    <Header />
    <div class="content-wrapper container">
      <div class="page-content">
        <section class="row">
          <div class="col-12 col-lg-4">
            <div class="card">
              <div class="card-body py-4 px-5">
                <div class="d-flex align-items-center">
                  <div class="col-md-8">
                    <input
                      type="text"
                      placeholder="Workshop ID"
                      class="form-control"
                    />
                  </div>
                  <button class="btn btn-block btn-info ms-2">Search</button>
                </div>
              </div>
            </div>
            <div class="card">
              <div class="card-header">
                <h4>Workshop Items</h4>
              </div>
              <div class="card-content pb-4">
                <div class="px-4">
                  <button
                    class="btn btn-block btn-xl btn-success font-bold mb-3"
                  >
                    Download All
                  </button>
                </div>

                <div class="recent-message px-4 py-3">
                  <div class="row">
                    <div class="col-12 d-flex">
                      <div class="image image-lg">
                        <img src="assets/images/faces/4.jpg" />
                      </div>

                      <div class="col-8">
                        <div class="name ms-4">
                          <h5 class="mb-1">Hank Schrader</h5>
                          <h6 class="text-muted">@a</h6>
                        </div>
                      </div>

                      <a class="stats-icon purple ms-2" href="#">
                        <i class="iconly-boldArrow---Down-3"></i>
                      </a>
                    </div>
                    <div class="col-12">
                      <div class="progress progress-primary mb-4">
                        <div
                          class="progress-bar progress-label"
                          role="progressbar"
                          style="width: 35%"
                          aria-valuenow="50%"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12 col-lg-8">
            <div class="row">
              <div class="col-6">
                <div class="card">
                  <div class="card-header">
                    <h4>Schemes</h4>
                  </div>
                  <div class="card-body" id="myitems">
                    <div
                      class="alert alert-info"
                      id="myalert"
                      style="z-index: 1000000"
                    >
                      <h4 class="alert-heading">Copy</h4>
                      <p>This is scheme copy your file with regex.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="card">
                  <div class="card-header">
                    <h4>DO</h4>
                  </div>
                  <div class="card-body" id="dropzone">
                    <div class="alert alert-info" style="z-index: 1000000">
                      <button
                        type="button"
                        class="btn-close float-end"
                      ></button>
                      <h4 class="alert-heading">Copy</h4>

                      <div class="form-group">
                        <label>Glob or path</label>
                        <input
                          type="text"
                          class="form-control form-control-sm"
                        />
                      </div>
                    </div>

                    <div
                      class="alert alert-warning"
                      id="myalert"
                      style="z-index: 1000000"
                    >
                      <h4 class="alert-heading">Has</h4>
                      <div class="form-group">
                        <label>Glob or path</label>
                        <input
                          type="text"
                          class="form-control form-control-sm"
                        />
                      </div>

                      <div class="card">
                        <div class="card-header">
                          <h6>Childs</h6>
                        </div>
                        <div class="card-body">
                          <div
                            class="alert alert-info"
                            style="z-index: 1000000"
                          >
                            <h4 class="alert-heading">Copy</h4>
                            <div class="form-group">
                              <label>Glob or path</label>
                              <input
                                type="text"
                                class="form-control form-control-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

export default {
  name: "App",
  components: {
    Header,
    Footer,
  },
};
</script>

<style lang="scss">

@use 'sass:math';

@import "@/assets/scss/_variables";
@import 'bootstrap/scss/bootstrap';

@import "@/assets/scss/layouts/main";
@import "@/assets/scss/layouts/default";

@import "@/assets/scss/components/alert";

@import "@/assets/scss/components/image";
@import "@/assets/scss/components/buttons";
@import "@/assets/scss/components/card";
@import "@/assets/scss/components/forms";
@import "@/assets/scss/components/progress";
@import "@/assets/scss/components/icons";

@import "@/assets/scss/_utilities";
//@import "@/assets/scss/image";



</style>
