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
                <!--<input type="tel"
                       ref="phone"
                       class="phone"
                       :value="this.phone"
                       placeholder="+7(___)___-__-__"
                       @input="maskPhone"
                       @change="maskPhone"
                />-->
                <TheMask
                        mask="+#(###) ###-##-##" @input="checkPhone" ref="phone" :value="this.phone" type="tel"  placeholder="+7(___) ___-__-__"
                />
            </div>

            <div class="tracking-item">
                <label>Статус: </label>
                <span class="status-item">{{ this.status }}</span>
             </div>

            <button class="tracking_button" @click="tracking" :disabled="(!this.ttn || !this.phone)">Отслеживать</button>

        </form>
    </div>
</template>

<script>

    import MyHeader from "../components/other/myHeader";
    import searchInput from '../components/tracking/searchInput';
    import {TheMask} from 'vue-the-mask'
    import Funcs from '../assets/js-funcs/default-funcs';

    export default {
        name: "Tracking",
        components: {MyHeader, searchInput, TheMask},
        data: () => {
            return {
                ttn: "",
                status: "",
                value: {},
                phone: "",
                Waybill_GUID : "",
                options: [],
                disabled: false
            }
        },
        methods: {
            fillData (value) {
                if (value) {
                    //ndow.console.log(this.$children[1].ttn);
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
            maskPhone () {
                let phoneValue = this.$refs.phone.value;

                if (typeof phoneValue === 'string') {
                    this.phone = phoneValue.slice(-1);
                }

               let x = phoneValue.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
               window.console.log(x);
               if(phoneValue.length === 11 && !phoneValue.includes('(')) {
                   this.phone = '+' + x[1] + '(' + x[2] + ') ' + x[3] + '-' + x[4]  + '-' + x[5];
               } else {
                   window.console.log(phoneValue);
                   this.phone = x[1] + !x[3] ? x[2] : '(' + x[2] + ') ' + x[3] + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
               }

            },
            tracking () {
                let data = {
                    Waybill_GUID: this.Waybill_GUID,
                    Driver_tracking_phone: this.phone,
                    Actions: ["Send_tracking_request"],
                };
                window.console.log(data);
                Funcs.doRequest(
                    "post",
                    "https://erp.unlogic.ru/api/v1/logist_registrar/send_waybil",
                    data,
                    null,
                    res => {
                        window.console.log(res);
                        alert(res);
                        if (res.data) {
                            this.status = res.data[0].Tracking_Status;
                            if (this.status === "Запрос отклонен") {
                                localStorage.setItem("status", this.status);
                            } else {
                                localStorage.removeItem("ttn");
                                localStorage.removeItem("phone");
                                localStorage.removeItem("status");
                            }
                        }
                    },
                    () => {
                        alert("Error");
                    }
                );
            },
            checkPhone () {
                if (this.phone != '') {
                    if (this.$refs.phone.lastValue.indexOf("8") == 0) {
                        this.$refs.phone.display = this.$refs.phone.value.replace("8", "7");
                    }
                }else {
                    this.phone = this.$refs.phone.lastValue;
                }
                window.console.log(this.$refs.phone.lastValue)
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
               "https://erp.unlogic.ru/api/v1/logist_registrar/ttn",
               null,
               null,
               res => {
                   let val = {};
                    res.data.data.forEach(elem => {
                        val = {
                            ttn: elem.Waybill_ID,
                            phone: elem.Driver_Phone,
                            status: elem.Tracking_Status,
                            Waybill_GUID: elem.Waybill_GUID
                        };
                        if (val.phone != '') {
                            this.options.push(val);
                        }
                    });
                    window.console.log(this.options);
               },
               () => {
                   alert("Ошибка! Список накладных не удалось получить");
               }
           );
        },
        mounted() {
            let ttnLocal = localStorage.getItem("ttn");
            if (ttnLocal !== "") {
                let elem = this.options.filter(e => e.ttn.includes(ttnLocal));
                if (elem)
                    this.fillData(elem);
            }
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
             //width: auto;
             padding: 10px;
        }
        & label {
            color: @black-color;
        }
        & .tracking_button {
            .button(5px, @green-color, @input-bg);
            align-self: center;
        }
        & .tracking_button:disabled {
            cursor: unset;
            background-color: @input-bg;
            color: @green-color;
            border-color: unset;
        }
    }
</style>