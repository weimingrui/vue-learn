<template>
  <div class="login-content">
    <div class="logo" >
      <img src="../assets/images/logo.svg" alt="icon">
    </div>
    <div class="account">
      <div class="title">定位引擎监控系统</div>
      <div class="input-content">
        <div class="account-name"><span>用户名</span><input placeholder="" v-model="username"/>
        </div>
        <div class="account-password"><span>密码</span><input placeholder="" type="password" v-model="password"/>
        </div>
      </div>
      <button class="login" @click="login()">登   录</button>
    </div>
  </div>
</template>

<script>
  import qs from "qs"
export default {
  name: 'hello',
  data () {
    return {
      username:"",
      password:"",
    }

  },
  created(){

  },
  methods: {
    login:function () {
      var name = this.username;
      var passwd = this.password;
      this.axios({
        method:'POST',
        url:this.siteUrl2+"login",
        data:qs.stringify({
          name:name,
          password:passwd
        }),
        headers:{
        "Content-Type":"application/x-www-form-urlencoded"
      }

      }).then((res) =>{
        var data = res.data;
        if(data.status=="success"){
          localStorage.Authentication_Token=Date.now();//data.token;
          localStorage.UserName=data.name
          this.$router.push({path:'/'});
        }else{
          alert(data.errorMsg);
        }
      })
      .catch((error)=>{
        console.log(error)
      })
    }

  },
/*  components : {
    'InputValidation' : require('./InputValidation.vue')
  }*/
}
</script>
<style scoped>
@import "../assets/css/login.css"
</style>
