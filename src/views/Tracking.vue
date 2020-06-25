<template>
    <div class="tracking">
        <MyHeader />
        <form class="tracking_form">
            <h2>Отслеживание</h2>
            <div>
                <search-input
                        :options="this.options"
                        :fillData="fillData"
                />
            </div>

            <div class="tracking-item">
                <label>ФИО водителя: </label>
                <span class="status-item">{{ this.driver }}</span>
             </div>

            <div class="tracking-item">
                <label>Телефон: </label>
                <TheMask
                        mask="+#(###) ###-##-##" @input="checkPhone" ref="phone" v-model="phone" type="tel"  placeholder="+7(___) ___-__-__"
                />
            </div>

            <div class="tracking-item">
                <label>Статус: </label>
                <span class="status-item">{{ this.status }}
                    <span class="refresh_status" @click="refreshStatus"><img alt="" src="../assets/reload_icon.png" width="15px"></span>
                </span>

             </div>

            <button class="tracking_button" type="button" @click="tracking" :disabled="(!this.document_id || !this.phone)">Отслеживать</button>

        </form>
        <myNotification
            :text="not_text"
            :textColor="not_color"
            v-show="is_not_show"/>
    </div>
</template>

<script>

    import MyHeader from "../components/other/myHeader";
    import searchInput from '../components/tracking/searchInput';
    import {TheMask} from 'vue-the-mask'
    import myNotification from '@/components/other/notification.vue'
    import Funcs from '../assets/js-funcs/default-funcs';

    export default {
        name: "Tracking",
        components: {MyHeader, searchInput, TheMask, myNotification},
        data: () => {
            return {
                document_id: "",
                status: "",
                value: {},
                phone: "",
                driver: '',
                timers: new Array(),
                currentTimer: '',
                Waybill_GUID : "",
                options: [],
                disabled: false,
                not_text: '',
                not_color: '',
                is_not_show: false
            }
        },
        methods: {
            showNotification(text, color) {
              this.not_text = text;
              this.not_color = color;
              this.is_not_show = true;
              setTimeout(() => {
                this.is_not_show = false;
              }, 1500);
            },
            fillData (value) {
                if (value) {
                    this.$children[1].$data.documentValue = value.document_id;
                    this.document_id = value.document_id;
                    this.status = value.status;
                    this.phone = value.phone;
                    this.driver = value.driver;
                    this.Waybill_GUID = value.Waybill_GUID;
                    localStorage.setItem('document_id', value.document_id);
                    localStorage.setItem('phone', value.phone);
                    localStorage.setItem('status', value.status);
                    localStorage.setItem('driver', value.driver);
                }
            },
            tracking () {
                let data = {
                    "Waybill_GUID": this.Waybill_GUID,
                    "Driver_tracking_phone": this.phone,
                    "Actions": ["Send_tracking_request"],
                };
                if (this.Waybill_GUID || this.Waybill_GUID != "") {
                    Funcs.doRequest(
                        "post",
                        this.$store.getters.getLinkByName('tracking', 'setStatus'),
                        data,
                        null,
                        res => {
                            if (!res.data.error) {
                                this.status = res.data.data[0].Tracking_Status;
                                if (this.status === "Запрос отправлен") {
                                    localStorage.setItem("status", this.status);
                                    localStorage.setItem("document_id", this.document_id);
                                    localStorage.setItem("phone", this.phone);
                                    localStorage.setItem("driver", this.driver);
                                    this.autoRefresh();
                                } else {
                                    localStorage.removeItem("document_id");
                                    localStorage.removeItem("phone");
                                    localStorage.removeItem("status");
                                    localStorage.removeItem("driver");
                                }
                            } else {
                                this.showNotification(res.data.report, 'red');
                            }
                        },
                        () => { this.showNotification('Сервер временно недоступен', 'red'); }
                    );
                } else {
                    this.showNotification('ГУИД накладной пуст', 'red');
                }
            },
            /*startTimer(doc_id) {
              let k = 0;
              for (let i in this.timers) {
                let item = this.timers[i];
                if (item.document_id == doc_id)
                  k++;
              }
              if (k === 0) {
                let curDate = new Date();
                curDate.setMinutes(curDate.getMinutes() + 3);
                this.timers.push({
                  document_id: doc_id,
                  stop_time: curDate
                })
                localStorage.setItem('timers', JSON.stringify(this.timers));
                this.getTimer();

              }
            },
            getTimer() {
              if (this.timers.length === 0)
                return false;
              let result = false;
              let index = 0;
              for (let i in this.timers) {
                let item = this.timers[i];
                if (item.document_id == this.document_id) {
                  index = i;
                  result = new Date(item.stop_time) - new Date();
                  let secs = new Date(result).getSeconds() >= 10 ? new Date(result).getSeconds() : '0' + new Date(result).getSeconds();
                  this.currentTimer = '0' + new Date(result).getMinutes() + ' : ' + secs
                  result = true;
                }
              }
              if (new Date(this.timers[index].stop_time) > new Date()) {
                setTimeout(() => {
                  this.getTimer();
                }, 1000);
              } else {
                this.stopTimer(index);
                result = false;
              }
              return result;
            },
            stopTimer(idx) {
              this.timers.splice(idx, 1);
              localStorage.setItem('timers', JSON.stringify(this.timers));
              let old_status = this.status;
              this.getDataFromServer();
              if (old_status === this.status) {
                //this.showNotification('Статус не изменился', 'red');
                this.startTimer(this.document_id);
              }
            },*/
            refreshStatus() {
                let data = {
                    "TrackingPhone": this.phone
                };
                if (this.status == '' || this.status == 'Запрос отправлен') {
                    Funcs.doRequest(
                        "post",
                        this.$store.getters.getLinkByName('tracking', 'getStatus'),
                        data,
                        null,
                        res => {
                            if (!res.error) {
                                window.console.log(res.data.data.Tracking_Status, this.status);
                                let new_status = res.data.data.Tracking_Status;
                                if (new_status != this.status) {
                                    this.status = new_status;
                                    /*this.timers.splice(0, 1);
                                    localStorage.setItem('timers', JSON.stringify(this.timers));*/
                                } else {
                                    this.autoRefresh();
                                }
                            } else {
                                this.showNotification(res.data.report, 'red');
                            }
                        },
                        () => {
                            this.showNotification('Сервер временно недоступен', 'red');
                        },
                        false
                    )
                }
            },
            autoRefresh() {
                setTimeout(() => {
                    this.refreshStatus();
                }, 5000);
            },
            checkPhone () {
                if (this.$refs.phone != undefined) {
                    if (this.phone != '') {
                        if (this.$refs.phone.lastValue[0] != "7") {
                            this.$refs.phone.display = this.$refs.phone.lastValue.replace(this.$refs.phone.lastValue[0], "7");
                        }
                    } else {
                        this.phone = this.$refs.phone.lastValue;
                    }
                }
            },
            getDataFromServer() {
              Funcs.doRequest(
                  "post",
                   this.$store.getters.getLinkByName('tracking', 'getTTNS'),
                   {
                       "Filter_Waybill_Status": ""
                   },
                   null,
                   res => {
                       if (!res.data.error) {
                           let val = {};
                           res.data.data.forEach(elem => {
                               if (elem.Driver_Phone == undefined || elem.Driver_Phone == "") {
                                   let str = elem.Driver_Phone_Non_Validation;
                                   let result = [];
                                   for (let i in str) {
                                      if (!isNaN(+str[i]) && str[i] != ' ') {
                                           result.push(str[i]);
                                      }
                                   }
                                   result = result.join('');
                                   elem.Driver_Phone = result.substring(0, 11);
                               }
                               val = {
                                   document_id: elem.Document_ID,
                                   phone: elem.Driver_Phone,
                                   driver: elem.Driver,
                                   status: elem.Tracking_Status,
                                   Waybill_GUID: elem.Waybill_GUID
                               };
                               this.options.push(val);
                           });
                           if (localStorage.getItem('document_id') != undefined) {
                               for (let i in this.options) {
                                   let item = this.options[i];
                                   if (item.document_id == localStorage.getItem('document_id')) {
                                       if (item.status != localStorage.getItem('status')) {
                                         let k = 0;
                                         for (let j in this.timers) {
                                           let elem = this.timers[j];
                                           if (elem.document_id == item.document_id) {
                                             k = j;
                                             break;
                                           }
                                         }
                                         this.timers.splice(k,1);
                                         localStorage.setItem('timers', JSON.stringify(this.timers));
                                       }
                                       this.fillData(item);
                                   }
                               }
                           }
                       } else {
                           this.showNotification(res.data.report, 'red');
                       }
                   },
                   () => {
                       this.showNotification('Сервер временно недоступен', 'red');
                   }
              );
            }
        },
        beforeMount() {
            this.phone = (localStorage.getItem('phone') && localStorage.getItem('phone') !== "undefined") ? localStorage.getItem('phone') : "";
            this.status = (localStorage.getItem('status') && localStorage.getItem('status') !== "undefined") ? localStorage.getItem('status') : "";
            this.document_id = (localStorage.getItem('document_id') && localStorage.getItem('document_id') !== "undefined") ? localStorage.getItem('document_id') : "";
            this.driver = (localStorage.getItem('driver') && localStorage.getItem('driver') !== "undefined") ? localStorage.getItem('driver') : "";
            this.timers = (localStorage.getItem('timers') && localStorage.getItem('timers') !== "undefined") ? JSON.parse(localStorage.getItem('timers')) : new Array();
        },
        created() {
           this.getDataFromServer();
        }
    }
</script>


<style lang="less">
    @import url('../assets/less-templates/base.less');
    .tracking_form {
        .flex(column, center, stretch);
        margin: 0 10px;

        & h2 {
            width: 100%;
            text-align: center;
            font-size: 1.5em;
            padding: 10px 0;
        }

        & .tracking-item {
            .flex(row, space-between, center);
            width: 100%;
            margin: 10px 0;
            & input {
                width: 60%;
            }
            & .status-item {
                .flex(row, space-between, center);
                .input();
                width: 60%;
                min-width: 180px;
                padding: 10px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;

                & .refresh_status {
                    cursor: pointer;
                }
            }
        }

        & input {
            .input();
             padding: 10px;
        }
        & label {
            color: @black-color;
        }
        & .tracking_button {
            .button(5px, @green-color, @input-bg);
            align-self: center;

            &:disabled {
                cursor: initial;
                background-color: @input-bg;
                color: @green-color;
                border-color: @input-bg;
            }
        }
    }
</style>
