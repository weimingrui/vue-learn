<template>
  <div class="hello" @click="closeShow">
  <!--<div class="header">
    <img src="../assets/images/u91.png" alt="icon">
    <h1>定位引擎监控</h1>
    <span><div></div>Exit</span>
    <span> <i></i> xuefang.tao</span>
  </div>-->
  <HeaderLayout ></HeaderLayout>
  <div class="container">
  <div class="content">

  <div class="search" :class="{searchActive:isSearch}" style="display: flex">
    <div class="engine-style">定位引擎: <span v-for="(sta,index) in engines" :class="{'active':e_ind === index}" @click="changeEngine(index,sta)">{{sta}}</span></div>
        <!--状态：   <span v-for="(sta,index) in status" :class="{'active':ind === index}" @click="changeBgc(index,sta)">{{sta}}</span>-->

    <div class="show-expect">
      <div :class="{nothide:!ind}" @click="showExpectList(1)"> 显示全部</div>
      <div :class="{nothide:ind}" @click="showExpectList()">显示异常</div>
    </div>
    <form :class="{form:isform} "  @submit.prevent="submit">
    <!--<label :class="{data1:data1}" for="data1" >数据发送端口号 ：</label>-->
      <!--<input type="text" id="data1" name="sink_port" v-model="searchData.sink_port" >-->
      <!--<label for="data2" >名称: &nbsp</label>-->
      <input class="searchTextInput" type="text" id="data2" name="name" placeholder="搜索 名称/MapId/接收端口号" v-model="searchText">

  <div class="isblock" v-if="seen">
      <div class="data3">
      <label for="data3">协议：&nbsp </label>
      <select name="deal" id="data3" v-model="searchData.protocol">
      <option>请选择</option>
        <option v-for=" xieyi in xieyis" :value="xieyi">{{xieyi}}</option>
      </select>
       </div>
      <div class="data4">
        <label for="data4">算法 ： </label>
      <select name="arithmetic" id="data4" v-model="searchData.algorithm">
        <option >请选择</option>
        <option value="ble-location">ble-location</option>
        <option value="wifi-location">wifi-location</option>
        <option value="rssi-filter">rssi-filter</option>
        <option value="third-party">third-party</option>
      </select>
      </div>
      <div class="data5">
              <label for="data5">IP: &nbsp </label>
    <input type="text" id="data5" name="sink_host" v-model="searchData.sink_host" placeholder="请输入数据发送IP">
  </div>
</div>
        <div class="downmargin" :class="{downmarginActive:isDown,isDownt2:isDown2}">
      <button >搜索</button>
      <button type="reset"  @click="resetData" v-if="seen3" >重置</button>
      <!--<span @click="toDown" v-if="seen4"> 展开 <img src="../assets/images/logo.png" alt="展开"></span>-->
      <span @click="uPper" class=" upper" v-if="seen2"> 收起 <img src="../assets/images/u297.png" alt="收起"></span>
      </div>
    </form>
  </div>
  <table v-if="e_ind">
    <tr>
        <th>名称</th>
        <th>MapId</th>
        <th v-if="e_ind==0">数据源IP</th><!--a-->
        <th>服务端Host</th>
        <th>服务端端口号</th>
        <th v-if="e_ind==0">协议</th>
        <th v-if="e_ind==0"><!--{{e_ind==0?"AP监控":"Beacon总数"}}-->AP监控</th>
        <th v-if="e_ind==0">接收状态</th><!--a-->
        <th>Beacon总数</th>
        <th v-if="e_ind==1">用户数</th>
        <th v-else>接收终端数（5min）</th>
        <th  v-if="e_ind==0">算法</th>
        <th v-if="e_ind==0">数据发送IP</th><!--a-->
        <th v-if="e_ind==0">数据发送端口号</th><!--a-->
        <th v-if="e_ind==1">请求次数（10s）</th>
        <th v-else>发送终端数（5min）</th>
        <th>响应次数（10s）</th>
        <th>版本号</th>
        <th>运行状态</th>
        <th>日志</th>
    </tr>
    <tr v-for="list in lists">
        <td :title="list.comment">{{list.project_name}}</td>
        <td :title="list.comment" >{{list.map_id}}</td>
        <td v-if="e_ind==0">{{list.source_host}}</td>
        <td>{{list.server_host}}</td>
        <td>{{list.server_port}}</td>
        <td v-if="e_ind==0">{{list.protocol}}</td>
        <td v-if="e_ind==0">{{list.ap_status}}</td>
        <td v-if="e_ind==0&&list.received_client_count>0 && new Date().getTime() - list.timestamp < 360000"><span class="normal"> <span>●</span> 正常</span></td>
        <td v-else-if="e_ind==0"><span class="abnormal"><span>●</span> 异常</span></td>
        <td>{{list.beacon_sum}}</td>
        <td>{{list.user_num}}</td>
        <td  v-if="e_ind==0">{{list.algorithm}}</td>
        <td v-if="e_ind==0">{{list.sink_host}}</td>
        <td v-if="e_ind==0"> {{list.sink_port}}</td>
        <td>{{list.req_num}}</td>
        <td>{{list.res_num}}</td>
        <td>{{list.version}}</td>
        <td v-if="new Date().getTime() - new Date(list.date_time).getTime() < 360000"><span class="normal"><span>●</span> 正常</span></td>
          <td v-else><span class="abnormal"><span>●</span> 异常</span></td>
        <td>
         <!-- <router-link :to="{name:'LogMessage2',params:{id:list.project_id,type:e_ind?'ble':'wifi'}}" target="_blank" v-if="list.project_id"><button class="lookBlog">□记录</button></router-link>-->
          <!--<router-link :to="{name:'LogMessage',params:{id:list.name,type:e_ind?'ble':'wifi'}}" target="_blank" v-else><button class="lookBlog">□记录</button></router-link>-->
          <button class="lookBlog" @click="(e) => {gotoLogPage(list,1)}">□记录</button>
          <button @click="(e) => {openShow(list.project_name, list.project_id,e)}" class="lookBlog">□日志</button>
        </td>
    </tr>
  </table>
  <table v-else-if="e_ind==0">
    <tr>
      <th>名称</th>
      <th>MapId</th>
      <th v-if="e_ind==0">数据源IP</th><!--a-->
      <th>接收端IP</th>
      <th>接收端端口号</th>
      <th v-if="e_ind==0">协议</th>
      <th v-if="e_ind==0"><!--{{e_ind==0?"AP监控":"Beacon总数"}}-->AP监控</th>
      <th v-if="e_ind==0">接收状态</th><!--a-->
      <th v-if="e_ind==1">接收终端数（10s）</th>
      <th v-else>接收终端数（5min）</th>
      <th  v-if="e_ind==0">算法</th>
      <th v-if="e_ind==0">数据发送IP</th><!--a-->
      <th v-if="e_ind==0">数据发送端口号</th><!--a-->
      <th v-if="e_ind==1">发送终端数（10s）</th>
      <th v-else>发送终端数（5min）</th>
      <th>运行状态</th>
      <th>日志</th>
    </tr>
    <tr v-for="list in lists">
      <td :title="list.introduction">{{list.name_ch}}</td>
      <td :title="list.introduction" >{{list.mapid}}</td>
      <td v-if="e_ind==0">{{list.source_host}}</td>
      <td>{{list.received_host}}</td>
      <td>{{list.received_port}}</td>
      <td v-if="e_ind==0">{{list.protocol}}</td>
      <td v-if="e_ind==0">{{list.ap_status}}</td>
      <td v-if="e_ind==0&&list.received_client_count>0 && new Date().getTime() - list.timestamp < 360000"><span class="normal"> <span>●</span> 正常</span></td>
      <td v-else-if="e_ind==0"><span class="abnormal"><span>●</span> 异常</span></td>
      <td>{{list.received_client_count}}</td>
      <td  v-if="e_ind==0">{{list.algorithm}}</td>
      <td v-if="e_ind==0">{{list.sink_host}}</td>
      <td v-if="e_ind==0"> {{list.sink_port}}</td>
      <td>{{list.send_client_count}}</td>
      <td v-if="new Date().getTime() - list.timestamp < 360000"><span class="normal"><span>●</span> 正常</span></td>
      <td v-else><span class="abnormal"><span>●</span> 异常</span></td>
      <td>
        <!--<router-link :to="{name:'LogMessage2',params:{id:list.project_id,type:e_ind?'ble':'wifi'}}" target="_blank" v-if="list.project_id"><button class="lookBlog">□记录</button></router-link>
        <router-link :to="{name:'LogMessage',params:{id:list.name,type:e_ind?'ble':'wifi'}}" target="_blank" v-else><button class="lookBlog">□记录</button></router-link>-->
        <button class="lookBlog" @click="(e) => {gotoLogPage(list,0)}">□记录</button>
        <button @click="(e) => {openShow(list.name, list.project_id,e)}" class="lookBlog">□日志</button>
      </td>
    </tr>
  </table>
    <div class="response-empty-warning" v-if="isShowEmptyNotice">暂无数据</div>
  <div class="block">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="+currentPage"
      :page-sizes="[10,20, 50,100,]"
      :page-size="+num"
      layout="total, sizes, prev, pager, next, jumper"
      :total="+total">
    </el-pagination>
  </div>

  </div>
  </div>
    <div class="rightShow" v-if="seen5" @click="openShow2">
      <div class="rightShowButton">
            <img src="../assets/images/u237.png" alt="!">
            <span>监控日志</span>
            <img @click="closeShow" src="../assets/images/u235.png" alt="close">
      </div>
      <div class="oneline"> </div>
      <div class="rightShowList" v-if="e_ind">
           <div v-for="list in linkStatus" >
              <div v-if="list.type==0">
                <span ><img src="../assets/images/u250.png" alt="接通">[{{name}}定位引擎]<!--接通--> {{list.log}}</span>
                <br><p></p>
              </div>
              <div v-if="list.type==1">
              <span ><img src="../assets/images/u248.png" alt="异常"><!--数据异常 &nbsp&nbsp-->{{list.log}}</span>
              <br><p></p>
              </div>
              <div v-if="list.type==2">
              <span ><img src="../assets/images/error.png" alt="异常"><!--程序中断 &nbsp&nbsp--> {{list.log}}</span>
              <br><p></p>
              </div>
          </div>
      </div>
      <div class="rightShowList" v-else-if="e_ind==0">
        <div v-for="list in linkStatus" >
          <div v-if="list.code==0">
            <span ><img src="../assets/images/u250.png" alt="接通">[{{name}}定位引擎]接通 {{list.datetime}}</span>
            <br><p></p>
          </div>
          <div v-if="list.code==1">
            <span ><img src="../assets/images/u248.png" alt="异常">数据异常 &nbsp&nbsp{{list.datetime}}</span>
            <br><p></p>
          </div>
          <div v-if="list.code==2">
            <span ><img src="../assets/images/error.png" alt="异常">程序中断 &nbsp&nbsp {{list.datetime}}</span>
            <br><p></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from "jquery"
export default {
  name: 'hello',
  data () {
    return {
      isShowEmptyNotice:false,
      lists:[],
      status:["全部","异常","正常"],
      engines:["WIFI","蓝牙"],
      ind:'',
      searchText:"",
      e_ind:0,
      seen:false,
      seen2:false,
      seen3:false,
      seen4:true,
      seen5:false,
      isSearch:false,
      isform:false,
      isDown:true,
      isDown2:false,
      total:"",
      currentPage:1,
      data1:false,
      num:10,
      searchData:{
      },
      param:"",
      linkStatus:"",
      name:"",xieyis:["Palmap", "Aercoscout","Huawei","Ruijie","Sundray","Uradio","Aruba","Zte","BleGateway","PalmapBle"]
    }

  },
  created(){
      if(!localStorage.Authentication_Token){
        this.$router.push({path:'/Login'});
        return ;
      }
      this.ind=0;
      this.createdData=(callback)=>{
          //console.log("调用后台接口",new Date());
          var data= {
            //"searchData":this.searchData,
            "linkStatus":this.status[this.ind],
            "engine":this.engines[this.e_ind],
            limit:+this.num,
            page:+this.currentPage,
            searchText:""
          };
          if(this.searchText){
            data.searchText=this.searchText;
          }
          var lastTime = Date.now();
          let url = this.siteUrl+ this.num+"/" + this.currentPage;
          //console.log(this.engines[this.e_ind])
          if(this.engines[this.e_ind]=="蓝牙"){
            if(data.searchText==""){
              data.searchText=null;
            }
            url = this.siteUrl2+ "limit/page"//this.num+"/" + this.currentPage;
          }
          this.axios({
              method:'POST',
              url:url,//+ this.num+"/" + this.currentPage,
              data:data
            }).then((res) =>{
                //console.log("res",res.data.data[0])
                var array=[];
                let iscurModel = false;
                if(this.e_ind==1){
                  if(res.data.list){
                    array = res.data.list;
                    iscurModel=true
                  }
                }else{
                  if(res.data.data){
                    array = res.data.data;
                    iscurModel=true
                  }
                }
                if(iscurModel){
                  array.sort((x,y)=>{
                    return y.received_port - x.received_port;
                  });
                  if(array.length<1){
                    this.isShowEmptyNotice = true;
                  }else{
                    this.isShowEmptyNotice = false;
                  }
                  this.lists=array;
                  this.total= +res.data.count;
                }
                if(callback){
                  let time =Date.now();
                  if(lastTime+3000<time){
                    this.createdData(callback)
                  }else{
                    setTimeout(()=>{this.createdData(callback)},3000);
                  }
                }
                //this.currentPage = +res.data.current_page
            })
            .catch((error)=>{
                console.log(error)
            })
      }
      this.createdData()

    //setInterval(()=>{
     this.createdData(this.createdData)
    //},1000*6)
  },
  methods: {
    gotoLogPage:function (props,type) {
      //params,刷新后数据不保留，query保留
      if(type===0){
        this.$router.push({
          name:'LogMessage',
          path:"/LogMessage/wifi/"+props.project_id
          ,query:{
            name:props.name_ch,
            id:props.name,
            name_ch:props.name_ch,
            map_id:props.mapId,
            type:"wifi"
          }
        })
      }else{
        this.$router.push({
          name:'LogMessage2',
          path:"/LogMessage2/ble/"+props.project_id
          ,query:{
            name:props.project_name,
            id:props.project_id+"",
            name_ch:props.comment,
            map_id:props.map_id,
            type:"蓝牙"
          }
        })
      }

    },
    changeBgc: function (index,sta) {
      this.ind=index;
      /*this.lists=[];
      this.isShowEmptyNotice = false;
      this.createdData()*/
      this.initTable();
    },
    showExpectList:function (sign) {
      if(sign){
        /*var className = document.getElementsByClassName("show-expect")[0].className;
        if(className.indexOf("nothide")<0){
          this.ind=1;
        }else{*/
          this.ind=0;
        //}
        /*this.lists=[];
        this.isShowEmptyNotice = false;
        this.createdData()*/
        this.initTable();
      }else{
       /* var className = document.getElementsByClassName("show-expect")[0].className;
        if(className.indexOf("nothide")<0){*/
          this.ind=1;
        /*}else{
          this.ind=0;
        }*/
        /*this.lists=[];
        this.isShowEmptyNotice = false;
        this.createdData()*/
        this.initTable();
      }

    },
    initTable:function () {
      this.lists=[];
      this.isShowEmptyNotice = false;
      this.createdData()
    },
    changeEngine:function (index,sta) {
      this.e_ind=index;
      this.ind=0;
      /*this.lists=[];
      this.createdData()*/
      this.initTable();
    },
    toDown:function (){
      this.seen=true;
      this.seen2=true;
      this.seen3=true;
      this.seen4=false;
      this.isSearch=true;
      this.isDown=false;
      this.isDown2=true;
      this.isform=true;
      this.data1=true;
    },
    uPper:function(){
      this.seen=false;
      this.seen2=false;
      this.seen3=false;
      this.seen4=true;
      this.isSearch=false;
      this.isDown=true;
      this.isDown2=false;
      this.isform=false;
      this.data1=false;
    },
    closeShow:function(e){
      if ( e && e.stopPropagation )
       e.stopPropagation();
       else
        window.event.cancelBubble = true;
      this.seen5=false;
    },
    resetData:function(){
      this.searchData={}
    },
    // -------------------------------------------------------------------------
    openShow:function(name,project_id, e){
      console.log(name);
      if ( e && e.stopPropagation ) {
        e.stopPropagation();
      }else if(window.event) {
        window.event.cancelBubble = true;
      }
      var url= this.siteUrl+"linkStatus?name="+name;
      if(project_id){//(this.engines[this.e_ind]=="蓝牙"){
        url = this.siteUrl2+ "linkstatus?project_id="+project_id//this.num+"/" + this.currentPage;
      }
      this.seen5=true;
      this.axios({
        method:"get",
        url:url
      })
      .then((res)=>{
        this.linkStatus=res.data
        this.name=name;
        console.log("666",res.data[0].datetime)
        var thistime=res.data[0].datetime
        console.log(new Date(thistime).toLocaleString())
      })
    },
    openShow2:function(e){
      if ( e && e.stopPropagation )
        e.stopPropagation();
      else
        window.event.cancelBubble = true;
       this.seen5=true;
    },
    // -------------------------------------------------------------------------
    handleSizeChange(val2) {
      this.num=val2
      this.createdData()
      setInterval(()=>{
         this.createdData()
      },1000*60*5)

    },
    handleCurrentChange(val) {
      this.currentPage=val
      this.createdData()
      setInterval(()=>{
         this.createdData()
      },1000*60*5)
    },
    submit:function(){
      console.log("searchData",this.searchData)
      this.createdData()
      setInterval(()=>{
         this.createdData()
      },1000*60*5)

      //       var newsearchdata=this.searchData
      //        for(var i in newsearchdata){
      //         console.log(newsearchdata[i])
      //         console.log(i)
      //       if(newsearchdata[i]==''){
      //           delete newsearchdata[i]
      //       }
      //   }
      // if(JSON.stringify(newsearchdata)!="{}"){
      // }

    }
  },
  components : {
    'HeaderLayout' : require('./HeaderLayout.vue')
  }
}
/*module.exports = {
  components : {
    'HeaderLayout' : require('./header-layout.vue')
  }
}*/
</script>
<style scoped>
@import "../assets/css/index.css"
</style>
