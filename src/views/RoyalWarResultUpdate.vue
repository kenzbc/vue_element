<template>
    <div class="royal-war-result-update">
        <el-form ref="royalWarResultForm" :model="formData" label-position="right" label-width="150px" :rules="formRules">
            <el-form-item label="赛事名称：" prop="tournament_name" >
                <el-input v-model="formData.tournament_name" class="large" placeholder="" readonly ></el-input>
            </el-form-item>
            <el-form-item label="轮次：" prop="round_name" >
                <el-input v-model="formData.round_name" class="large" placeholder="" readonly ></el-input>
            </el-form-item>
            <el-form-item label="比赛时间：" prop="start_time_string" >
                <el-input v-model="formData.start_time_string" class="large" placeholder="" readonly ></el-input>
            </el-form-item>
            <el-form-item label="比赛双方：" prop="" >
                <el-col :span="5">
                    <el-input v-model="formData.team_a_name" class="" placeholder="" readonly ></el-input>
                </el-col>
                <el-col class="line" :span="2" align="center">VS</el-col>
                <el-col :span="5">
                    <el-input v-model="formData.team_b_name" class="" placeholder="" readonly ></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="胜利方：" prop="win_teamID" >
                <el-select v-model="formData.win_teamID" placeholder="请选择胜利方">
                    <el-option :label="formData.team_a_name" :value="formData.teamID_a"></el-option>
                    <el-option :label="formData.team_b_name" :value="formData.teamID_b"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="第几盘：" prop="the_result" >
                <el-input v-model="formData.the_result" class="mini" type="number" min="1" max="5" placeholder="请输入盘数"></el-input>
                <span class="tip">可选范围1-5</span>
            </el-form-item>
            <el-form-item label="游戏模式：" prop="game_mode" >
                <el-select v-model="formData.game_mode" placeholder="请选择游戏模式">
                    <el-option label="1V1" value="1"></el-option>
                    <el-option label="2V2" value="2"></el-option>
                    <el-option label="KOF" value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="本盘游戏总局数：" prop="numberOfGames" >
                <el-input v-model="formData.numberOfGames" class="mini" type="number" min="1" max="5" placeholder="请输入局数"></el-input>
                <span class="tip">可选范围1-5</span>
            </el-form-item>

            <el-form-item label="">
                <div class="royal-war-result-detail">
                    <el-row v-for="(item,index) in formData.record_array" class="royal-war-result-row-item" :key="index">
                        <el-col :span="2">
                            <el-form-item :prop="'record_array.' + index + '.numberOfGames'">
                                <el-input v-model="item.numberOfGames" type="number" min="1" max="5" placeholder="第几局"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="20">
                        <!--<el-col :span="20" :class="'record_array.' + index + '.team_a_array.team_a_name' == '1' ? 'team_red' : 'team_blue' ">-->
                            <el-row style="margin-bottom: 22px;">
                                <el-col :span="3">
                                    <el-form-item :prop="'record_array.' + index + '.team_a_array.team_a_name'">
                                        <el-input v-model="formData.team_a_name" type="" placeholder="战队A" readonly></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="3">
                                    <el-form-item :prop="'record_array.' + index + '.team_a_array.color'">
                                        <el-select v-model="item.team_a_array[0].color" placeholder="颜色">
                                            <el-option label="红色" value="1"></el-option>
                                            <el-option label="蓝色" value="2"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="3">
                                    <el-form-item :prop="'record_array.' + index + '.team_a_array.record_result'">
                                        <el-select v-model="item.team_a_array[0].record_result" placeholder="游戏结果">
                                            <el-option label="胜利" value="1"></el-option>
                                            <el-option label="平局" value="0"></el-option>
                                            <el-option label="失败" value="-1"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="24" v-for="(item_team_a,index_team_a) in formData.record_array[index].team_a_array" :key="index_team_a">
                                    <el-row class="row-title">
                                        <el-col :span="3" class="player">选手名</el-col>
                                        <el-col :span="3" class="card">平均费用</el-col>
                                        <el-col :span="3" class="card">皇冠数</el-col>
                                        <el-col :span="3" class="card">丢失皇冠</el-col>
                                        <el-col :span="3" class="card">首牌时间</el-col>
                                        <el-col :span="3" class="card">一塔时间</el-col>
                                        <el-col :span="3" class="card">平均塔血</el-col>
                                        <el-col :span="3" class="card">禁用卡</el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="3">
                                            <el-form-item :prop="'record_array.' + index + '.team_a_array.'+index_team_a+'.playerID'">
                                                <el-select
                                                        v-model="item.team_a_array[index_team_a].playerID"
                                                        filterable
                                                        remote
                                                        placeholder="选手名称或ID"
                                                        :remote-method="remotePlayer"
                                                        :loading="loading">
                                                    <el-option
                                                            v-for="item_player in search_player"
                                                            :key="item_player.nickname"
                                                            :label="item_player.nickname"
                                                            :value="item_player.playerID">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="3">
                                            <el-form-item label="" :prop="'record_array.' + index + '.team_a_array.'+index_team_a+'.average_cost'">
                                                <el-input v-model="item.team_a_array[index_team_a].average_cost" type="text" placeholder=""></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="3">
                                            <el-form-item label="" :prop="'record_array.' + index + '.team_a_array.'+index_team_a+'.crown_number'">
                                                <el-input v-model="item.team_a_array[index_team_a].crown_number" type="text" placeholder=""></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="3">
                                            <el-form-item label="" :prop="'record_array.' + index + '.team_a_array.'+index_team_a+'.lose_crown_number'">
                                                <el-input v-model="item.team_a_array[index_team_a].lose_crown_number" type="text" placeholder=""></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="3">
                                            <el-form-item label="" :prop="'record_array.' + index + '.team_a_array.'+index_team_a+'.first_brand_time'">
                                                <el-input v-model="item.team_a_array[index_team_a].first_brand_time" type="text" placeholder=""></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="3">
                                            <el-form-item label="" :prop="'record_array.' + index + '.team_a_array.'+index_team_a+'.first_tower_time'">
                                                <el-input v-model="item.team_a_array[index_team_a].first_tower_time" type="text" placeholder=""></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="3">
                                            <el-form-item label="" :prop="'record_array.' + index + '.team_a_array.'+index_team_a+'.average_tower'">
                                                <el-input v-model="item.team_a_array[index_team_a].average_tower" type="text" placeholder=""></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="3" class="card">
                                            <el-form-item label="" :prop="'record_array.' + index + '.team_a_array.'+index_team_a+'.ban1'">
                                                <el-select
                                                        v-model="item.team_a_array[index_team_a].ban1"
                                                        filterable
                                                        remote
                                                        placeholder="卡牌名称或ID"
                                                        :remote-method="remoteCard"
                                                        :loading="loading">
                                                    <el-option
                                                            v-for="item_card in search_card"
                                                            :key="item_card.name"
                                                            :label="item_card.name"
                                                            :value="item_card.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row class="row-title">
                                        <el-col :span="24" class="card">卡组</el-col>
                                    </el-row>
                                    <el-row style="margin-bottom: 10px;">
                                        <el-col :span="3">
                                            <el-form-item :prop="'record_array.' + index + '.team_a_array.'+index_team_a+'.deviceID_1'">
                                                <el-select v-model="item.team_a_array[index_team_a].deviceID_1" filterable remote placeholder="卡牌名称或ID" :remote-method="remoteCard" :loading="loading">
                                                    <el-option v-for="item_card in search_card" :key="item_card.name" :label="item_card.name" :value="item_card.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="3">
                                            <el-form-item :prop="'record_array.' + index + '.team_a_array.'+index_team_a+'.deviceID_2'">
                                                <el-select v-model="item.team_a_array[index_team_a].deviceID_2" filterable remote placeholder="卡牌名称或ID" :remote-method="remoteCard" :loading="loading">
                                                    <el-option v-for="item_card in search_card" :key="item_card.name" :label="item_card.name" :value="item_card.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="3">
                                            <el-form-item :prop="'record_array.' + index + '.team_a_array.'+index_team_a+'.deviceID_3'">
                                                <el-select v-model="item.team_a_array[index_team_a].deviceID_3" filterable remote placeholder="卡牌名称或ID" :remote-method="remoteCard" :loading="loading">
                                                    <el-option v-for="item_card in search_card" :key="item_card.name" :label="item_card.name" :value="item_card.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="3">
                                            <el-form-item :prop="'record_array.' + index + '.team_a_array.'+index_team_a+'.deviceID_4'">
                                                <el-select v-model="item.team_a_array[index_team_a].deviceID_4" filterable remote placeholder="卡牌名称或ID" :remote-method="remoteCard" :loading="loading">
                                                    <el-option v-for="item_card in search_card" :key="item_card.name" :label="item_card.name" :value="item_card.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="3">
                                            <el-form-item :prop="'record_array.' + index + '.team_a_array.'+index_team_a+'.deviceID_5'">
                                                <el-select v-model="item.team_a_array[index_team_a].deviceID_5" filterable remote placeholder="卡牌名称或ID" :remote-method="remoteCard" :loading="loading">
                                                    <el-option v-for="item_card in search_card" :key="item_card.name" :label="item_card.name" :value="item_card.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="3">
                                            <el-form-item :prop="'record_array.' + index + '.team_a_array.'+index_team_a+'.deviceID_6'">
                                                <el-select v-model="item.team_a_array[index_team_a].deviceID_6" filterable remote placeholder="卡牌名称或ID" :remote-method="remoteCard" :loading="loading">
                                                    <el-option v-for="item_card in search_card" :key="item_card.name" :label="item_card.name" :value="item_card.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="3">
                                            <el-form-item :prop="'record_array.' + index + '.team_a_array.'+index_team_a+'.deviceID_7'">
                                                <el-select v-model="item.team_a_array[index_team_a].deviceID_7" filterable remote placeholder="卡牌名称或ID" :remote-method="remoteCard" :loading="loading">
                                                    <el-option v-for="item_card in search_card" :key="item_card.name" :label="item_card.name" :value="item_card.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="3">
                                            <el-form-item :prop="'record_array.' + index + '.team_a_array.'+index_team_a+'.deviceID_8'">
                                                <el-select v-model="item.team_a_array[index_team_a].deviceID_8" filterable remote placeholder="卡牌名称或ID" :remote-method="remoteCard" :loading="loading">
                                                    <el-option v-for="item_card in search_card" :key="item_card.name" :label="item_card.name" :value="item_card.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-col>

                            </el-row>
                            <el-row>
                                <el-col :span="3">
                                    <el-form-item :prop="'record_array.' + index + '.team_b_array.team_b_name'">
                                        <el-form-item :prop="'record_array.' + index + '.team_b_array.team_b_name'">
                                            <el-input v-model="formData.team_b_name" type="" placeholder="战队B" readonly></el-input>
                                        </el-form-item>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="3">
                                    <el-form-item :prop="'record_array.' + index + '.team_b_array.color'">
                                        <el-select v-model="item.team_b_array[0].color" placeholder="颜色">
                                            <el-option label="红色" value="1"></el-option>
                                            <el-option label="蓝色" value="2"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="3">
                                    <el-form-item :prop="'record_array.' + index + '.team_b_array.record_result'">
                                        <el-select v-model="item.team_b_array[0].record_result" placeholder="游戏结果">
                                            <el-option label="胜利" value="1"></el-option>
                                            <el-option label="平局" value="0"></el-option>
                                            <el-option label="失败" value="-1"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="24" v-for="(item_team_b,index_team_b) in formData.record_array[index].team_b_array" :key="index_team_b">
                                    <el-row class="row-title">
                                        <el-col :span="3" class="player">选手名</el-col>
                                        <el-col :span="3" class="card">平均费用</el-col>
                                        <el-col :span="3" class="card">皇冠数</el-col>
                                        <el-col :span="3" class="card">丢失皇冠</el-col>
                                        <el-col :span="3" class="card">首牌时间</el-col>
                                        <el-col :span="3" class="card">一塔时间</el-col>
                                        <el-col :span="3" class="card">平均塔血</el-col>
                                        <el-col :span="3" class="card">禁用卡</el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="3">
                                            <el-form-item :prop="'record_array.' + index + '.team_b_array.'+index_team_b+'.playerID'">
                                                <el-select
                                                        v-model="item.team_b_array[index_team_b].playerID"
                                                        filterable
                                                        remote
                                                        placeholder="选手名称或ID"
                                                        :remote-method="remotePlayer"
                                                        :loading="loading">
                                                    <el-option
                                                            v-for="item_player in search_player"
                                                            :key="item_player.nickname"
                                                            :label="item_player.nickname"
                                                            :value="item_player.playerID">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="3">
                                            <el-form-item label="" :prop="'record_array.' + index + '.team_b_array.'+index_team_b+'.average_cost'">
                                                <el-input v-model="item.team_b_array[index_team_b].average_cost" type="text" placeholder=""></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="3">
                                            <el-form-item label="" :prop="'record_array.' + index + '.team_b_array.'+index_team_b+'.crown_number'">
                                                <el-input v-model="item.team_b_array[index_team_b].crown_number" type="text" placeholder=""></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="3">
                                            <el-form-item label="" :prop="'record_array.' + index + '.team_b_array.'+index_team_b+'.lose_crown_number'">
                                                <el-input v-model="item.team_b_array[index_team_b].lose_crown_number" type="text" placeholder=""></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="3">
                                            <el-form-item label="" :prop="'record_array.' + index + '.team_b_array.'+index_team_b+'.first_brand_time'">
                                                <el-input v-model="item.team_b_array[index_team_b].first_brand_time" type="text" placeholder=""></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="3">
                                            <el-form-item label="" :prop="'record_array.' + index + '.team_b_array.'+index_team_b+'.first_tower_time'">
                                                <el-input v-model="item.team_b_array[index_team_b].first_tower_time" type="text" placeholder=""></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="3">
                                            <el-form-item label="" :prop="'record_array.' + index + '.team_b_array.'+index_team_b+'.average_tower'">
                                                <el-input v-model="item.team_b_array[index_team_b].average_tower" type="text" placeholder=""></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="3" class="card">
                                            <el-form-item label="" :prop="'record_array.' + index + '.team_b_array.'+index_team_b+'.ban1'">
                                                <el-select
                                                        v-model="item.team_b_array[index_team_b].ban1"
                                                        filterable
                                                        remote
                                                        placeholder="卡牌名称或ID"
                                                        :remote-method="remoteCard"
                                                        :loading="loading">
                                                    <el-option
                                                            v-for="item_card in search_card"
                                                            :key="item_card.name"
                                                            :label="item_card.name"
                                                            :value="item_card.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row class="row-title">
                                        <el-col :span="24" class="card">卡组</el-col>
                                    </el-row>
                                    <el-row style="margin-bottom: 10px;">
                                        <el-col :span="3">
                                            <el-form-item :prop="'record_array.' + index + '.team_b_array.'+index_team_b+'.deviceID_1'">
                                                <el-select v-model="item.team_b_array[index_team_b].deviceID_1" filterable remote placeholder="卡牌名称或ID" :remote-method="remoteCard" :loading="loading">
                                                    <el-option v-for="item_card in search_card" :key="item_card.name" :label="item_card.name" :value="item_card.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="3">
                                            <el-form-item :prop="'record_array.' + index + '.team_b_array.'+index_team_b+'.deviceID_2'">
                                                <el-select v-model="item.team_b_array[index_team_b].deviceID_2" filterable remote placeholder="卡牌名称或ID" :remote-method="remoteCard" :loading="loading">
                                                    <el-option v-for="item_card in search_card" :key="item_card.name" :label="item_card.name" :value="item_card.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="3">
                                            <el-form-item :prop="'record_array.' + index + '.team_b_array.'+index_team_b+'.deviceID_3'">
                                                <el-select v-model="item.team_b_array[index_team_b].deviceID_3" filterable remote placeholder="卡牌名称或ID" :remote-method="remoteCard" :loading="loading">
                                                    <el-option v-for="item_card in search_card" :key="item_card.name" :label="item_card.name" :value="item_card.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="3">
                                            <el-form-item :prop="'record_array.' + index + '.team_b_array.'+index_team_b+'.deviceID_4'">
                                                <el-select v-model="item.team_b_array[index_team_b].deviceID_4" filterable remote placeholder="卡牌名称或ID" :remote-method="remoteCard" :loading="loading">
                                                    <el-option v-for="item_card in search_card" :key="item_card.name" :label="item_card.name" :value="item_card.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="3">
                                            <el-form-item :prop="'record_array.' + index + '.team_b_array.'+index_team_b+'.deviceID_5'">
                                                <el-select v-model="item.team_b_array[index_team_b].deviceID_5" filterable remote placeholder="卡牌名称或ID" :remote-method="remoteCard" :loading="loading">
                                                    <el-option v-for="item_card in search_card" :key="item_card.name" :label="item_card.name" :value="item_card.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="3">
                                            <el-form-item :prop="'record_array.' + index + '.team_b_array.'+index_team_b+'.deviceID_6'">
                                                <el-select v-model="item.team_b_array[index_team_b].deviceID_6" filterable remote placeholder="卡牌名称或ID" :remote-method="remoteCard" :loading="loading">
                                                    <el-option v-for="item_card in search_card" :key="item_card.name" :label="item_card.name" :value="item_card.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="3">
                                            <el-form-item :prop="'record_array.' + index + '.team_b_array.'+index_team_b+'.deviceID_7'">
                                                <el-select v-model="item.team_b_array[index_team_b].deviceID_7" filterable remote placeholder="卡牌名称或ID" :remote-method="remoteCard" :loading="loading">
                                                    <el-option v-for="item_card in search_card" :key="item_card.name" :label="item_card.name" :value="item_card.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="3">
                                            <el-form-item :prop="'record_array.' + index + '.team_b_array.'+index_team_b+'.deviceID_8'">
                                                <el-select v-model="item.team_b_array[index_team_b].deviceID_8" filterable remote placeholder="卡牌名称或ID" :remote-method="remoteCard" :loading="loading">
                                                    <el-option v-for="item_card in search_card" :key="item_card.name" :label="item_card.name" :value="item_card.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </el-col>
                        <el-col :span="2">
                            <el-button type="danger" icon="minus" class="action-btn" @click="minusItem" :disabled="index==0"><i class="el-icon-minus"></i></el-button>
                            <el-button type="success" icon="plus" class="action-btn" @click="plusItem" v-if="index == formData.record_array.length - 1"><i class="el-icon-plus"></i></el-button>
                        </el-col>
                    </el-row>
                </div>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submit" :disabled="form.loading || form.uploading" :loading="form.loading">提交</el-button>
            </el-form-item>
        </el-form>

    </div>
</template>

<script>
	export default {
		data () {
			return {
				form: {
					loading: false,
				},
				formData: {
					act: 'view',
					//前台只读参数
					tournament_name:'',
					round_name:'',
					start_time_string:'',
					team_a_name:'',
					team_b_name:'',
					//传给后台的参数
					id:'',//对应resultID
					tournament_id:'',
					matchID: '',
					roundID:'',
					the_result:'',
					game_mode:'',
					numberOfGames:'',
					win_teamID:'',
					los_teamID:'',
					teamID_a:'',
					teamID_b:'',
					//record_array数组
					record_array: [{
						numberOfGames:'',
						team_a_array: [{
							recordID:'0',
							numberOfGames:'',
							teamID:'',
							color:'',
							record_result:'',
							//
							playerID:'',
							deviceID_1:'',
							deviceID_2:'',
							deviceID_3:'',
							deviceID_4:'',
							deviceID_5:'',
							deviceID_6:'',
							deviceID_7:'',
							deviceID_8:'',
							average_cost:'',
							crown_number:'',
							lose_crown_number:'',
							first_brand_time:'',
							first_tower_time:'',
							average_tower:'',
							ban1:'',
						}],
						team_b_array: [{
							recordID:'0',
							numberOfGames:'',
							teamID:'',
							color:'',
							record_result:'',
							//
							playerID:'',
							deviceID_1:'',
							deviceID_2:'',
							deviceID_3:'',
							deviceID_4:'',
							deviceID_5:'',
							deviceID_6:'',
							deviceID_7:'',
							deviceID_8:'',
							average_cost:'',
							crown_number:'',
							lose_crown_number:'',
							first_brand_time:'',
							first_tower_time:'',
							average_tower:'',
							ban1:'',
						}],
					}]
				},
				formRules:  {
					// name: [{required: true, message: '名称不能为空'}],
					// image_url: [{required: true, message: '封面不能为空'}],
					// type: [{required: true, message: '类型不能为空'}],
					// level: [{required: true, message: '级别不能为空'}],
					// holy_water: [{required: true, message: '圣水数不能为空'}],
				},
				search_player:[{
					nickname:'',
					playerID:''
				}],
				search_card:[{
					name:'',
					id:''
				}],
				push_array:[{
					recordID:'0',
					numberOfGames:'',
					teamID:'',
					color:'',
					record_result:'',
					//
					playerID:'',
					deviceID_1:'',
					deviceID_2:'',
					deviceID_3:'',
					deviceID_4:'',
					deviceID_5:'',
					deviceID_6:'',
					deviceID_7:'',
					deviceID_8:'',
					average_cost:'',
					crown_number:'',
					lose_crown_number:'',
					first_brand_time:'',
					first_tower_time:'',
					average_tower:'',
					ban1:'',
				}],
				loading: false,
			}
		},
		mounted () {
			if (this.$route.name === 'royal-war-result-update') {
				this.requestData({id: this.$route.params.id,act:'view'})
			}else{
				this.requestMatch(this.$route.query.matchID);//创建的时候获取头部赛事信息
			}

		},
		watch: {
			'formData.game_mode' (data) {
				for (let i in this.formData.record_array) {
					if(data == '2' && this.formData.record_array[i].team_a_array.length == '1'){
						this.formData.record_array[i].team_a_array.push({
							recordID:'0',
							numberOfGames:'',
							teamID:'',
							color:'',
							record_result:'',
							//
							playerID:'',
							deviceID_1:'',
							deviceID_2:'',
							deviceID_3:'',
							deviceID_4:'',
							deviceID_5:'',
							deviceID_6:'',
							deviceID_7:'',
							deviceID_8:'',
							average_cost:'',
							crown_number:'',
							lose_crown_number:'',
							first_brand_time:'',
							first_tower_time:'',
							average_tower:'',
							ban1:'',
						});
						this.formData.record_array[i].team_b_array.push({
							recordID:'0',
							numberOfGames:'',
							teamID:'',
							color:'',
							record_result:'',
							//
							playerID:'',
							deviceID_1:'',
							deviceID_2:'',
							deviceID_3:'',
							deviceID_4:'',
							deviceID_5:'',
							deviceID_6:'',
							deviceID_7:'',
							deviceID_8:'',
							average_cost:'',
							crown_number:'',
							lose_crown_number:'',
							first_brand_time:'',
							first_tower_time:'',
							average_tower:'',
							ban1:'',
						});
					}else if(data !== '2' && this.formData.record_array[i].team_a_array.length == '2'){
						this.formData.record_array[i].team_a_array.splice(this.formData.record_array[i].team_a_array.length - 1, 1);
						this.formData.record_array[i].team_b_array.splice(this.formData.record_array[i].team_b_array.length - 1, 1);
					}
				}

			},
			'formData.record_array' (data) {
				if (this.$route.name === 'royal-war-result-update') {
					for (let i in data) {

                        for(let k in data[i].team_a_array){
	                        //选手
	                        this.search_player.push({
		                        nickname: this.formData.record_array[i].team_a_array[k].nickname,
		                        playerID: this.formData.record_array[i].team_a_array[k].playerID
	                        });
	                        this.search_player.push({
		                        nickname: this.formData.record_array[i].team_b_array[k].nickname,
		                        playerID: this.formData.record_array[i].team_b_array[k].playerID
	                        });
	                        //卡牌
	                        this.search_card.push({
	                        	name: this.formData.record_array[i].team_a_array[k].device_1_name,
	                        	id: this.formData.record_array[i].team_a_array[k].deviceID_1
	                        });
	                        this.search_card.push({
		                        name: this.formData.record_array[i].team_b_array[k].device_1_name,
		                        id: this.formData.record_array[i].team_b_array[k].deviceID_1
	                        });
	                        this.search_card.push({
	                        	name: this.formData.record_array[i].team_a_array[k].device_2_name,
	                        	id: this.formData.record_array[i].team_a_array[k].deviceID_2
	                        });
	                        this.search_card.push({
		                        name: this.formData.record_array[i].team_b_array[k].device_2_name,
		                        id: this.formData.record_array[i].team_b_array[k].deviceID_2
	                        });
	                        this.search_card.push({
	                        	name: this.formData.record_array[i].team_a_array[k].device_3_name,
	                        	id: this.formData.record_array[i].team_a_array[k].deviceID_3
	                        });
	                        this.search_card.push({
		                        name: this.formData.record_array[i].team_b_array[k].device_3_name,
		                        id: this.formData.record_array[i].team_b_array[k].deviceID_3
	                        });
	                        this.search_card.push({
	                        	name: this.formData.record_array[i].team_a_array[k].device_4_name,
	                        	id: this.formData.record_array[i].team_a_array[k].deviceID_4
	                        });
	                        this.search_card.push({
		                        name: this.formData.record_array[i].team_b_array[k].device_4_name,
		                        id: this.formData.record_array[i].team_b_array[k].deviceID_4
	                        });
	                        this.search_card.push({
	                        	name: this.formData.record_array[i].team_a_array[k].device_5_name,
	                        	id: this.formData.record_array[i].team_a_array[k].deviceID_5
	                        });
	                        this.search_card.push({
		                        name: this.formData.record_array[i].team_b_array[k].device_5_name,
		                        id: this.formData.record_array[i].team_b_array[k].deviceID_5
	                        });
	                        this.search_card.push({
	                        	name: this.formData.record_array[i].team_a_array[k].device_6_name,
	                        	id: this.formData.record_array[i].team_a_array[k].deviceID_6
	                        });
	                        this.search_card.push({
		                        name: this.formData.record_array[i].team_b_array[k].device_6_name,
		                        id: this.formData.record_array[i].team_b_array[k].deviceID_6
	                        });
	                        this.search_card.push({
	                        	name: this.formData.record_array[i].team_a_array[k].device_7_name,
	                        	id: this.formData.record_array[i].team_a_array[k].deviceID_7
	                        });
	                        this.search_card.push({
		                        name: this.formData.record_array[i].team_b_array[k].device_7_name,
		                        id: this.formData.record_array[i].team_b_array[k].deviceID_7
	                        });
	                        this.search_card.push({
	                        	name: this.formData.record_array[i].team_a_array[k].device_8_name,
	                        	id: this.formData.record_array[i].team_a_array[k].deviceID_8
	                        });
	                        this.search_card.push({
		                        name: this.formData.record_array[i].team_b_array[k].device_8_name,
		                        id: this.formData.record_array[i].team_b_array[k].deviceID_8
	                        });
	                        this.search_card.push({
	                        	name: this.formData.record_array[i].team_a_array[k].ban_name,
	                        	id: this.formData.record_array[i].team_a_array[k].ban1
	                        });
	                        this.search_card.push({
		                        name: this.formData.record_array[i].team_b_array[k].ban_name,
		                        id: this.formData.record_array[i].team_b_array[k].ban1
	                        });
                        }


					}
				}
			}

		},
		methods: {
			requestMatch (params) {
				const _this = this;
				this.ajax('match/get_match_tournament.php', {matchID:params}, function (response) {
					if (response.data.code == 200) {
						_this.formData.tournament_name = response.data.data.tournament_name;
						_this.formData.round_name = response.data.data.round_name;
						_this.formData.start_time_string = response.data.data.start_time_string;
						_this.formData.team_a_name = response.data.data.team_a_name;
						_this.formData.team_b_name = response.data.data.team_b_name;
						_this.formData.tournament_id = response.data.data.tournamentID;
						_this.formData.matchID = response.data.data.matchID;
						_this.formData.roundID = response.data.data.roundID;
						_this.formData.teamID_a = response.data.data.teamID_a;
						_this.formData.teamID_b = response.data.data.teamID_b;
					} else {
						_this.$message.error({
							message: response.data.message,
						})
					}
				})
			},
            //view
			requestData (params) {
				const _this = this;
				this.ajax('match/royal_war_result_op.php','post', params, function (response) {
					if (response.data.code == 200) {
						//
						_this.formData.record_array = response.data.data.record_array;
						_this.formData.matchID = response.data.data.matchID;
						_this.formData.game_mode = response.data.data.game_mode;
						_this.formData.the_result = response.data.data.the_result;
						_this.formData.numberOfGames = response.data.data.numberOfGames;
						_this.formData.id = _this.$route.params.id;
						_this.formData.win_teamID = response.data.data.win_teamID;
						_this.formData.los_teamID = response.data.data.los_teamID;

						//修改返回头部比赛信息
						_this.formData.tournament_name = response.data.data.match.tournament_name;
						_this.formData.round_name = response.data.data.match.round_name;
						_this.formData.start_time_string = response.data.data.match.start_time_string;
						_this.formData.team_a_name = response.data.data.match.team_a_name;
						_this.formData.team_b_name = response.data.data.match.team_b_name;
						_this.formData.tournament_id = response.data.data.match.tournamentID;
						_this.formData.matchID = response.data.data.match.matchID;
						_this.formData.roundID = response.data.data.match.roundID;
						_this.formData.teamID_a = response.data.data.match.teamID_a;
						_this.formData.teamID_b = response.data.data.match.teamID_b;
						//
						_this.formData.act = 'edit';

						for(let i in _this.formData.record_array){
							_this.formData.record_array[i].numberOfGames = response.data.data.record_array[i].team_a_array[0].numberOfGames;
							//teamID&color&record_result
							// _this.formData.record_array[i].team_a_array.color = response.data.data.record_array[i].team_a_array[0].color;
							// _this.formData.record_array[i].team_b_array.color = response.data.data.record_array[i].team_b_array[0].color;
							// _this.formData.record_array[i].team_a_array.record_result = response.data.data.record_array[i].team_a_array[0].record_result;
							// _this.formData.record_array[i].team_b_array.record_result = response.data.data.record_array[i].team_b_array[0].record_result;
							//卡牌name

                            //判断tower为null变成空
                            // if(_this.formData.record_array[i].team_a_array[0].average_tower == null){
								// _this.formData.record_array[i].team_a_array[0].average_tower = ''
                            // }
                            // if(_this.formData.record_array[i].team_a_array[1].average_tower == null){
								// _this.formData.record_array[i].team_a_array[1].average_tower = ''
                            // }
                            // if(_this.formData.record_array[i].team_b_array[0].average_tower == null){
								// _this.formData.record_array[i].team_b_array[0].average_tower = ''
                            // }
                            // if(_this.formData.record_array[i].team_b_array[1].average_tower == null){
								// _this.formData.record_array[i].team_b_array[1].average_tower = ''
                            // }
						}

					} else {
						_this.$message.error({
							message: response.data.message,
						})
					}
				})
			},
			//创建提交
			requestUpdate () {
				let _this = this
				this.form.loading = true;

				if (_this.$route.name === 'royal-war-result-update') {
					_this.formData.act = 'edit';
				}else{
					_this.formData.act = 'add';
				}
				//los_teamID
				if(_this.formData.win_teamID == _this.formData.teamID_a){
					_this.formData.los_teamID = _this.formData.teamID_b;
				}else{
					_this.formData.los_teamID = _this.formData.teamID_a;
				}
				//数组修改后手动填写
				for(let i in this.formData.record_array){
					//局数
					this.formData.record_array[i].team_a_array[0].numberOfGames = this.formData.record_array[i].numberOfGames;
					this.formData.record_array[i].team_b_array[0].numberOfGames = this.formData.record_array[i].numberOfGames;
					//teamID&color&record_result
					this.formData.record_array[i].team_a_array[0].teamID = this.formData.teamID_a;
					this.formData.record_array[i].team_b_array[0].teamID = this.formData.teamID_b;
					// this.formData.record_array[i].team_a_array[0].color = this.formData.record_array[i].team_a_array.color;
					// this.formData.record_array[i].team_b_array[0].color = this.formData.record_array[i].team_b_array.color;
					// this.formData.record_array[i].team_a_array[0].record_result = this.formData.record_array[i].team_a_array.record_result;
					// this.formData.record_array[i].team_b_array[0].record_result = this.formData.record_array[i].team_b_array.record_result;
					if(this.formData.game_mode == '2'){
						this.formData.record_array[i].team_a_array[1].numberOfGames = this.formData.record_array[i].numberOfGames;
						this.formData.record_array[i].team_b_array[1].numberOfGames = this.formData.record_array[i].numberOfGames;
						this.formData.record_array[i].team_a_array[1].teamID = this.formData.teamID_a;
						this.formData.record_array[i].team_b_array[1].teamID = this.formData.teamID_b;
						this.formData.record_array[i].team_a_array[1].color = this.formData.record_array[i].team_a_array[0].color;
						this.formData.record_array[i].team_b_array[1].color = this.formData.record_array[i].team_b_array[0].color;
						this.formData.record_array[i].team_a_array[1].record_result = this.formData.record_array[i].team_a_array[0].record_result;
						this.formData.record_array[i].team_b_array[1].record_result = this.formData.record_array[i].team_b_array[0].record_result;
					}
				}


				this.ajax('match/royal_war_result_op.php','post', this.formData, function (response) {
					if (response.data.code == 200) {
						_this.$message({
							message: response.data.message,
							type: 'success'
						});
						_this.$router.push({path: '/royal-war-result',query:{matchID:_this.$route.query.matchID}})
					} else {
						_this.$message.error({
							message: response.data.message,
						});
					}
					_this.form.loading = false
				})
			},
			//搜索选手
			remotePlayer(query){
				const _this = this;
				// _this.search_player = [];
				if(query){
					this.ajax('match/player_information.php',{player_param: query,gameID: 4}, function (response) {
						_this.search_player = response.data.data;
					})
				}

			},
			//搜索卡牌
			remoteCard(query) {
				const _this = this;
				// _this.search_card = [];
				if(query) {
					this.ajax('match/royal_war_information.php', {card_param: query}, function (response) {
						_this.search_card = response.data.data;
						console.log(_this.search_card);
					})
				}
			},
			minusItem () {
				this.formData.record_array.splice(this.formData.record_array.length - 1, 1);
			},
			plusItem () {
				if(this.formData.game_mode == '2'){
					this.formData.record_array.push({
						numberOfGames:'',
						team_a_array: [{
							recordID:'0',
							numberOfGames:'',
							teamID:'',
							color:'',
							record_result:'',
							//
							playerID:'',
							deviceID_1:'',
							deviceID_2:'',
							deviceID_3:'',
							deviceID_4:'',
							deviceID_5:'',
							deviceID_6:'',
							deviceID_7:'',
							deviceID_8:'',
							average_cost:'',
							crown_number:'',
							lose_crown_number:'',
							first_brand_time:'',
							first_tower_time:'',
							average_tower:'',
							ban1:'',
						},{
							recordID:'0',
							numberOfGames:'',
							teamID:'',
							color:'',
							record_result:'',
							//
							playerID:'',
							deviceID_1:'',
							deviceID_2:'',
							deviceID_3:'',
							deviceID_4:'',
							deviceID_5:'',
							deviceID_6:'',
							deviceID_7:'',
							deviceID_8:'',
							average_cost:'',
							crown_number:'',
							lose_crown_number:'',
							first_brand_time:'',
							first_tower_time:'',
							average_tower:'',
							ban1:'',
						}],
						team_b_array: [{
							recordID:'0',
							numberOfGames:'',
							teamID:'',
							color:'',
							record_result:'',
							//
							playerID:'',
							deviceID_1:'',
							deviceID_2:'',
							deviceID_3:'',
							deviceID_4:'',
							deviceID_5:'',
							deviceID_6:'',
							deviceID_7:'',
							deviceID_8:'',
							average_cost:'',
							crown_number:'',
							lose_crown_number:'',
							first_brand_time:'',
							first_tower_time:'',
							average_tower:'',
							ban1:'',
						},{
							recordID:'0',
							numberOfGames:'',
							teamID:'',
							color:'',
							record_result:'',
							//
							playerID:'',
							deviceID_1:'',
							deviceID_2:'',
							deviceID_3:'',
							deviceID_4:'',
							deviceID_5:'',
							deviceID_6:'',
							deviceID_7:'',
							deviceID_8:'',
							average_cost:'',
							crown_number:'',
							lose_crown_number:'',
							first_brand_time:'',
							first_tower_time:'',
							average_tower:'',
							ban1:'',
						}],
					})
				}else{
					this.formData.record_array.push({
						numberOfGames:'',
						team_a_array: [{
							recordID:'0',
							numberOfGames:'',
							teamID:'',
							color:'',
							record_result:'',
							//
							playerID:'',
							deviceID_1:'',
							deviceID_2:'',
							deviceID_3:'',
							deviceID_4:'',
							deviceID_5:'',
							deviceID_6:'',
							deviceID_7:'',
							deviceID_8:'',
							average_cost:'',
							crown_number:'',
							lose_crown_number:'',
							first_brand_time:'',
							first_tower_time:'',
							average_tower:'',
							ban1:'',
						}],
						team_b_array: [{
							recordID:'0',
							numberOfGames:'',
							teamID:'',
							color:'',
							record_result:'',
							//
							playerID:'',
							deviceID_1:'',
							deviceID_2:'',
							deviceID_3:'',
							deviceID_4:'',
							deviceID_5:'',
							deviceID_6:'',
							deviceID_7:'',
							deviceID_8:'',
							average_cost:'',
							crown_number:'',
							lose_crown_number:'',
							first_brand_time:'',
							first_tower_time:'',
							average_tower:'',
							ban1:'',
						}],
					})
				}

			},
			submit () {
				this.$refs['royalWarResultForm'].validate((valid) => {
					if (valid) {
						this.requestUpdate()
					} else {
						return false;
					}
				});
			},

		}
	}
</script>

<style>
    .royal-war-result-update .royal-war-result-detail {

    }
    .royal-war-result-update .royal-war-result-detail .royal-war-result-row-item {
        margin-bottom: 22px;
    }
    .royal-war-result-update .royal-war-result-detail .el-row .el-col {
        /*margin-right: 10px;*/
    }
    .royal-war-result-update .royal-war-result-detail .row-title .el-col {
        text-align: center;
        color: #fff;
        border-right: 1px solid #fff;
    }
    .royal-war-result-update .royal-war-result-detail .row-title{
        background-color: #409EFF;
    }

    .royal-war-result-update .royal-war-result-detail .team_red{
        background-color: #F56C6C;
    }
    .royal-war-result-update .royal-war-result-detail .team_blue{
        background-color: #409EFF;
    }
</style>
