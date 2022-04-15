<template>
    <div>
        <slot></slot>
        <div class="BlockOverlay" v-if="blocked">
            <div class="spinner-grow text-primary" role="status"></div>
        </div>
    </div>
    
</template>


<script>
export default {
    props:["blocked"]
}
</script>
<style scoped>
.BlockOverlay{
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 1000;
    border: none;
    margin: 0px;
    padding: 0px;
    top: 0px;
    left: 0px;
    cursor: wait;
    border-radius: inherit;
    background: rgba(255,255,255)!important;
    opacity: .8!important;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>