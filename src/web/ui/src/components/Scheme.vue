<template>
  <div :class="'alert alert-'+type+' scheme'">
    <h4 class="alert-heading">{{scheme.name}}</h4>
    <p v-if="showParams==false">{{scheme.description}}</p>
    <template v-else>
        <div class="form-group" v-for="(param, index) in scheme.params" :key="index">
            <label>{{param.name}}</label>
            <input type="text" v-model="param.value" class="form-control form-control-sm">
        </div>
    </template>
  </div>
</template>

<script>
export default {
    name: "AppScheme",
    props:{
        scheme:{
            default:null
        },
        showParams:{
            default:false,
            type:Boolean
        }
    },
    data(){
        return {
            type:null
        }
    },
    mounted(){
        if(this.scheme.id==0)
            this.type="danger"
        else if(this.scheme.id==1)
            this.type="success"
        else if(this.scheme.id==2)
            this.type="warning"
        else if(this.scheme.id==3)
            this.type="info"
    }
}
</script>