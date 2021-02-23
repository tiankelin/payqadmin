<template>
	<div class="main">
		<div id="eleContainer"></div>
		<div class="closeBtn" @click='handleCloseClick'>X</div>
		<div class='butWrapper'>
			<Button type="info" @click='editFence'>开始编辑</Button>
			<Button type="primary" @click='enterFence'>结束编辑</Button>
			<Button type="success" @click='backClick'>返回</Button>
		</div>
		<div class='operateInfo'>鼠标双击或右键确定新增围栏范围!</div>
	</div>

</template>
<script>
	import AMap from 'AMap';
	export default {
		name: "eleMap",
		props:{
			newPath:Array
		},
		data() {
			return {
				userData: (JSON.parse(this.$store.state.userData)),	
				path:[],
				map:{},
				polyEditor:{},
				mouseTool:{},
				
				polygon:{}
			}
		},
		
		methods: {
			handleCloseClick() {
				this.$emit('eleShow',false)
			},
		
			drawPolygon(){
		    this.mouseTool.polygon({
	        strokeColor: "#FF33FF", 
	        strokeOpacity: 1,
	        strokeWeight: 6,
	        strokeOpacity: 1,
	        fillColor: '#1791fc',
	        fillOpacity: 0.4,
	        // 线样式还支持 'dashed'
	        strokeStyle: "solid",
	        // strokeStyle是dashed时有效
	        // strokeDasharray: [30,10],
	      })	
			},
			editMet(){
				let that=this						
				    this.polygon = new AMap.Polygon({
				        path:this.newPath.toString()?this.newPath:this.path,
				        strokeColor: "#FF33FF", 
				        strokeWeight: 6,
				        strokeOpacity:0.9,
				        fillOpacity: 0.4,
				        fillColor: '#1791fc',
				        zIndex: 50,
				    })		
				   		   
				    this.map.add(this.polygon)
					this.map.setFitView([this.polygon])
					 this.polyEditor = new AMap.PolyEditor(this.map, this.polygon)
					  	 
					   this.polyEditor.open()
					   
					   this.polyEditor.on('addnode', function(event) {
					   	
//      			  console.log('触发事件：addnode')
    				})

				    this.polyEditor.on('adjust', function(event) {
//				        console.log('触发事件：adjust')
//				        console.log(event)
				    })
				
				    this.polyEditor.on('removenode', function(event) {
//				        console.log('触发事件：removenode')
				    })
					
				    this.polyEditor.on('end', function(event) {
				    	that.path=[]

				            for(let item of event.target.Ce.path){
						      	that.path.push([item.lng,item.lat])
						      }	
						
				          })
			},
			editFence(){				
				this.polyEditor.open()													     				    
			},
			enterFence(){				
				if(this.polyEditor.close){
				this.polyEditor.close()	
				}
				
			},
			backClick(){

				if(this.polyEditor.close){
				this.polyEditor.close()						
				}
				this.$emit('pathArrs',this.path)
				this.$emit('eleShow',false)
//				console.log(this.path)
				
			},
			loadmap(){
				let that = this
				 this.map =new AMap.Map('eleContainer', {
					zoom: 15,
					center: [this.userData.lon,this.userData.lat],
				});
				this.mouseTool = new AMap.MouseTool(this.map)	
				if(!this.newPath.toString()){
					this.drawPolygon()			
				    this.mouseTool.on('draw', function(event) {				    	
				    	let news=event.obj.getPath()
				      // event.obj 为绘制出来的覆盖物对象
			         //console.log(event.obj.Ke.path)
				      for(let item of news){
				      	that.path.push([item.lng,item.lat])
				      }	
				      that.mouseTool.close(true);
				      that.editMet()
				    })
				}else{
					 that.editMet()
				}
				
				
								    			    		
			}
		},
		
		mounted() {				
			this.loadmap()


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
		right: 12px;
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
		width: 280px;	
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