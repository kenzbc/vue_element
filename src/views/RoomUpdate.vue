<template>
    <div class="room-update">
        <el-steps class="room-create-steps" :space="300" :active="stepActive" finish-status="success">
            <el-step title="配置房间类型"></el-step>
            <el-step title="配置房间赛事"></el-step>
            <el-step title="配置奖金方案"></el-step>
            <el-step title="配置房间属性"></el-step>
        </el-steps>

        <div v-show="stepActive == 0">
            <el-form ref="typeForm" :model="formData" label-position="right" label-width="120px" :rules="formRules[0]">
                <el-form-item label="房间类型：" :prop="formData.type == 6 ? 'starID' : 'type'">
                    <el-input placeholder="请输入名人ID" v-model="formData.starID" class="mini" v-show="formData.type == 6">
                        <el-select v-model="formData.type" filterable placeholder="选择类型" slot="prepend" class="mini-select">
                            <el-option v-for="item in form.roomTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-input>
                    <el-select v-model="formData.type" filterable placeholder="请选择" class="full mini" v-show="formData.type != 6">
                        <el-option v-for="item in form.roomTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="门票价格：" prop="price">
                    <el-input v-model="formData.price" class="mini" min="0" type="number" placeholder="设置门票价格"></el-input>
                </el-form-item>

                <el-form-item label="人数上限：" prop="num">
                    <el-input v-model="formData.num" class="mini" min="1" type="number" :readonly="formData.type == 5" placeholder="设置房间上限人数"></el-input>
                </el-form-item>

                <el-form-item label="最低人数：" prop="num_limit" v-show="formData.is_must_open == 0">
                    <el-input v-model="formData.num_limit" class="mini" min="1" type="number" placeholder="设置房间最低人数"></el-input>
                </el-form-item>

                <el-form-item label="是否必开：" required>
                    <el-radio-group v-model="formData.is_must_open">
                        <el-radio-button label="1" :disabled="formData.type == 5">必开</el-radio-button>
                        <el-radio-button label="0">非必开</el-radio-button>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="参与次数：" prop="times">
                    <el-input v-model="formData.times" class="mini" type="number" :readonly="formData.type == 5" placeholder="建议1~5"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="next">下一步</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div v-show="stepActive == 1">
            <el-form ref="matchForm" :model="formData" label-position="right" label-width="120px" :rules="formRules[1]">
                <el-form-item label="选择赛事：" required class="select-tournament">
                    <el-select v-model="form.tournamentSelect" multiple filterable placeholder="请选择" class="tournament">
                        <el-option v-for="item in form.tournamentSelectOptions" :key="item.value" :label="item.label" :value="item.value">
                            <img :src="item.icon"/>{{item.label}}
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="选择比赛：" required>
                    <el-row class="box-wrap">
                        <el-col :span="4">
                            <div class="data-box date">
                                <div class="title">日期</div>
                                <div class="list">
                                    <div class="item" v-for="item in form.matchList" :key="item.id">
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

                <el-form-item label="身价中位数：" prop="avg_value">
                    <el-input v-model="formData.avg_value" class="mini" placeholder="生成身价中位数" readonly>
                        <el-button slot="append" type="primary" @click="requestAvgValue" :loading="form.avgValueLoading">生成</el-button>
                    </el-input>
                    <span class="tip">中位数为系统根据所选队伍中选手身价的平均值，仅做参考（身价最低为10）</span>
                </el-form-item>

                <el-form-item label="设置工资帽：" prop="salary_cap">
                    <el-input v-model="formData.salary_cap" class="mini" placeholder="设置工资帽" type="number"></el-input>
                    <span class="tip">参考数值 <span class="light">{{parseInt(formData.avg_value * 5)}}</span> （身价中位数 * 5）</span>
                </el-form-item>

                <el-form-item label="房间截至时间：" prop="">
                    <el-date-picker v-model="formData.at_end_time_temp" type="datetime" placeholder="选择日期时间" readonly format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                    <span class="tip">选择比赛后自动生成（所选择比赛中最早开始那一场的时间）</span>
                </el-form-item>

                <el-form-item>
                    <el-button type="" @click="prev">上一步</el-button>
                    <el-button type="primary" @click="next">下一步</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div v-show="stepActive == 2">
            <el-form ref="bonusForm" :model="formData" label-position="right" label-width="120px" :rules="formRules[2]">
                <el-form-item label="奖金总数：" prop="prize_amount">
                    <el-input :placeholder="form.bonusesTypeSetting[formData.prize_type].placeholder" :type="form.bonusesTypeSetting[formData.prize_type].type" v-model="formData.prize_amount" class="small">
                        <el-select v-model="formData.prize_type" slot="prepend" class="mini-select">
                            <el-option label="果子" value="1"></el-option>
                            <el-option label="门票" value="2"></el-option>
                            <el-option label="其他" value="3"></el-option>
                        </el-select>
                        <template slot="append" v-if="formData.prize_type==1">参考值：{{parseInt(formData.num * formData.price * 0.7 * 10)}} - {{parseInt(formData.num * formData.price * 0.8 * 10)}}</template>
                        <template slot="append" v-if="formData.prize_type==2">参考值：{{parseInt(formData.num * formData.price * 0.7)}} - {{parseInt(formData.num * formData.price * 0.8)}}</template>
                    </el-input>
                    <span class="tip">{{form.bonusesTypeSetting[formData.prize_type].tip}}</span>
                </el-form-item>

                <el-form-item label="中奖范围：" prop="prize_num" v-if="formData.type != 6" required>
                    <el-input :placeholder="form.prizeTypeSetting[formData.prize_range].placeholder" type="number" v-model="formData.prize_num" class="small">
                        <el-select v-model="formData.prize_range" slot="prepend" class="mini-select" :disabled="formData.prize_type == 3">
                            <el-option label="固定人数" value="1"></el-option>
                            <el-option label="固定比例" value="2"></el-option>
                        </el-select>
                        <template slot="append" v-if="formData.prize_range == 1">人数上限：{{formData.num}}</template>
                        <template slot="append" v-else>比例上限：100</template>
                    </el-input>
                    <span class="tip">{{form.prizeTypeSetting[formData.prize_range].tip}}</span>
                </el-form-item>

                <el-form-item label="分配方案：" prop="assign_plan" v-if="formData.type != 6" required>
                    <el-input :placeholder="form.distributionTypeSetting[formData.assign_plan].placeholder" readonly v-model="assignPlanDesc" class="small">
                        <el-select v-model="formData.assign_plan" slot="prepend" class="mini-select" :disabled="formData.prize_range == 2 || formData.prize_type == 3">
                            <el-option label="均分" value="1"></el-option>
                            <el-option label="梯度" value="2"></el-option>
                        </el-select>
                    </el-input>
                </el-form-item>

                <el-form-item class="distribution-detail" v-if="formData.assign_plan == '2'">
                    <div class="row">
                        <div class="col people">
                            合计人数：{{form.checkDistribution.sumNum}}
                        </div>
                        <div class="col money">
                            合计金额：{{form.checkDistribution.sumAmount}}
                        </div>
                    </div>
                    <div class="row" v-for="(item,index) in distributionItems">
                        <div class="col people">
                            <el-form-item label="人数：">
                                <el-input v-model="item.people" min="0" type="number" @keyup="computeDistributionItems()">
                                    <template slot="append">{{item.start}} - {{item.end}} 名</template>
                                </el-input>
                            </el-form-item>
                        </div>
                        <div class="col money">
                            <el-form-item label="人均金额：">
                                <el-input v-model="item.money" min="0" type="number"></el-input>
                            </el-form-item>
                        </div>
                        <div class="col actions">
                            <div v-if="index == distributionItems.length - 1">
                                <el-button type="danger" icon="minus" class="action-btn" @click="minusItem" :disabled="index==0"></el-button>
                                <el-button type="success" icon="plus" class="action-btn" @click="plusItem"></el-button>
                            </div>
                        </div>
                    </div>
                </el-form-item>

                <el-form-item >
                    <div class="el-form-item__error" v-if="formData.assign_plan == 2 && form.checkDistribution.message" v-text="form.checkDistribution.message" style="line-height: 0;width: 450px;"></div>
                </el-form-item>

                <el-form-item>
                    <el-button @click="prev">上一步</el-button>
                    <el-button type="primary" @click="next" :disabled="formData.assign_plan == 2 && form.checkDistribution.message != ''">下一步</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div v-show="stepActive == 3">
            <el-form ref="attributeForm" :model="formData" label-position="right" label-width="150px" :rules="formRules[3]">
                <el-form-item label="房间名称：" prop="name">
                    <el-input v-model="formData.name" type="text" placeholder="请输入房间名称（限20个字，建议说明时间、赛事等相关信息）" class="large"></el-input>
                </el-form-item>

                <el-form-item label="房间描述：" prop="room_desc" required>
                    <el-input v-model="formData.room_desc" type="text" placeholder="请输入房间描述（限30个字，一般用于填写奖励方案）" class="large" :disabled="parseInt(formData.group_id) !== 0"></el-input>
                </el-form-item>

                <el-form-item label="帖子ID：" prop="dynamicID">
                    <el-input v-model="formData.dynamicID" type="text" placeholder="请输入帖子ID（用于范特西聊天室）" class="mini" :disabled="parseInt(formData.group_id) !== 0"></el-input>
                </el-form-item>

                <el-form-item label="房间封面：" prop="cover_id">
                    <el-select v-model="formData.cover_id" placeholder="选择房间封面" clearable filterable  :disabled="parseInt(formData.group_id) !== 0">
                        <el-option v-for="item in form.coverList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                    <div v-if="this.formData.cover_url"><img class="cover-image" :src="this.formData.cover_url" /></div>
                    <div v-else=""></div>
                </el-form-item>

                <el-form-item label="房间截至时间：" prop="at_end_time">
                    <el-date-picker v-model="formData.at_end_time" type="datetime" placeholder="房间截至时间" format="yyyy-MM-dd HH:mm:ss"  :disabled="parseInt(formData.group_id) !== 0"></el-date-picker>
                    <span class="tip">控制该房间最后参与的截至时间</span>
                </el-form-item>

                <el-form-item label="房间信息：" v-if="action == 'create'">
                    <el-row :gutter="20" class="roomInfo">
                        <el-col :span="3">
                            <el-card>
                                <div slot="header" class="clearfix">房间设置</div>
                                <div>房间类型：{{form.roomTypeOptions[formData.type - 1].label}}</div>
                                <div v-if="formData.type == 6">名人ＩＤ：{{formData.starID}}</div>
                                <div>人数上限：{{formData.num}}</div>
                                <div>参与次数：{{formData.times}}</div>
                                <div>门票价格：{{formData.price}}</div>
                                <div>是否必开：{{formData.is_must_open == '1' ? '必开' : '非必开'}}</div>
                            </el-card>
                        </el-col>
                        <el-col :span="7">
                            <el-card>
                                <div slot="header" class="clearfix">比赛信息</div>
                                <div>身价中位数：{{formData.avg_value}}</div>
                                <div>工资帽：{{formData.salary_cap}}</div>
                                <div>所选比赛：<el-tag v-for="item in selectTournament" :key="item.id">{{item.label}}</el-tag></div>
                                <div>所选赛事：</div>
                                <div class="select-match-list">
                                    <div class="item" v-for="item in selectMatch">
                                        <div class="info"><span>ID：{{item.matchID}}</span> <span class="team-name">{{item.team_short_name_a}}</span> <img :src="item.team_image_thumb_a" class="team-icon"> <span class="vs">vs</span> <img :src="item.team_image_thumb_b" class="team-icon"> <span class="team-name">{{item.team_short_name_b}}</span></div>
                                    </div>
                                </div>
                            </el-card>
                        </el-col>
                        <el-col :span="6">
                            <el-card>
                                <div slot="header" class="clearfix">奖金分配</div>
                                <div>奖金总额：{{formData.prize_amount}}</div>
                                <div>中奖范围：{{formData.prize_num}}（{{formData.prize_range == 1 ? '固定人数' : '固定比例'}}）</div>
                                <div>分配方案：{{formData.assign_plan == 1? '均分' : '梯度'}}</div>
                                <div v-if="formData.assign_plan == 2">
                                    <table class="assign-plan-table">
                                        <thead>
                                            <tr>
                                                <th width="80">#</th>
                                                <th width="100">人数</th>
                                                <th>人均分配金额</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item,index) in formData.assign_plan_num">
                                                <td>{{index+1}}</td>
                                                <td>{{item}}</td>
                                                <td>{{formData.assign_plan_amount[index]}}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                </el-form-item>

                <el-form-item label="发布渠道：" prop="thirdParty">
                    <el-select v-model="form.thirdParty" multiple placeholder="请选择渠道" filterable style="width: 600px;">
                        <el-option v-for="item in thirdParty" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="属性：">
                    <el-checkbox v-model="form.is_experience_room">体验房</el-checkbox>
                </el-form-item>

                <el-form-item>
                    <el-button type="" @click="prev" :disabled="form.loading || action!='create'">上一步</el-button>
                    <el-button type="primary" @click="submit" :disabled="form.loading" :loading="form.loading">提交</el-button>
                    <el-checkbox v-model="form.is_forced" class="form-submit-action-check" v-if="form.code == 40310"> 强制提交</el-checkbox>
                </el-form-item>
            </el-form>
        </div>

    </div>
</template>

<script>
    export default {
        data () {
            let prize_num_rule = (rule, value, callback) => {
                let _type = {1: '中奖范围的人数', 2: '中奖范围的比例'}
                let type = _type[this.formData.prize_range]
                let max = this.formData.prize_range == 1 ? this.formData.num : 100
                max = parseInt(max)
                value = parseInt(value)
                if (!value) {
                    return callback(new Error(type + '不能为空'));
                } else if (value < 1) {
                    callback(new Error(type + '不能小于1'));
                } else if (value > max) {
                    callback(new Error(type + '不能超过' + (this.formData.prize_range == 1 ? '房间总人数：':'') + max))
                } else {
                    callback();
                }
            }
            return {
                action: 'create',
                stepActive: 0,
                formRef: ['typeForm', 'matchForm', 'bonusForm', 'attributeForm'],
                form: {
                    is_forced: false,
                    coverList: [],
                    _coverList: {},
                    checkDistribution : {
                        sumNum: 0,
                        sumAmount: 0,
                        message: ''
                    },
                    loading: false,
                    avgValueLoading: false,
                    roomType: '',
                    starName: '',
                    roomTypeOptions: [
                        {
                            value: '1',
                            label: '新人'
                        },
                        {
                            value: '2',
                            label: '活动'
                        },
                        {
                            value: '3',
                            label: '日赛'
                        },
                        {
                            value: '4',
                            label: '周赛'
                        },
                        {
                            value: '5',
                            label: 'SOLO'
                        },
                        {
                            value: '6',
                            label: '名人'
                        },
                        {
                            value: '7',
                            label: '毒奶'
                        }
                    ],
                    isRequiredOptions: 1,
                    ticketPrice: '',
                    maxPeople: '',
                    participateCount: '',
                    selectMatchListDate: [],
                    selectDateMatchList: [],
                    tournamentSelect: [],
                    tournamentSelectOptions: [],
                    matchList: {},
                    _matchList: {},
                    price: 0,
                    wage: 200,
                    roomEndDateTime: '',
                    totalBonuses: 100,
                    bonusesType: '1',
                    bonusesTypeSetting: {
                        1: {
                            type: 'number',
                            placeholder: '输入果子数量',
                            tip: '果子，可参考人数上限 * 门票 * 0.7 - 0.8 *  10'
                        },
                        2: {
                            type: 'number',
                            placeholder: '输入门票数量',
                            tip: '门票，可参考人数上限 * 门票 * 0.7 - 0.8'
                        },
                        3: {
                            type: 'text',
                            placeholder: '输入奖励内容',
                            tip: '例如战队周边等需要后期手工发放的奖品'
                        }
                    },
                    prize: '',
                    prizeType: '1',
                    prizeTypeSetting: {
                        1: {
                            placeholder: '输入人数',
                            tip: '固定人数，数字代表人数，不可超过房间总人数'
                        },
                        2: {
                            placeholder: '输入比例',
                            tip: '固定比例，数值代表百分比，不可超过10'
                        }
                    },
                    distribution: '',
                    distributionType: 'trapezoid',
                    distributionTypeSetting: {
                        1: {
                            placeholder: '自动计算平均分到的将金数'
                        },
                        2: {
                            placeholder: '可用金额'
                        }
                    },
                    at_end_time: '',
                    code: '',
                    thirdParty: [],
                    is_experience_room: false
                },
                formData: {
                    starID: '',
                    name: '',
                    room_desc: '',
                    dynamicID: '',
                    price: '',
                    num: '',
	                num_limit:'0',
                    is_must_open: 1,
                    times: '',
                    type: '1',
                    avg_value: '',
                    salary_cap: '200',
                    prize_type: '1',
                    prize_amount: '',
                    prize_range: '1',
                    prize_num: '',
                    assign_plan: '1',
                    assign_plan_num: [],
                    assign_plan_amount: [],
                    matchID: [],
                    at_end_time: '',
                    cover_id: '',
                    cover_url: '',
                    is_forced: 0,
                    group_id: 0,
                    thirdParty: '',
                    is_experience_room: 0
                },
                formRules: [
                    {
                        starID: [{required: true, message: '请输入名人ID'}],
                        type: [{required: true, message: '请选择活动区域'}],
                        price: [{required: true, message: '门票价格不能为空'},],
                        num: [{required: true, message: '人数上限不能为空'},],
                        times: [{required: true, message: '参与次数不能为空'},]

                    },
                    {
                        avg_value: [{required: true, message: '身价中位数不能为空'}],
                        salary_cap: [{required: true, message: '工资帽不能为空'}],
                        at_end_time_temp: [{required: true, message: '房间截至时间不能为空'}]
                    },
                    {
                        prize_amount: [{required: true, message: '奖励内容不能为空'}],
                        prize_num: [{validator: prize_num_rule}]
                    },
                    {
                        name: [{required: true, message: '房间名称不能为空'}],
                        room_desc: [{required: true, message: '房间描述不能为空'}],
                        dynamicID: [{required: false, message: '帖子ID不能为空'}],
                        at_end_time: [{required: true, message: '房间截至时间不能为空'}],
                        thirdParty: [{required: true, message: '至少选择一个发布渠道'}],
//                        cover_id: [{required: true, message: '必须选择房间封面'}]
                    }
                ],
                distributionItems: [
                    {
                        people: 1,
                        money: 0
                    }
                ],
                thirdParty: []
            }
        },
        created () {
            this.requestCoverList()
        },
        mounted () {
            if (this.$route.name === 'room-update') {
                this.action = 'update'
                this.stepActive = 3
                this.requestRoomData({roomID:this.$route.params.id})
            } else {
                this.computeDistributionItems();
                this.requestTournamentList();
            }
            this.requestRoomThirdPartyList()
        },
        watch: {
            'form.thirdParty' (data) {
                this.formData.thirdParty = data.join()
            },
            'form.is_experience_room' (data) {
                this.formData.is_experience_room = data ? 1 : 0
            },
            'form.is_forced' (val) {
                this.formData.is_forced = val === true ? 1 : 0
            },
            'formData.type' (val) {
                if (val == 5) {
                    this.formData.is_must_open = 0;
                    this.formData.num = 2;
                    this.formData.times = 1;
                }
            },
            'formData.prize_type' (val) {
                if (val == 3) {
                    this.formData.prize_range = '1'
                    this.formData.assign_plan = '1'
                }
            },
            'form.tournamentSelect' (data) {
                this.form.selectMatchListDate = [];
                this.requestMatchList(data.join());
            },
            'formData.prize_num' (data) {
                this.computeDistributionItems()
            },
            distributionItems: {
                handler: function (data) {
                    this.computeDistributionItems()
                },
                deep: true
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
                    this.formData.at_end_time_temp = _earliestDatetime
                    this.formData.at_end_time = _earliestDatetime
                },
                deep: true
            },
            'formData.at_end_time' (val) {
                if (val) {
                    this.formData.at_end_time = this.moment(val).format('YYYY-MM-DD HH:mm:ss')
                }
            },
            'formData.prize_range' (val) {
                if (val == 2) {
                    this.formData.assign_plan = '1'
                } else {

                }
            },
            'formData.cover_id' (id) {
                if (id) {
                    this.formData.cover_url = this.form._coverList[id].image_url
                } else {
                    this.formData.cover_url = ''
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
            assignPlanDesc () {
                let type = ['', '果子', '门票']
                if (this.formData.assign_plan == 1) {
                    return this.formData.assign_plan == 2 ? '人均' + type[this.formData.prize_type] + '：' + (this.formData.prize_amount / this.formData.num).toFixed(2) : ''
                } else {
                    let useAmount = 0;
                    for (let i in this.formData.assign_plan_num) {
                        useAmount += this.formData.assign_plan_num[i] * this.formData.assign_plan_amount[i]
                    }
                    return '可用' + type[this.formData.prize_type] + '：' + (this.formData.prize_amount - useAmount)
                }
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
            requestRoomThirdPartyList () {
                this.ajax('member/third_party_list.php', {page: 1, limit: 100}, (response) => {
                    if (response.data.code == 200) {
                        this.thirdParty = response.data.data.list
                    } else {
                        this.$message.error({
                            message: response.data.message,
                        })
                    }
                })
            },
            requestRoomData (params) {
                // localStorage.setItem('room_page',this.$route.query.room_page)
                this.ajax('edit_room.php',params, (response) => {
                    if (response.data.code == 200) {
                        this.formData = response.data.data
                        this.form.thirdParty = this.formData.thirdParty.length ? this.formData.thirdParty.split(',') : []
                        this.form.is_experience_room = this.formData.is_experience_room == 1
                    } else {
                        this.$message.error({
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
            requestCoverList () {
                const _this = this
                this.ajax('search_cover_list.php',{type: 0,limit:100}, function (response) {
                    if (response.data.code == 200) {
                        _this.form.coverList = response.data.data.list
                        for (let i in _this.form.coverList) {
                            _this.form._coverList[_this.form.coverList[i].id] = _this.form.coverList[i]
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

                if (this.$route.name === 'room-create') {
                    this.ajax('create_room.php', 'post', this.formData, function (response) {
                        _this.form.code = response.data.code
                        if (response.data.code == 200) {
                            _this.$message({
                                message: response.data.message,
                                type: 'success'
                            });
                            _this.$router.push({path: '/room'})
                        } else {
                            _this.$message.error({
                                message: response.data.message,
                            });
                        }
                        _this.form.loading = false
                    })

                }else if(this.$route.query.type == 'copy'){
                    this.ajax('copy_room.php', 'post', {
                        roomID: this.$route.params.id,
//                        action: 'edit',
                        name: this.formData.name,
                        room_desc: this.formData.room_desc,
                        dynamicID: this.formData.dynamicID,
                        at_end_time: this.formData.at_end_time,
                        cover_id: this.formData.cover_id,
                        cover_url: this.formData.cover_url,
                        thirdParty: this.formData.thirdParty,
                        is_experience_room: this.formData.is_experience_room
                    }, function (response) {
                        if (response.data.code == 200) {
                            _this.$message({
                                message: response.data.message,
                                type: 'success'
                            });
                            _this.$router.push({path: '/room'})
                        } else {
                            _this.$message.error({
                                message: response.data.message,
                            });
                        }
                        _this.form.loading = false
                    })
                } else {
                    this.ajax('edit_room.php', 'post', {
                        roomID: this.$route.params.id,
                        action: 'edit',
                        name: this.formData.name,
                        room_desc: this.formData.room_desc,
                        dynamicID: this.formData.dynamicID,
                        at_end_time: this.formData.at_end_time,
                        cover_id: this.formData.cover_id,
                        cover_url: this.formData.cover_url,
                        thirdParty: this.formData.thirdParty,
                        is_experience_room: this.formData.is_experience_room
                    }, function (response) {
                        if (response.data.code == 200) {
                            _this.$message({
                                message: response.data.message,
                                type: 'success'
                            });
                            _this.$router.push({path: '/room'})
                        } else {
                            _this.$message.error({
                                message: response.data.message,
                            });
                        }
                        _this.form.loading = false
                    })
                }
            },
            prev () {
                this.stepActive--;
            },
            next () {
                let _refs = this.formRef[this.stepActive];
                this.$refs[_refs].validate((valid) => {
                    if (valid) {
                        this.stepActive++;
                    } else {
                        return false;
                    }
                });
            },
            submit () {
                let _refs = this.formRef[this.stepActive];
                this.$refs[_refs].validate((valid) => {
                    if (valid) {
                        this.requestUpdateRoom()
                    } else {
                        return false;
                    }
                });
            },
            minusItem () {
                this.distributionItems.splice(this.distributionItems.length - 1, 1);
            },
            plusItem () {
                this.distributionItems.push({
                    people: 1,
                    money: 0
                })
            },
            computeDistributionItems () {
                let data = this.distributionItems
                this.form.checkDistribution.sumNum = 0
                this.form.checkDistribution.sumAmount = 0
                this.form.checkDistribution.message = ''
                this.formData.assign_plan_num = []
                this.formData.assign_plan_amount = []
                for (let i in data) {
                    this.formData.assign_plan_num.push(data[i].people)
                    this.formData.assign_plan_amount.push(data[i].money)
                    this.form.checkDistribution.sumNum += parseInt(data[i].people)
                    this.form.checkDistribution.sumAmount += (parseInt(data[i].money) * parseInt(data[i].people))
                }

                if (this.form.checkDistribution.sumNum  > this.formData.prize_num) {
                    this.form.checkDistribution.message = '梯度奖金分配人数总和（'+ (this.form.checkDistribution.sumNum) +'）不能超过中奖总人数（' + this.formData.prize_num + '）'
                } else if (this.form.checkDistribution.sumAmount > this.formData.prize_amount) {
                    this.form.checkDistribution.message = '梯度奖金分配奖金总和（' + (this.form.checkDistribution.sumAmount) + '）不能超过奖金总数（' + this.formData.prize_amount + '）'
                }else if(this.form.checkDistribution.sumAmount < this.formData.prize_amount){
	                this.form.checkDistribution.message = '梯度奖金分配奖金总和（' + (this.form.checkDistribution.sumAmount) + '）没有全部分配完'
                }

                for (let index = 0; index < this.distributionItems.length; index++) {
                    let start = 0;
                    if (index === 0) {
                        start = 1;
                    } else {
                        for (let j = 0; j < index; j++) {
                            start += parseInt(this.distributionItems[j].people)
                        }
                        start += 1
                    }
                    this.distributionItems[index].start = start;
                    let end = 0;
                    if (index === 0) {
                        end = parseInt(this.distributionItems[index].people)
                    } else {
                        end = start + parseInt(this.distributionItems[index].people) - 1
                    }
                    this.distributionItems[index].end = end;
                }
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
        justify-content: center;
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
