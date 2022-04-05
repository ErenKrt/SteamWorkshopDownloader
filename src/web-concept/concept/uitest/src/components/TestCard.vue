<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="card-title">Items</div>
    </div>

    <div class="card-table table-responsive">
      <div>
        <div class="row">
          <div class="col-auto">
            <span class="avatar">JL</span>
          </div>
          <div class="col">
            <div class="text-truncate">
              <strong>Jeffie Lewzey</strong> commented on your
              <strong>"I'm not a witch."</strong> post.
            </div>
            <div class="text-muted">yesterday</div>
          </div>
          <div class="col-auto align-self-center">
            <div class="badge bg-primary"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.badge:empty {
    display: inline-block;
    width: 0.5rem;
    height: 0.5rem;
    min-width: 0;
    min-height: auto;
    padding: 0;
    border-radius: 100rem;
    vertical-align: baseline;
}
.text-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.avatar{
        --tblr-avatar-size: 2.5rem;
    --tblr-avatar-bg: var(--tblr-border-color-light);
    position: relative;
    width: var(--tblr-avatar-size);
    height: var(--tblr-avatar-size);
    font-size: calc(var(--tblr-avatar-size)/ 2.8571428572);
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #626976;
    text-align: center;
    text-transform: uppercase;
    vertical-align: bottom;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background: var(--tblr-avatar-bg) no-repeat center/cover;
    border-radius: 4px;
}
</style>