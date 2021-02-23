<template>
	<div class="main">
		<div id="eleContainer"></div>
		<div class="closeBtn" @click='handleCloseClick'>X</div>
		<div class='butWrapper'>
			<Button type="info" @click='editFence'>编辑</Button>
			<Button type="primary" @click='enterFence'>保存</Button>
			<Button type="success" @click='backClick'>返回</Button>			
		</div>
		<div class='operateInfo'>鼠标双击或右键确定新增围栏范围!</div>
	</div>

</template>
<script>
	var polyEditor;
	import AMap from 'AMap'
	export default {
		name: "eleMap",
		props:{
			newPath:Array
		},
		data() {
			return {
				userData: (JSON.parse(this.$store.state.userData)),	
				path:[],
				
			}
		},
		
		methods: {
			//关闭
			handleCloseClick() {
				this.$emit('eleShow',false)
			},
			//加载地图
			loadmap(){				
				var map =new AMap.Map('eleContainer', {
					zoom: 15,
					center: [this.userData.lng,this.userData.lat],
				});
				var mouseTool = new AMap.MouseTool(map);
			      function drawPolygon () {
				      mouseTool.polygon({
				        strokeColor: "#FF33FF", 
				        strokeOpacity: 1,
				        strokeWeight: 6,
				        strokeOpacity: 0.2,
				        fillColor: '#1791fc',
				        fillOpacity: 0.4,
				        // 线样式还支持 'dashed'
				        strokeStyle: "solid",
				        // strokeStyle是dashed时有效
				        // strokeDasharray: [30,10],
				      })
				    }	
					drawPolygon ()    
				  mouseTool.on('draw',(event=> {				   
				      console.log(event.obj.getPath())
				      let news=event.obj.getPath();				      
				      for(let item of news){
				      	this.path.push([item.lng,item.lat])
				      }	
				    	mouseTool.close(true);
				    	editPoly();
				     })
				 ) 
				      console.log(this.path)
				    let editPoly=()=>{
				    	 var polygon = new AMap.Polygon({
				        path:this.path,
				        strokeColor: "#FF33FF", 
				        strokeWeight: 6,
				        strokeOpacity: 0.2,
				        fillOpacity: 0.4,
				        fillColor: '#1791fc',
				        zIndex: 50,
				    })
				       
				       	
				       
				
				    map.add(polygon)
				    // 缩放地图到合适的视野级别
				    map.setFitView([ polygon ])
				polyEditor = new AMap.PolyEditor(map, polygon)

					    polyEditor.on('addnode', function(event) {
					        console.log('触发事件：addnode')
					    })
					
					    polyEditor.on('adjust', function(event) {
					        console.log('触发事件：adjust')
					    })
					
					    polyEditor.on('removenode', function(event) {
					        console.log('触发事件：removenode')
					    })
					
					    polyEditor.on('end', function(event) {
					       console.log('触发事件： end')
					       console.log(event.target.Ce.path)
					        // event.target 即为编辑后的多边形对象
					    })  
				   
				    }
				      
			
				  
				 	
			},
			editFence(){
				polyEditor.open();
			},
			//保存
			enterFence(){
				polyEditor.close();
			},
			//返回
			backClick(){
				this.$emit('eleShow',false)
			}
		},
		
		mounted() {				
			this.loadmap()
			this.editFence=window.editFence;
		},
	}
</script>

<style scoped>
	.main {
		position: absolute;
		width: calc(100% - 210px);
		height: calc(100vh - 95px);
		left:200px;
		top: 65px;
		z-index: 101;
		background:#fff;
	}
	
	#eleContainer {
		width: calc(100% - 40px);
		height: calc(100% - 50px);
		z-index: 100;
		margin: 30px 20px 20px;
	}
	
	.closeBtn {
		position: absolute;
		right: 7px;
		top: 2px;
		z-index: 102;
		color: #000;
		font-size: 20px;
		cursor: pointer;
		color: #51B5EA;
	}
	.main>>>img{
		width: 40px;
		height: auto;
	}
	.butWrapper{
		position: absolute;
		right:32px;
		bottom:22px;
		z-index:110;
		background: #FFFFFF;
		width: 220px;	
		height: 60px;
		line-height: 60px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
	}
	.butWrapper>>>button{
		
		margin:0 4px;
		height: 28px;
		line-height: 28px;
	}
	.operateInfo{
	background: #FFFFFF;
	position: absolute;
	left: 22px;
	top:32px;
	z-index:110;
	color: #f00;
	font-size: 12px;
	font-weight: 600;
	padding:5px 10px;	
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
	}
</style>