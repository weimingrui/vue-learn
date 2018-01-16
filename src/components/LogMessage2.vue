<template>
  <div class="logMessage">
    <HeaderLayout :name="name"></HeaderLayout>

    <div class="container log-messagepage">
      <div class="content flex-contain">
        <div class="left-table-contain">
          <div class="dateMac">
            <div class="block">
              <div class="table-title">{{!isShowUserInfoTable?"日Mac吞吐趋势":"用户量"}}<!----></div>
              <div class="selectedDate"><div class="user day selected" @click="selectMonth('user',1)">按天查看</div>
                <div class="user month" @click="selectMonth('user',2)">按月查看</div></div>
              <el-date-picker v-if="selectM==1"
                v-model="value1"
                type="date"
                placeholder="选择日期"
                @change="redrawaActiveUser"
                :picker-options="pickerOptions0">
              </el-date-picker>
              <el-date-picker v-else
                              v-model="value1"
                              type="month"
                              placeholder="选择月份"
                              @change="redrawaActiveUser"
                              :picker-options="pickerOptions0">
              </el-date-picker>
            </div>
            <div id="main"></div>
          </div>
          <div class="monthMac">
            <div class="block">
              <div class="table-title">{{!isShowUserInfoTable?"月Mac吞吐趋势":"访问请求量"}}<!--月Mac吞吐趋势--></div>
              <div class="selectedDate"><div class="request day  selected" @click="selectMonth('request',1)">按天查看</div>
                <div class=" request month" @click="selectMonth('request',2)">按月查看</div></div>
              <el-date-picker v-if="selectM2==1"
                v-model="value2"
                type="date"
                placeholder="选择日期"
                @change="redrawAccessRequest"
                :picker-options="pickerOptions1">
                <!--type="month"
                @change="otherMonth"
                placeholder="选择月"-->
              </el-date-picker>
              <el-date-picker v-else
                v-model="value2"
                type="month"
                placeholder="选择月份"
                @change="redrawAccessRequest"
                :picker-options="pickerOptions1">
                <!--type="month"
                @change="otherMonth"
                placeholder="选择月"-->
              </el-date-picker>
            </div>
            <div id="main2" ></div>
          </div>
        </div>
        <div class="right-table-contain">
          <div class="offLink">
            <div class="block">
              <div class="table-title">异常监控统计</div>
              <el-date-picker
                v-model="value3"
                type="month"
                @change="otherError"
                placeholder="选择月">
              </el-date-picker>
            </div>
            <div id="main3" ></div>
          </div>
          <div id="main4" class="list-contain" v-if="isShowUserInfoTable">
            <div class="table-title">用户列表</div>
            <div class="list-body" >
              <div class="lib">
                <div>用户ID</div>
                <div>扫描到的Beacon数</div>
                <div>有效的Beacon数</div>
              </div>
              <div class="item" v-for="item in listData">
                <div>{{item.user_id}}</div>
                <div>{{item.scan_beacon_num}}</div>
                <div>{{item.valid_beacon_num}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  // import echarts from 'echarts';
  import $ from "jquery"
  export default  {
    data(){
      return{
        isShowUserInfoTable:false,
        dataId:"",
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 360000;
          }
        },
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 360000;
          }
        },
        value1:new Date(),
        value2: new Date(),
        value3: new Date(),
        dayMac:"",
        selectM:1,
        selectM2:1,
        listData:[{user_id:"--",sum_beacon_count:"--",valid_beacon_count:"--"}],
        name:"",
        getProps:{}
      }
    },
    created(){
      if(!localStorage.Authentication_Token){
        this.$router.push({path:'/Login'});
        return ;
      }
      try{
        this.getProps =this.$route.query;
      }catch (e){
        console.log(e)
      }
      this.name = this.getProps.name;
      console.log(this.name)
      this.isShowUserInfoTable=this.getProps.type=="wifi"?false:true;
      this.distribute=(array,type,dateFormat)=>{
        var date=[], input=[],output=[];
        for(let i=0 ; i<array.length ; i ++ ){

          if(dateFormat=="day"){
            date.push(new Date(array[i].date_time).getHours()+":00")
          }
          if(dateFormat=="month"){
            date.push(new Date(array[i].date_time).getDate() +"号")
          }
          if(type=="request"){
            input.push(array[i].req_num)
            output.push(array[i].res_num)
          }else if(type=="user"){
            input.push(array[i].user_num)
            output.push(array[i].user_num)
          }
        }
        return {
          date,
          input,
          output
        }
      }
      if(this.isShowUserInfoTable){
        this.resquestCallbackRequest=()=> {
          var date = Date.now();
          var tablename = Number(this.getProps.id.toLowerCase());
          var url = this.siteUrl2 +"UserInfoList?project_id="+tablename;
          //console.log(tablename);
          this.axios({
            method:'GET',
            url:url,
          }).then((res) =>{
            if(res.data.length>0){
              this.listData=res.data
            }else{
              this.listData=[{user_id:"--",sum_beacon_count:"--",valid_beacon_count:"--"}]
            }
            //listData:[{user_id:"123123",sum_beacon_count:200,valid_beacon_count:120}
            if(date+3000< Date.now()){
              this.resquestCallbackRequest();
            }else{
              setTimeout(this.resquestCallbackRequest,3000)
            }

          }).catch((error)=>{
            console.log(error)
          })
        }
        this.resquestCallbackRequest();
      }
    },
    methods:{
      selectMonth:function (type ,index) {

        var selectedMonthLayout=function (value,classname,oldvalue) {

          //var node = $(classname);
          if(value!=oldvalue){
            if(value==1){
              var node2=$((classname+".day"));
              if(!node2.hasClass("selected")){
                node2.addClass("selected")
              }
              var node3=$((classname+".month"));
              if(node3.hasClass("selected")){
                node3.removeClass("selected")
              }

            }else{
              var node2=$((classname+".month"));
              if(!node2.hasClass("selected")){
                node2.addClass("selected")
              }
              var node3=$((classname+".day"));
              if(node3.hasClass("selected")){
                node3.removeClass("selected")
              }
            }
            /*if(!node.hasClass("selected")){
              node.addClass("selected")
            }*/
          }else{
            /*if (node.hasClass("selected")) {
              node.removeClass("selected")
            }*/
          }
          return value;
        }
        if(type=="user"){
          this.selectM =
            selectedMonthLayout(index,".selectedDate .user",this.selectM);
          this.requestActiveUsers();
        }else if(type=="request"){
          this.selectM2 =
            selectedMonthLayout(index,".selectedDate .request",this.selectM2);
          this.getAccessRequests();
        }
      },
      redrawaActiveUser:function(date){
        this.value1=date;
        this.requestActiveUsers();

      },
      redrawAccessRequest:function(date){
        this.value2=date
        this.getAccessRequests();
      },
      otherError:function(date){
        this.value3=date
        this.goSearchError()
      }
    },
    mounted(){
      function getEchartArea() {

        var width =  window.screen.width/2-100;
        var height = window.screen.height/2 -160;
        return {width,height};
      }
      function  getRequestDate(date,type) {
        if(!date){
          return ;
        }
        if(typeof date=="string"&&date.indexOf("-")>-1){
          date=new Date(date)
        }
        var years = date.getUTCFullYear();
        var month = 1+date.getUTCMonth();
        var day = date.getUTCDate();
        var hour =date.getHours();
        if(month<10){
          month="0"+month;
        }
        var newdate = years+"-"+month;
        if(type=="day"){
          return newdate+"-"+day//+" "+hour;
        }
        return newdate
      }
      this.requestActiveUsers=()=>{
        var url = this.siteUrl2+"Users"
        var type = this.selectM;
        var dateType = "day";
        if(type==2){
          dateType = "month";
        }
        var date = getRequestDate(this.value1,dateType);
        this.axios({
          url:url,
          params:{
            date:date,
            project_id:Number(this.getProps.id.toLowerCase()),
            type:type
          },
          method:"get"
        })
          .then((res)=>{
            this.dayMac=this.distribute(res.data,"user",dateType);
            this.renderDay(this.dayMac.date,this.dayMac.input,this.dayMac.output)
          })
          .catch((err)=>{
            console.log(err)
          })
      }
      this.getAccessRequests=()=>{
        var url = this.siteUrl2+"AccessRequest";
        var type = this.selectM2;
        var dateType = "day";
        if(type==2){
          dateType = "month";
        }
        var date = getRequestDate(this.value2,dateType);
        this.axios({
          url:url,
          params:{
            date:date,
            project_id:Number(this.getProps.id.toLowerCase()),
            type:type
          },
          method:"get"
        })
          .then((res)=>{

            this.dayMac=this.distribute(res.data,"request",dateType)
            console.log("month",this.dayMac)
            this.renderMonth(this.dayMac.date,this.dayMac.input,this.dayMac.output)
          })
          .catch((err)=>{
            console.log(err)
          })
      }
      var initErrorData = function(date){
        var data = [];
        var dateNum = new Date(Number(date.substring(0,4)), Number(date.substring(5,7)), 0).getDate();
        for(var i=0;i<dateNum;i++){
          data.push(cloneObject({
            res_exception_num: 0,
            run_exception_num: 0
          }))
        }
        return data;
      }
      this.goSearchError=()=>{
        var date = getRequestDate(this.value3);
        this.axios({
          url:this.siteUrl2+"expections",
          params:{
            date:date,
            project_id:Number(this.getProps.id.toLowerCase())
          },
          method:"get"
        })
          .then((res)=>{
            var data=[];
            try{
              data = initErrorData(date);
              for(var i=0;i<res.data.length;i++){
                data.splice(i,1,res.data[i])
              }
            }catch(e) {
              data = res.data;
            }
            this.blurData=data;
            this.renderError()
          })
          .catch((err)=>{
            console.log(date)
            console.log(err)
          })
      };
      var cloneObject =function (object) {
          if (null == object || "object" != typeof object)
            return object;
          // Handle the 3 simple types, Number and String and Boolean
          if(object instanceof Number || object instanceof String || object instanceof Boolean)
            return object.valueOf();
          // Handle Date
          if (object instanceof Date) {
            var copy = new Date();
            copy.setTime(object.getTime());
            return copy;
          }
          // Handle Array or Object
          if (object instanceof Object || object instanceof Array) {
            var copy = (object instanceof Array)?[]:{};
            for (var attr in object) {
              if (object.hasOwnProperty(attr))
                copy[attr] = object[attr]?cloneObject(object[attr]):object[attr];
            }
            return copy;
          }
          throw new Error("Unable to clone obj! Its type isn't supported.");
      }
      var areaSize = getEchartArea();
      function initLayout() {
        //document.getElementById("#main").style.width=areaSize.width;
        document.getElementById("main").style.height=areaSize.height+"px";
        document.getElementById("main2").style.height=areaSize.height+"px";
        document.getElementById("main3").style.height=areaSize.height+"px";
        if(document.getElementById("main4")){
          document.getElementById("main4").style.height=areaSize.height+56+"px";
        }
      }
      this.renderDay=(date,input,output)=>{
        var myChart = echarts.init(document.getElementById('main'));

        var option = {
          /*title: {
                      text: '日Mac吞吐趋势'
                  },*/
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data:['活跃用户'],
            height:areaSize.height,
            width:areaSize.width
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          calculable : true,//
          toolbox: {
            show : true,
            feature : {
              mark : {show: true},
              dataView : {show: true, readOnly: false},
              magicType : {show: true, type: ['line', 'bar']},
              restore : {show: true},
              saveAsImage : {show: true}
            },
            containLabel: true
            /*feature: {
                        saveAsImage: {}
                    }*/
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data:date
          },
          yAxis:
            {
              type: 'value',
              name:'(人数)',
              position:'left',
              axisTick:{
                inside:'false',
                length:10,
              }
            },
          series: [
            {
              name:'活跃用户',
              type:'line',
              stack: 'input',
              data:input,
              smooth:true,
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(93, 255, 250,0.72)'
                  }, {
                    offset: 1,
                    color:'rgba(93, 255, 250,0.72)'
                  }], false)
                }
              },
            },
            /*{
              name:'output',
              type:'line',
              stack: 'output',
              data:output,
              smooth:true,
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(175, 182, 244,0.72)'
                  }, {
                    offset: 1,
                    color:  'rgba(175, 182, 244,0.72)'
                  }], false)
                }
              },
            }*/
          ]
        };
        option.series[0].itemStyle={
          normal: {
            color: "#5dfffa"
          }
        };
        /*option.series[1].itemStyle={
          normal: {
            color: "#afb6f4"
          }
        };*/
        myChart.setOption(option);
      }
      this.renderMonth=(date,input,output)=>{
        var myChart2 = echarts.init(document.getElementById('main2'))
        var option2 = {
          /* title: {
                         text: '月Mac吞吐趋势'
                     },*/
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data:['请求次数','响应次数'],
            height:areaSize.height,
            width:areaSize.width
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          /*toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },*/
          toolbox: {
            show : true,
            feature : {
              mark : {show: true},
              dataView : {show: true, readOnly: false},
              magicType : {show: true, type: ['line', 'bar']},
              restore : {show: true},
              saveAsImage : {show: true}
            },
            containLabel: true
            /*feature: {
                        saveAsImage: {}
                    }*/
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data:date
          },
          yAxis: {
            type: 'value',
            name:"(次数)"
          },
          series: [
            {
              name:'请求次数',
              type:'line',
              stack: 'input',
              data:input,
              smooth:true,
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(93, 255, 250,0.72)'
                  }, {
                    offset: 1,
                    color:'rgba(93, 255, 250,0.72)'
                  }], false)
                }
              },
            },
            {
              name:'响应次数',
              type:'line',
              stack: 'output',
              data:output,
              smooth:true,
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(175, 182, 244,0.72)'
                  }, {
                    offset: 1,
                    color:  'rgba(175, 182, 244,0.72)'
                  }], false)
                }
              },
            }
          ]
        };
        option2.series[0].itemStyle={
          normal: {
            color: "#5dfffa"
          }
        };
        option2.series[1].itemStyle={
          normal: {
            color: "#afb6f4"
          }
        };
        myChart2.setOption(option2);
      }
      this.renderError=()=>{

        var myChart3 = echarts.init(document.getElementById('main3'));
        var fixH =areaSize.height/7;
        var cellSize = [fixH, fixH];
        var pieRadius = fixH/3//30;
        console.log("this.value3",this.value3)
        function timeFormat( params ){
          var year = new Date(params).getFullYear()
          var month = new Date(params).getMonth()+1
          var month2 = new Date(params).getMonth()+2
          var startDate=year+ "-"+month+"-"+"01"
          var endDate=year+"-"+month2+"-"+"01"
          var monthRange=year+"-"+month
          return {startDate,endDate,monthRange};
        }
        var rangeDate=timeFormat(this.value3)

        function getVirtulData() {
          var date = +echarts.number.parseDate(rangeDate.startDate);
          var end = +echarts.number.parseDate(rangeDate.endDate);
          var dayTime = 3600 * 24 * 1000;
          var data = [];
          for (var time = date; time < end; time += dayTime) {
            data.push([
              echarts.format.formatTime('yyyy-MM-dd', time),
              Math.floor(Math.random() * 10000)
            ]);
          }
          return data;
        }
        var blurData=this.blurData
        console.log("blurData:",blurData)
        function getPieSeries(scatterData, chart) {

          return echarts.util.map(scatterData, function (item, index) {
            var center = chart.convertToPixel('calendar', item);
            return {
              id: index + 'pie',
              type: 'pie',
              center: center,
              label: {
                normal: {
                  formatter: '{c}',
                  position: 'inside',
                  color:"#111"
                }
              },
              radius: pieRadius,
              data: [
                {name: '程序中断', value:blurData[index].run_exception_num,label:{normal:{color:"#111"}}},
                {name: '数据异常', value:blurData[index].res_exception_num}
              ],
              color:['#c23531','#2f4554'//'#ffbf60', '#ff8b7c'
              ],
              itemStyle:{
                /*normal: {
                  color:{
                      type: 'linear',
                      x: 0,
                      y: 1,
                      x2: 1,
                      y2: 1,
                      colorStops: [
                        {
                          offset: 0, color: '#c23531' // 0% 处的颜色
                        }, {
                          offset: 1, color: '#2f4554' // 100% 处的颜色
                        }
                      ],
                    globalCoord:true
                  },
                  color1:{
                    type: 'linear',
                    x: 0,
                    y: 1,
                    x2: 1,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0, color: '#1fc227' // 0% 处的颜色
                      }, {
                        offset: 1, color: '#fffe2d' // 100% 处的颜色
                      }
                    ],
                    globalCoord:true
                  }
                }*/
              },

            };
          });
        }

        function getPieSeriesUpdate(scatterData, chart) {
          return echarts.util.map(scatterData, function (item, index) {
            var center = chart.convertToPixel('calendar', item);
            return {
              id: index + 'pie',
              center: center
            };
          });
        }

        var scatterData = getVirtulData();

        var option3 = {
          /*title:{
                text:"异常监控统计"
               },*/
          tooltip : {},
          legend: {
            data: ['程序中断', '数据异常'],
            bottom: 20
          },
          calendar: {
            top: 'middle',
            left: 'center',
            orient: 'vertical',
            cellSize: cellSize,
            yearLabel: {
              show: false,
              textStyle: {
                fontSize: 30
              }
            },
            dayLabel: {
              margin: 10,
              firstDay: 1,
              nameMap: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
              show:true
            },
            monthLabel: {
              show: true
            },
            range: [rangeDate.monthRange]
          },
          color:"#000",
          series: [{
            id: 'label',
            type: 'scatter',
            coordinateSystem: 'calendar',
            symbolSize: 1,
            label: {
              normal: {
                show: true,
                formatter: function (params) {
                  return echarts.format.formatTime('dd', params.value[0]);
                },
                offset: [-cellSize[0] / 2 + 10, -cellSize[1] / 2 + 10],
                textStyle: {
                  color: '#000',
                  fontSize: 14
                }
              }
            },
            data: scatterData,
          }]
        };

        if (!app.inNode) {
          var pieInitialized;
          setTimeout(function () {
            pieInitialized = true;
            var series = getPieSeries(scatterData, myChart3);
            myChart3.setOption({
              series: series
            });
          }, 10);

          app.onresize = function () {
            if (pieInitialized) {
              myChart3.setOption({
                series: getPieSeriesUpdate(scatterData, myChart3)
              });
            }
          };
        }
        option3.series[0].itemStyle={
          normal: {
            color: {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.5,
              colorStops: [{
                offset: 0, color: '#affe2d' // 0% 处的颜色
              }, {
                offset: 1, color: '#fffe2d' // 100% 处的颜色
              }],
              globalCoord: false // 缺省为 false
            }
          }
        };
        myChart3.setOption(option3);

      }
      this.requestActiveUsers();
      this.getAccessRequests();
      this.goSearchError();
      initLayout();
    },
    components : {
      'HeaderLayout' : require('./HeaderLayout.vue')
    }
  }
</script>
<style scoped>
  .selectedDate{
      display: flex;
    margin-left: auto;
    margin-right: 40px;

  }
  .selectedDate div{
    margin-left: 20px;
    width:80px;
    background: rgba(42, 146, 255, 0);
    height: 36px;
    border: 1px solid #ccc;
    color: #000;
    border-radius: 5px;
    cursor: pointer;
    line-height: 34px;
    text-align: center;
  }
  .selectedDate .selected{
    border:none;
    color:  rgba(16, 142, 233, 1);
    border: 1px solid rgba(16, 142, 233, 1);
  }
  @import "../assets/css/logMessage.css"
</style>
