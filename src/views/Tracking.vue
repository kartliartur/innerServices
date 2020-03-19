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
                <label>Телефон: </label>
                <TheMask
                        mask="+#(###) ###-##-##" @input="checkPhone" ref="phone" v-model="phone" type="tel"  placeholder="+7(___) ___-__-__"
                />
            </div>

            <div class="tracking-item">
                <label>Статус: </label>
                <span class="status-item">{{ this.status }}</span>
             </div>

            <button class="tracking_button" type="button" @click="tracking" :disabled="(!this.ttn || !this.phone)">Отслеживать</button>

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
                ttn: "",
                status: "",
                value: {},
                phone: "",
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
                    this.$children[1].$data.ttnValue = value.ttn;
                    this.ttn = value.ttn;
                    this.status = value.status;
                    this.phone = value.phone;
                    this.Waybill_GUID = value.Waybill_GUID;
                    localStorage.setItem('ttn', value.ttn);
                    localStorage.setItem('phone', value.phone);
                    localStorage.setItem('status', value.status);
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
                                    localStorage.setItem("ttn", this.ttn);
                                    localStorage.setItem("phone", this.phone);
                                } else {
                                    localStorage.removeItem("ttn");
                                    localStorage.removeItem("phone");
                                    localStorage.removeItem("status");
                                }
                            } else {
                                this.showNotification(res.data.report, 'red');
                            }
                        }
                    );
                } else {
                    this.showNotification('ГУИД накладной пуст', 'red');
                }
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
            }
        },
        beforeMount() {
            this.phone = (localStorage.getItem('phone') && localStorage.getItem('phone') !== "undefined") ? localStorage.getItem('phone') : "";
            this.status = (localStorage.getItem('status') && localStorage.getItem('status') !== "undefined") ? localStorage.getItem('status') : "";
            this.ttn = (localStorage.getItem('ttn') && localStorage.getItem('ttn') !== "undefined") ? localStorage.getItem('ttn') : "";
        },
        beforeCreate() {
           Funcs.doRequest(
               "post",
                this.$store.getters.getLinkByName('tracking', 'getTTNS'),
                {
                    "Sending_Address_Stavrolen": true,
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
                                ttn: elem.Waybill_ID,
                                phone: elem.Driver_Phone,
                                status: elem.Tracking_Status,
                                Waybill_GUID: elem.Waybill_GUID
                            };
                            this.options.push(val);
                        });
                        if (localStorage.getItem('ttn') != undefined) {
                            for (let i in this.options) {
                                let item = this.options[i];
                                if (item.ttn == localStorage.getItem('ttn')) {
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
                .input();
                width: 60%;
                padding: 10px;
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