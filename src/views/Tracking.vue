<template>
    <div class="tracking">
        <MyHeader />
        <form class="tracking_form">
            <div>
                <search-input
                        @input="fillData(value)"
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
                        mask="+#(###) ###-##-##" :value="this.phone" type="tel" masked="false" placeholder="+7(___) ___-__-__"
                />
            </div>

            <div class="tracking-item">
                <label>Статус: </label>
                <span class="status-item">{{ this.status }}</span>
             </div>

            <button class="tracking_button" @click="tracking">Отслеживать</button>

        </form>
    </div>
</template>

<script>

    import MyHeader from "../components/other/myHeader";
    import searchInput from '../components/tracking/searchInput';
    import {TheMask} from 'vue-the-mask'
    import axios from 'axios';

    export default {
        name: "Tracking",
        components: {MyHeader, searchInput, TheMask},
        data: () => {
            return {
                ttn: "",
                status: "",
                value: {},
                phone: "",
                /*options: [
                    {
                        ttn: "100",
                        phone: 100,
                        status: "100"
                    },
                    {
                        ttn: 200,
                        phone: 200,
                        status: "200"
                    },
                    {
                        ttn: 300,
                        phone: 300,
                        status: "300"
                    }
                ]*/

            }
        },
        methods: {
            fillData (value) {
                window.console.log("I'm from TRACKING!!!");
                if (value) {
                    window.console.log(value);
                    this.status = value.status;
                    this.phone = value.phone;
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
                    ttn: this.ttn,
                    phone: this.phone,
                    status: this.status,
                };
                axios.post("", data).then(res => {
                    let statusRes = res.status;
                    if (statusRes === "ждет") {
                       this.status = statusRes;
                       localStorage.setItem("status", statusRes);
                    } else {
                        this.status = statusRes;
                    }
                })
            }
        },
        beforeMount() {
            this.phone = (localStorage.getItem('phone') && localStorage.getItem('phone') !== "undefined") ? localStorage.getItem('phone') : "";
            this.status = (localStorage.getItem('status') && localStorage.getItem('status') !== "undefined") ? localStorage.getItem('status') : "";
        },
        beforeCreate() {
           /*axios.get("").then(res => {
               this.options = res.options
           });*/
        }
    }
</script>


<style lang="less">
    @import url('../assets/less-templates/base.less');
    .tracking_form {
        .flex(column, center, stretch);
        padding: 20px 0;
        margin: 0 10px;

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
            color: @green-color;
        }
        & .tracking_button {
            .button(5px, @green-color, @input-bg);
            align-self: center;
        }
    }
</style>