<template>
	<div class="logMessage">
	<!--<div class="header">-->
    <!--<img src="../assets/images/u91.png" alt="icon">-->
    <!--<h1>定位引擎监控</h1>-->
    <!--<span class="user-name"><div></div>Exit</span>-->
    <!--<span class="login-out"> <i></i> xuefang.tao</span>-->
  <!--</div>-->
  <HeaderLayout :name="name"></HeaderLayout>

  <div class="container log-messagepage">
    <div class="content flex-contain">
      <div class="left-table-contain">
        <div class="dateMac">
            <div class="block">
              <div class="table-title">{{!isShowUserInfoTable?"日Mac吞吐趋势":"日用户量"}}<!----></div>
              <el-date-picker
                v-model="value1"
                type="date"
                placeholder="选择日期"
                @change="otherDay"
                :picker-options="pickerOptions0">
              </el-date-picker>
            </div>
            <div id="main"></div>
        </div>
        <div class="monthMac">
          <div class="block">
            <div class="table-title">{{!isShowUserInfoTable?"月Mac吞吐趋势":"月用户量"}}<!--月Mac吞吐趋势--></div>
            <el-date-picker
              v-model="value2"
              type="month"
              @change="otherMonth"
              placeholder="选择月">
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
              <div>{{item.sum_beacon_count}}</div>
              <div>{{item.valid_beacon_count}}</div>
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
        value1:new Date(),
        value2: new Date(),
        value3: new Date(),
        dayMac:"",
        listData:[{user_id:"--",sum_beacon_count:"--",valid_beacon_count:"--"}],
        name:""
			}
		},
		created(){
      if(!localStorage.Authentication_Token){
        this.$router.push({path:'/Login'});
        return ;
      }
		  this.isShowUserInfoTable=this.$route.query.type=="wifi"?false:true;
      this.name = this.$route.query.name;
			this.distribute=(array,dateFormat)=>{
				var date=[], input=[],output=[];
				for(let i=0 ; i<array.length ; i ++ ){
					if(dateFormat=="day"){
						date.push(new Date(array[i].date).getHours()+":00")
					}
					if(dateFormat=="month"){
						date.push(new Date(array[i].date).getDate() +"号")
					}
					input.push(array[i].received_client_count)
					output.push(array[i].output_client_count)
				}
				return {
					date,
					input,
					output
				}
			}
			/*if(this.isShowUserInfoTable){
			  this.resquestCallbackRequest=()=> {
			    var date = Date.now();
			    var tablename = this.$route.params.id.toLowerCase()+"_realtimeclientsinfo";
          var url = this.siteUrl +"UserInfoList?name="+tablename+"&timestamp="+(parseInt(date/1000));
          console.log(tablename);
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
      }*/
		},
		methods:{
			otherDay:function(date){
				this.value1=date
				this.goSearchDay()

			},
			otherMonth:function(date){
				this.value2=date
				this.goSearchMonth()
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
			this.goSearchDay=()=>{
				this.axios({
				url:this.siteUrl+"daylog/"+this.$route.query.id,
				params:{
					date:this.value1
				},
				method:"get"
				})
				.then((res)=>{
					console.log("day",res.data)
					this.dayMac=this.distribute(res.data,"day")
					this.renderDay(this.dayMac.date,this.dayMac.input,this.dayMac.output)
				})
				.catch((err)=>{
					console.log(err)
				})
			}
			this.goSearchMonth=()=>{
				this.axios({
					url:this.siteUrl+"monthlog/"+this.$route.query.id,
					params:{
						date:this.value2
					},
					method:"get"
				})
				.then((res)=>{
					this.dayMac=this.distribute(res.data,"month")
					console.log("month",this.dayMac)
					this.renderMonth(this.dayMac.date,this.dayMac.input,this.dayMac.output)
				})
				.catch((err)=>{
					console.log(err)
				})
			}
      this.goSearchError=()=>{
				this.axios({
					url:this.siteUrl+"errorlog/"+this.$route.query.id,
					params:{
						date:this.value3
					},
					method:"get"
				})
				.then((res)=>{
					console.log("error",res.data)
					this.blurData=res.data
					this.renderError()
				})
				.catch((err)=>{
					console.log(err)
				})
			}
			this.goSearchDay()
			this.goSearchMonth()
			this.goSearchError()
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
      initLayout();
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
				        data:['input','output'],
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
                name:'input',
                position:'left',
                axisTick:{
                  inside:'false',
                  length:10,
                }
				      },
				    series: [
				        {
				            name:'input',
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
				        }
				    ]
				};
        option.series[0].itemStyle={
          normal: {
            color: "#5dfffa"
          }
        };
        option.series[1].itemStyle={
          normal: {
            color: "#afb6f4"
          }
        };
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
					        data:['input','output'],
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
					        type: 'value'
					    },
					    series: [
					        {
					            name:'input',
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
                          position: 'inside'
                      }
                  },
                  radius: pieRadius,
                  data: [
                      {name: '程序中断', value:blurData[index][1]},
                      {name: '数据异常', value:blurData[index][0]}
                  ],
                color:['#ffbf60', '#ff8b7c'],
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
	},
    components : {
      'HeaderLayout' : require('./HeaderLayout.vue')
    }
}
</script>
<style scoped>
  @import "../assets/css/logMessage.css"
</style>
