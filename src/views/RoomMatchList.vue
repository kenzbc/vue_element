<template>
    <div class="room-match-list">
        <el-form :inline="true">
            <el-form-item>
                房间ID：{{room_id}}
                房间名称：{{room_name}}
            </el-form-item>
            <el-form-item style="float:right;margin-right: 0">
                <el-button type="success" @click="roomAction('finish')" v-loading.fullscreen.lock="fullscreenLoading">结算</el-button>
                <el-button type="info" @click="roomAction('data')" v-loading.fullscreen.lock="fullscreenLoading">重新获取全部数据</el-button>
                <el-button type="default" icon="arrow-left" @click="back">返回</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="tableData" border stripe v-loading="loading">
            <el-table-column align="center" prop="matchID" label="对局ID"></el-table-column>
            <el-table-column align="center" prop="start_time" label="比赛日" width="160"></el-table-column>
            <el-table-column align="center" label="赛制" width="100">
                <template scope="scope">BO{{scope.row.game_count}}</template>
            </el-table-column>
            <el-table-column align="center" prop="team_short_name_a" label="队伍A"></el-table-column>
            <el-table-column align="center" label="比分" width="80">
                <template scope="scope">
                    {{scope.row.team_a_win}} ： {{scope.row.team_b_win}}
                </template>
            </el-table-column>
            <el-table-column align="center" prop="team_short_name_b" label="队伍B"></el-table-column>
            <el-table-column align="center" prop="name" label="赛事" width="250"></el-table-column>
            <el-table-column align="center" prop="round_name" label="阶段"></el-table-column>
            <el-table-column align="center" label="比赛状态" width="130">
                <template scope="scope">
                    {{scope.row.m_status == 0 ? '未开始' : (scope.row.m_status == 1 ? '进行中' : '已结束')}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="数据状态">
                <template scope="scope">
                    {{scope.row.rm_status == 0 ? '暂无数据' : (scope.row.rm_status == 1 ? '获取中' : '获取结束')}}
                </template>
            </el-table-column>
            <el-table-column align="center" prop="date" label="操作">
                <template scope="scope">
                    <el-badge :value="scope.row.result_num" class="button">
                        <el-button size="small" type="info" @click="roomAction('data',scope.row)" v-loading.fullscreen.lock="fullscreenLoading">获取数据</el-button>
                    </el-badge>
                    <el-button size="small" type="danger" @click="roomAction('close',scope.row)" v-loading.fullscreen.lock="fullscreenLoading">结束</el-button>
                </template>
            </el-table-column>
            <el-table-column width="80" type="expand">
                <template scope="scope">
                    <el-row class="match-player-team">
                        <el-col :span="12">{{scope.row.team_short_name_a}}</el-col>
                        <el-col :span="12">{{scope.row.team_short_name_b}}</el-col>
                    </el-row>
                    <el-row class="match-player-expand">
                        <el-col :span="12">
                            <el-col :span="4" v-for="(item,index) in scope.row.team_a_player_list" :key="index">
                                <el-card class="match-player">
                                    <img :src="item.player_image || 'http://img1.famulei.com/z/0/p/174/2711010166345_100X100.png'" class="image">
                                    <div class="content">
                                        <div class="name">{{item.player_nickname}}</div>
                                        <div class="posAndPos"><span class="pos">{{position(item.positionID)}}</span><span class="score">{{item.score}}</span></div>
                                    </div>
                                </el-card>
                            </el-col>
                        </el-col>
                        <el-col :span="12">
                            <el-col :span="4" v-for="(item,index) in scope.row.team_b_player_list" :key="index">
                                <el-card class="match-player">
                                    <img :src="item.player_image || 'http://img1.famulei.com/z/0/p/174/2711010166345_100X100.png'" class="image">
                                    <div class="content">
                                        <div class="name">{{item.player_nickname}}</div>
                                        <div class="posAndPos"><span class="pos">{{position(item.positionID)}}</span><span class="score">{{item.score}}</span></div>
                                    </div>
                                </el-card>
                            </el-col>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                roomID: 0,
                groupID: 0,
                queryParams: {
                    page: 1,
                    limit: 15,
                },
                tableData: [],
                loading: false,
	            fullscreenLoading: false,
                total: 0,
                room_id: 0,
                room_name: '',
                room_type:''
            }
        },
        watch: {
            queryParams: {
                handler (data,oldData) {
                    if (!isNaN(data.page) || !isNaN(data.limit)) {
                        data.limit = parseInt(data.limit)
                        data.page = parseInt(data.page)
                    }
                    this.$router.push({
                        path: '',
                        query: data
                    })
                },
                deep: true
            }
        },
        mounted () {
            this.roomID = this.$route.params.id
            this.groupID = this.$route.params.id
            this.requestList()
        },
        methods: {
            position (index) {
                let arr = ['','ADC','中单','上单','打野','辅助']
                return arr[index]
            },
            back () {
                this.$router.back();
            },
            requestList () {

                let _this = this;
                // localStorage.setItem('room_page',_this.$route.query.room_page)

                _this.loading = true;
                if (this.$route.name === 'comb-room-match-list') {
                    this.ajax('room_match_list.php', {groupID: this.groupID}, function (response) {
                        _this.loading = false
                        _this.tableData = response.data.data
                    });
                }else{
                    this.ajax('room_match_list.php', {roomID: this.roomID}, function (response) {
                        _this.loading = false
                        _this.tableData = response.data.data
                    });
                }
                _this.room_id = _this.$route.query.room_id;
                _this.room_name = _this.$route.query.room_name;
                _this.room_type = _this.$route.query.room_type;

            },
            roomAction (type,row) {
	            // this.fullscreenLoading = true;
                switch (type) {
                    case 'data':
                        let params = this.$route.name === 'comb-room-match-list'?{groupID: this.groupID}:{roomID: this.roomID}
                        if (row) {
                            params.match_id = row.matchID
                        }
                        this.$confirm('确定要获取' + (row ? '这场' : '全部') + '比赛的数据吗？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
	                        this.fullscreenLoading = true;
                            this.ajax('get_match_data.php', params, (response)=> {
	                            this.fullscreenLoading = false;
	                            if (response.data.code == 200) {
                                    this.$message({
                                        type: 'success',
                                        message: response.data.message
                                    })
                                    this.requestList()
                                } else {
                                    this.$message.error({
                                        message: response.data.message,
                                    })
                                }
                            })
                        })
                        break
                    case 'close':
                        this.$confirm('确定要结束这场比赛吗？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
	                        this.fullscreenLoading = true;
                            if (this.$route.name === 'comb-room-match-list') {
                                this.ajax('settlement_group.php', {group_id: this.groupID}, (response)=> {
	                                // this.loading = false
	                                this.ajax('finish_match.php', {group_id: this.groupID,match_id: row.matchID}, (response)=> {
		                                if (response.data.code == 200) {
			                                this.fullscreenLoading = false;
			                                this.$message({
				                                type: 'success',
				                                message: response.data.message
			                                })
			                                this.requestList()
		                                } else {
			                                this.$message.error({
				                                message: response.data.message,
			                                })
		                                }
	                                })
                                })
                            }else{
                                this.ajax('settlement.php', {roomID: row.roomID}, (response)=> {
                                	//this.loading = false
	                                this.ajax('finish_match.php', {roomID: this.roomID,match_id: row.matchID}, (response)=> {
		                                this.fullscreenLoading = false;
		                                if (response.data.code == 200) {
			                                this.$message({
				                                type: 'success',
				                                message: response.data.message
			                                })
			                                this.requestList()
		                                } else {
			                                this.$message.error({
				                                message: response.data.message,
			                                })
		                                }
	                                })
                                })
                            }

                        })
                        break
                    case 'finish':
                        this.$confirm('确定要结算这个房间吗？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
	                        this.fullscreenLoading = true;
                            if (this.$route.name === 'comb-room-match-list') {
                                this.ajax('settlement_group.php', {group_id: this.groupID},  (response) => {
	                                this.fullscreenLoading = false;
                                    if (response.data.code == 200) {
                                        this.$message({
                                            type: 'success',
                                            message: response.data.message
                                        })
                                        this.requestList()
                                    } else {
                                        this.$message.error({
                                            message: response.data.message,
                                        })
                                    }
                                    this.dialog.visible = false
                                })
                            }else{
                                this.ajax('settlement.php', {roomID: this.roomID}, (response) => {
	                                this.fullscreenLoading = false;
                                    if (response.data.code == 200) {
                                        this.$message({
                                            type: 'success',
                                            message: response.data.message
                                        })
                                        this.requestList()
                                    } else {
                                        this.$message.error({
                                            message: response.data.message,
                                        })
                                    }
                                    this.dialog.visible = false
                                })
                            }

                        })
                        break
                }
            }
        }
    }
</script>

<style>
    .match-player-team .el-col-12,
    .match-player-expand .el-col-12 {
        width: 49%;
    }

    .match-player-team .el-col-12:nth-child(2),
    .match-player-expand .el-col-12:nth-child(2) {
        margin-left: 2%;
    }

    .el-card.match-player {
        margin: 0 5px 10px 5px;
    }

    .match-player-team .el-col-12 {
        padding: 0 5px;
        line-height: 40px;
        font-weight: bold;
        font-size: 16px;
    }

    .el-card.match-player .content {
        padding: 0;
        line-height: 26px;
        font-size: 12px;
    }

    .el-card.match-player .content .name {
        padding: 0 10px;
        font-size: 14px;
        text-align: center;
    }

    .el-card.match-player .content .posAndPos {
        background-color: #475669;
        color: #fff;
        padding: 0 10px;
        height: 26px;
    }

    .el-card.match-player .content .posAndPos > span {
        display: inline-block;
    }

    .el-card.match-player .content .posAndPos .pos {
        float: left;
    }

    .el-card.match-player .content .posAndPos .score {
        float: right;
    }

    .el-card.match-player .el-card__body {
        padding: 0;
    }

    .el-card.match-player .el-card__body img {
        width: 100%;
        background-color: #e2e2e2;
        min-height: 123px;
    }
</style>
