<template>
  <div>
    <div class="header">
      <img src="../assets/images/logo.svg" alt="icon">
      <h1>定位引擎监控<span v-if="name" class="day">  ——  {{name}}</span></h1>
      <span @click="loginOut()"><!--<div></div>-->
        <img style="width: 30px;height: 24px;" src="../assets/images/exit.svg"/>
        Exit</span>
      <span > <!--<i></i>--><img style="width: 30px;height: 30px;" src="../assets/images/user.svg">
        {{accountName}}</span>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'hello',
    data () {
      return {
        accountName:"Palmap",
      }
    },
    props:{
      "name":{
        type: String,
        required: false
      },
    },
    created(){
      this.accountName=localStorage.UserName
    },
    mounted(){

    },
    methods: {
      loginOut:function () {
        localStorage.Authentication_Token="";
        this.$router.push({path:'/login'});
        return false;
      }
    },

  }
</script>
<style scoped>
  h1 span.day{
    font-size: 16px;
    margin-left: 5px;
  }
  @import "../assets/css/index.css"
</style>
