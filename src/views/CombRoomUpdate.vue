<template>
    <div class="room-update">

        <el-form ref="form" :model="formData" label-position="right" label-width="120px" :rules="formRules">
            <el-form-item label="组合名称：" prop="group_name">
                <el-input v-model="formData.group_name" type="text" placeholder="请输入房间名称（限20个字，建议说明时间、赛事等相关信息）" class="large"></el-input>
            </el-form-item>

            <el-form-item label="选择赛事：" required class="select-tournament" v-if="action == 'create'">
                <el-select v-model="form.tournamentSelect" multiple filterable placeholder="请选择" class="tournament">
                    <el-option v-for="(item,index) in form.tournamentSelectOptions" :label="item.label" :value="item.value" :key="index">
                        <img :src="item.icon"/>{{item.label}}
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="选择比赛：" required v-if="action == 'create'">
                <el-row class="box-wrap">
                    <el-col :span="4">
                        <div class="data-box date">
                            <div class="title">日期</div>
                            <div class="list">
                                <div class="item" v-for="item in form.matchList">
                                    <el-checkbox v-model="matchDateList" :indeterminate="item.list.length > item.selected && item.selected > 0" :label="item.date" @change="matchListDateChange">{{item.date}}</el-checkbox>
                                    <span class="stat">
                                            <span>{{item.selected}}</span>/<span>{{item.list.length}}</span>
                                        </span>
                                </div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="20">
                        <div class="data-box match">
                            <div class="title">比赛列表</div>
                            <div class="list">
                                <div class="date-match-box" :data-date="obj.date" v-for="(obj,i) in form.matchList">
                                    <div class="date">{{obj.date}}</div>
                                    <div class="item" :data-match-id="item.matchID" :class="{selected:item.selected}" @click="matchItemSelectedEvent(item,i,j)" v-for="(item,j) in obj.list">
                                        <div class="info">
                                            <span>ID：{{item.matchID}}</span>
                                            <span class="team-name">{{item.team_short_name_a}}</span>
                                            <img class="team-icon" :src="item.team_image_thumb_a"/>
                                            <span class="vs">vs</span>
                                            <img class="team-icon" :src="item.team_image_thumb_b"/>
                                            <span class="team-name">{{item.team_short_name_b}}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-form-item>

            <el-form-item label="身价中位数：" prop="avg_value" v-if="action == 'create'">
                <el-input v-model="formData.avg_value" class="mini" placeholder="生成身价中位数" readonly>
                    <el-button slot="append" type="primary" @click="requestAvgValue" :loading="form.avgValueLoading">生成</el-button>
                </el-input>
                <span class="tip">中位数为系统根据所选队伍中选手身价的平均值，仅做参考（身价最低为10）</span>
            </el-form-item>

            <el-form-item label="设置工资帽：" prop="salary_cap" v-if="action == 'create'">
                <el-input v-model="formData.salary_cap" class="mini" placeholder="设置工资帽" type="number"></el-input>
                <span class="tip">参考数值 <span class="light">{{parseInt(formData.avg_value * 5)}}</span> （身价中位数 * 5）</span>
            </el-form-item>

            <el-form-item label="房间截止时间：" prop="at_end_time">
                <el-date-picker v-model="formData.at_end_time" type="datetime" placeholder="选择日期时间" format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submit" :disabled="form.loading" :loading="form.loading">提交</el-button>
                <el-checkbox v-model="form.is_forced" class="form-submit-action-check" v-if="form.code == 40310"> 强制提交</el-checkbox>
            </el-form-item>

        </el-form>

    </div>
</template>

<script>
    export default {
        data () {
            return {
                action: 'create',
                stepActive: 0,
                form: {
                    is_forced: false,
                    loading: false,
                    selectMatchListDate: [],
                    selectDateMatchList: [],
                    tournamentSelect: [],
                    tournamentSelectOptions: [],
                    matchList: {},
                    _matchList: {},
                    roomEndDateTime: '',
                    totalBonuses: 100,
                    at_end_time: '',
                    code: ''
                },
                formData: {
                    group_name: '',
                    avg_value: '',
                    salary_cap: '200',
                    matchID: [],
                    at_end_time: '',
                    is_forced: 0
                },
                formRules: {
                    group_name: [{required: true, message: '房间名称不能为空'}],
                    at_end_time: [{required: true, message: '房间截至时间不能为空'}],
                    avg_value: [{required: true, message: '身价中位数不能为空'}],
                    salary_cap: [{required: true, message: '工资帽不能为空'}],
                }
            }
        },
        created () {
            if (this.$route.name === 'comb-room-update') {
                this.action = 'update'
                this.requestRoomData({groupID:this.$route.params.id})
            } else {
//                this.computeDistributionItems();
                this.requestTournamentList();
            }
        },
        watch: {
            'form.is_forced' (val) {
                this.formData.is_forced = val === true ? 1 : 0
            },
            'form.tournamentSelect' (data) {
                this.form.selectMatchListDate = [];
                this.requestMatchList(data.join());
            },
            'form.matchList': {
                handler: function (data) {
                    this.formData.matchID = []
                    for (let date in data) {
                        for (let i in data[date].list) {
                            if (data[date].list[i].selected) {
                                this.formData.matchID.push(data[date].list[i].matchID)
                            }
                        }
                    }

                    let selectMatchItem = []
                    for (let i in this.formData.matchID) {
                        selectMatchItem.push(this.form._matchList[this.formData.matchID[i]])
                    }
                    selectMatchItem.sort(function (a, b) {
                        return a.start_datetime - b.start_datetime
                    })
                    let _earliestDatetime = selectMatchItem.length ? selectMatchItem[0].start_datetime : '';
//                    this.formData.at_end_time_temp = _earliestDatetime
                    this.formData.at_end_time = _earliestDatetime
                },
                deep: true
            },
            'formData.at_end_time' (val) {
                if (val) {
                    this.formData.at_end_time = this.moment(val).format('YYYY-MM-DD HH:mm:ss')
                }
            }
        },
        computed: {
            matchDateList () {
                let list = [];
                for (let date in this.form.matchList) {
                    if (this.form.matchList[date].selected === this.form.matchList[date].list.length) {
                        list.push(date)
                    }
                }
                return list
            },
            selectTournament () {
                let tournamentObj = {}
                for (let i in this.form.tournamentSelectOptions) {
                    tournamentObj[this.form.tournamentSelectOptions[i].value] = this.form.tournamentSelectOptions[i]
                }
                let selectTournament = []
                for (let i in this.form.tournamentSelect) {
                    selectTournament.push(tournamentObj[this.form.tournamentSelect[i]])
                }
                return selectTournament
            },
            selectMatch () {
                let matchList = []
                for (let i in this.formData.matchID) {
                    matchList.push(this.form._matchList[this.formData.matchID[i]])
                }
                return matchList
            }
        },
        methods: {
            requestRoomData (params) {
                const _this = this;
                this.ajax('edit_combination.php',params, function (response) {
                    if (response.data.code == 200) {
                        _this.formData = response.data.data.info
                    } else {
                        _this.$message.error({
                            message: response.data.message,
                        })
                    }
                })
            },
            requestTournamentList () {
                const _this = this;
                this.ajax('get_tournament_list.php', function (response) {
                    if (response.data.code == 200) {
                        for (let i in response.data.data.list) {
                            _this.form.tournamentSelectOptions.push({
                                icon: response.data.data.list[i].image,
                                label: response.data.data.list[i].short_name,
                                value: response.data.data.list[i].tournamentID
                            })
                        }
                    }
                })
            },
            requestMatchList (tournament_id) {
                const _this = this;
                _this.form.matchList = {};
                _this.form._matchList = {};
                this.ajax('get_match_list.php', {tournament_id: tournament_id}, function (response) {
                    if (response.data.code == 200) {
                        _this.form.matchList = response.data.data;
                        for (let date in response.data.data) {
                            let dateMatchList = response.data.data[date]
                            _this.form.matchList[date] = {
                                selected: 0,
                                date: date,
                                list: dateMatchList
                            }
                            for (let i in dateMatchList) {
                                _this.form._matchList[dateMatchList[i].matchID] = dateMatchList[i]
                            }
                        }
                    }
                })
            },
            requestAvgValue () {
                const _this = this;
                if (!_this.formData.matchID.length) {
                    _this.$message({
                        message: '生成身价中位数之前至少需要选择一场比赛',
                        type: 'warning'
                    })
                    return
                }
                _this.form.avgValueLoading = true;
                this.ajax('get_fantasy_median.php', {match_id: this.formData.matchID.join()}, function (response) {
                    if (response.data.code == 200) {
                        _this.$message({
                            message: response.data.message
                        });
                        _this.formData.avg_value = response.data.data;
                    } else {
                        _this.$message.error({
                            message: response.data.message,
                        });
                    }
                    _this.form.avgValueLoading = false;
                })
            },
            requestUpdateRoom () {
                let _this = this
                this.form.loading = true
                _this.form.code = -1;
                if (this.$route.name === 'comb-room-create') {
                    this.ajax('create_combination.php', 'post', this.formData, function (response) {
                        _this.form.code = response.data.code
                        if (response.data.code == 200) {
                            _this.$message({
                                message: response.data.message,
                                type: 'success'
                            });
                            _this.$router.push({path: '/comb-room'})
                        } else {
                            _this.$message.error({
                                message: response.data.message,
                            });
                        }
                        _this.form.loading = false
                    })

                } else {
                    this.ajax('edit_combination.php', 'post', {
                        groupID: this.$route.params.id,
                        action: 'edit',
                        name: this.formData.group_name,
                        at_end_time: this.formData.at_end_time
                    }, function (response) {
                        if (response.data.code == 200) {
                            _this.$message({
                                message: response.data.message,
                                type: 'success'
                            });
                            _this.$router.push({path: '/comb-room'})
                        } else {
                            _this.$message.error({
                                message: response.data.message,
                            });
                        }
                        _this.form.loading = false
                    })
                }
            },
            submit () {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.requestUpdateRoom()
                    } else {
                        return false;
                    }
                });
            },
            matchItemSelectedEvent (item, date, index) {
                let _item = this.$(event.currentTarget)
                if (_item.hasClass('selected')) {
                    this.form.matchList[date].selected--;
                } else {
                    this.form.matchList[date].selected++;
                }
                item.selected = !item.selected
//                _item.toggleClass('selected')
            },
            matchListDateChange () {
                let checkbox = event.currentTarget
                if (checkbox.checked) {
                    this.form.matchList[checkbox.value].selected = this.form.matchList[checkbox.value].list.length
                } else {
                    this.form.matchList[checkbox.value].selected = 0
                }
                for (let i in this.form.matchList[checkbox.value].list) {
                    this.form.matchList[checkbox.value].list[i].selected = checkbox.checked
                }
            }
        }
    }
</script>

<style>
    .room-create-steps {
        text-align: center;
    }

    .el-select .el-input {
        /*width: 110px;*/
    }

    .el-select.full .el-input {
        width: 100%;
    }

    .distribution-detail .row {
        width: 570px;
        display: table;
    }

    .distribution-detail .row + .row {
        margin-top: 10px;
    }

    .distribution-detail .col {
        display: table-cell;
        text-align: center;
    }

    .distribution-detail .col.people {
        width: 270px;
    }

    .distribution-detail .col .el-form-item > * {
        float: left;
    }

    .distribution-detail .col input {
        text-align: center;
    }

    .distribution-detail .col.people .el-form-item__label {
        width: 80px !important;
    }

    .distribution-detail .col.people .el-form-item__content {
        width: 160px;
    }

    .distribution-detail .col.people .el-input-group--append > * {
        width: 80px;
    }

    .distribution-detail .col.money {
        width: 200px;
        text-align: left;
    }

    .distribution-detail .col.money .el-form-item__label {
        width: 90px !important;
    }

    .distribution-detail .col.money .el-form-item__content {
        width: 90px;
    }

    .distribution-detail .col.actions {
        width: 100px;
        text-align: center;
    }

    .el-select-dropdown__item {
        padding: 0 10px;
        height: 36px;
        line-height: 36px;
    }

    .el-select.tournament {
        width: 600px;
    }

    .el-step__title {
        margin-left: -25px;
    }

    .roomInfo .el-tag + .el-tag {
        margin-left: 10px;
    }

    .assign-plan-table {
        border-radius: 4px;
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 10px;
    }


    .assign-plan-table th,
    .assign-plan-table td {
        border: 1px solid #dfe6ec;
        text-align: center;
    }

    .cover-image {
        height: 100px;
        width: auto;
        margin-top: 22px;
    }

    .form-submit-action-check {
        margin-left: 15px;
    }
</style>
